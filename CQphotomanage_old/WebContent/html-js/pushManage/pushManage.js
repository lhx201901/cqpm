/**
 * 用户管理js
 * 
 * @author lxw
 */
var TABLE = "d_photo_pic";
var MODULE_ID="";
var Table_Obj;//表格对象
$(function() {
	load_user();
	MODULE_ID = GetRequest().pid;
	//搜索抗增加回车检索按钮功能
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	});
	initTypeChange();
	
})
/**
 * 单图，多图切换
 */ 
function initTypeChange() {
	$(".ed_msl>a").click(function() {
		$(this).addClass("cur").siblings("a").removeClass("cur");
		TABLE = $(this).attr("title");
	})
	$("#search_type_one").change(function(){
		searchData();
	});
	$("#mj").change(function(){
		searchData();
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
	 obj.orderField = "id";
	 obj.orderType = "desc";
//	 obj.type = 0;
	 obj.type = 2;//推送检索
	 var fieldArray=[];
	//判断是否选择了查询词
     $.each( $(".search_field:checked" ),function(){
    	 fieldArray.push($(this).val());
     });
	 if(fieldArray.length>0){
		 obj.searchField=fieldArray.join(",");
	 }
	var searchWord = {};
	var type_one = $("#search_type_one").val();
	if (type_one == "全部") {
		type_one = "";
	}

	searchWord.table = "d_photo_pic";// 要查询的表，图集还是图片
	searchWord.type_one = type_one;// 直接查询的字段
	searchWord.type_two = "";// 直接查询的字段
	searchWord.type_three = "";// 直接查询的字段
	searchWord.type_four = "";// 直接查询的字段
	searchWord.type_five = "";// 直接查询的字段
	searchWord.is_delete = "";// 直接查询的字段
	searchWord.is_push = 0;// 直接查询的字段
	searchWord.pic_mj = $("#mj").val();
	
	var term = $("#searchW_words").val().replace(/ /g,'@');
	searchWord.term = term;//  查询字段
	obj.searchWord = JSON.stringify(searchWord);
	
	return obj;
}
/**
 * 初始加载
 */
function load_user(){
	var  obj = getParam();
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			init_table(data.rows);
			$("#total_records").text(data.total);
			$("#this_page").text(1);
			$("#total_page").text(data.tatalPages);
			var url = "/photo/retriebe/getDataByterm";
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
						{// 表格结构配置
							title : "图片",// 列title文字
							field : "pic_lylys",// 该列对应数据哪个字段
							width : "10%",// 列宽度设置,不设也没什么
							render : function(data) {
								var html ="";
								html+='<div class="hill_img"><div class="hl_img"><img onclick=clickOne(\''+data.pic_lyljm+'\') ondblclick="clickdbl(\''+data.pic_xh+'\',\''+data.pic_mc+'\')" src="'+PICURI+data.pic_lylys+'"></div></div>';
								return html;
							}
						},
						{
							title : "图片信息",
							field : "pic_mc",
							width : "30%",
							render : function(data) {
								var html ="";
								if(data.pic_mc!=undefined && data.pic_mc!=null  && data.pic_mc!="null" && data.pic_mc.length>50){
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.pic_mc.substring(0,50)+'...</p>';
								}else{
									html+='<p><span style="font-weight: bold;">标题：</span>'+data.pic_mc+'</p>';
								}
								html+='<p><span style="font-weight: bold;">作者：</span>'+data.pic_scz+'</p>';
								if(data.pic_zsm!=null&&data.pic_zsm.length>50){
									html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.pic_zsm.substring(0,50)+'...</p>';
								}else{
									html+='<p><span style="font-weight: bold;">图片说明：</span>'+data.pic_zsm+'</p>';
								}
								return html;
							}
							
						},
						{
							title : "价格(人名币:元)",
							field : "pic_jg",
							width : "8%",
							align : 'center'
						},
						{
							title : "密级状态",
							field : "pic_mj",
							width : "10%",
							align : 'center',
							render : function(data) {
								if(data.pic_mj==1){
									return "非公开";
								}else{
									return "公开";
								}
							}
						},
						{
							title : "删除状态",
							field : "is_delete",
							width : "10%",
							render : function(data) {
								if(data.is_delete==1){
									return "已删除";
								}else{
									return "正常";
								}
							},
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
	html += '<a href="javascript:void();" onclick="toDetail(\''+data.pic_xh+'\',\''+data.pic_mc+'\')">查看</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="editUser('+data.id+')">编辑</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="setMj('+data.id+')">密级</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="setJG('+data.id+')">定价</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="downloadYt(\''+data.pic_xh+'\')">下载</a>';
	html += '<a href="javascript:void();" class="ml10" onclick="deleteThis('+data.id+')">删除</a>';
	if(data.pic_mj==0){		
		html += '<a href="javascript:void();" class="ml10" onclick="addPush('+data.id+')">加入推送</a>';
	}
	
	return html;
}
/**
 * 编辑图片
 * @param id
 */
function editUser(id){
	parent.createPage("图片详情", "../../html/photoManage/picEdit.html?id="+id, true, "picEdit");
}
/**
 * 查看详情
 * @param twq
 */
function toDetail(uuid,pic_mc){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type=d_photo_pic";
	url = encodeURI(url);
	var title ="详情";
	if(pic_mc!=undefined && pic_mc!=null && pic_mc!="null"){
		if(pic_mc.length>10){
			title =pic_mc.substring(0,10)+"...";
		}else{
			title = pic_mc;
		}
	}
	parent.createPage(title,url , true, "picsDetail"+uuid);
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
 * 设定密级
 * @param id
 */
function setMj(id){
	var html ='';
	html += '<div class="ued_w">';

	html += '<p>请设置图片的保密级别</p>';
	html += '<input class="ismg" type="radio" name="picMj" value ="0" checked="checked"> 公开';
	html += '<input class="ismg" type="radio" name="picMj" value ="1"> 非公开';
	html += '</div>';
	var title ="新增角色";
	var content = '<div style="padding: 20px 80px 20px;">请确认操作？</div>';

	AlertBox.confirm(html, title, sureSetMj, id);
}

/**
 * 批量设定密级
 */
function beacthMJ(){
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
	setMj(ids);
}

/**
 * 确认设定密级
 * @param id
 */
function sureSetMj(id){
	var obj = {};
	obj.ids=id;
	obj.picMj =  $("input[name='picMj']:checked").val();
	console.log(obj)
	$.ajax({
		url : "/photo/photoPic/setMjByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				searchData();
			}
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})
}

/**
 * 设定价格
 * @param id
 */
/**
 * 设定价格
 * @param id
 */
function setJG(id){
	var html ='';
	html += '<div class="ued_w">';
	html += '<div class="clearfix">';
	html += '<input type="text" value="200" class="text"  id="jg_text" oninput="chage()"'
		+' onkeyup=\'if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value="";}\'  '
		+' onafterpaste=\'if(!/^\\d+(\\.\\d{0,2})?$/.test(this.value)){this.value="";}\'   placeholder="输入价格" />'
		//+'<input type="text" class="text" placeholder="输入价格" id="jg_text" oninput="chage()">';
	html += '</div>';
	html += '<div class="clearfix" style="margin-top: 20px;">';
	html += '<a onclick="changeJG(this)" title="100">100元</a>'
	html += '<a onclick="changeJG(this)" class="cur" title="200">200元</a>'
	html += '<a onclick="changeJG(this)" title="500">500元</a>'
	html += '<a onclick="changeJG(this)" title="1000">1000元</a>'
	html += '</div>'
	html += '<div class="clearfix">';
	html += '<p class="jg">￥200元</>'
	html += '</div>'
	html += '</div>';
	var title ="设定价格";
	AlertBox.confirm(html, title, sureSetJG, id);
}
function changeJG(_this){
	$(_this).addClass("cur").siblings("a").removeClass("cur");
	var jg = $(_this).attr("title");
	$("#jg_text").val(jg);
	$(".jg").text("￥"+jg+"元");
}
function chage(){
	var jg = $("#jg_text").val();
	$(".jg").text("￥"+jg+"元");
}
function beacthJG(){
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
	setJG(ids)
}
function sureSetJG(id){
	var obj = {};
	obj.ids=id;
	obj.picJg =  $("#jg_text").val();
	if($("#jg_text").val().length==0){
		AlertBox.alert("请输入图片价格！", "");
		return ;
	}
	console.log(obj)
	$.ajax({
		url : "/photo/photoPic/setJgByIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info+"特别提醒：执行之后，数据会在1-2分钟后更新完成！", "");
			if(data.state){
				searchData();
			}
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})
}

/**
 * 加入推送
 * @param id
 */
function addPush(id){
	var title ="加入提示";
	var content = '<div style="padding: 20px 80px 20px;">加入推送任务后，程序将会自动执行将数据条目和文件传输至门户网站，请确认操作？</div>';
	AlertBox.confirm(content, title, sureAddPush, id);
}
function beacthPush(){
	var datas = Table_Obj.getCheckedItem();
	if(datas.length==0){
		AlertBox.alert("未选择有效数据！", "");
		return;
	}
	var arr = new Array();
	$.each(datas, function(key, val) {
		if(val.pic_mj==0){			
			arr[arr.length] = val.id;
		}
	});
	console.log(arr);
	if(arr.length==0){
		AlertBox.alert("未选择公开数据,非公开数据不能加入推送！", "");
		return;
	}
	var ids = arr.join(",");
	addPush(ids)
}
function sureAddPush(id){
	var obj = {};
	obj.xhs=id;
	$.ajax({
		url : "/photo/push/addPushByPicIds", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
			if(data.state){
				changePicIsPush(id);
			}
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})
}

function changePicIsPush(id){
	var obj = {};
	obj.ids=id;
	$.ajax({
		url : "/photo/photoPic/changeIsPust", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			console.log(data)
			AlertBox.alert(data.info, "");
		},
		error : function() {
			AlertBox.alert("系统错误！", "");
		}
	})
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
		url : "/photo/photoPic/physicalDeleteByIds",
		dataType : "json",
		async : true,
		data : {
			ids : id
		},
		type : "post",
		success : function(data) {
			if(data.status){
				AlertBox.alert("删除成功!<br>特别提醒：执行之后，数据会在1-2分钟后更新完成！","");
				AlertBox.onHide(function(){
					searchData();
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
var timer=null;
//单击
function clickOne(path){
	clearTimeout(timer);
	timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
		//alert("单击事件");
		picLarge(path);
	}, 400);
}
//双击
function clickdbl(picXh,tpmc){
	clearTimeout(timer);
	//alert("双击事件");
	toDetail(picXh,tpmc);
}
function toDetail(uuid,tj_mc){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type="+TABLE;
	url = encodeURI(url);
	var title ="详情";
	if(tj_mc!=undefined && tj_mc!=null && tj_mc!="null"){
		if(tj_mc.length>10){
			title =tj_mc.substring(0,10)+"...";
		}else{
			title = tj_mc;
		}
	}
	parent.createPage(title,url , true, "picsDetail"+uuid);
}