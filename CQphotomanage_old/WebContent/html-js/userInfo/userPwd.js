
/**
 * 用户基本信息
 */
var MODULE_ID = "";

$(function(){
	MODULE_ID = GetRequest().pid;
	
})


function editSave(){
	var obj ={};
	var oldPwd =$("#oldPwd").val();
	var newPwd =$("#newPwd").val();
	var newPwd2 =$("#newPwd2").val();
	
	if(oldPwd==""||newPwd==""||newPwd2==""){
		AlertBox.alert("原密码、新密码、确认密码均不能为空", "");
		return
	}
	if(newPwd!=newPwd2){
		AlertBox.alert("新密码、确认密码输入不一致！", "");
		return
	}
	obj.oldPwd = oldPwd;
	obj.newPwd = newPwd;
	var title ="编辑确认";
	var content = '<div style="padding: 20px 80px 20px;">编辑保存成功后，用户信息会发生改变，请确认操作？</div>';
	AlertBox.confirm(content, title, sureEditSave, obj);
}
function sureEditSave(obj){
	$.ajax({
		url : "/photo/user/editUserPassword", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data.resultStatus==true || data.resultStatus=='true'){
				AlertBox.alert("密码修改成功，请刷新网页重新登录！", "消息提示");
				AlertBox.onHide(function(){
					window.location.reload();
				})
			}else{
				AlertBox.alert(data.resultInfo, "");
			}
		},
		error : function() {
		}
	})
}

function restData(){
	$("#oldPwd").val();
	$("#newPwd").val();
	$("#newPwd2").val();
}