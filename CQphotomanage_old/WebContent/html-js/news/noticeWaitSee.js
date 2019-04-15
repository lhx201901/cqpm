var _ID="";
var MAIN_PAGE_WINDOW =null;
/**
 * 消息详情--js
 */
$(function() {
	_ID = GetRequest().id;
	var MODULE_ID = GetRequest().pid;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+MODULE_ID).contentWindow;
	waitToSee();
})

/**
 * 发布消息
 */
function waitToSee(){
	$.ajax({
		url : "/photo/notice/waitToSee", 
		dataType : "json",
		async : true,
		data : {
			id:_ID
		},
		type : "post",
		success : function(data) {
			$("#notTitle").html(data.notTitle);
			$("#notContent").html(data.notContent);
			$("#senderName").html(data.senderName);
			$("#sendingTime").html(dateFtt("yyyy-MM-dd hh:mm:ss", new Date(data.sendingTime)));
			MAIN_PAGE_WINDOW.searchData();
			loadMessgeNum();
		},
		error : function() {
		}
	})
}

/**
 * 更新数据
 */
function loadMessgeNum(){
	$.ajax({
		url : "/photo/notice/countNoticeNum",
		dataType : "json", 
		async : true,
		data : {}, 
		type : "post",
		success : function(data) {
			$("#totleNum",window.parent.document).html(data.totleNum);
			$("#noNum",window.parent.document).html(data.noNum);
			$("#editNum",window.parent.document).html(data.editNum);
			$("#updateNum",window.parent.document).html(data.updateNoticeNum);
			$("#deleteNum",window.parent.document).html(data.delNoticeNum);
		},
		error : function() {
		}
	})
}