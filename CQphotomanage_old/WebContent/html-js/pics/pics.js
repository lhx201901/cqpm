/**
 * 图片列表页
 */
var MODULE_ID = "";
var TYPE_ONE = "";
var TABLE = "d_photo_pic";
var currentPage = 1;
var pageSize = 30;
var allPage;
var SEARCH_TYPE=0;
$(function() {
	MODULE_ID = GetRequest().pid;
	$("#pageSize").val(pageSize);
	// 初始化调用
	initTypeChange();
	console.log("111111"+ $("#search_type_one").val());
	initDatePicker();
	console.log("222222"+ $("#search_type_one").val());
	var userXh =  USRSESSION.userXh;
	loadClassify(userXh);
	getNarClassify(MODULE_ID);
	
	
	$("#SuperSearch").click(function() {
		higth_select_change();
		AlertBox.confirm(null, "高级搜索",higth_search,null)

	});
	console.log("3333333333"+ $("#search_type_one").val());
		//搜索抗增加回车检索按钮功能
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	});
	searchData();
})
/**
 * 高级检索切换单图图片
 */
function higth_select_change(){
	$("#search_type_one").val($("#h_type_one").val());
	 TYPE_ONE = $("#search_type_one").val();
	 loadEntitysByPname(TYPE_ONE);
	 if(TYPE_ONE=="全部图片"){
		 TYPE_ONE = "";
	 }
	 TABLE = $("#h_tj_pic").val();
	 if(TABLE=="d_photo_tj"){
		 $("#dl_sysj").hide();
	 }else{
		 $("#dl_sysj").show();
	 }
	var ac =$(".ed_msl>a");
	$.each(ac, function(key, val) {
		if(val.title==TABLE){
			$(val).addClass("cur").siblings("a").removeClass("cur");
		}
	});
}
/**
 * 高级检索
 */
function higth_search(){
	SEARCH_TYPE = 1;
	currentPage = 1;
	loadPage();
	AlertBox.hide();
}
/**
 * 高级检索获取检索条件
 * @returns {___anonymous8660_8661}
 */
function higth_search_getParam(){
	
	 var obj = {};
	 obj.pageIndex = currentPage;
	 pageSize=$("#pageSize").val();
	 obj.pageSize = pageSize;
	 obj.orderType = "desc";
	 obj.type = 0;//检索类型 
	 
	var searchWord = {};
	
	var s_sysj =$("#h_sysj_start").val();
	var e_sysj =$("#h_sysj_end").val();
	var sysj = getHightime(s_sysj,e_sysj);
	
	var s_scsj =$("#h_scsj_start").val();
	var e_scsj =$("#h_scsj_end").val();
	var scsj = getHightime(s_scsj,e_scsj);
	
	var h_syz = $("#h_syz").val();
	var h_scz = $("#h_scz").val();
	searchWord.table = TABLE;// 要查询的表，图集还是图片
	searchWord.type_one = TYPE_ONE;// 直接查询的字段
	searchWord.type_two = "";// 直接查询的字段
	searchWord.type_three = "";// 直接查询的字段
	searchWord.type_four = "";// 直接查询的字段
	searchWord.type_five = "";// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	if(TABLE=="d_photo_tj"){
		obj.orderField = "tj_scsj";
		searchWord.tj_scsj = scsj;// 上传时间
		searchWord.tj_syz=h_syz;
		searchWord.tj_scz=h_scz;
	}else{
		obj.orderField = "pic_scsj";
		searchWord.pic_scsj = scsj;// 上传时间
		searchWord.pic_sysj = sysj;// 上传时间
		searchWord.pic_syz=h_syz;
		searchWord.pic_scz=h_scz;
	}
	var term = $("#h_text").val().replace(/ /g,'@');
	
	searchWord.term = term;//  查询字段
	
	obj.searchWord = JSON.stringify(searchWord);
	
	return obj;
}
/**
 * 高级检索组装时间
 * @param s_time 开始时间
 * @param e_time 结束时间
 * @returns {String}
 */
function getHightime(s_time,e_time){
	var sj = "";
	if(s_time.length==0 && e_time.length==0){
		sj = "";
		return sj;
	}
	
	//开始时间
	if(s_time.length==0){
		sj = "* TO ";
	}else{
		var startTime = new Date(s_time);
		startTime.setDate(startTime.getDate()-1);
		var y = startTime.getFullYear();
		var m = startTime.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = startTime.getDate();
		if(d<10){
			d = "0"+d;
		}
		var st = y + '-' + m + '-' + d;
		sj = st+'T23:59:59.999Z TO ';
	}
	
	
	//结束时间
	if(e_time.length==0){
		sj += "*";
	}else{
		var endTime = new Date(e_time);
		y = endTime.getFullYear();
		m = endTime.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		d = endTime.getDate();
		if(d<10){
			d = "0"+d;
		}
		var et = y + '-' + m + '-' + d;
		sj += et+'T23:59:59.999Z';
	}
	return sj;
}
/**
 * 加载分类
 */
function loadClassify(userXh) {
	var html = "";
	$.ajax({
			url : "/photo/user/loadClassifyByUser", // 请求的url地址
			dataType : "json", // 返回格式为json
			async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				userId : userXh
			}, // 参数值
			type : "post", // 请求方式
			success : function(data) {
				var html = '';
				$.each(data[0].children, function(key, val) {
					html += '<option value="' + val.name + '">' + val.name + '</option>'
				});
				$("#search_type_one").html(html);
				$("#h_type_one").html(html);
			},
			error : function() {
		}
	})
}
/**
 * 单图，多图切换
 */ 
function initTypeChange() {
	$(".ed_msl>a").click(function() {
		$(this).addClass("cur").siblings("a").removeClass("cur");
		TABLE = $(this).attr("title");
		searchData();
	})
	$("#search_type_one").change(function (){
		TYPE_ONE = $("#search_type_one").val();
		loadEntitysByPname(TYPE_ONE);
	});
}
/**
 * 日期初始化
 */
function initDatePicker() {
	$.datepicker.regional['zh-CN'] = {
		closeText : '关闭',
		prevText : '<上月',
		nextText : '下月>',
		currentText : '今天',
		monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
				'十月', '十一月', '十二月' ],
		monthNamesShort : [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
				'十一', '十二' ],
		dayNames : [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
		dayNamesShort : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
		dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
		weekHeader : '周',
		dateFormat : 'yy-mm-dd',
		firstDay : 1,
		isRTL : false,
		showMonthAfterYear : true,
		yearSuffix : '年'
	};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	$(".time_picker_handle").datepicker({
		dateFormat : "yy-mm-dd",
		onSelect : function(val) {
			var minDom = $(this).attr("minlimit");
			var maxDom = $(this).attr("maxlimit");
			if (minDom) {
				$(minDom).datepicker("option", "maxDate", val);
			}
			if (maxDom) {
				$(maxDom).datepicker("option", "minDate", val);
			}
		}
	});
}
/**
 * 查询分类
 * 
 * @param id
 */
function getNarClassify(id) {
	id = id.split("_")[1];
	$.ajax({
		url : "/photo/narClassify/getEntityById", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			"id" : id
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			TYPE_ONE = data.narName;
			$("#type_one").text(TYPE_ONE + '：');
			$("#search_type_one").val(TYPE_ONE);
			loadEntitysByPname(TYPE_ONE);
		},
		error : function() {
		}
	})
}
/**
 * 查询分类的一级子类
 * 
 * @param id
 */
function loadEntitysByPname(TYPE_ONE) {
	$.ajax({
		url : "/photo/narClassify/loadEntitysByPname", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			"pname" : TYPE_ONE
		}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			var html = '<option value="">全部</option>';
			$.each(data, function(key, val) {
				html += '<option value="' + val.narName + '">' + val.narName + '</option>'
			});
			$("#type_two").html(html);
		},
		error : function() {
		}
	})
}

function loadPage(){
	var obj = {};
	if(SEARCH_TYPE==0){
		obj = getParam();
	}else{
		obj = higth_search_getParam();
	}
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : true,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			allPage = data.tatalPages;
			html = '';
			if(TABLE=="d_photo_tj"){
				$.each(data.rows, function(key, val) {
					html += '<li>';
					html += '<div class="picn">';
					html += '<div class="tuji_con">';
					html += '<em class="tjc">'+val.tj_sl+'</em>';
					html += '</div>';
					html += '<a href="#" onclick="toDetail(\''+val.tj_xh+'\',\''+val.tj_mc+'\')">';
					html += '	<p>';
					var imgurl = "";
					if(val.tj_fmlj==null||val.tj_fmlj==""){
						imgurl = '../../images/inx_img_09.jpg';
					}else{
						imgurl =PICURI+ val.tj_fmlj;
					}
					html += '<img src="'+imgurl+'" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'">';
					html += '</p>';
//					html += '<span style="background: url('+imgurl+')"></span>';
					html += '<div class="show_msg">';
					html += '<div class="bg"></div>';
					html += '<div class="img_msg">';
					//分别为标题、分说明、作者、日期、总说明 
					html += '	<div class="f16">图集说明</div>';
					if(TYPE_ONE=='新华图片'){
						html += '<div class="mt5">标题：'+val.tj_mc+'</div>';
						html += '<div class="mt5">图集说明：'+val.tj_sm+'</div>';
					}else{
						if(val.tj_mc !=undefined && val.tj_mc !=null && val.tj_mc.length>50){
							html += '<div class="mt5">标题：'+val.tj_mc.substring(0,50) + '...</div>';
						}else{		
							html += '<div class="mt5">标题：'+val.tj_mc+'</div>';
						}
						if(val.tj_sm !=undefined && val.tj_sm !=null && val.tj_sm.length>150){
							html += '<div class="mt5">图集说明：'+val.tj_sm.substring(0,150) + '...</div>';
						}else{		
							html += '<div class="mt5">图集说明：'+val.tj_sm+'</div>';
						}
					}
					html += '<div class="mt5">作者：'+val.tj_scz+'</div>';
					html += '<div class="mt5">上传日期：'+val.tj_scsj.substring(0,10)+'</div>';
					html += '<div class="mt5">图集分类：'+val.type_one+'</div>';
					html += '</div>';
					html += '</div>';
					html += '</a>';
					html += '</div>';
					html += '</li>';
				});
			}else{
				$.each(data.rows, function(key, val) {
					html += '<li>';
					html += '<div class="picn">';
					html += '<a href="javascript:void(0)" onclick=clickOne(\''+val.pic_lyljm+'\') ondblclick="clickdbl(\''+val.pic_xh+'\',\''+val.pic_mc+'\')" >';
					html += '<p><img src="' + PICURI+val.pic_lylys+'" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//					html += '<span style="background: url(' + PICURI+val.pic_lylys+')"></span>';
					html += '<div class="show_msg">';
					html += '<div class="bg"></div>';
					html += '<div class="img_msg">';
					html += '<div class="f16">图片说明</div>';
					if(TYPE_ONE=='新华图片'){
						html += '<div class="mt5">标题：'+val.pic_mc+'</div>';
						html += '<div class="mt5">分说明：'+val.pic_fsm+'</div>';
						html += '<div class="mt5">主说明：'+val.pic_zsm+'</div>';
					}else{						
						if(val.pic_fsm !=undefined && val.pic_fsm !=null && val.pic_fsm.length>50){
							html += '<div class="mt5">标题：'+val.pic_mc.substring(0,50) + '...</div>';
						}else{		
							html += '<div class="mt5">标题：'+val.pic_mc+'</div>';
						}
						if(val.pic_fsm !=undefined && val.pic_fsm !=null && val.pic_fsm.length>150){
							html += '<div class="mt5">分说明：'+val.pic_fsm.substring(0,150) + '...</div>';
						}else{		
							html += '<div class="mt5">分说明：'+val.pic_fsm+'</div>';
						}
						if(val.pic_zsm !=undefined && val.pic_zsm !=null && val.pic_zsm.length>150){
							html += '<div class="mt5">主说明：'+val.pic_zsm.substring(0,150) + '...</div>';
						}else{		
							html += '<div class="mt5">主说明：'+val.pic_zsm+'</div>';
						}
					}
					html += '<div class="mt5">作者：'+val.pic_scz+'</div>';
					html += '<div class="mt5">摄影日期：'+val.pic_sysj.substring(0,10)+'</div>';
					html += '<div class="mt5">上传日期：'+val.pic_scsj.substring(0,10)+'</div>';
					html += '<div class="mt5">图片分类：'+val.type_one+'</div>';
					html += '</div>';
					html += '</div>';
					html += '</a>';
					html += '</div>';
					html += '</li>';
				});
			}
			if(''==html){
				html="没查询到数据!"
			}
			$("#img_list_ul").empty();
			$("#img_list_ul").html(html);
			$("#img_list_ul > li > div > a").hover(
					  function (e) {
							// console.log("x---"+ e.clientX+"y----"+ e.clientY);
						  var imgul= $(this).parents("#img_list_ul");
						  var imgli= $(this).parents("li");
						 var zwidth=  imgul.width();
						 var showmsg= $(this).find(".show_msg")
						  $(this).find(".bg").css("width",imgli.width()*1.8);
						  $(this).find(".img_msg").css("width",imgli.width()*1.8);
						  showmsg.css("width",imgli.width()*2)
						  console.log("x---"+ imgli.offset().left+"y----"+ imgli.offset().top);
						 if(zwidth+15-imgli.offset().left<imgli.width()*2.4){
							 showmsg.css("left",-imgli.width()*2.2);
						 }
						 var zheight=  imgul.height();
//						 alert(zheight+"=="+imgli.offset().top+"=="+imgli.height());
						// console.log("计算:"+(zheight+15-e.clientY));
						 if(zheight>imgli.height()){							 
							 if(zheight+15-imgli.offset().top<imgli.height()){
								 showmsg.css("top",-240);
							 }
						 }
						 imgul= $(this).parents(".picn").css("z-index",10);
						 showmsg.show();
					  },
					  function (e) {
						  var showmsg = $(this).find(".show_msg")
						    showmsg.css("top",-10);
							showmsg.css("left", "119%");
							imgul= $(this).parents(".picn").css("z-index",3);
						  $(this).find(".show_msg").hide();
					  }
				);
			paging(loadPage);
		},
		error : function() {
		}
	})
}
//onMouseOver="mouseOver(this,event,\''+val.pic_xh+'\');" onMouseOut="mouseOut();"
//onMouseenter="mouseOver(this,event,\''+val.pic_xh+'\');" onMouseleave="mouseOut();"
function mouseOver(t,event,data){  
	console.log(data);
     //参数含义    
     //t:指当前对象，即超链接<a>  
     //e:event事件  
     //data:要显示的内容  
     var tooltipHtml = '<div id="tooltip" class="tooltip">65444444444444</div>';  
     $(t).append(tooltipHtml); //添加到页面中    
     $("#tooltip").css({    
          "top": (event.pageY) + "px",    
          "left": (event.pageX) + "px"   
     }).show("fast"); //设置提示框的坐标，并显示   
}  
function mouseOut(){  
	//$("#tooltip").remove();    
} 
function searchData(){
	if($("#search_type_one").val()!=TYPE_ONE){
		var text = $("#searchW_words").val();
		var url = "../../html/search/search.html?text="+text+"&TYPE_ONE="+$("#search_type_one").val();
		url = encodeURI(url);
		parent.createPage("检索结果",url , true, "searchData");
		
		return;
	}
	SEARCH_TYPE = 0;
	currentPage=1;
	loadPage();
}

function toDetail(uuid,pic_mc){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type="+TABLE;
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
 * 检索获取条件
 */
function getParam() {
	 var obj = {};
	 obj.pageIndex = currentPage;
	 pageSize=$("#pageSize").val();
	 obj.pageSize = pageSize;
	 obj.orderField = "";
	 obj.orderType = "desc";
	 obj.type = 0;

	var searchWord = {};
	var type_two = $("#type_two").val();
	if (type_two == "全部") {
		type_two = "";
	}
	var pic_scsj =getTime();

	searchWord.table = TABLE;// 要查询的表，图集还是图片
	searchWord.type_one = TYPE_ONE;// 直接查询的字段
	searchWord.type_two = type_two;// 直接查询的字段
	searchWord.type_three = "";// 直接查询的字段
	searchWord.type_four = "";// 直接查询的字段
	searchWord.type_five = "";// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	if(TABLE=="d_photo_tj"){
		searchWord.tj_scsj = pic_scsj;// 上传时间
		 obj.orderField = "id";
	}else{
		searchWord.pic_scsj = pic_scsj;// 上传时间
		 obj.orderField = "id";
	}
	var term = $("#searchW_words").val().replace(/ /g,'@');
	
	searchWord.term = term;//  查询字段
	
	obj.searchWord = JSON.stringify(searchWord);
	
	return obj;
}
function getTime() {

	var nowdate = new Date();
	var pic_scsj = $("#pic_scsj").val();
	var y = nowdate.getFullYear();
	var m = nowdate.getMonth() + 1;
	if(m<10){
		m="0"+m;
	}
	var d = nowdate.getDate();
	if(d<10){
		d = "0"+d;
	}
	var newdateString = y + '-' + m + '-' + d;
	if (pic_scsj == "今日") {
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
		
	} else if (pic_scsj == "一周") {
		nowdate.setDate(nowdate.getDate()-8);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
	}else if(pic_scsj == "一月"){
		nowdate.setMonth(nowdate.getMonth() - 1);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
	}else if(pic_scsj == "三月"){
		nowdate.setMonth(nowdate.getMonth() - 3);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
	}else if(pic_scsj == "半年"){
		nowdate.setMonth(nowdate.getMonth() - 6);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
	}else if(pic_scsj == "一年"){
		nowdate.setMonth(nowdate.getMonth() - 12);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'T23:59:59.999Z TO '+newdateString+'T23:59:59.999Z';
	}else{
		pic_scsj = "";
	}
	return pic_scsj;
}

function  selectChange(_this){
	searchData();
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
function clickdbl(picXh,pic_mc){
	clearTimeout(timer);
	//alert("双击事件");
	toDetail(picXh,pic_mc);
}
