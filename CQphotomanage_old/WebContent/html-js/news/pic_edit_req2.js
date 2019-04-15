var MAIN_PAGE_WINDOW =null;
var _ID;
var _OBJ={};
$(function() {
	//事件初始化
	initDatePicker();
	initKeywordsTips();
	$("#newData #MainExplain").keyup(initTextareaTip);
	$("#newData #MinorExplain").keyup(initTextareaTip);
	var MODULE_ID = GetRequest().pid;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+MODULE_ID).contentWindow;
	_ID = GetRequest().id;
	findById();
})

/**
 * 查询图片编辑请求
 */
function findById(){
	$.ajax({
		url : "/photo/photoEditNotice/findById", 
		dataType : "json", 
		async : true,
		data : {
			id:_ID
		},
		type : "post",
		success : function(data) {
			$("#picLyljm").attr("src",PICURI + data.pic.picLyljm);
			objToOldData(data.pic);
			objToNewData(data.npic);
			_OBJ=data.npic;
			$("#xiugaiku").html("修改库("+data.npic.messageSendUnit+")图片信息");
			$("#benku").html("本库("+data.npic.messageReceiveUnit+")图片信息");
		},
		error : function() {
			AlertBox.alert("查询加载失败！");
		}
	});
}

//日期初始化
function initDatePicker() {
	laydate.render({
		elem: '#newData #CreateTime' //开始日期
	});
}
//绑定关键词添加
function initKeywordsTips() {
	$("#newData #Keywords").on("keyup", function(e) {
		var ev = e;
		if (ev.keyCode == 13 && $(this).val()) {
			$("#newData #KeywordTips").append('<a>' + $(this).val() + '<i class="ico ico17"></i></a>');
			$(this).val("");
		}
	})
	$("#newData #KeywordTips").on("click", ".ico", function() {
		$(this).parent("a").remove();
	})
}

/**
 * 界面赋值
 * @param obj
 */
function objToNewData(obj) {
	$("#newData #picTypesSel").empty();
	//initPicTypes("图库", 1);
	$("#newData #Title").val(obj.picMcN);
	$("#newData #MainExplain").val(obj.picZsmN);
	$("#newData #MinorExplain").val(obj.picFsmN);
	$("#newData #Adress").val(obj.picDdN);
	$("#newData #Author").val(obj.picSyzN);
	$("#newData #CreateTime").val(obj.picSysjN != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysjN)) : "");
	/*if (obj.typeOneN != null && obj.typeOneN != "") {
		$("#newData #picType1").val(obj.typeOneN);
		initPicTypes(obj.typeOneN, 2);
	}
	if (obj.typeTwoN != null && obj.typeTwoN != "") {
		$("#newData #picType2").val(obj.typeTwoN);
		initPicTypes(obj.typeTwoN, 3);
	}
	if (obj.typeThreeN != null && obj.typeThreeN != "") {
		$("#newData #picType3").val(obj.typeThreeN);
		initPicTypes(obj.typeThreeN, 4);
	}
	if (obj.typeFourN != null && obj.typeFourN != "") {
		$("#newData #picType4").val(obj.typeFourN);
		initPicTypes(obj.typeFourN, 5);
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		$("#newData #picType5").val(obj.typeFive);
	}*/
	var html="";
	if (obj.typeOneN != null && obj.typeOneN != "") {
		html+=obj.typeOneN+"  ";
	}
	if (obj.typeTwoN != null && obj.typeTwoN != "") {
		html+=obj.typeTwoN+"  ";
	}
	if (obj.typeThreeN != null && obj.typeThreeN != "") {
		html+=obj.typeThreeN+"  ";
	}
	if (obj.typeFourN != null && obj.typeFourN != "") {
		html+=obj.typeFourN+"  ";
	}
	if (obj.typeFiveN != null && obj.typeFiveN != "") {
		html+=obj.typeFiveN+"  ";
	}
	$("#newData #picTypesSel").val(html);
	$("#newData #picMjSel").val(obj.picMjN);
	$("#newData #picTypeSel").val(obj.picTypeN);
	$("#newData #KeywordTips").empty();
	if(obj.picGjzN!=undefined && obj.picGjzN!=""){
		var arr = obj.picGjzN.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				//$("#newData #KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
				$("#newData #KeywordTips").append('<a>' + arr[i] + '</a>');
			}
		}
	}
	$("#sendTime").html(dateFtt("yyyy-MM-dd", new Date(obj.messageSendTime)));
	$("#picScz").html(obj.messageSendUnit);
	initTextareaTip();
}

/**
 * 界面赋值
 * @param obj
 */
function objToOldData(obj) {
	$("#oldData #Title").val(obj.picMc);
	$("#oldData #MainExplain").val(obj.picZsm);
	$("#oldData #MinorExplain").val(obj.picFsm);
	$("#oldData #Adress").val(obj.picDd);
	$("#oldData #Author").val(obj.picSyz);
	$("#oldData #CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");

	var html="";
	if (obj.typeOne != null && obj.typeOne != "") {
		html+=obj.typeOne+"  ";
	}
	if (obj.typeTwo != null && obj.typeTwo != "") {
		html+=obj.typeTwo+"  ";
	}
	if (obj.typeThree != null && obj.typeThree != "") {
		html+=obj.typeThree+"  ";
	}
	if (obj.typeFour != null && obj.typeFour != "") {
		html+=obj.typeFour+"  ";
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		html+=obj.typeFive+"  ";
	}
	$("#oldData #picTypes").val(html);
	$("#oldData #picMjSel").val(obj.picMj);
	$("#oldData #picTypeSel").val(obj.picType);
	$("#oldData #KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#oldData #KeywordTips").append('<a>' + arr[i] + '</a>');
			}
		}
	}
	initTextareaTip();
}

/**
 * 加载分类
 */
function initPicTypes(pname, picType) {
	if (pname.length == 0) {
		$("#picTypesSel #picType" + picType).parent().nextAll().remove();
		$("#picTypesSel #picType" + picType).parent().remove();
		return;
	}
	$.ajax({
		url : "/photo/narClassify/loadEntitysByPname",
		dataType : "json",
		async : false,
		data : {
			pname : pname
		},
		type : "post",
		success : function(data) {
			if (data.length != 0 || picType == 1) {
				var html = '<div class="img_sel"><select class="sct" id="picType' + picType + '">';
				html += '<option value="">选择分类</option>';
				$.each(data, function(i, val) {
					html += '<option value="' + val.narName + '">' + val.narName + '</option>';
				});
				html += '</select></div>';
				$("#picTypesSel").append(html);
				$("#picTypesSel #picType" + picType).change(function() {
					var pname = $('#picType' + picType).val();
					$("#picTypesSel #picType" + picType).parent().nextAll().remove();
					initPicTypes(pname, picType + 1);
				});
			} else {
				$("#picTypesSel #picType" + picType).parent().nextAll().remove();
				$("#picTypesSel #picType" + picType).parent().remove();
			}
		},
		error : function() {
		}
	});
}


/**
 * 同意修改
 */
function editPicYes(_this){
	//var obj = getNweData();
	
	var obj={};
	obj.opreateInfo=$("#editRemark").val();
	obj.dataId=_ID;
	obj.async=1;
	$.ajax({
		url : "/photo/photoEditNotice/asyncPhotoEditNoticeInfo", 
		dataType : "json", 
		async : true,
		data :obj,
		type : "post",
		success : function(data) {
			console.log(data);
			AlertBox.alert(data.resultInfo);
			if(data.resultStatus){
				MAIN_PAGE_WINDOW.searchData();
				AlertBox.onHide(function(){
					loadMessgeNum()
				})
			}
		},
		error : function() {
			AlertBox.alert("系统错误！");
		}
	});
}

/**
 * 不同意修改
 */
function editPicNo(_this){
	var obj={};
	obj.opreateInfo=$("#editRemark").val();
	obj.dataId=_ID;
	obj.async=0;
	$.ajax({
		url : "/photo/photoEditNotice/asyncPhotoEditNoticeInfo", 
		dataType : "json", 
		async : true,
		data :obj,
		type : "post",
		success : function(data) {
			console.log(data);
			AlertBox.alert(data.resultInfo);
			if(data.resultStatus){
				MAIN_PAGE_WINDOW.searchData();
				AlertBox.onHide(function(){
					loadMessgeNum()
				})
			}
		},
		error : function() {
			AlertBox.alert("系统错误！");
		}
	});
}

/**
 * 获取修改的数据
 */
function getNweData(){/*
	var obj = _OBJ;
	obj.picMc = $("#newData #Title").val();
	obj.picZsm = $("#newData #MainExplain").val();
	obj.picFsm = $("#newData #MinorExplain").val();
	obj.picDd = $("#newData #Adress").val();
	obj.picSyz = $("#newData #Author").val();
	obj.picSysj =new Date($("#newData #CreateTime").val());
	obj.typeOne = $("#newData #picType1").val();
	obj.typeTwo = $("#newData #picType2").val();
	obj.typeThree = $("#newData #picType3").val();
	obj.typeFour = $("#newData #picType4").val();
	obj.typeFive = $("#newData #picType5").val();
	obj.picMj = $("#newData #picMjSel").val();
	obj.picType = $("#newData #picTypeSel").val();
	var picGjz = new Array();
	$("#newData #KeywordTips a").each(function() {
		picGjz.push($(this).text());
	});
	obj.picGjz = picGjz.join("@");
	obj.picScsj =new Date(_OBJ.picScsj);
	obj.sendTime = new Date(_OBJ.sendTime);
	delete obj.editTime;
	obj.editRemark=$("#editRemark").val();
	return obj;
*/}

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
			parent.closeCurPage();
		},
		error : function() {
			parent.closeCurPage();
		}
	})
}