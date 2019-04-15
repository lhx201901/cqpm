/**
 * 消息管理--js
 * 
 */
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	$('#search_words').keydown(function(e){
		if(e.keyCode==13){
			load_user();
		}
	});
	load_user();
	MODULE_ID = GetRequest().pid;
	$('#search_words').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	});
})

/**
 * 检索获取条件
 */
function getParam() {
	 var obj = {};
	 obj.pageIndex = 1;
	 pageSize=$("#page_size").val();
	 obj.pageSize = pageSize;
	 obj.orderBy="sendingTime";
	var searchWord = {};
	var term = $("#search_words").val().replace(/ /g,'@');
	searchWord.keyWords = term;//  查询字段
	obj.conditions = JSON.stringify(searchWord);
	return obj;
}

/**
 * 初始加载
 */
function load_user(){
	var  obj = getParam();
	$.ajax({
		url : "/photo/notice/mySender", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/notice/mySender";
			setCommon(obj, Table_Obj, url);
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
					lookDetails(data.id);
				},
				columns : [
						{
							title : "消息名称",
							field : "notTitle",
							width : "15%",
							align : 'center'
						},
						{
							title : "消息内容",
							field : "notContent",
							width : "45%",
							render : function(data) {
								var html="";
								if(data.notContent.length>100){
									html=data.notContent.substring(0,80)+"……";
								}else{
									html=data.notContent;
								}
								return html;
							},
							align : 'center'
						},
						{
							title : "发布时间",
							field : "sendingTime",
							width : "15%",
							render : function(data) {
								var html=dateFtt("yyyy-MM-dd hh:mm:ss", new Date(data.sendingTime))
								return html;
							},
							align : 'center'
						},
						{
							title : "操作",
							//width : "20%",
							render : function(data) {
								return loadOperater(data);
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
	html += '<a href="javascript:void();" class="ml10" onclick="deleteById('+data.id+')">删除</a>';
	return html;
}

/**
 * 检索user
 */
function searchData(){
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	var obj ={};
	obj.pageSize=pageSize;
	obj.pageIndex=pageIndex;
	var othr =getParam();;
	reset_serach(othr,obj);
}


function add(){
	parent.createPage("发布消息", "../../html/news/addNotice.html", true, "addNotice");
}

/**
 * 查看详情
 * @param id
 */
function lookDetails(id){
	parent.createPage("消息详情", "../../html/news/noticeDetail.html?id="+id, true, "noticeDetail");
}

/**
 * 删除用户
 * @param id
 */
function deleteById(id){
	var title ="删除提示";
	var content = '<div style="padding: 20px 80px 20px;">删除后不可恢复，请确认操作？</div>';
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
	deleteById(ids);
}

/**
 * 确认删除操作
 * @param id
 */
function sureDelete(id){
	$.ajax({
		url : "/photo/notice/manageDeleteByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {"ids":id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data){
				AlertBox.alert("删除成功！");
				AlertBox.onHide(function(){
					searchData();
				});
			}
		},
		error : function() {
		}
	})
}