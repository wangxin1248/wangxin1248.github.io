
// https://github.com/jgthms/bulma/issues/238 thanks!
document.getElementById("nav-toggle").addEventListener("click", toggleNav);
function toggleNav() {
    var nav = document.getElementById("nav-menu");
    var className = nav.getAttribute("class");
    if(className == "nav-right nav-menu") {
        nav.className = "nav-right nav-menu is-active";
    } else {
        nav.className = "nav-right nav-menu";
    }
}

// for the random quote in the header
var txtFile = new XMLHttpRequest();
txtFile.open("GET", "/quotes.txt", true);
txtFile.onreadystatechange = function () {
    if (txtFile.readyState === 4) {
        if (txtFile.status === 200) {
            allText = txtFile.responseText;
            lines = txtFile.responseText.split("\n");
            randLine = lines[Math.floor((Math.random() * lines.length) + 1)];
            document.getElementById('quote').innerHTML = randLine ||
                "Intelligence is the ability to adapt to change."; // fallback quote
        }
    }
};
txtFile.send(null);

document.getElementById("search-text").addEventListener("keydown", function(e) {
    // search
    if (e.keyCode == 13) { searchHandler(); }
}, false);

function searchHandler() {
    var searchInput = document.getElementById('search-text');
    var text = searchInput.value;
    // add site:example.com in the placeholder
    window.location.href = "https://www.google.com/search?q=site:wangxin1248.github.io " + text;
}


   
/*侧边栏显示、切换等*/
function showCatelog(){
	$('#markdown-toc').hide();
	if (typeof $('#markdown-toc').html() === 'undefined') {
		$('.a_catelog').removeClass('active');
		$('.a_bloginfo').addClass('active');
		$('div.sidebar_catelog').hide();
		$('div.sidebar_index').show();
		$('#sidebar_close').hide();
	}else if($(window).width() >= 1200){
		$('.sidebar_catelog').html('<ul class="list_catelog">' + $('#markdown-toc').html() + '</ul>');
		$('#right_sidebar').animate({right:"+=300px"},300);
		$('#content').animate({left:'-=150px'},300);
		$('.a_bloginfo').removeClass('active');
		$('.a_catelog').addClass('active');
		$('div.sidebar_index').hide();
		$('div.sidebar_catelog').show();
	}
}

// 侧边栏目录
function locateCatelogList(){
    /*获取文章目录集合,可通过：header过滤器*/
    var alis = $('.article :header');
    /*获取侧边栏目录列表集合**/
    var sidebar_alis = $('.sidebar_catelog').find('a');
    /*获取滚动条到顶部的距离*/
    var scroll_height = $(window).scrollTop();
    for(var i =0;i<alis.length;i++){
        /*获取锚点集合中的元素分别到顶点的距离*/
        var a_height = $(alis[i]).offset().top;
        if (a_height<scroll_height){
            /*高亮显示*/
            sidebar_alis.removeClass('list_click');
            $(sidebar_alis[i]).addClass('list_click');
        }
    }
}

$(function() {
    showCatelog();
    /*绑定滚动事件 */ 
    $(window).bind('scroll',locateCatelogList); 
});