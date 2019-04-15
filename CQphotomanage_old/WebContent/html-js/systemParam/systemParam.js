var MODULE_ID="";
var PARAM=null;
$(function() {
	MODULE_ID = GetRequest().pid;
	loadParam();
})
/**
 * 加载参数
 */
function loadParam(){
	$.ajax({
		url : "/photo/systemParam/getParam", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			PARAM = data;
			if(data!=null){
				$("#useUnit").val(data.useUnit);
				$("#copyright").val(data.copyright);
				$("#contactNumber").val(data.contactNumber);
				$("#contactAdress").val(data.contactAdress);
			}
			
		},
		error : function() {
		}
	})
}
/**
 * 修改保存
 */
function eaitSave(){
	var useUnit = $("#useUnit").val();
	var copyright = $("#copyright").val();
	var contactNumber = $("#contactNumber").val();
	var contactAdress = $("#contactAdress").val();
	if(useUnit.length<=0){
		AlertBox.alert("使用单位不能为空！","");
		return;
	}
	PARAM.contactAdress=contactAdress;
	PARAM.contactNumber=contactNumber;
	PARAM.copyright=copyright;
	PARAM.useUnit=useUnit;
	
	var title ="参数确认";
	var content = '<div style="padding: 20px 80px 20px;">修改系统参数之后，后期的所有数据及人员的单位都会发生改变，请确认操作？</div>';
	AlertBox.confirm(content, title, sureEdit, PARAM);
	
}
function sureEdit(obj){
	$.ajax({
		url : "/photo/systemParam/upadteParam", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.info, "");
			if(data.state){
				PARAM = data.param;
			}
		},
		error : function() {
		}
	})
}