
var USERID="";
$(function() {
	USERID = GetRequest().id;
	loadUseRole();
	loadClassify();

	// 初始化
	initAllChecked();
	
	findUser();
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
				html += '<input type="radio" name="role" hidden="hidden" value="'+val.id+'"/>';
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
 * 绑定全选
 */
function initAllChecked() {
	var allChecked = $("#AllChecked");
	var imageTypes = $("input[name=imageType]");
	allChecked.on("change", function() {
		var self = this;
		imageTypes.each(function() {
			this.checked = self.checked;
		})
	})
	imageTypes.on("change", function() {
		var checked = 0;
		imageTypes.each(function() {
			if (this.checked)
				checked++;
		})
		if (checked < imageTypes.length) {
			allChecked[0].checked = false;
		} else {
			allChecked[0].checked = true;
		}
	})
}
/**
 * 查询用户基本资料
 */
function findUser(){
	$.ajax({
		url : "/photo/user/loadUserDetailsInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"userId":USERID}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data.user!=undefined&&data.user!=null){
				setUserInfo(data.user);
			}
			if(data.role!=undefined&&data.role!=null&&data.role.length!=0){
				setRoles(data.role);
			}
			if(data.uo!=undefined&&data.uo!=null&&data.uo.length!=0){
				setUserOperation(data.uo);
			}
		},
		error : function() {
		}
	})
}
/**
 * 赋值用户基本信息
 * @param user
 */
function setUserInfo(user){
	$("#loginName").val(user.loginName);
	$("#realName").val(user.realName);
	$("#sex").val(user.sex);
	$("#idNumber").val(user.idNumber==null?"":user.idNumber);
	$("#contactNumber").val(user.contactNumber==null?"":user.contactNumber);
	$("#eMail").val(user.eMail==null?"":user.eMail);
	$("#contactAddress").val(user.contactAddress==null?"":user.contactAddress);
	$("#userUnit").val(user.userUnit);
	$("#userJop").val(user.userJop==null?"":user.userJop);
	$("#userMemorySize").val(user.userMemorySize==null?"":user.userMemorySize);
	
}
/**
 * 赋值角色信息
 * @param roles
 */
function setRoles(roles){
//	$.each(roles, function(key, val) {
//		
//	});
	var role = roles[0];
	
	$("input[name='role'][value='"+role.id+"']").attr("checked",true); 
}
/**
 * 赋值用户操作信息
 * @param uo
 */
function setUserOperation(uo){
	console.log(uo);
	var browseText = uo.browseText;
	
	var imageTypes = $("input[name=imageType]");
	$.each(imageTypes, function(key, val) {
		if(browseText.indexOf(val.value)!=-1){
			val.checked=true;
		}
		
	});
	
	if(browseText.split("@").length == imageTypes.length){
		var allChecked = $("#AllChecked");
		allChecked[0].checked = true;
	}
	setCheckBoxValue($("input[name=searchFun]"),uo.isSearch);
	setCheckBoxValue($("input[name=downFun]"),uo.isDownload);
/*	$("input[name='source'][value='"+uo.isSearch+"']").attr("checked",true); 
	$("input[name='download'][value='"+uo.isDownload+"']").attr("checked",true); */
	$("input[name='edit'][value='"+uo.isEdit+"']").attr("checked",true); 
	$("input[name='entry'][value='"+uo.isInset+"']").attr("checked",true); 
}

function eaitSave(){
	var obj ={};

	var loginName = $("#loginName").val();
	var realName = $("#realName").val();
	var sex = $("#sex").val();
	var idNumber = $("#idNumber").val();
	var contactNumber = $("#contactNumber").val();
	var eMail = $("#eMail").val();
	var contactAddress = $("#contactAddress").val();
	var userUnit = $("#userUnit").val();
	var userJop = $("#userJop").val();
	var userMemorySize=$("#userMemorySize").val();
	obj.id=USERID;
	obj.loginName=loginName;
	obj.realName=realName;
	obj.sex=sex;
	obj.idNumber=idNumber;
	obj.contactNumber=contactNumber;
	obj.eMail=eMail;
	obj.contactAddress=contactAddress;
	obj.userUnit=userUnit;
	obj.userJop=userJop;
	if(userMemorySize.length==0){
		obj.userMemorySize=0.0;
	}else{
		obj.userMemorySize=userMemorySize;
	}
	
	var roleCode = $("input[name='role']:checked").val();
	obj.roleId=roleCode;

	var arr = new Array();
	$("input[name=imageType]:checked").each(function(i){
        arr[i] = $(this).val();
    });
	var vals = arr.join("@");

	var isSearch = concateByStr($("input[name='searchFun']:checked"),"@");
	var isDownload =concateByStr($("input[name='downFun']:checked"),"@"); 
	var isEdit =  $("input[name='edit']:checked").val();
	var isInset =  $("input[name='entry']:checked").val();
	
	
	
	obj.browseText=vals;
	obj.isSearch=isSearch;
	obj.isDownload=isDownload;
	obj.isEdit=isEdit;
	obj.isInset=isInset;
	var title ="编辑确认";
	var content = '<div style="padding: 20px 80px 20px;">编辑保存成功后，用户信息会发生改变，请确认操作？</div>';
	AlertBox.confirm(content, title, sureEdit, obj);
	
}
function sureEdit(obj){
	$.ajax({
		url : "/photo/user/editUseByAdmin", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				//self.opener.location.reload(); 
				parent.refreshTabByIndex(0);
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
/**
 * 
 * @param objArray 复选框组元素对象集合
 * @param objData 需要选中的复选框
 */
function setCheckBoxValue(objArray,objData){
	$.each(objArray, function(key, val) {
		if(objData.indexOf(val.value)!=-1){
			val.checked=true;
		}
	});
}
