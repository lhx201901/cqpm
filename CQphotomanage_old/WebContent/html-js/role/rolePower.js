/**
 * 角色权限js
 * author lxw
 * 2018/01/23
 */
var ROLEID_ = "";//序号
var MODULEOBJ_ = {};//定义模块树
var USEROBJ_ = {};//定义部门树

$(document).ready(function(){
	ROLEID_ = GetRequest().roleId;
	console.log(ROLEID_);
	findRolePowerById(ROLEID_);
});

/**
 * 加载角色权限信息
 * @param roleId
 */
function findRolePowerById(roleId){
	$.ajax({
	    url:"/photo/role/findRolePowerById",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:{id:roleId},    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	MODULEOBJ_ = data.module;
	    	USEROBJ_ = data.user;
	    	var obj = data.role;
	    	$("#roleId").val(obj.id);
	    	$("#roleCode").val(obj.roleCode);
	    	$("#roleName").val(obj.roleName);
	    	$("input[name='isUse'][value='"+obj.isUse+"']").attr("checked",true); 
	    	$("#roleRemark").val(obj.roleRemark);
	    	initModuleInfo(MODULEOBJ_);
	    	//initUserInfo(USEROBJ_);
	    	loadHaving();
	    },
	    error:function(){
	    	$box.promptBox("服务器错误！");
	    }
	});
}

/**
 * 加载功能模块树图
 * @author George
 * @param treeData
 */
function initModuleInfo(treeData){
	var zNodes=null;
	//tree的相关设置
	var setting = {
		view: {
			dblClickExpand: true,
			showLine: false,
			selectedMulti: false
		},
		check:{
			enable :true,
			chkStyle:"checkbox",
			nocheckInherit: false
		},
		data: {
			key:{url:"noUrl"},
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "parentId",
				rootPId: ""
			}
		},
		callback: {
			onCheck:function (event, treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj("moduleTree");
					var checkedNodes= zTree.getCheckedNodes(true);
					var owner="";
					$.each( checkedNodes, function( key, val ) {
						if(val.id != 0){
							owner=owner+""+val.name + "\r\n";
						}
					} );
					if(owner.length>0){
						$("#haveModule").val(owner.substring(1));
					}else{
						$("#haveModule").val(owner);
					}
				}
		}
	};
	var t = $("#moduleTree");
	t = $.fn.zTree.init(t, setting, treeData);
	var zTree = $.fn.zTree.getZTreeObj("moduleTree");
	zTree.expandAll(true);
}

/**
 * 加载机构用户树图
 * @author George
 * @param treeData
 */
function initUserInfo(treeData){
	var zNodes=null;
	//tree的相关设置
	var setting = {
		view: {
			dblClickExpand: true,
			showLine: false,
			selectedMulti: false
		},
		check:{
			enable :true,
			chkStyle:"checkbox",
			nocheckInherit: false
		},
		data: {
			key:{url:"noUrl"},
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "parentId",
				rootPId: ""
			}
		},
		callback: {
			onCheck:function (event, treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj("userTree");
					var checkedNodes= zTree.getCheckedNodes(true);
					var owner="";
					$.each( checkedNodes, function( key, val ) {
						if(val.id != 0){
							owner=owner+" "+val.name + "\r\n";
						}
					} );
					if(owner.length>0){
						$("#havaUsers").val(owner.substring(1));
					}else{
						$("#havaUsers").val(owner);
					}
				}
		}
	};
	var t = $("#userTree");
	t = $.fn.zTree.init(t, setting, treeData);
	var zTree = $.fn.zTree.getZTreeObj("userTree");
	zTree.expandAll(true);
}

function loadHaving(){
	var zTree = $.fn.zTree.getZTreeObj("moduleTree");
	var checkedNodes= zTree.getCheckedNodes(true);
	var owner="";
	$.each( checkedNodes, function( key, val ) {
		if(val.id != 0){
			owner=owner+"  "+val.name + "\r\n";
		}
	} );
	if(owner.length>0){
		$("#haveModule").val(owner.substring(1));
	}else{
		$("#haveModule").val(owner);
	}
	
	/*zTree = $.fn.zTree.getZTreeObj("userTree");
	checkedNodes= zTree.getCheckedNodes(true);
	owner="";
	$.each( checkedNodes, function( key, val ) {
		if(val.id != 0){
			owner=owner+"  "+val.name + "\r\n";
		}
	} );
	if(owner.length>0){
		$("#havaUsers").val(owner.substring(1));
	}else{
		$("#havaUsers").val(owner);
	}*/
}

/**
 * 改变权限
 */
function changePower(){
	var title ="确认提示";
	var html = '<div style="padding: 20px 80px 20px;">权限变更后无法恢复，只能再次设置，请慎重！</div>';
	AlertBox.confirm(html, title, sureChangePower, "");
}
/**
 * 确认改变权限
 */
function sureChangePower(){
	var obj = {};
	
	var zTree1 = $.fn.zTree.getZTreeObj("moduleTree");
	var checkedNodes1= zTree1.getCheckedNodes(true);
	var moduleIds="";
	$.each( checkedNodes1, function( key, val ) {
		if(val.id != 0){
			moduleIds=moduleIds+","+val.id;
		}
	} );
	obj.moduleIds = moduleIds.substring(1)
	
/*	var zTree = $.fn.zTree.getZTreeObj("userTree");
	var checkedNodes= zTree.getCheckedNodes(true);
	var userIds="";
	$.each( checkedNodes, function( key, val ) {
		if(val.id != 0){
			userIds=userIds+","+val.id ;
		}
	} );
	obj.userIds = userIds.substring(1)*/
	
	var roleId = $("#roleId").val();
	obj.roleId = roleId;
	$.ajax({
	    url:"/photo/role/changeRolePower",    //请求的url地址
	    dataType:"json",   //返回格式为json
	    async:true,//请求是否异步，默认为异步，这也是ajax重要特性
	    data:obj,    //参数值
	    type:"post",   //请求方式
	    success:function(data){
	    	
	    	AlertBox.alert(data.resultInfo, "");
	    	if(data.resultStatus){
	    		findRolePowerById(roleId);
	    	}
	    },
	    error:function(){
	    	AlertBox.alert("服务器错误！","");
	    }
	});
}
/**
 * 重置
 */
function restTableData(){
	initModuleInfo(MODULEOBJ_);
	initUserInfo(USEROBJ_);
	loadHaving();
}
