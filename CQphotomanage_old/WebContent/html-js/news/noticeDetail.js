var _ID="";

/**
 * 消息详情--js
 */
$(function() {
	_ID = GetRequest().id;
	findNoticeById();
})

/**
 * 发布消息
 */
function findNoticeById(){
	$.ajax({
		url : "/photo/notice/findById", 
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
		},
		error : function() {
		}
	})
}