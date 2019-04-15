var dataId=null;
var unitObj={};
var MODULEOBJ_ = {};//定义模块树
var type="";
$(function() {
	var obj = GetRequest();
	type=obj.type;
	if(type=="edit"){
		dataId = obj.dataId;
	}else{
		unitObj.parentId=obj.dataId;
		$("#unitName").change(function(){
			$("#userUnit").val($("#unitName").val());
		});
	}
	initLoad();
	initAllChecked();
})
function changeIPType(){
	if($("#isSeparateIP").val()==1){
		$("#ftpInfo").show();
		$("#ftpDiv").show();
	}else{
		$("#ftpInfo").hide();
		$("#ftpDiv").hide();
	}
}
/**
 * 初始化单位数据
 */
function  initLoad(){
	$.ajax({
		url : "/photo/unit/findPowerById", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{id:dataId}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data);
			if(data){
				if(type=="edit"){					
					unitObj=data.unit;
					initUnitInfo(unitObj);
					$('#userDiv select').attr("disabled",true);
					$('#userDiv input').attr("disabled",true);
				}
				MODULEOBJ_=data.moudle;
				initModuleInfo(MODULEOBJ_);
				initNar(data.allNar);
				initNarQuery(data.narCheck);
				changeIPType();
				if(data.user!=null && data.user!=undefined){					
					initUser(data.user);
				}
				
			}
		},
		error : function() {
		}
	})
}
function initUser(user){
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
 * 页面初始化
 */
function initUnitInfo(data){
	$("#unitName").val(data.unitName) ;//单位名称
	$("#unitCode").val(data.unitCode); ;//单位序号
	$("#address").val(data.address); ;//地址
	$("#phone").val(data.phone); ;//电话
	$("#remark").val(data.remark); ;
	$("#isUse").val(data.isUse); 
	$("#usersNum").val(data.usersNum); 
	$("#dataStorageType").val(data.dataStorageType); 
	$("#isSeparateIP").val(data.isSeparateIP); 
	//独立ip参数
	$("#projectIp").val(data.projectIp); ;
	$("#projectPort").val(data.projectPort); 
	$("#projectName").val(data.projectName); 
	$("#ftpPath").val(data.ftpPath); 
	$("#ftpPort").val(data.ftpPort); 
	$("#ftpUser").val(data.ftpUser); 
	$("#ftpPwd").val(data.ftpPwd); 
	$("#ftpFileDir").val(data.ftpFileDir); 
	$("#unitMemorySize").val(data.memorySize==null?"":data.memorySize);
}
/**
 * 保存修改
 */
function saveEdit(){
	var obj={};
	unitObj.unitName=$("#unitName").val() ;//单位名称
	unitObj.unitCode=$("#unitCode").val();
	unitObj.address=$("#address").val(); ;//地址
	unitObj.phone=$("#phone").val(); ;//电话
	unitObj.remark=$("#remark").val(); ;
	unitObj.isUse=$("#isUse").val(); 
	unitObj.usersNum=$("#usersNum").val(); 
	unitObj.dataStorageType=$("#dataStorageType").val(); 
	unitObj.isSeparateIP=$("#isSeparateIP").val(); 
	//独立ip参数
	unitObj.projectIp=$("#projectIp").val(); ;
	unitObj.projectPort=$("#projectPort").val(); 
	unitObj.projectName=$("#projectName").val(); 
	unitObj.ftpPath=$("#ftpPath").val(); 
	unitObj.ftpPort=$("#ftpPort").val(); 
	unitObj.ftpUser=$("#ftpUser").val(); 
	unitObj.ftpPwd=$("#ftpPwd").val(); 
	unitObj.ftpFileDir=$("#ftpFileDir").val(); 
	if(unitObj.unitName.legth==0||unitObj.unitCode.length==0){
		AlertBox.alert("请填写单位名称和单位代码！", "消息提示");
		return ;
	}
	if(unitObj.usersNum.length==0){
		AlertBox.alert("最大用户量不能为空！", "消息提示");
		return ;
	}
	if(type=="add"){
		if($("#loginName").val().length==0){
			AlertBox.alert("请输入该单位的管理员登录名！", "消息提示");
			return ;
		}else{
			var loginName = $("#loginName").val();
			var realName = $("#realName").val();
			var sex = $("#sex").val();
			var idNumber = $("#idNumber").val();
			var contactNumber = $("#contactNumber").val();
			var eMail = $("#eMail").val();
			var contactAddress = $("#contactAddress").val();
			var userJop = $("#userJop").val();
			unitObj.loginName=loginName;
			unitObj.realName=realName;
			unitObj.sex=sex;
			unitObj.idNumber=idNumber;
			unitObj.contactNumber=contactNumber;
			unitObj.eMail=eMail;
			unitObj.contactAddress=contactAddress;
			unitObj.userJop=userJop;
			var userMemorySize = $("#userMemorySize").val();
			if(userMemorySize.length==0){
				unitObj.userMemorySize="0.0	";
			}else{
				unitObj.userMemorySize=userMemorySize;
			}
			
		}
	}
	var unitMemorySize=$("#unitMemorySize").val();
	if(unitMemorySize.length==0){
		AlertBox.alert("单位存储空间不能为空！", "消息提示");
		return ;
	}
	unitObj.memorySize=$("#unitMemorySize").val();
	console.log(unitObj);
	var arr = new Array();
	$("input[name=imageType]:checked").each(function(i){
        arr[i] = $(this).val();
    });
	var narids = arr.join(",");
	var zTree1 = $.fn.zTree.getZTreeObj("moduleTree");
	var checkedNodes1= zTree1.getCheckedNodes(true);
	var moduleIds="";
	$.each( checkedNodes1, function( key, val ) {
		if(val.id != 0){
			moduleIds=moduleIds+","+val.id;
		}
	} );
	unitObj.mods = moduleIds.substring(1);
	unitObj.nars=narids;
	var url="";
	if(type=="edit"){
		url="/photo/unit/editUnit";
	}else{
		url="/photo/unit/addUnitBean";
	}
	$.ajax({
		url : url, // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :unitObj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data);
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				parent.refreshTabByIndex(0);
				AlertBox.onHide(function(){
					parent.closeCurPage();
				})
			}
		},
		error : function() {
			AlertBox.alert("系统异常");
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
function initNar(data){
	var html ="";
	$.each(data, function(key, val) {
		html += '<span>';
		html += '<label class="custom_checkbox">';
		html += '<input name="imageType" hidden="hidden" type="checkbox"  value="'+val.id+'"/>';
		html += '<div></div>'+val.narName+'</label>';
		html += '</span>';
	});
	$("#choose_search").append(html);
}
function initNarQuery(browseText){
	var imageTypes = $("input[name=imageType]");
	$.each(imageTypes, function(key, val) {
		$.each(browseText, function(index, item) {
			if(item.narClassifyId==val.value){
				val.checked=true;
				return false;
			}
		});
	});
	if(browseText.length == imageTypes.length){
		var allChecked = $("#AllChecked");
		allChecked[0].checked = true;
	}
};
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
			}
		}
	};
	var t = $("#moduleTree");
	t = $.fn.zTree.init(t, setting, treeData);
	var zTree = $.fn.zTree.getZTreeObj("moduleTree");
	zTree.expandAll(true);
}