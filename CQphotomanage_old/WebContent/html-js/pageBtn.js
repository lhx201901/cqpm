var Table_Obj=null;//表格对象
var Other=null;
var Param =null;
var Url="";
$(function() {
	
})
/**
 * 设定参数
 * @param other其他参数
 * @param param分页的参数
 * @param tableObj表格对象
 * @param url 请求链接
 */
function setCommon(other,tableObj,url){
	Table_Obj = tableObj;
	Other=other;
	Url = url;
}
/**
 * 检索重置参数回调
 * @param other
 * @param param
 */
function reset_serach(other,param){
	Other=other;
	page_btn(param);
}
/**
 * 翻页回调
 * @param othr
 * @param param
 */
function page_btn(param){
	Other.pageSize=param.pageSize;
	Other.pageIndex=param.pageIndex;
	
	$.ajax({
		url : Url, // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : Other, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			Table_Obj.setData(data.rows);
			$("#this_page").text(param.pageIndex);
			$("#total_page").text(data.tatalPages);
			$("#total_records").text(data.total);
		},
		error : function() {
		}
	})
}


/**
 * 首页
 */
function first_page(){
	var obj ={};
	obj.pageSize = $("#page_size").val();
	obj.pageIndex=1;
	page_btn(obj);
}
/**
 * 上一页
 */
function last_page(){
	var this_page = $("#this_page").text();
	if(parseInt(this_page)-1>0){
		var pageSize = $("#page_size").val();
		var pageIndex = parseInt(this_page)-1;
		var obj ={};
		obj.pageSize=pageSize;
		obj.pageIndex=pageIndex;
		page_btn(obj);
	}else{
		alert("已是第一页");
	}
}
/**
 * 下一页
 */
function next_page(){
	var this_page = $("#this_page").text();
	var total_page = $("#total_page").text();
	if(this_page==total_page){
		alert("已是最后一页");
	}else{
		var pageSize = $("#page_size").val();
		var pageIndex = parseInt(this_page)+1;
		var obj ={};
		obj.pageSize=pageSize;
		obj.pageIndex=pageIndex;
		page_btn(obj);
	}
}
/**
 * 最后一页
 */
function end_page(){
	var total_page = $("#total_page").text();
	var pageSize = $("#page_size").val();
	var obj={};
	obj.pageSize=pageSize;
	obj.pageIndex=total_page;
	page_btn(obj);
}
/**
 * 页面跳转
 */
function go_page(){
	var go_page_text = $("#go_page_text").val();
	var total_page = $("#total_page").text();
	if(parseInt(go_page_text)>parseInt(total_page) || parseInt(go_page_text)<0){
		alert("输入页码不合法");
	}else{
		var pageSize = $("#page_size").val();
		var obj ={};
		obj.pageSize=pageSize;
		obj.pageIndex=go_page_text;
		page_btn(obj);
	}
	
}
/***
 * 切换每页大小
 */
function page_size_change(){
	var pageSize = $("#page_size").val();
	var obj={};
	obj.pageSize=pageSize;
	obj.pageIndex=1;
	$("#this_page").text(1);
	page_btn(obj);
}