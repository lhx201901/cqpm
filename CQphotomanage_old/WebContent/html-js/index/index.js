var narJson= new Array();
var userXh="";
$(function() {
	//zfzupdate

	checksessoin();
	// 父窗体弹窗的触发
	window.showAlert = function() {
		$(".magic_mask").show();
		$(".vtop").css("box-shadow", "none");
	}
	window.hideAlert = function() {
		$(".magic_mask").hide();
		$(".vtop").css("box-shadow", "0 5px 10px #e9e9e9");
	}
	// 创建tab和对应的iframe
	window.createPage = function(text, url, isAppend,id) {
		var repeatIdx = checkRepeat(url,id);
		if (repeatIdx >= 0) {
			setActiveTab(repeatIdx,url);
			return;
		}
		var iframeBox = $("#IframeBox");
		var tabBox = $("#TabBox");
		var iframe = $('<iframe class="sub_page active" src="' + url+ '" id ="tab_frame_' + id+ '"></iframe>');
		tabBox.children("a").attr("class", "vel");
		if (isAppend) {
			var tab = $('<a link="' + url + '" class="vel2" id = "'+id+'">' + text
					+ '<i class="ico ico14"></i></a>');
			iframeBox.children("iframe").removeClass("active");
			tabBox.append(tab);
			iframeBox.append(iframe);
		} else {
			var tab = $('<a link="' + url + '" class="vel2"  id = "'+id+'">' + text + '</a>');
			tabBox.html(tab);
			iframeBox.html(iframe);
		}
		dealTabBeyond();
	}
	//关闭当前活跃的iframe
	window.closeCurPage = function() {
		var tabBox = $("#TabBox");
		var iframeBox = $("#IframeBox");
		var active = tabBox.children("a.vel2");
		var idx = active.index();
		active.remove();
		iframeBox.children("iframe").eq(idx).remove();
		if(active.hasClass("vel2")) {
			tabBox.children("a:last-child").attr("class", "vel2").siblings().attr("class", "vel");
			iframeBox.children("iframe:last-child").addClass("active").siblings().removeClass("active");
		}
		dealTabBeyond();
	}
	
	//刷新制定index的tab页
	window.refreshTabByIndex = function(idx){
		var iframeBox = $("#IframeBox");
		var child = iframeBox.children("iframe").eq(idx);
		if(child){
			child.attr('src', child.attr('src'));
		}
	}

	// 初始化
	initSideNav();
	initRootView();
	bindTabClick();
	bindTabArrow();
	// 窗体改变触发的事件
	window.onresize = function() {
		dealTabBeyond();
	}
})
// 初始化侧边导航栏
function initSideNav() {
	$("#SideNavBox").html(drawParentNav(narJson));
	initNavCollapse();
	initNavLink();
}
function drawParentNav(arr, html) {
	html = (html || "");
	//var isOpen = false;
	$.each(arr, function(key, val) {
		if (val.children.length) {
			html += '<div class="nav_box">' + '<div class="nav_ti '
					//+ (isOpen ? "" : "show_mt") + '">'
					//console.log(val.parentId);
					+ (val.parentId<=0 ? "show_mt" : "") + '">'
					+ (val.icon ? '<i class="ico ' + val.icon + '"></i>' : "")
					+ val.name + '<i class="ico ico5"></i></div>'
					+ '<ul class="open_window_link">'
					+ drawChildNav(val.children) + '</ul>' + '</div>';
			//isOpen = true;
		} else {
			if(val.parentId == 0){
				var hasCur = false;
				if(key == 0){
					hasCur = true;
					isSetDefault = true;
				}
				html += '<div class="nav_box open_window_link"><span class="'+(hasCur?"cur":"")+'"><a id ="' + val.id + '" href="'+val.url+'" class="nav_ti" style="display: block;">'+(val.icon ? '<i class="ico '+val.icon+'"></i>' : "")+'<span>'+val.name+'</span><i class="ico ico6" style="left: auto;right: 22px;" ></i></a></span></div>';
				return;
			}
			html += '<div class="nav_box"><a href="' + val.url + '?pid='+val.id+'" id ="' + val.id + '">'
					+ (val.icon ? '<i class="ico ' + val.icon + '"></i>' : "")
					+ '<span>' + val.name
					+ '</span><i class="ico ico6"></i></a></div>'
		}
	});
	return html;
}
var isSetDefault = false;
function drawChildNav(arr) {
	var html = '';
	$.each(arr, function(key, val) {
		if (val.children.length) {
			html += '<li><div class="nav_ti">'
					+ (val.icon ? '<i class="ico ' + val.icon + '"></i>' : "")
					+ val.name + '<i class="ico ico5"></i></div>'
					+ '<ul class="open_window_link">'
					+ drawChildNav(val.children) + '</ul></li>'
		} else {
			html += '<li class="' + (isSetDefault ? "" : "cur")
					+ '" ><a href="' + val.url + '?pid='+val.id+'" id ="' + val.id + '">'
					+ (val.icon ? '<i class="ico ' + val.icon + '"></i>' : "")
					+ '<span>' + val.name
					+ '</span><i class="ico ico6"></i></a></li>';
			isSetDefault = true;
		}
	});
	return html;
}
/**
 * 初始化侧边栏展开收起的事件
 */ 
function initNavCollapse() {
	var handle = $(".nav_ti");
	handle.click(function() {
		if ($(this).hasClass("show_mt")) {
			$(this).removeClass("show_mt");
		} else {
			$(this).addClass("show_mt");
			//$(this).parents(".nav_box").siblings(".nav_box").children(".nav_ti").removeClass("show_mt");
		}
	})
}
/**
 * 初始化侧边栏链接点击事件
 */
function initNavLink() {
	var linkHandle = $(".open_window_link a");
	linkHandle.click(function() {
		var linkstr = $(this).attr("href");
		var id = $(this).attr("id");
		var text = $(this).children("span").text();
		if (!linkstr)
			return false;
		createPage(text, linkstr,false,id);
		linkHandle.parent("li").removeClass("cur");
		$(this).parent("li").addClass("cur");
		return false;
	})
}
function setActiveTab(idx,url) {
	var tabBox = $("#TabBox");
	var iframeBox = $("#IframeBox");
	tabBox.children("a").eq(idx).attr("class", "vel2").siblings("a").attr(
			"class", "vel");
	var activeIframe = iframeBox.children("iframe").eq(idx);
	activeIframe.addClass("active").siblings("iframe").removeClass("active");
	if(url==activeIframe.attr('src')){
		activeIframe.attr('src', activeIframe.attr('src'));
	}else{
		activeIframe.attr('src', url);
	}
}

function checkRepeat(url,id) {
	var tabBox = $("#TabBox");
	var idx = -1;
	tabBox.children("a").each(function(key, val) {
		if ($(this).attr("link") == url||$(this).attr("id")==id) {
			idx = key
		}
	})
	return idx;
}
// 绑定tab事件
function bindTabClick() {
	var tabBox = $("#TabBox");
	var iframeBox = $("#IframeBox");
	tabBox.on("click", "a", function(e) {
		var ev = e || event;
		var idx = $(this).index();
		if (ev.target.tagName.toLowerCase() == "i") {
			iframeBox.children("iframe").eq(idx).remove();
			$(this).remove();
			if ($(this).hasClass("vel2")) {
				tabBox.children("a:last-child").attr("class", "vel2")
						.siblings().attr("class", "vel");
				iframeBox.children("iframe:last-child").addClass("active")
						.siblings().removeClass("active");
			}
			dealTabBeyond();
			return;
		}
		;
		$(this).attr("class", "vel2").siblings().attr("class", "vel");
		iframeBox.children("iframe").eq(idx).addClass("active").siblings(
				"iframe").removeClass("active")
	})
}
// 初始化侧边栏默认选中的链接，就是加了cur那个链接
function initRootView() {
	var curHandle = $(".nav_box .cur");
	if (curHandle.length) {
		var linkHandle = curHandle.children("a");
		linkHandle.focus();
		var linkstr = linkHandle.attr("href");
		var id = linkHandle.attr("id");
		var text = linkHandle.children("span").text();
		createPage(text, linkstr,false,id);
	}
}
// tab长度超出处理
function dealTabBeyond() {
	var tabData = getTabWidth();
	var tabBox = $("#TabBox");
	if (tabData.contentWidth > tabData.boxWidth) {
		$(".tab_arrow").show();
	} else {
		tabBox.animate({
			marginLeft : 0
		}, 500);
		$(".tab_arrow").hide();
	}
}

function bindTabArrow() {
	var leftArrow = $(".tab_arrow_left");
	var rightArrow = $(".tab_arrow_right");
	var tabBox = $("#TabBox");
	leftArrow.click(function() {
		var tabData = getTabWidth();
		var left = parseInt(tabBox.css("margin-left"));
		if (left >= 0 && tabData.contentWidth <= tabData.boxWidth) {
			return;
		}
		if (Math.abs(left) >= tabData.boxWidth / 2) {
			tabBox.animate({
				marginLeft : left + (tabData.boxWidth / 2)
			}, 500);
			return;
		}
		tabBox.animate({
			marginLeft : 0
		}, 500);
	})
	rightArrow
			.click(function() {
				var tabData = getTabWidth();
				var left = parseInt(tabBox.css("margin-left"));
				if (left <= (tabData.boxWidth - tabData.contentWidth)) {
					return;
				}
				if ((tabData.contentWidth - tabData.boxWidth + left) >= tabData.boxWidth / 2) {
					tabBox.animate({
						marginLeft : left - (tabData.boxWidth / 2)
					}, 500);
					return;
				}
				tabBox.animate({
					marginLeft : tabData.boxWidth - tabData.contentWidth
				}, 500);
			})
}

function getTabWidth() {
	var tabBox = $("#Tab");
	var boxWidth = tabBox.width();
	var contentWidth = 0;
	tabBox.children("#TabBox").children("a").each(
			function(key, val) {
				contentWidth += ($(this).outerWidth()
						+ parseInt($(this).css("margin-left")) + parseInt($(
						this).css("margin-right")));
			})
	return {
		boxWidth : boxWidth,
		contentWidth : contentWidth
	}
}

/**
 * 加载分类
 */
function loadClassify(userXh) {
	var html = "";
	$.ajax({
			url : "/photo/user/loadClassifyByUser", // 请求的url地址
			dataType : "json", // 返回格式为json
			async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				userId : userXh
			}, // 参数值
			type : "post", // 请求方式
			success : function(data) {
				$.each(data, function(key, val) {
					narJson.push(val);
					
				});
			},
			error : function() {
		}
	})
}

function loadModule(userId) {
	var html = "";
	$.ajax({
		url : "/photo/role/findPowerByUserId", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			userId : userId
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$.each(data, function(key, val) {
				narJson.push(val);
				
			});
		},
		error : function() {
		}
	})
}

function loadMessgeNum(){
	$.ajax({
		url : "/photo/notice/countNoticeNum",
		dataType : "json", 
		async : false,
		data : {}, 
		type : "post",
		success : function(data) {
			$("#totleNum").html(data.totleNum);
			$("#noNum").html(data.noNum);
			$("#editNum").html(data.editNum);
			$("#updateNum").html(data.updateNoticeNum);
			$("#deleteNum").html(data.delNoticeNum);
			
		},
		error : function() {
		}
	})
}

/**
 * 登录过期，跳转登录页面
 */
function checksessoin() {
	$.ajax({
		url : "/photo/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(!data.resultStatus){
				AlertBox.alert(data.resultInfo);
				AlertBox.onHide(function(){
					window.location.href="../../html/login/login.html";
				})
	    	}else{
	    		var USR=data.resultData;
	    		console.log(USR);
	    		loadMessgeNum();
	    		userXh=USR.userXh;
	    		$("#realName").text(USR.realName);
	    		if(userXh.trim()!='admin' && userXh.trim()!='ADMIN'){
	    			var index = {};
	    			index.url="../../html/home/home.html";
	    			index.parentId=0;
	    			index.id="index";
	    			index.name="首页";
	    			index.icon="ico0";
	    			index.children=new Array();
	    			narJson.push(index);
	    		}
	    		loadClassify(USR.userXh);
	    		loadModule(USR.id);
	    	}
		},
		error : function() {
		}
	});
}

/**
 * 退出登录
 */
function loginOut(){
	$.ajax({
	    url:"/photo/user/loginOut",
	    dataType:"json",
	    async:true,
	    data:{},
	    type:"post",
	    success:function(data){
	    	if(data){
	    		parent.window.location.href="../../html/login/login.html";
	    	}
	    },
	    error:function(){
	    }
	});
}

