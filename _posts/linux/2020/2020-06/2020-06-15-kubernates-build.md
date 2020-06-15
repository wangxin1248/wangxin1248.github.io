---
layout: post
title:  "Centos 使用 kubeadm 部署 kubernetes"
date:  2020-06-15
desc: "Centos7 使用 kubeadm 部署 kubernetes"
keywords: "Centos,kubernetes,服务器,k8s"
categories: [Linux]
tags: [Centos]
---
# 使用 kubeadm 部署 kubernetes

集群介绍：

- master：CentOS7、10.69.12.136
- node1：CentOS7、10.69.12.235
- node2：CentOS7、10.70.147.141

本教程使用的用户均为 root

## 安装 Docker

此部分需要在 master 和 node 上都执行。

卸载旧版本：

```shell
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```


添加 yum 软件源：

```shell
$ sudo yum-config-manager \
    --add-repo \
    https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo

$ sudo sed -i 's/download.docker.com/mirrors.ustc.edu.cn\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo
```

安装 Docker CE

```shell
$ sudo yum makecache fast
$ sudo yum install docker-ce
```

启动 Docker CE

```shell
$ sudo systemctl enable docker
$ sudo systemctl start docker
```

## 安装 kubelet kubeadm kubectl

此部分需要在 master 和 node 上都执行。

```shell
$ cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

$ sudo yum install -y kubelet kubeadm kubectl
```

修改内核的运行参数：

```shell
$ cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# 应用配置
$ sysctl --system
```

配置 kubelet：

```shell
# /etc/systemd/system/kubelet.service.d/文件夹不存在则自行创建
$ vi /etc/systemd/system/kubelet.service.d/10-proxy-ipvs.conf
```

写如如下内容：

```shell
[Service]
ExecStartPre=-modprobe ip_vs
ExecStartPre=-modprobe ip_vs_rr
ExecStartPre=-modprobe ip_vs_wrr
ExecStartPre=-modprobe ip_vs_sh
```

执行以下命令应用配置。

```shell
$ sudo systemctl daemon-reload
```

查看 Kubernetes 运行状态：

```shell
$ systemctl status kubelet
```

假如出现如下的信息表示并没有正常运行：

```shell
● kubelet.service - kubelet: The Kubernetes Node Agent
   Loaded: loaded (/usr/lib/systemd/system/kubelet.service; disabled; vendor preset: disabled)
  Drop-In: /usr/lib/systemd/system/kubelet.service.d
           └─10-kubeadm.conf
        /etc/systemd/system/kubelet.service.d
           └─10-proxy-ipvs.conf
   Active: activating (auto-restart) (Result: exit-code) since 日 2020-06-14 07:50:25 EDT; 1s ago
     Docs: https://kubernetes.io/docs/
  Process: 61400 ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS (code=exited, status=255)
 Main PID: 61400 (code=exited, status=255)
```

可以执行如下的命令查看具体的错误信息：

```shell
$ journalctl -xefu kubelet
```

查看systemd日志发现真正的错误原因是：

```shell
failed to run Kubelet: Running with swap on is not supported, please disable swap! or set --fail-swap-on flag to false
```

运行如下的命令检查 Swap 有没有被关闭

```shell
$ cat /proc/swaps
```

禁用Swap命令如下：

```shell
# 关闭Swap，机器重启后不生效
$ swapoff -a

# 修改/etc/fstab永久关闭Swap
$ cp -p /etc/fstab /etc/fstab.bak$(date '+%Y%m%d%H%M%S')
# CentOS
$ sed -i "s/\/dev\/mapper\/centos-swap/\#\/dev\/mapper\/centos-swap/g" /etc/fstab
# 修改后重新挂载全部挂载点
$ mount -a

# 查看Swap
$ free -m
$ cat /proc/swaps
```

运行下面命令重启Kubelet：

```shell
$ systemctl daemon-reload
$ systemctl restart kubelet
```

再次查看 Kubernetes 运行状态：

```shell
$ systemctl status kubelet
```

正常启动则可以执行后续的操作：

```shell
● kubelet.service - kubelet: The Kubernetes Node Agent
   Loaded: loaded (/usr/lib/systemd/system/kubelet.service; disabled; vendor preset: disabled)
  Drop-In: /usr/lib/systemd/system/kubelet.service.d
           └─10-kubeadm.conf
        /etc/systemd/system/kubelet.service.d
           └─10-proxy-ipvs.conf
   Active: active (running) since 日 2020-06-14 07:57:54 EDT; 146ms ago
     Docs: https://kubernetes.io/docs/
 Main PID: 64249 (kubelet)
    Tasks: 9
   Memory: 15.3M
   CGroup: /system.slice/kubelet.service
           └─64249 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/con...
```

## 集群部署

### master部署

在 master 节点执行如下的命令：

```shell
$ sudo kubeadm init --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers \
      --pod-network-cidr 10.244.0.0/16 \
      --v 5 \
      --ignore-preflight-errors=all
```

- --pod-network-cidr 10.244.0.0/16 参数与后续 CNI 插件有关，这里以 flannel 为例，若后续部署其他类型的网络插件请更改此参数。

正常执行会输出：

```shell
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.69.12.136:6443 --token agu552.wz67ri0qqrwos1hm \
    --discovery-token-ca-cert-hash sha256:c7e9a4e221d1a1ca27b7ccfab09ada62eb6a55d78bd6b737f339c63e7ecb1724 
```

保留上面加入集群的命令，在后续 node 节点中要使用.

配置 flannel：

```shell
$ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.11.0/Documentation/kube-flannel.yml
```

关闭防火墙：

```shell
# 查看防火墙状态
$ firewall-cmd --state

# 停止firewall
$ systemctl stop firewalld.service

# 禁止firewall开机启动
$ systemctl disable firewalld.service 
```

### node部署

在 node 节点中执行刚才 mater 中提示的加入集群的命令：

```shell
kubeadm join 10.69.12.136:6443 --token agu552.wz67ri0qqrwos1hm \
    --discovery-token-ca-cert-hash sha256:c7e9a4e221d1a1ca27b7ccfab09ada62eb6a55d78bd6b737f339c63e7ecb1724 
```

## 使用

将 /etc/kubernetes/admin.conf 复制到 ~/.kube/config

```shell
# ~/.kube/文件夹不存在则创建
$ cp /etc/kubernetes/admin.conf ~/.kube/config
```

查看启动的服务

```shell
$ kubectl get all -A 
```

查看集群中的节点

```shell
$ kubectl get node
```

## 参考文献

- [https://yeasy.gitbook.io/docker_practice/setup/kubeadm](https://yeasy.gitbook.io/docker_practice/setup/kubeadm)
- [https://blog.csdn.net/nklinsirui/article/details/80855415](https://blog.csdn.net/nklinsirui/article/details/80855415)
- [https://www.cnblogs.com/qingfeng2010/p/10540832.html](https://www.cnblogs.com/qingfeng2010/p/10540832.html)
- [https://blog.csdn.net/ytangdigl/article/details/79796961](https://blog.csdn.net/ytangdigl/article/details/79796961)
