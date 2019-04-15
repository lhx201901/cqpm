
var MAIN_PAGE_WINDOW =null;
$(function(){
	
	
	loadUseRole();
	loadClassify();
	
	//初始化
	initAllChecked();
	var MODULE_ID = GetRequest().pid;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+MODULE_ID).contentWindow;
	console.log(MAIN_PAGE_WINDOW);
})
/**
 * 加载可用角色
 */
function loadUseRole(){
	$.ajax({
		//zfzupdate
//		url : "/photo/role/getRoleByIsUse", // 请求的url地址
		url : "/photo/role/findRoleByUnitName", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			isUse:1
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			var html = "";
			$.each(data, function(key, val) {
				html += '<label>';
				if(key == 0){
					html += '<input type="radio" name="role" hidden="hidden" checked="checked" value="'+val.id+'"/>';
				}else{
					html += '<input type="radio" name="role" hidden="hidden" value="'+val.id+'"/>';
				}
				html += '<a>'+val.roleName+'</a>';
				html += '</label>';
			});
			$(".js_ak").html(html);
		},
		error : function() {
		}
	})
}
/**
 * 加载分类
 */
function loadClassify() {
	var html = "";
	$.ajax({
		//zfzupdate
		//url : "/photo/narClassify/getMainClassify", // 请求的url地址
			url : "/photo/narClassify/getNarByUnitAdmin", // 请求的url地址
			dataType : "json", // 返回格式为json
			async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {}, // 参数值
			type : "post", // 请求方式
			success : function(data) {
				var html ="";
				$.each(data, function(key, val) {
					html += '<span>';
					html += '<label class="custom_checkbox">';
					html += '<input name="imageType" hidden="hidden" type="checkbox"  value="'+val.narName+'"/>';
					html += '<div></div>'+val.narName+'</label>';
					html += '</span>';
				});
				$("#choose_search").append(html);
			},
			error : function() {
		}
	})
}
/**
 * 绑定全选事件
 */
function initAllChecked(){
	var allChecked = $("#AllChecked");
	var imageTypes = $("input[name=imageType]");
	allChecked.on("change", function(){
		var self = this;
		imageTypes.each(function(){
			this.checked = self.checked;
		})
	})
	imageTypes.on("change", function(){
		var checked = 0;
		imageTypes.each(function(){
			if(this.checked) checked ++;
		})
		if(checked < imageTypes.length){
			allChecked[0].checked = false;
		}else{
			allChecked[0].checked = true;
		}
	})
}
/**
 * 新增保存
 */
function addSave(){
	var loginName = $("#login_name").val();
	var password = $("#pwd").val();
	var roleCode = $("input[name='role']:checked").val();
	var userMemorySize=$("#userMemorySize").val();
	var arr = new Array();
	$("input[name=imageType]:checked").each(function(i){
        arr[i] = $(this).val();
    });
	var vals = arr.join("@");

//	var isSearch =  $("input[name='source']:checked").val();
//	var isDownload =  $("input[name='download']:checked").val();
	var isEdit =  $("input[name='edit']:checked").val();
	var isInset =  $("input[name='entry']:checked").val();
	
	var isSearch = concateByStr($("input[name='searchFun']:checked"),"@");
	var isDownload =concateByStr($("input[name='downFun']:checked"),"@"); 
	var obj ={};
	if(userMemorySize.length==0){
		obj.userMemorySize=0.0;
	}else{
		obj.userMemorySize=userMemorySize;
	}
	obj.loginName=loginName;
	obj.password=password;
	obj.roleId=roleCode;
	obj.browseText=vals;
	obj.isSearch=isSearch;
	obj.isDownload=isDownload;
	obj.isEdit=isEdit;
	obj.isInset=isInset;
	console.log(obj)
	$.ajax({
		url : "/photo/user/addSaveUser", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			var html =data.resultInfo;
			AlertBox.alert(html, "");
			if(data.resultStatus){
				MAIN_PAGE_WINDOW.search_users();
				//parent.closeCurPage();
				AlertBox.onHide(function(){
					parent.closeCurPage();
				})
			}
		},
		error : function() {
		}
	})
	
}
/**
 * 复选框 被选中的数据的拼接
 * @param objArray 元素对象
 * @param str 分割字符
 */
function concateByStr(objArray, str){
	var arr=[];
	if(objArray==null||objArray==undefined||objArray.length<=0){
		return "";
	}
	$(objArray).each(function(i){
		arr.push($(this).val()) ;
    });
	return arr.join("@");
}
function test(){
	MAIN_PAGE_WINDOW.sureUse(1);
}
