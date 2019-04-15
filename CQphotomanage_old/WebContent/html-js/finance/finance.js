/**
 * 用户管理js
 * 
 * @author lxw
 */
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	initDatePicker();
	initUserAndDw();
	loadData();
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			loadData();
		}
	});
	$("#ssdw").change(function(){
		loadData();
	});
	$("#userName").change(function(){
		loadData();
	});
	MODULE_ID = GetRequest().pid;
})
/**
 * 用户初始化
 */
function initUserAndDw(){
	$.ajax({
		url : "/photo/finance/getSsdwQuery", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			var html="";
			$.each(data, function(key, val) {
				html+="<option value='"+val.ssdw+"'>"+val.ssdw+"</option>";
			});
			$("#ssdw").append(html);
		},
		error : function() {
		}
	})
	$.ajax({
		url : "/photo/finance/getUserNameQuery", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			var html="";
			$.each(data, function(key, val) {
				html+="<option value='"+val.user_name+"'>"+val.user_name+"</option>";
			});
			$("#userName").append(html);
		},
		error : function() {
		}
	})
}
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
 * 获取检索参数
 */
function getParam(){
	var obj = {};
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	if(startTime>endTime){
		AlertBox.alert("起始时间不能大于结束时间！", "");
		return;
	}
	obj.userXh= "";
	obj.userName = $("#userName").val();
	obj.ssdw = $("#ssdw").val();
	obj.startTime= startTime.length>0?startTime+" 00:00:00":"";
	obj.endTime= endTime.length>0?endTime+" 23:59:59":"";
	var pageSize = $("#page_size").val();
	var pageIndex = 1;
	obj.pageSize=pageSize;
	obj.pageIndex=pageIndex;
	return obj;
}

/**
 * 初始加载
 */
function loadData(){
	var  obj = getParam();
	$.ajax({
		url : "/photo/finance/findPageByUser", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			createNum(data.countT,data.countS,data.countW);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/finance/findPageByUser";
			setCommon(obj, Table_Obj, url);
		},
		error : function() {
		}
	})
}
//生成支付信息
function createNum(total,success,notsucess){
	$("#numDiv").html('<span class="nk_ti ml20">总金额：￥'+total+'</span><br>'
			+'<span class="nk_ti ml20">结算金额：￥'+success+'</span><br>'
			+'<span class="nk_ti ml20">待结算金额：￥'+notsucess+'</span>');
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
//					alert(data.id)
//				},
				rowDoubleClick : function(data) {// 行双击回调，参数为改行数据
					//alert(JSON.stringify(data))
				},
				click:function(data){
					
				},
				columns : [
						{// 表格结构配置
							title : "图片",// 列title文字
							field : "picLyljs",// 该列对应数据哪个字段
							width : "10%",// 列宽度设置,不设也没什么
							render : function(data) {
								var html ="";
								html+='<div class="hill_img"><div class="hl_img"><img src="'+PICURI+data.picLyljs+'"></div></div>';
								return html;
							}
						},
						{
							title : "图片信息",
							field : "picMc",
							width : "20%",
							render : function(data) {
								var html ="";
								if(data.picMc!=undefined && data.picMc!=null  && data.picMc!="null" && data.picMc.length>50){
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.picMc.substring(0,50)+'...</p>';
								}else{
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.picMc+'</p>';
								}
								html+='<p><span style="font-weight: bold;">作者：</span>'+data.userName+'</p>';
								return html;
							}
							
						},
						{
							title : "价格(人名币:元)",
							field : "salePrice",
							width : "12%"
						},{
							title : "资源所属单位",
							field : "ssdw",
							width : "10%"
						},
						{
							title : "支付方式",
							field : "payWay",
							width : "10%",
							render : function(data) {
								if(data.isUse==1){
									return "微信";
								}else{
									return "支付宝";
								}
							}
						},{
							title : "销售时间",
							field : "saleTime",
							width : "10%",
							render : function(data) {
								return data.saleTime==null?"":dateFtt("yyyy-MM-dd", new Date(data.saleTime))
							}
						},{
							title : "结算状态",
							field : "haveSettlement",
							width : "10%",
							render : function(data){
								if(data.haveSettlement==0){
									return "待结算";
								}else{
									return "结算";
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
	html += '<a href="javascript:void();" onclick="lookDetails(\''+data.picXh+'\')">查看</a>';
	if(data.haveSettlement==0){
		html += '<a href="javascript:void();" class="ml10" onclick="settlement('+data.id+')">结算</a>';
	}
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
	var othr =getParam();
	reset_serach(othr,obj);
}

 
/**
 * 查看详情
 * @param twq
 */
function lookDetails(uuid){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type=d_photo_pic";
	url = encodeURI(url);
	parent.createPage("详情",url , true, "picsDetail");
}
/**
 * 获取门户数据
 */
function getSjcqData(){
	var obj = {};
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	if((startTime.length>0&&endTime.length>0)&&(startTime>endTime)){
		AlertBox.alert("起始时间不能大于结束时间！", "");
		return;
	}
	obj.startTime= startTime;
	obj.endTime= endTime;//endTime.length>0?endTime+" 23:59:59":"";
	console.log(obj)
	AlertBox.alert("数据获取中请稍等！", "");
	$.ajax({
		url : "/photo/finance/getFinanceDataByTime", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data==true || data=='true'){
				AlertBox.alert("数据获取成功！", "");
				loadData();
			}else{
				AlertBox.alert("数据获取失败！", "");
			}
		},
		error : function() {
		}
	})
}
/**
 * 结算
 */
function settlement(id){
	$.ajax({
		url : "/photo/finance/photoSettlement", // 请求的url地址
		dataType : "text", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{dataIds : id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			if(data==true || data=='true'){
				AlertBox.alert("数据结算成功！", "");
				loadData();
			}else{
				AlertBox.alert("数据结算失败！", "");
			}
		},
		error : function() {
		}
	})
}
/**
 * 批量结算
 */
function batchSettlement(){ 
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		AlertBox.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		if(val.haveSettlement==0){			
			arr.push( val.id);
		}
	});
	if(arr.length==0){
		AlertBox.alert("未选择待结算数据！", "");
		return;
	}
	var ids = arr.join(",");
	settlement(ids)
}