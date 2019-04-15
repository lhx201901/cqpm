
/**
 * 用户基本信息
 */
var MODULE_ID = "";
var USER = null;
$(function(){
	MODULE_ID = GetRequest().pid;
	loadUserInfo();
})

function loadUserInfo(){
	$.ajax({
		url : "/photo/user/getLoginUserInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			USER = data;
			$("#userId").val(data.id);
			$("#loginName").val(data.loginName);
			$("#realName").val(data.realName);
			$("#sex").val(data.sex);
			$("#idNumber").val(data.idNumber);
			$("#contactNumber").val(data.contactNumber);
			$("#eMail").val(data.eMail);
			$("#contactAddress").val(data.contactAddress);
			$("#userUnit").val(data.userUnit);
			$("#userJop").val(data.userJop);
		},
		error : function() {
		}
	})
}

function editSave(){
	var obj ={};
	obj.id =$("#userId").val();
	obj.loginName =$("#loginName").val();
	obj.realName=$("#realName").val();
	obj.sex=$("#sex").val();
	obj.idNumber=$("#idNumber").val();
	obj.contactNumber=$("#contactNumber").val();
	obj.eMail=$("#eMail").val();
	obj.contactAddress=$("#contactAddress").val();
	obj.userUnit=$("#userUnit").val();
	obj.userJop=$("#userJop").val();
	
	var title ="编辑确认";
	var content = '<div style="padding: 20px 80px 20px;">编辑保存成功后，用户信息会发生改变，请确认操作？</div>';
	AlertBox.confirm(content, title, sureEditSave, obj);
}
function sureEditSave(obj){
	$.ajax({
		url : "/photo/user/editSaveUser", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				USER = data.resultData;
				restData();
			}
		},
		error : function() {
		}
	})
}

function restData(){
	$("#userId").val(USER.id);
	$("#loginName").val(USER.loginName);
	$("#realName").val(USER.realName);
	$("#sex").val(USER.sex);
	$("#idNumber").val(USER.idNumber);
	$("#contactNumber").val(USER.contactNumber);
	$("#eMail").val(USER.eMail);
	$("#contactAddress").val(USER.contactAddress);
	$("#userUnit").val(USER.userUnit);
	$("#userJop").val(USER.userJop);
	$("#realName" , parent.document).html(USER.realName);
}