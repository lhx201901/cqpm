/**
 * 组图/图片详情页
 */
var UUID_ = "";
var TABLE = "";

var currentPage = 1;
var pageSize = 12;
var allPage=0;
var picDownXh = "";
$(function() {
	var obj = GetRequest();
	UUID_ = obj.uuid;
	TABLE = obj.type;

	initLoad();
	// 初始化
	initCheckedAll();
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	});
	
})
function downloadYt1(){
	downloadYt(picDownXh);
}
function addSavePre1(){
	addSavePre(picDownXh);
}
// 初始化全选事件
function initCheckedAll() {
	$("#CheckedAll").change(function() {
		var val = this.checked;
		$("input[name=images]").each(function() {
			this.checked = val;
		})
	})
	$(".icolt").click(function() {
		var allPage=$("#allPage").val();
		var pageNum = $("#pageNum").val();
		//获取上一页数据
		if(TJUUID_!=undefined && TJUUID_!=null){
			if(parseFloat(pageNum)==1){
				if(parseFloat(allPage)>1){
					$("#pageNum").val(allPage);
					getPicByTjXh(allPage, 4);
				}
			}else{
				$("#pageNum").val(parseFloat(pageNum)-1);
				getPicByTjXh(parseFloat(pageNum)-1, 4);
			}
		}
	});
	$(".icort").click(function() {
		var pageNum = $("#pageNum").val();
		var allPage=$("#allPage").val();
		//获取下一页数据
		if(TJUUID_!=undefined && TJUUID_!=null){
			if(parseFloat(allPage)>1){
				if(parseFloat(allPage)==parseFloat(pageNum)){
					$("#pageNum").val(1);
					getPicByTjXh(1, 4);
				}else{
					$("#pageNum").val(parseFloat(pageNum)+1);
					getPicByTjXh(parseFloat(pageNum)+1, 4);
				}
			}
		}
	});
}
/**
 * 通过图集序号获取图片信息
 * @param pageNum
 * @param pageSize
 * @returns {Array}
 */
function getPicByTjXh(pageNum,pageSize){
	var PICS = new Array();
	var params = {};
	 var obj = {};
	 obj.pageIndex = pageNum;
	 obj.pageSize = pageSize;
	 obj.orderField = "";
	 obj.orderType = "";
	 obj.type = 0;
	var searchWord = {};
	searchWord.table = "d_photo_pic";// 要查询的表，图集还是图片
	searchWord.tj_xh = TJUUID_;// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	searchWord.term = "";//  模糊查询匹配的条件
	obj.searchWord = JSON.stringify(searchWord);
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			//添加图片信息
			 $(".vt_dl_minimg ul").html("");
			 var html="";
			 $.each(data.rows, function(key, val) {
					html += '<li picXh=\''+val.pic_xh +'\'>';
					html += '<p><img src="' + PICURI + val.pic_lyljm + '"></img></p>';
					html += '</li>';
				});

			$(".vt_dl_minimg ul").html(html);
			 $("#allPage").val(data.tatalPages);
			 $(".vt_dl_minimg ul li").click(function() {
					changePic($(this).attr("picXh"));
					$(this).addClass("cur").siblings("li").removeClass("cur");
			});
		},
		error : function() {
		}
	})
	return PICS;

}
/**
 * 初始化加载
 */
var TJUUID_ = "";
function initLoad() {
	var PIC = null;
	var PICS = null;
	// 当为图集进入
	if ("d_photo_tj" == TABLE) {
		
		// tj_xh:3be4e8b9-d466-4b3e-ba81-c7a9492950dc AND is_delete:0 AND tableName:d_photo_tj 
//		tj_xh:3be4e8b9-d466-4b3e-ba81-c7a9492950dc AND is_delete:0 AND tableName:d_photo_pic 
//		pic_xh:5251d1a5-2ebf-4608-962e-8d230fbf702e AND is_delete:0 AND tableName:d_photo_pic 
		var TJ = searchEntityByTjID(UUID_);
		TJUUID_ = TJ.tj_xh;
		PICS = loadPicsByTjxh();
		getPicByTjXh(1,4);
		if (TJ.pic_xh != null && TJ.pic_xh != "") {
			PIC = searchEntityByPicXh(TJ.pic_xh);
		}else{
			PIC = PICS[0];
		}
	}
	// 图片进入
	if ("d_photo_pic" == TABLE) {
		PIC = searchEntityByPicXh(UUID_);
		if(PIC!=null && PIC!= undefined){			
			TJUUID_ = PIC.tj_xh;
			PICS = loadPicsByTjxh();
			getPicByTjXh(1,4);
		}
	}
	if("push_audit" == TABLE){
		PIC=findPicByPushAuditId(UUID_);
		$("#pic_in_del").html("");
		$("#page_div").html("");
		/*if(PIC!=null && PIC!= undefined){			
			TJUUID_ = PIC.tj_xh;
			PICS = loadPicsByTjxh();
		}*/
	}
	if(PIC!=null && PIC!= undefined){		
		loadPicHtml(PIC);
	}else{
	//	AlertBox.alert("对应的条目信息已被删除，请确认数据是否存在！");
	}
	//loadPicsHtml(PICS);
}
/**
 * 通过审核信息获取图片信息
 */
function findPicByPushAuditId(id){
	
	var PICOBJ = null;
	$.ajax({
		url : "/photo/pushInternalAudit/findById", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :{id : id}, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			PICOBJ = data;
		},
		error : function() {
		}
	})
	return PICOBJ;
}
/**
 * 根据图集UUID查询图集实体
 * 
 * @param id
 */
function searchEntityByTjID(tjxh) {
	
	 var obj = {};
	 obj.pageIndex = 1;
	 obj.pageSize = 20;
	 obj.orderField = "";
	 obj.orderType = "";
	 obj.type = 0;
	 
	var searchWord = {};
	searchWord.table = "d_photo_tj";// 要查询的表，图集还是图片
	searchWord.tj_xh = tjxh;// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	searchWord.term = "";//  模糊查询匹配的条件
	obj.searchWord = JSON.stringify(searchWord);
	
	
	var TJOBJ_ = null;
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			TJOBJ_ = data.rows[0];
		},
		error : function() {
		}
	})

	return TJOBJ_;
}
/**
 * 根据图片UUID查询图片信息
 * 
 * @param picxh
 */
function searchEntityByPicXh(picxh) {
	 var obj = {};
	 obj.pageIndex = 1;
	 obj.pageSize = 20;
	 obj.orderField = "";
	 obj.orderType = "";
	 obj.type = 0;
	 
	var searchWord = {};
	searchWord.table = "d_photo_pic";// 要查询的表，图集还是图片
	searchWord.pic_xh = picxh;// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	searchWord.term = "";//  模糊查询匹配的条件
	obj.searchWord = JSON.stringify(searchWord);
	
	var PICOBJ = null;
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			PICOBJ = data.rows[0];
		},
		error : function() {
		}
	})
	return PICOBJ;
}
/**
 * 根据图集UUID查询图片集合
 * @returns {Array}
 */
function loadPicsByTjxh() {
	var PICS = new Array();
	var params = {};
	 var obj = {};
	 obj.pageIndex = currentPage;
	 obj.pageSize = pageSize;
	 obj.orderField = "";
	 obj.orderType = "";
	 obj.type = 0;
	 
	var searchWord = {};
	searchWord.table = "d_photo_pic";// 要查询的表，图集还是图片
	searchWord.tj_xh = TJUUID_;// 直接查询的字段
	searchWord.is_delete = 0;// 直接查询的字段
	searchWord.term = "";//  模糊查询匹配的条件
	obj.searchWord = JSON.stringify(searchWord);
	
	$.ajax({
		url : "/photo/retriebe/getDataByterm", // 请求的url地址
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			 PICS = data.rows;
			 loadPicsHtml(PICS);
			 allPage=data.tatalPages;
			 paging(loadPicsByTjxh);
		},
		error : function() {
		}
	})
	return PICS;
}
function null_W(str){
    if(str==null||str==undefined||str==""){
        return "无";
    }else{
        return str;
    }
}
function loadPicHtml(PIC) {
	var html = "";
	html += '<img src="' + PICURI + PIC.pic_lyljm + '" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'">'
	$(".vt_dl_img").html(html);
	$(".vt_maximg").css("height",$(".vt_maximg").width());
	$(window).resize(function(){
		$(".vt_maximg").css("height",$(".vt_maximg").width());
	});
	html = "";
//	html += '<p class="zi_fi">主说明</p>';
//	html += '<p class="zi_ci">' + PIC.pic_zsm + '</p>';
	//html += '<div class="f16 mb10">主说明</div>';
//	html += '<div class="gray9 mt10">' + PIC.pic_zsm + '</div>';
//	html += '<p class="zi_fi">分说明</p>';
//	html += '<p class="zi_ci">' + PIC.pic_fsm + '</p>';
	if(PIC.pic_mc!=undefined && PIC.pic_mc!=null && PIC.pic_mc!=null && PIC.pic_mc.length>50){
		html += '<p class="zi_ti">' + PIC.pic_mc.substring(0,50) + '...</p>';
	}else{
		html += '<p class="zi_ti">' + PIC.pic_mc + '</p>';
	}
//	html += '<p class="zi_fi">主说明</p>';
//	html += '<p class="zi_ci">' + PIC.picZsm + '</p>';
	
	html += '<p class="zi_fi">分说明</p>';
	if(PIC.pic_fsm !=undefined && PIC.pic_fsm !=null && PIC.pic_fsm.length>150){
		html += '<p class="zi_ci">' + PIC.pic_fsm.substring(0,150) + '...</p>';
	}else{		
		html += '<p class="zi_ci">' + PIC.pic_fsm + '</p>';
	}
	
	html += '<div class="zi_mg">';
	html += '<p>';
	html += '<span>图片地点：</span>' + null_W(PIC.pic_dd) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>摄影作者：</span>' + null_W(PIC.pic_syz) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>拍摄时间：</span>' + timestampToTime(PIC.pic_sysj) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>上传者：</span>' + null_W(PIC.pic_scz) + '';
	html += '</p>';
	html += '</div>';
	html += '<p class="zi_ex">图片EXIF提取数据</p>';
	html += '<div class="zi_tab">';
	html += '<table>';
	html += '<tr>';
	html += '<td>分辨率: ' +  ((PIC.pic_fbl==null||PIC.pic_fbl=='null')?"":PIC.pic_fbl)+ '</td>';
	html += '<td>曝光时间: ' +  ((PIC.pic_bgsj==null||PIC.pic_bgsj=='null')?"":PIC.pic_bgsj)+ '</td>';
	html += '</tr>';
	html += '<tr>';
	var fileSize="";
	// 如果大小大于1M使用'M'为单位表示, 1位小数点
	if(PIC.pic_filesize > 1024 * 1024 * 1024){
		// 如果大小大于1G使用'G'为单位表示, 1位小数点
		fileSize = Math.round(PIC.pic_filesize / (1024 * 1024* 1024) * 100) / 100 + "G";
	}else if (PIC.pic_filesize > 1024 * 1024) {
		fileSize = Math.round(PIC.pic_filesize / (1024 * 1024) * 10) / 10 + "M";
	} else if (PIC.pic_filesize > 1024) {
		// 如果大小大于1KB使用'KB'为单位表示, 1位小数点
		fileSize = Math.round(PIC.pic_filesize / 1024 * 10) / 10 + "KB";
	}
	html += '<td>大小: '+ fileSize +'</td>';
	html += '<td>ISO速度：' +  ((PIC.pic_iso==null||PIC.pic_iso=='null')?"":PIC.pic_iso)+ '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>相机型号: ' + ((PIC.pic_xjxh==null||PIC.pic_xjxh=='null')?"":PIC.pic_xjxh)+ '</td>';
	html += '<td>焦距: '+ ((PIC.pic_jj==null||PIC.pic_jj=='null')?"":PIC.pic_jj)+'</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>光圈值: ' + ((PIC.pic_gqz==null||PIC.pic_gqz=='null')?"":PIC.pic_gqz)+ '</td>';
	html += '<td></td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div class="mt30">';
	if("push_audit" != TABLE){
		picDownXh = PIC.pic_xh;
		html += '<a onclick="downloadYt1(\'' + PIC.pic_xh + '\')" class="btn btn_ok">下载图片</a>';
		html += '<a onclick="addSavePre1(\'' + PIC.pic_xh + '\')" class="btn ml10">加入预选</a>';
	}
	html += '</div>';

	$(".zutu_img").html(html);

	html = "";

	html += '<div class="f16 mb10">主说明</div>';
	html += '<div class="gray9 mt10">' + PIC.pic_zsm + '</div>';
	html += '<div class="smpa">';
	html += '<span>图片分类:</span>';
	html += '<a href="#">' + PIC.type_one + '</a>';
	if (PIC.type_two != null && PIC.type_Two != "") {
		html += '<u>></u> <a href="#">' + PIC.type_two + '</a>';
	}
	if (PIC.type_three != null && PIC.type_three != "") {
		html += '<u>></u> <a href="#">' + PIC.type_three + '</a>';
	}
	if (PIC.type_four != null && PIC.type_four != "") {
		html += '<u>></u> <a href="#">' + PIC.type_four + '</a>';
	}
	if (PIC.type_five != null && PIC.type_five != "") {
		html += '<u>></u> <a href="#">' + PIC.type_five + '</a>';
	}
	html += '</div>';
	html += '<div class="key_wd">';
	html += '<span>关键词:</span>';
	var gjz = PIC.pic_gjz;
	if (gjz != null && gjz != "") {
		$.each(gjz.split("@"), function(key, val) {
			html += '<a href="#">' + val + '</a>';
		});
	}
	html += '</div>';

	$(".pic_in_info").html(html);
}

function loadPicsHtml(PICS) {
	var html = "";
	$.each(PICS, function(key, val) {
		html += '<li>';
		html += '<label onclick="changePic(\'' + val.pic_xh +'\')">';
		html += '<input hidden="hidden" type="checkbox" name="images" attrXh="' + val.pic_xh + '" attrLj="'+ val.pic_xh +'"/>';
		html += '<div class="picn">';
		html += '<div class="picn_nbx">';
		html += '	<p>';
		html += '<img src="' + PICURI + val.pic_lylys + '">';
		html += '</p>';
//		html += '<span style="background: url(' + PICURI + val.pic_lylys + ')"></span>';
		html += '<div class="bg"></div>';
		html += '<div class="ed_sel_ok">';
		html += '<i class="ico ico20"></i>';
		html += '</div>';
		html += '<div class="up_txt_ied">';
		html += '<a onclick="downloadYt(\'' + val.pic_xh + '\')" >下载</a> <a onclick="addSavePre(\'' + val.pic_xh + '\')">加入预选</a>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</label>';
		html += '</li>';
	});

	$("#ImageList").html(html);
}

function changePic(id) {
	var PIC = searchEntityByPicXh(id);
	loadPicHtml(PIC)
	//$('html').scrollTop(0);
	$('html').animate( {scrollTop: 0}, 500);
}

/**
 * 加入预选
 * 
 * @param picXh
 */
function addSavePre(picXh) {
	AlertBox.alert("数据加入预选中,请稍等...!","消息提示");
	$.ajax({
		url : "/photo/preelection/addSavePre",
		dataType : "json",
		async : true,
		data : {
			picXh : picXh
		},
		type : "post",
		success : function(data) {
			AlertBox.alert(data.resultInfo);
		},
		error : function() {
			AlertBox.alert("系统错误，请稍后重试！");
		}
	});
}

/**
 * 批量加入预选
 */
function batchSavePre() {
	var arr = new Array();
	$("input[name=images]:checked").each(function(){
		var picXh=$(this).attr("attrXh");
		arr.push(picXh);
	});
	var picXhs = arr.join(",");
	if(picXhs.length==0){
		AlertBox.alert("请选择要加入预选的档案！");
		return ;
	}
	AlertBox.alert("数据加入预选中,请稍等...!","消息提示");
	$.ajax({
		url : "/photo/preelection/batchSavePre",
		dataType : "json",
		async : true,
		data : {
			picXhs : picXhs
		},
		type : "post",
		success : function(data) {
			AlertBox.alert(data.resultInfo);
		},
		error : function() {
			AlertBox.alert("系统错误，请稍后重试！");
		}
	});
}

/**
 * 批量下载
 */
function batchDownYt() {
	$("input[name=images]:checked").each(function(){
		var picYtLj=$(this).attr("attrLj");
		downloadYt(picYtLj);
	});
}
/**
 * 检索
 */
function searchData(){
	var text = $("#searchW_words").val();
	var url = "../../html/search/search.html?text="+text+"&TYPE_ONE="+$("#search_type_one").val();
	url = encodeURI(url);
	parent.createPage("检索结果",url , true, "searchData");
}