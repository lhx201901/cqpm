/**
 * 用户管理js
 * 
 * @author lxw
 */
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	$('#search_words').keydown(function(e){
		if(e.keyCode==13){
			search_users();
		}
	});
	load_role();
	load_user();
	MODULE_ID = GetRequest().pid;
	$("#role").change(function(){
		search_users();
	});
	
})
function load_role(){

	$.ajax({
		url : "/photo/role/findRoleByUnitName", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			$.each(data, function(key, val) {
				$("#role").append("<option value='"+val.id+"'>"+val.roleName+"</option>");
			});
		},
		error : function() {
		}
	})

}
function add(_this){
	$(_this).attr('href',"../../html/user/addUser.html?pid="+MODULE_ID);
}
/**
 * 初始加载
 */
function load_user(){
	$.ajax({
		url : "/photo/user/loadUserPage", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageIndex : 1,
			pageSize:20,
			loginName:"",
			realName:"",
			roleId:0
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/user/loadUserPage";
			setCommon({loginName:"",realName:""}, Table_Obj, url);
		},
		error : function() {
		}
	})
}
/**
 * 初始化表格
 */
function init_table(datas){
	var esay = $("#TableContainer").easyTable(
			{
				data : datas, // 初始数据，动态添加可以通过setData
				hideCheckbox : false, // 否显示复选框，获取复选框选择的数据用方法getCheckedItem
//				rowClick : function(data) {// 行点击回调，参数为改行数据
//					alert(JSON.stringify(data))
//				},
				rowDoubleClick : function(data) {// 行双击回调，参数为改行数据
					//alert(JSON.stringify(data))
				},
				columns : [
						{// 表格结构配置
							title : "登录名",// 列title文字
							field : "loginName",// 该列对应数据哪个字段
							width : "10%"// 列宽度设置,不设也没什么
						},
						{
							title : "真实姓名",
							field : "realName",
							width : "12%"
						},
						{
							title : "性别",
							field : "sex",
							width : "8%",
							render : function(data) {
								if(data.sex==1){
									return "男";
								}else{
									return "女";
								}
							}
						},
						{
							title : "联系电话",
							field : "contactNumber",
							width : "20%",
						},
						{
							title : "是否启用",
							field : "isUse",
							width : "10%",
							render : function(data) {
								if(data.isUse==1){
									return "启用";
								}else{
									return "停用";
								}
							}
						},
						{
							title : "操作",
							//width : "20%",
							render : function(data) {
								
								return loadOperater(data);//'<a href="#">查看</a><a href="#" class="ml10">编辑</a><a href="#" class="ml10" onclick="test_delete()">删除</a>';
							}
						} ]
			});
	Table_Obj = esay;
}
/**
 * 加载方法
 * @param data
 * @returns {String}
 */
function loadOperater(data){
	var html ="";
	html += '<a href="javascript:void();" onclick="lookDetails('+data.id+')">查看</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="editUser('+data.id+')">编辑</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="pwdReset('+data.id+')">密码恢复</a>';
	if(data.isAdmin!=1){
		html += '<a href="javascript:void();" class="ml10" onclick="deleteUser('+data.id+')">删除</a>';
	}
	return html;
}

/**
 * 检索user
 */
function search_users(){
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	var obj ={};
	obj.pageSize=pageSize;
	obj.pageIndex=pageIndex;
	var loginName = $("#search_words").val();
	var realName = $("#search_words").val();
	var othr = {};
	othr.loginName=loginName;
	othr.realName=realName;
	othr.roleId=$("#role").val();
	reset_serach(othr,obj);
}

/**
 * 查看详情
 * @param twq
 */
function lookDetails(id){
	parent.createPage("用户详情", "../../html/user/editUser.html?id="+id, true, "editUser");
}
/**
 * 编辑图片
 * @param id
 */
function editUser(id){
	parent.createPage("用户详情", "../../html/user/editUser.html?id="+id, true, "editUser");
}
/**
 * 恢复用户默认密码
 * @param id
 */
function pwdReset(id){
	var title ="密码恢复默认提示";
	var content = '<div style="padding: 20px 80px 20px;">请确认是否为该用户恢复默认密码:"666666"？</div>';
	AlertBox.confirm(content, title, surePwdReset, id);
}
function surePwdReset(id){
	$.ajax({
		url : "/photo/user/resetPwdByAdmin", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"id":id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				search_users();
			}
		},
		error : function() {
		}
	})
}
/**
 * 删除用户
 * @param id
 */
function deleteUser(id){
	var title ="删除提示";
	var content = '<div style="padding: 20px 80px 20px;">删除用户后不可恢复，请确认操作？</div>';
	AlertBox.confirm(content, title, sureDelete, id);
}
/**
 * 批量删除
 */
function beathDeleteUser(){
	var datas = Table_Obj.getCheckedItem();
	var arr = new Array();
	$.each(datas, function(key, val) {
		if(val.isAdmin!=1){
			arr[key] = val.id;
		}
	});
	var ids = arr.join(",");
	deleteUser(ids);
}

/**
 * 确认删除操作
 * @param id
 */
function sureDelete(id){
	$.ajax({
		url : "/photo/user/deleteUserByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"ids":id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				search_users();
			}
		},
		error : function() {
		}
	})
}
/**
 * 设置停启用
 * @param num 0、停用；1、启用；
 */
function setIsUse(num){
	var datas = Table_Obj.getCheckedItem();
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.id;
	});
	if(arr.length==0){
		AlertBox.alert("未选择有效数据！", "");
		return;
	}
	var ids = arr.join(",");
	var obj={};
	obj.ids = ids;
	obj.isUse = num;
	var title ="停启用提示";
	var content = '<div style="padding: 20px 80px 20px;">设置后不可恢复，只能重新设置，请确认操作？</div>';
	AlertBox.confirm(content, title, suerSetIsUser, obj);
}
/**
 * 设置停启用
 * @param obj
 */
function suerSetIsUser(obj){
	$.ajax({
		url : "/photo/user/setIsUseByUserIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				search_users();
			}
		},
		error : function() {
		}
	})
}
