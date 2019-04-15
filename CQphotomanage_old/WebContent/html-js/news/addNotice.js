
/**
 * 发布消息--js
 */
$(function(){
});

/**
 * 发布消息
 */
function addSave(){
	var notTitle=$("#notTitle").val();
	var notContent=$("#notContent").val();
	AlertBox.confirm('<div style="padding: 20px 80px 20px;">确认发布消息？</div>', '发布确认', function(){
		$.ajax({
			url : "/photo/notice/sendNotice", 
			dataType : "json",
			async : true,
			data : {
				notTitle:notTitle,
				notContent:notContent
			},
			type : "post",
			success : function(data) {
				AlertBox.alert(data.resultInfo);
				if(data.resultStatus){
					AlertBox.onHide(function(){
						parent.refreshTabByIndex(0);
						parent.closeCurPage();
					})
				}else{
					AlertBox.alert(data.resultInfo);
				}
			},
			error : function() {
				AlertBox.alert("系统异常！");
			}
		})
	});
}

function reset(){
	var notTitle=$("#notTitle").val("");
	var notContent=$("#notContent").val("");
}