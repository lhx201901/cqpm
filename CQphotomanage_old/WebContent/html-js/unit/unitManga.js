var zTree; //树对象
var moudleTreeNodes=null;//当前加载的树形节点
var zNodes  ; //单位树的初始化数据
var Table_Obj;//表格对象
$(function() {
	$('#search_words').keydown(function(e){
		if(e.keyCode==13){
			searchThis();
		}
	});
	initNarClassifyTree();

})
/**
 * 单位树形属性设置
 * 创建人：lxw
 * 创建时间：2017/04/01
 * @type {{view: {dblClickExpand: boolean, showLine: boolean, selectedMulti: boolean}, data: {key: {url: string}, simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: string}}, callback: {onClick: Function}}}
 */
var setting = {
    view: {
        dblClickExpand: true,
        showLine: false,
        selectedMulti: false,
       // showIcon: false
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
        onClick:function(event,treeId,treeNode,clickFlag){
        	moudleTreeNodes = treeNode;
        	$("#search_words").val("");
        	searchThis();
        }
    }
};

/**
 * 加载单位树
 */
function initNarClassifyTree(){
    var t = $("#unitTree");
    $.ajax({
        url:'/photo/unit/loadUnitTree',
        type:'post',
        data:{},
        dataType:'JSON',
        async:false,
        success:function(data){
        	zNodes = data;
        	t = $.fn.zTree.init(t, setting, zNodes);
        	zTree = $.fn.zTree.getZTreeObj("unitTree");
        	console.log(zTree);
        	var sel_id="0";
        	var nodes = zTree.getNodes();
        	var firstNode = nodes[0]; 
        	console.log(moudleTreeNodes);
        	if(moudleTreeNodes){
        		sel_id=moudleTreeNodes.id;
        	}else{
        		sel_id=firstNode.id;
        	}
        	moudleTreeNodes=zTree.getNodeByParam("id", sel_id);
        	zTree.selectNode(moudleTreeNodes);
        	//初始化单位列表
        	loadNarClassify();
        	//展开所有节点
        	t.expandAll(true);
        	//zTree.expandNode(moudleTreeNodes, true);
        }
    });
}

/**
 * 初始加载
 */
function loadNarClassify(){
	$.ajax({
		url : "/photo/unit/findPageInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageIndex : 1,
			pageSize:20,
			parentId:moudleTreeNodes.id,
			unitName:""
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/unit/findPageInfo";
			setCommon({parentId:0,unitName:""}, Table_Obj, url);
		},
		error : function() {
		}
	})
}
/**
 * 初始化表格
 */
function init_table(datas){
	var esay = $("#TableBox").easyTable(
			{
				data : datas, // 初始数据，动态添加可以通过setData
				hideCheckbox : true, // 否显示复选框，获取复选框选择的数据用方法getCheckedItem
//				rowClick : function(data) {// 行点击回调，参数为改行数据
//					alert(JSON.stringify(data))
//				},
				rowDoubleClick : function(data) {// 行双击回调，参数为改行数据
					//alert(JSON.stringify(data))
				},
				columns : [
						{// 表格结构配置
							title : "单位名称",// 列title文字
							field : "unitName",// 该列对应数据哪个字段
							width : "10%",
							align : 'center'
						},
						{
							title : "单位代码",
							field : "unitCode",
							width : "12%",
							align : 'center'
						},{
							title : "单位地址",
							field : "address",
							width : "15%",
							align : 'center'
						},{
							title : "是否启用",
							field : "isUse",
							width : "12%",
							align : 'center',
							render : function(data) {
								if(data.isUse && data.isUse==1){
									return "启用";
								}else{
									return "禁用";
								}
							}
						},{
							title : "是否独立ip",
							field : "isSeparateIP",
							width : "12%",
							align : 'center',
							render : function(data) {
								if(data.isSeparateIP && data.isSeparateIP==1){
									return "独立ip";
								}else{
									return "非独立ip";
								}
							}
						},{
							title : "数据存储类型",
							field : "dataStorageType",
							width : "12%",
							align : 'center',
							render : function(data) {
								if(data.dataStorageType && data.dataStorageType==1){
									return "云存储";
								}else{
									return "本地存储";
								}
							}
						},{
							title : "最大用户数",
							field : "usersNum",
							width : "12%",
							align : 'center'
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
	html += '<a class="ml10" onclick="editNarClassify('+data.id+')">编辑</a>';
	html += '<a class="ml10" onclick="deleteNarClassify('+data.id+')">删除</a>';
	
	
	return html;
}
/**
 * 检索
 */
function searchThis(){
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	var obj ={};
	obj.pageSize=pageSize;
	obj.pageIndex=pageIndex;
	var unitName = $("#search_words").val();
	var othr = {};
	othr.unitName=unitName;
	othr.parentId=moudleTreeNodes.id;
	reset_serach(othr,obj);
}
/**
 * 新增栏目
 */
function add(){
	var html ='';
	html += '<div class="ued_w">';
	html += '<dl class="clearfix">';
	html += '<dt>模块名称：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="modId" value="" style="display: none;">';
	html += '<input type="text" class="text" placeholder="" id="modName">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>模块链接：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="modUrl">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>模块类型：</dt>';
	html += '<dd style="float: left;margin-top: 7px;">';
	html += '<input type="radio" name="modType" value ="1" checked="checked"> 页面';
	html += '<input type="radio" name="modType" value ="0"> 功能';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>模块图标：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="modIcon">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>模块备注：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="modRemark">';
	html += '</dd>';
	html += '</dl>';
	html += '</div>';
	
	var title ="新增模块";
	var content = '<div style="padding: 20px 80px 20px;">设置后不可恢复，只能重新设置，请确认操作？</div>';
	var url = "/photo/module/addSaveModule";
	AlertBox.confirm(html, title, addSave, url);
}
/**
 * 新增保存
 */
function addSave(url){
	var obj ={};
	obj.parentId = moudleTreeNodes.id;
	var id = $("#modId").val();
	if(id!=""){
		obj.id=id;
	}
	obj.modName = $("#modName").val();
	obj.modUrl = $("#modUrl").val();
	obj.modType =  $("input[name='modType']:checked").val();
	obj.ico = $("#modIcon").val();
	obj.modRemark = $("#modRemark").val();
	$.ajax({
		url : url, // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				searchThis();
				initNarClassifyTree();	
			}
		},
		error : function() {
		}
	})
}

function  editNarClassify(id){
	var url = "../../html/unit/unitEdit.html?dataId="+id;
	url = encodeURI(url);
	parent.createPage("编辑单位",url , true, "unitDetail");
}
function  editNarClassify(id){
	var url = "../../html/unit/unitEdit.html?dataId="+id+"&type=edit";
	url = encodeURI(url);
	parent.createPage("编辑单位",url , true, "unitDetail");
}
function addUnit(){
	var url = "../../html/unit/unitEdit.html?dataId="+moudleTreeNodes.id+"&type=add";
	url = encodeURI(url);
	parent.createPage("新增单位",url , true, "unitDetail");
}

/**
 * 删除
 * @param id
 */
function deleteNarClassify(id){
	var title ="删除提示";
	var content = '<div style="padding: 20px 80px 20px;">删除后不可恢复，请确认操作？</div>';
	AlertBox.confirm(content, title, sureDelete, id);
}

/**
 * 确认删除操作
 * @param id
 */
function sureDelete(id){
	$.ajax({
		url : "/photo/unit/deleteUnitBean", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"unitIds":id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				//searchThis();
				initNarClassifyTree();	
			}
		},
		error : function() {
		}
	})
}

