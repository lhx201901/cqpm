/**
 * 图片详情页
 */
var XH_ = "";

var currentPage = 1;
var pageSize = 12;
var allPage=0;

$(function() {
	var obj = GetRequest();
	XH_ = obj.picXh;
	initLoad();
	// 初始化
	initCheckedAll();
})
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
		if(tjxh!=undefined && tjxh!=null){
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
		if(tjxh!=undefined && tjxh!=null){
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
	searchWord.tjXh = tjxh;// 直接查询的字段
	obj.conditions = JSON.stringify(searchWord);
	$.ajax({
		url : "/photo/photoPic/loadPicItem",
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data :obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			//添加图片信息
			 $(".vt_dl_minimg ul").html("");
			 var html="";
			 $.each(data.rows, function(key, val) {
					html += '<li id=\''+val.id +'\'>';
					html += '<p><img src="' + PICURI + val.picLyljm + '"></img></p>';
					html += '</li>';
				});
			$(".vt_dl_minimg ul").html(html);
			 $("#allPage").val(data.tatalPages);
			 $(".vt_dl_minimg ul li").click(function() {
					changePic($(this).attr("id"));
					$(this).addClass("cur").siblings("li").removeClass("cur");
			 });
		},
		error : function() {
		}
	})
	return PICS;

}
/**
 * 根据图集ID查询图集实体
 * 
 * @param id
 */
function searchEntityByTjID(id) {
	
	 var obj = {};
	 obj.pageIndex = 1;
	 obj.pageSize = 20;
	 obj.orderField = "";
	 obj.orderType = "";
	 obj.type = 0;
	 
	var searchWord = {};
	searchWord.table = "d_photo_tj";// 要查询的表，图集还是图片
	searchWord.id = id;// 直接查询的字段
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
 * 根据图片ID查询图片详情
 * 
 * @param id
 */
function searchEntityByPicId(id) {
	var PICOBJ = null;
	$.ajax({
		url : "/photo/photoPic/findById",
		dataType : "json",
		async : false,
		data :{
			id:id
		}, 
		type : "post", 
		success : function(data) {
			PICOBJ = data;
		},
		error : function() {
		}
	})
	return PICOBJ;
}

/**
 * 根据图片UUID查询图片信息
 * 
 * @param picxh
 */
function searchEntityByPicXh(picxh) {
	var PICOBJ = null;
	$.ajax({
		url : "/photo/photoPic/findByXh",
		dataType : "json", 
		async : false,
		data :{
			picXh:picxh
		},
		type : "post",
		success : function(data) {
			PICOBJ = data;
		},
		error : function() {
		}
	})
	return PICOBJ;
}
/**
 * 根据图集序号查询图片集合
 * 
 * @param tjxh
 */
var tjxh = "";
function loadPicsByTjxh() {
	var PICS = new Array();
	var params = {};
	var obj = {};
	obj.pageIndex = currentPage;
	obj.pageSize = pageSize;
	var searchWord = {};
	searchWord.tjXh = tjxh;
	obj.conditions = JSON.stringify(searchWord);
	$.ajax({
		url : "/photo/photoPic/loadPicItem",
		dataType : "json", 
		async : false,
		data :obj,
		type : "post",
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
/**
 * 初始化加载
 */
function initLoad() {
	var PIC = null;
	var PICS = null;
	PIC = searchEntityByPicXh(XH_);
	tjxh = PIC.tjXh;
	PICS = loadPicsByTjxh();
	getPicByTjXh(1,4);
	loadPicHtml(PIC);
}

function loadPicHtml(PIC) {
	console.log(PIC);
	var html = "";
	//onclick="picLarge(\''+PIC.picYtlj+'\')"
	html += '<img  src="' + PICURI + PIC.picLyljm + '" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'">'
	$(".vt_dl_img").html(html);
	$(".vt_maximg").css("height",$(".vt_maximg").width());
	$(window).resize(function(){
		$(".vt_maximg").css("height",$(".vt_maximg").width());
	});
	html = "";
	if(PIC.picMc!=undefined && PIC.picMc!=null && PIC.picMc!=null && PIC.picMc.length>50){
		html += '<p class="zi_ti">' + PIC.picMc.substring(0,50) + '...</p>';
	}else{
		html += '<p class="zi_ti">' + PIC.picMc + '</p>';
	}
//	html += '<p class="zi_fi">主说明</p>';
//	html += '<p class="zi_ci">' + PIC.picZsm + '</p>';
	
	html += '<p class="zi_fi">分说明</p>';
	if(PIC.picFsm !=undefined && PIC.picFsm !=null && PIC.picFsm.length>150){
		html += '<p class="zi_ci">' + PIC.picFsm.substring(0,150) + '...</p>';
	}else{		
		html += '<p class="zi_ci">' + PIC.picFsm + '</p>';
	}
	html += '<div class="zi_mg">';
	html += '<p>';
	html += '<span>图片地点：</span>' + null_W(PIC.picDd) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>摄影作者：</span>' + null_W(PIC.picSyz) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>拍摄时间：</span>' + timestampToTime(PIC.picSysj) + '';
	html += '</p>';
	html += '<p>';
	html += '<span>上传者：</span>' + null_W(PIC.picScz) + '';
	html += '</p>';
	html += '</div>';
	html += '<p class="zi_ex">图片EXIF提取数据</p>';
	html += '<div class="zi_tab">';
	html += '<table>';
	html += '<tr>';
	html += '<td>分辨率: ' + ((PIC.picFbl==null||PIC.picFbl=='null')?'':PIC.picFbl) + '</td>';
	console.log(html);
	html += '<td>曝光时间: ' +  ((PIC.picBgsj==null||PIC.picBgsj=='null')?"":PIC.picBgsj)+ '</td>';
	html += '</tr>';
	html += '<tr>';
	var fileSize="";
	// 如果大小大于1M使用'M'为单位表示, 1位小数点
	if(PIC.picFilesize > 1024 * 1024 * 1024){
		// 如果大小大于1G使用'G'为单位表示, 1位小数点
		fileSize = Math.round(PIC.picFilesize / (1024 * 1024* 1024) * 100) / 100 + "G";
	}else if (PIC.picFilesize > 1024 * 1024) {
		fileSize = Math.round(PIC.picFilesize / (1024 * 1024) * 10) / 10 + "M";
	} else if (PIC.picFilesize > 1024) {
		// 如果大小大于1KB使用'KB'为单位表示, 1位小数点
		fileSize = Math.round(PIC.picFilesize / 1024 * 10) / 10 + "KB";
	}
	html += '<td>大小: '+ fileSize +'</td>';
	html += '<td>ISO速度：' + ((PIC.picIso==null||PIC.picIso=='null')?"":PIC.picIso) + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>相机型号: ' +  ((PIC.picXjxh==null||PIC.picXjxh=='null')?"":PIC.picXjxh)+ '</td>';
	html += '<td>焦距: '+ ((PIC.picJj==null||PIC.picJj=='null')?"":PIC.picJj)+'</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>光圈值: ' + ((PIC.picGqz==null||PIC.picGqz=='null')?"":PIC.picGqz) + '</td>';
	html += '<td></td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div class="mt30">';
	html += '<a onclick="downloadYt(\'' + PIC.picXh + '\')" class="btn btn_ok">下载图片</a>';
	html += '<a onclick="addSavePre(\'' + PIC.picXh + '\')" class="btn ml10">加入预选</a>';
	html += '</div>';

	$(".zutu_img").html(html);

	html = "";

	html += '<div class="f16 mb10">主说明</div>';
	html += '<div class="gray9 mt10">' + PIC.picZsm + '</div>';
	html += '<div class="smpa">';
	html += '<span>图片分类:</span>';
	html += '<a href="#">' + PIC.typeOne + '</a>';
	if (PIC.typeTwo != null && PIC.typeTwo != "") {
		html += '<u>></u> <a href="#">' + PIC.typeTwo + '</a>';
	}
	if (PIC.typeThree != null && PIC.typeThree != "") {
		html += '<u>></u> <a href="#">' + PIC.typeThree + '</a>';
	}
	if (PIC.typeFour != null && PIC.typeFour != "") {
		html += '<u>></u> <a href="#">' + PIC.typeFour + '</a>';
	}
	if (PIC.typeFive != null && PIC.typeFive != "") {
		html += '<u>></u> <a href="#">' + PIC.typeFive + '</a>';
	}
	html += '</div>';
	html += '<div class="key_wd">';
	html += '<span>关键词:</span>';
	var gjz = PIC.picGjz;
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
		html += '<label onclick="changePic(' + val.id + ')">';
		html += '<input hidden="hidden" type="checkbox" name="images" attrXh="' + val.picXh + '" attrLj="'+ val.picXh +'"/>';
		html += '<div class="picn">';
		html += '<div class="picn_nbx">';
		html += '	<p>';
		html += '<img src="' + PICURI + val.picLylys + '">';
		html += '</p>';
//		html += '<span style="background: url(' + PICURI + val.picLylys + ')"></span>';
		html += '<div class="bg"></div>';
		html += '<div class="ed_sel_ok">';
		html += '<i class="ico ico20"></i>';
		html += '</div>';
		html += '<div class="up_txt_ied">';
		html += '<a onclick="downloadYt(\'' + val.picXh + '\')" >下载</a> <a onclick="addSavePre(\'' + val.picXh + '\')">加入预选</a>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</label>';
		html += '</li>';
	});

	$("#ImageList").html(html);
}

function changePic(id) {
	var PIC = searchEntityByPicId(id);
	loadPicHtml(PIC)
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
function null_W(str){
    if(str==null||str==undefined||str==""){
        return "无";
    }else{
        return str;
    }
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

