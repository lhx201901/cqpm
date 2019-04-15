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
	load_user();
	MODULE_ID = GetRequest().pid;
	
})
/**
 * 初始加载
 */
function load_user(){
	$.ajax({
		url : "/photo/role/loadRoleByPage", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageIndex : 1,
			pageSize:20,
			roleName:""
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/role/loadRoleByPage";
			setCommon({roleName:""}, Table_Obj, url);
		},
		error : function() {
			AlertBox.alert("链接异常！","");
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
							title : "角色代码",// 列title文字
							field : "roleCode",// 该列对应数据哪个字段
							width : "15%",// 列宽度设置,不设也没什么
							align :"center"
						},
						{
							title : "角色名称",
							field : "roleName",
							width : "15%",
							align :"center"
						},
						{
							title : "是否可用",
							field : "isUse",
							width : "10%",
							align :"center",
							render : function(data) {
								if(data.isUse==1){
									return "可用";
								}else{
									return "停用";
								}
							}
						},
						{
							title : "角色备注",
							field : "roleRemark",
							width : "20%",
							align :"center",
							render : function(data) {
								if(data.roleRemark==null){
									return "";
								}else{
									return data.roleRemark;
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
	html += '<a onclick="lookDetails('+data.id+')">编辑</a>';
	html += '<a class="ml10" onclick="changePower('+data.id+')">分配权限</a>';
	html += '<a class="ml10" onclick="deleteUser('+data.id+')">删除</a>';
	
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
	var roleName = $("#search_words").val();
	var othr = {};
	othr.roleName=roleName;
	reset_serach(othr,obj);
}
/**
 * 新增角色
 */
function add(){
	var html ='';
	html += '<div class="ued_w">';
	html += '<dl class="clearfix">';
	html += '<dt>角色代码：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="roleId" value="" style="display: none;">';
	html += '<input type="text" class="text" placeholder="" id="roleCode">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>角色名称：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="roleName">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>是否可用：</dt>';
	html += '<dd style="float: left;margin-top: 7px;">';
	html += '<input type="radio" name="isUse" value ="1" checked="checked"> 可用';
	html += '<input type="radio" name="isUse" value ="0"> 不可用';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>角色备注：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="roleRemark">';
	html += '</dd>';
	html += '</dl>';
	html += '</div>';
	
	var title ="新增角色";
	var content = '<div style="padding: 20px 80px 20px;">请确认操作？</div>';
	var url = "/photo/role/addSaveRole";
	AlertBox.confirm(html, title, addSave, url);
}

/**
 * 新增编辑保存
 */
function addSave(url){
	var obj ={};
	var id = $("#roleId").val();
	if(id!=""){
		obj.id=id;
	}
	obj.roleCode = $("#roleCode").val();
	obj.roleName = $("#roleName").val();
	obj.isUse =  $("input[name='isUse']:checked").val();
	obj.roleRemark = $("#roleRemark").val();
	$.ajax({
		url : url, // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				search_users();
			}
		},
		error : function() {
		}
	})
}
/**
 * 查看编辑
 * @param id
 */
function  lookDetails(id){
	$.ajax({
		url : "/photo/role/findRoleById", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{id:id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			
			var html ='';
			html += '<div class="ued_w">';
			html += '<dl class="clearfix">';
			html += '<dt>角色代码：</dt>';
			html += '<dd>';
			html += '<input type="text" class="text" placeholder="" id="roleId" value="'+data.id+'" style="display: none;">';
			html += '<input type="text" class="text" placeholder="" id="roleCode" value="'+data.roleCode+'">';
			html += '</dd>';
			html += '</dl>';
			html += '<dl class="clearfix">';
			html += '<dt>角色名称：</dt>';
			html += '<dd>';
			var roleName = data.roleName==null?"":data.roleName;
			html += '<input type="text" class="text" placeholder="" id="roleName" value="'+roleName+'">';
			html += '</dd>';
			html += '</dl>';
			html += '<dl class="clearfix">';
			html += '<dt>是否可用：</dt>';
			html += '<dd style="float: left;margin-top: 7px;">';
			html += '<input type="radio" name="isUse" value ="1" checked="checked"> 可用';
			html += '<input type="radio" name="isUse" value ="0"> 不可用';
			html += '</dd>';
			html += '</dl>';
			html += '<dl class="clearfix">';
			html += '<dt>角色备注：</dt>';
			html += '<dd>';
			var roleRemark = data.roleRemark==null?"":data.roleRemark;
			html += '<input type="text" class="text" placeholder="" id="roleRemark" value="'+roleRemark+'">';
			html += '</dd>';
			html += '</dl>';
			html += '</div>';
			
			var title ="编辑角色";
			var content = '<div style="padding: 20px 80px 20px;">设置后不可恢复，只能重新设置，请确认操作？</div>';
			var url = "/photo/role/editSaveRole";
			AlertBox.confirm(html, title, addSave, url);
			$("input[name='isUse'][value='"+data.isUse+"']").attr("checked",true); 
		},
		error : function() {
		}
	})
}





/**
 * 编辑图片
 * @param id
 */
function changePower(id){
	parent.createPage("分配权限", "../../html/role/rolePower.html?roleId="+id, true, "rolePower");
}

/**
 * 删除用户
 * @param id
 */
function deleteUser(id){
	var title ="删除提示";
	var content = '<div style="padding: 20px 80px 20px;">删除角色后不可恢复，请确认操作？</div>';
	AlertBox.confirm(content, title, sureDelete, id);
}
/**
 * 批量删除
 */
function beathDelete(){
	var datas = Table_Obj.getCheckedItem();
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.id;
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
		url : "/photo/role/deleteRoleByIds", // 请求的url地址
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
		url : "/photo/role/setIsUseByRoleIds", // 请求的url地址
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
