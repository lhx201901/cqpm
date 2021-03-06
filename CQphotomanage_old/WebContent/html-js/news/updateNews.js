/**
 * 消息列表--js
 */
var MODULE_ID="";
var Table_Obj;//表格对象
var attrType=1;

$(function() {
	load_user();
	MODULE_ID = GetRequest().pid;
	initTypeChange();
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			load_user();
		}
	})
})
/**
 * 单图，多图切换
 */ 
function initTypeChange() {
	$(".ed_msl>a").click(function() {
		$(this).addClass("cur").siblings("a").removeClass("cur");
		attrType = $(this).attr("attrType");
	})
	$("#operationStatu").change(function(){
		load_user();
	});
}

/**
 * 检索获取条件
 */
function getParam() {
	 var obj = {};
	 obj.pageIndex = 1;
	 pageSize=$("#page_size").val();
	 obj.pageSize = pageSize;
	 obj.orderBy="id";
	var searchWord = {};
	var term = $("#searchW_words").val().replace(/ /g,'@');
	searchWord.keyWords = term;//  查询字段
	searchWord.operationStatu=$("#operationStatu").val()!=""?$("#operationStatu").val():null;
	obj.term = JSON.stringify(searchWord);
	return obj;
}
/**
 * 初始加载
 */
function load_user(){
	var  obj = getParam();
	$.ajax({
		url : "/photo/photoEditNotice/findPageInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/photoEditNotice/findPageInfo";
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
					detail(data.id);
				},
				columns : [
						{// 表格结构配置
							title : "图片",// 列title文字
							field : "picLylys",// 该列对应数据哪个字段
							width : "10%",// 列宽度设置,不设也没什么
							render : function(data) {
								var html ="";
								html+='<div class="hill_img"><div class="hl_img"><img onclick=picLarge(\''+data.picLyljm+'\') src="'+PICURI+data.picLylys+'"></div></div>';
								return html;
							}
						},
						{
							title : "图片信息",
							field : "picMc",
							width : "35%",
							render : function(data) {
								var html ="";
								if(data.picMc!=undefined && data.picMc!=null  && data.picMc!="null" && data.picMc.length>50){
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.picMc.substring(0,50)+'...</p>';
								}else{
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.picMc+'</p>';
								}
								html+='<p><span style="font-weight: bold;">上传者：</span>'+data.picScz+'</p>';
								html+='<p><span style="font-weight: bold;">摄影者：</span>'+data.picSyz+'</p>';
								if(data.picZsm!=null && data.picZsm.length>150){
									html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.picZsm.substring(0,150)+'……</p>';
								}else{
									html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.picZsm+'</p>';
								}
								return html;
							}
							
						},
						{
							title : "修改库",
							field : "messageSendUnit",
							width : "10%"
						},
						{
							title : "修改时间",
							field : "messageSendTime",
							width : "10%"
						},{
							title : "处理状态",
							field : "isEdit",
							width : "7%",
							render : function(data) {
								var html="";
								if(data.operationStatu==0){
									html="待处理";
								}else if(data.operationStatu==1){
									html="已处理";
								}
								return html;
							}
						},{
							title : "同步状态",
							field : "isAsync",
							width : "7%",
							render : function(data) {
								var html="";
								if(data.isAsync==0){
									html="未同步";
								}else if(data.isAsync==1){
									html="已同步";
								}
								return html;
							}
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
	if(data.operationStatu==0){
		html += '<a  onclick="eidtPhoto(\''+data.id+'\')">同步</a>';
	}else{
		html += '<a onclick="detail(\''+data.id+'\')">查看</a>';
		//html += '<a class="ml10" onclick="auditInfo(\''+data.id+'\')">审核信息</a>';
	}
	html += '<a class="ml10" onclick="deleteThis('+data.id+')">删除</a>';
	return html;
}

function auditInfo(id){
	var table = "";
	table += '<table style ="margin: 0 auto;" >';
	table += '<tr><td>备注:</td><td>';
	table += '<textarea id="remarks" rows="3" cols="20"></textarea>';
	table += '</td></tr><br>';
	table += '<tr><td colspan="2" align="center"><input type="hidden" id="dataId" >';
	table += '</td></tr>';
	table += '</table>';
	var html='<a class="btn btn_ok" onclick="auditPass(2)">通过审核</a>'
		+'<a class="btn ml10" onclick="auditPass(3)">不通过审核</a>';
	AlertBox.audit(table, "审核信息",html);		
	$("#dataId").val(ids);

}
/**
 * 检索列表
 */
function searchData(){
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	var obj ={};
	obj.pageSize=pageSize;
	obj.pageIndex=pageIndex;
	var othr =getParam();
	reset_serach(othr,obj);
}

/**
 * 查看详情
 * @param picXh
 */
function detail(id){
	var url = "../../html/news/picEidtDetail2.html?pid="+MODULE_ID+"&id="+id;
	url = encodeURI(url);
	parent.createPage("查看详情",url , true, "editDetail");
}

/**
 * 图片比编辑
 * @param picXh
 */
function eidtPhoto(id){
	var url = "../../html/news/picEidt2.html?pid="+MODULE_ID+"&id="+id;
	url = encodeURI(url);
	parent.createPage("图片同步",url , true, "picEdit");
}

/**
 * 删除操作
 * @param id
 */
function deleteThis(id){
	var title ="删除提示";
	var content = '<div style="padding: 20px 80px 20px;">删除后不可恢复，请确认操作？</div>';
	AlertBox.confirm(content, title, sureDelete, id);
}
function beacthDelete(){
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		AlertBox.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		arr[key] = val.id;
	});
	var ids = arr.join(",");
	deleteThis(ids)
}
function sureDelete(id){
	$.ajax({
		url : "/photo/photoEditNotice/deleteByIds",
		dataType : "json",
		async : true,
		data : {
			ids : id
		},
		type : "post",
		success : function(data) {
			if(data){
				AlertBox.alert("删除成功!");
				AlertBox.onHide(function(){
					searchData();
					loadMessgeNum();
				});
			}else{
				AlertBox.alert("删除失败！");
			}
			
		},
		error : function() {
			AlertBox.alert("系统错误，请稍后重试！");
		}
	});
}
/**
 * 更新数据
 */
function loadMessgeNum(){
	$.ajax({
		url : "/photo/notice/countNoticeNum",
		dataType : "json", 
		async : true,
		data : {}, 
		type : "post",
		success : function(data) {
			$("#totleNum",window.parent.document).html(data.totleNum);
			$("#noNum",window.parent.document).html(data.noNum);
			$("#editNum",window.parent.document).html(data.editNum);
			$("#updateNum",window.parent.document).html(data.updateNoticeNum);
			$("#deleteNum",window.parent.document).html(data.delNoticeNum);
		},
		error : function() {
		}
	})
}