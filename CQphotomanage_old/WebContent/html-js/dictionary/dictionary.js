var zTree; //树对象
var dictionaryTreeNodes=null;//当前加载的树形节点
var zNodes  ; //模块树的初始化数据
var Table_Obj;//表格对象
$(function() {
	$('#search_words').keydown(function(e){
		if(e.keyCode==13){
			searchThis();
		}
	});
	initTree();
	
	 loadTable();
})
/**
 * 模块树形属性设置
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
        	dictionaryTreeNodes = treeNode;
        	$("#search_words").val("");
        	searchThis();
        }
    }
};

/**
 * 加载模块树
 */
function initTree(){
    var t = $("#dictionaryTree");
    $.ajax({
        url:'/photo/dictionary/loadDicTree',
        type:'post',
        data:{},
        dataType:'JSON',
        async:false,
        success:function(data){
        	zNodes = data;
        	t = $.fn.zTree.init(t, setting, zNodes);
        	zTree = $.fn.zTree.getZTreeObj("dictionaryTree");
        	var sel_id="0";
        	if(dictionaryTreeNodes){
        		sel_id=dictionaryTreeNodes.id;
        	}
        	dictionaryTreeNodes=zTree.getNodeByParam("id", sel_id);
        	zTree.selectNode(dictionaryTreeNodes);
        	//展开所有节点
        	t.expandAll(true);
        	//zTree.expandNode(dictionaryTreeNodes, true);

        }
    });
}

/**
 * 初始加载
 */
function loadTable(){
	$.ajax({
		url : "/photo/dictionary/loadDataTotable", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			pageIndex : 1,
			pageSize:20,
			dicParentId:0,
			dicName:""
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/dictionary/loadDataTotable";
			setCommon({dicParentId:0,dicName:""}, Table_Obj, url);
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
				hideCheckbox : false, // 否显示复选框，获取复选框选择的数据用方法getCheckedItem
//				rowClick : function(data) {// 行点击回调，参数为改行数据
//					alert(JSON.stringify(data))
//				},
				rowDoubleClick : function(data) {// 行双击回调，参数为改行数据
					//alert(JSON.stringify(data))
				},
				columns : [
						{// 表格结构配置
							title : "字典代码",// 列title文字
							field : "dicCode",// 该列对应数据哪个字段
							width : "10%"// 列宽度设置,不设也没什么
						},{// 表格结构配置
							title : "字典名称",// 列title文字
							field : "dicName",// 该列对应数据哪个字段
							width : "20%"// 列宽度设置,不设也没什么
						},{
							title : "字典备注",
							field : "dicRemark",
							width : "30%",
							render : function(data) {
								if(data.dicRemark==null){
									return "";
								}else{
									return data.dicRemark;
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
	html += '<a onclick="editNarClassify('+data.id+')">查看</a>';
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
	var dicName = $("#search_words").val();
	var othr = {};
	othr.dicName=dicName;
	othr.dicParentId=dictionaryTreeNodes.id;
	reset_serach(othr,obj);
}
/**
 * 新增栏目
 */
function add(){
	var html ='';
	html += '<div class="ued_w">';
	html += '<dl class="clearfix">';
	html += '<dt>字典代码：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="dicId" value="" style="display: none;">';
	html += '<input type="text" class="text" placeholder="" id="dicCode">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>字典名称：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="dicName">';
	html += '</dd>';
	html += '</dl>';
	html += '<dl class="clearfix">';
	html += '<dt>字典备注：</dt>';
	html += '<dd>';
	html += '<input type="text" class="text" placeholder="" id="dicRemark">';
	html += '</dd>';
	html += '</dl>';
	html += '</div>';
	
	var title ="新增字典";
	var content = '<div style="padding: 20px 80px 20px;">设置后不可恢复，只能重新设置，请确认操作？</div>';
	var url = "/photo/dictionary/addSaveDic";
	AlertBox.confirm(html, title, addSave, url);
}
/**
 * 新增保存
 */
function addSave(url){
	var obj ={};
	obj.parentId = dictionaryTreeNodes.id;
	var id = $("#dicId").val();
	if(id!=""){
		obj.id=id;
	}
	obj.dicCode = $("#dicCode").val();
	obj.dicName = $("#dicName").val();
	obj.dicRemark = $("#dicRemark").val();
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
				initTree();	
			}
		},
		error : function() {
		}
	})
}

function  editNarClassify(id){
	$.ajax({
		url : "/photo/dictionary/findByDicId", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{dicId:id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			
			var html ='';
			
			html += '<div class="ued_w">';
			html += '<dl class="clearfix">';
			html += '<dt>字典代码：</dt>';
			html += '<dd>';
			html += '<input type="text" class="text" placeholder="" id="dicId" value="'+data.id+'" style="display: none;">';
			html += '<input type="text" class="text" placeholder="" id="dicCode" value="'+data.dicCode+'">';
			html += '</dd>';
			html += '</dl>';
			html += '<dl class="clearfix">';
			html += '<dt>字典名称：</dt>';
			html += '<dd>';
			html += '<input type="text" class="text" placeholder="" id="dicName" value="'+data.dicName+'">';
			html += '</dd>';
			html += '</dl>';
			html += '<dl class="clearfix">';
			html += '<dt>字典备注：</dt>';
			html += '<dd>';
			var dicRemark = data.dicRemark==null?"":data.dicRemark;
			html += '<input type="text" class="text" placeholder="" id="dicRemark" value="'+dicRemark+'">';
			html += '</dd>';
			html += '</dl>';
			html += '</div>';
			
			var title ="编辑模块";
			var content = '<div style="padding: 20px 80px 20px;">设置后不可恢复，只能重新设置，请确认操作？</div>';
			var url = "/photo/dictionary/editSaveDic";
			AlertBox.confirm(html, title, addSave, url);
		},
		error : function() {
		}
	})
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
 * 批量删除
 */
function beathDeleteUser(){
	var datas = Table_Obj.getCheckedItem();
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.id;
	});
	var ids = arr.join(",");
	deleteNarClassify(ids);
}

/**
 * 确认删除操作
 * @param id
 */
function sureDelete(id){
	$.ajax({
		url : "/photo/dictionary/deleteDICByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"ids":id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			AlertBox.alert(data.resultInfo, "");
			if(data.resultStatus){
				searchThis();
				initTree();	
			}
		},
		error : function() {
		}
	})
}

