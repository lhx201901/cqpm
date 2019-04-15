/**
 * 用户管理js
 * 
 * @author lxw
 */
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	MODULE_ID = GetRequest().pid;
	initDatePicker();	
	load_user();
})
/**
 * 日期初始化
 */
function initDatePicker() {
	laydate.render({
		elem: '#startTime'
	});
	laydate.render({
		elem: '#endTime'
	});
}
/**
 * 检索获取条件
 */
function getParam() {
	 var obj = {};
	 obj.pageIndex = 1;
	 var startTime = $("#startTime").val();
	 var endTime = $("#endTime").val();
	 if((startTime.length>0&&endTime.length>0)&&(startTime>endTime)){
			AlertBox.alert("起始时间不能大于结束时间！", "");
			return;
	}
	 var pageSize=$("#page_size").val();
	 obj.pageSize = pageSize; 
	 var term = $("#searchW_words").val().replace(/\s/g,'');
	 obj.keyWords=term;
	 obj.state=$("#state").val();
	 obj.startTime=startTime;
	 obj.endTime=endTime;
	return obj;
}
/**
 * 初始加载
 */
function load_user(){
	var  obj = getParam();
	$.ajax({
		url : "/photo/pushInternal/findPageInfo", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/pushInternal/findPageInfo";
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
					//alert(JSON.stringify(data))
				},
				columns : [
//"userXh": "admin",
//"batchNumber": "201812120001",
						{// 表格结构配置
							title : "推送人",// 列title文字
							field : "userName",// 该列对应数据哪个字段
							width : "10%"
						},
						{
							title : "图片信息",
							field : "picMc",
							width : "20%"
						},
						{
							title : "审核状态",
							field : "state",
							width : "10%",
							render : function(data) {
								if(data.state==0){
									return "未推送";
								}if(data.state==1){
									return "已推送待审核";
								}else if(data.state==2){
									return "审核通过";
								}else{
									return "审核不通过";
								}
							}
						},
						{
							title : "审核人",
							field : "auditUserName",
							width : "10%",
							render : function(data) {
								var html ="";
								if(data.auditUserName==null || data.auditUserName=='null'){
									return "";
								}else{
									return data.auditUserName;
								}
							}
						},
						{
							title : "审核时间",
							field : "auditTime",
							width : "10%",
							render : function(data) {
								var html ="";
								if(data.auditTime==null || data.auditTime=='null'){
									return "";
								}else{
									return data.auditTime;
								}
							}
						},
						{
							title : "审核信息",
							field : "auditInfo",
							width : "10%",
							render : function(data) {
								var html ="";
								if(data.auditInfo==null || data.auditInfo=='null'){
									return "";
								}else{
									return data.auditInfo;
								}
							}
						},
						{
							title : "操作",
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
	html += '<a href="javascript:void();" onclick="toDetail(\''+data.picXh+'\')">查看</a>';
	if(data.state==2||data.state==3){
		html += '<a href="javascript:void();" class="ml10" onclick="deleteById('+data.id+')">删除</a>';
	}
	return html;
}
/**
 * 获取审核数据
 * @param type
 */
function getAuditInfo(){
	 var obj = {};
	 var startTime = $("#startTime").val();
	 var endTime = $("#endTime").val();
	 if((startTime.length>0&&endTime.length>0)&&(startTime>endTime)){
			AlertBox.alert("起始时间不能大于结束时间！", "");
			return;
	}
	 obj.startTime=startTime;
	 obj.endTime=endTime;
	AlertBox.alert("信息获取中！");
	$.ajax({
		url : "/photo/pushInternalAudit/getAuditInfo", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			if(data || data=='true'){
				AlertBox.alert("信息获取成功！");
				searchData();
			}else{
				AlertBox.alert("信息获取失败！");
			}
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})
}
/**
 * 查看审核信息
 * @param info
 */
function showAuditInfo(info,user,auditTime){
	var html="";
	if(info!=null && 'null'!=info){
		AlertBox.alert("审核人："+user+"<br><br>审核时间："+auditTime+"<br><br>审核备注："+info, "审核信息");
	}else{
		AlertBox.alert("审核备注：", "审核信息");		
	}
}
/**
 * 查看详情
 * @param twq
 */
function toDetail(uuid){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type=d_photo_pic";
	url = encodeURI(url);
	parent.createPage("详情",url , true, "picsDetail"+uuid);
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
	var othr =getParam();
	reset_serach(othr,obj);
}

/**
 * 查看详情
 * @param twq
 */
function lookDetails(id){
	parent.createPage("图片详情", "../../html/photoManage/picEdit.html?id="+id, true, "picEdit");
}
/**
 * 编辑图片
 * @param id
 */
function editUser(id){
	parent.createPage("图片详情", "../../html/photoManage/picEdit.html?id="+id, true, "picEdit");
}

/**
 * 通过id删除数据
 * @param id
 */
function deleteById(id){
	var title ="消息提示";
	var content = '<div style="padding: 20px 80px 20px;">删除后不可恢复，请确认操作？</div>';
	var url = "/photo/pushInternal/deleteByIds";
	AlertBox.confirm(content, title, sureDelete, id);
}
//批量删除
function beacthDelete(){ 
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		AlertBox.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		if(val.state==2||val.state==3){			
			arr.push( val.id);
		}
	});
	if(arr.length==0){
		AlertBox.alert("未选择已经审核过的数据，未审核数据不能删除！", "");
		return;
	}
	var ids = arr.join(",");
	deleteById(ids)
}
/**
 * 审核数据
 * @param type
 */
function sureDelete(dataId){
	$.ajax({
		url : "/photo/pushInternal/deleteByIds", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {dataId:dataId}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			if(data || data=='true'){
				AlertBox.alert("数据删除成功！");
				searchData();
			}else{
				AlertBox.alert("数据删除失败！");
			}
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})

	
}