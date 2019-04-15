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
		url : "/photo/photoEdit/findEditInfo", 
		dataType : "json", 
		async : true,
		data : {
			id:_ID
		},
		type : "post",
		success : function(data) {
			$("#picLyljm").attr("src",PICURI + data.pic.picLyljm);
			objToOldData(data.pic);
			objToNewData(data.editPic);
			_OBJ=data.editPic;
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
	initPicTypes("图库", 1);
	$("#newData #Title").val(obj.picMc);
	$("#newData #MainExplain").val(obj.picZsm);
	$("#newData #MinorExplain").val(obj.picFsm);
	$("#newData #Adress").val(obj.picDd);
	$("#newData #Author").val(obj.picSyz);
	$("#newData #CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");
	if (obj.typeOne != null && obj.typeOne != "") {
		$("#newData #picType1").val(obj.typeOne);
		initPicTypes(obj.typeOne, 2);
	}
	if (obj.typeTwo != null && obj.typeTwo != "") {
		$("#newData #picType2").val(obj.typeTwo);
		initPicTypes(obj.typeTwo, 3);
	}
	if (obj.typeThree != null && obj.typeThree != "") {
		$("#newData #picType3").val(obj.typeThree);
		initPicTypes(obj.typeThree, 4);
	}
	if (obj.typeFour != null && obj.typeFour != "") {
		$("#newData #picType4").val(obj.typeFour);
		initPicTypes(obj.typeFour, 5);
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		$("#newData #picType5").val(obj.typeFive);
	}
	$("#newData #picMjSel").val(obj.picMj);
	$("#newData #picTypeSel").val(obj.picType);
	$("#newData #KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#newData #KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
			}
		}
	}
	$("#sendRemark").html(obj.sendRemark);
	$("#sendTime").html(dateFtt("yyyy-MM-dd", new Date(obj.sendTime)));
	$("#picScz").html(obj.picScz);
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
	$("#oldData #picTypes").html(html);
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
	var obj = getNweData();
	obj.isEdit=1;
	$.ajax({
		url : "/photo/photoEdit/editPic", 
		dataType : "json", 
		async : true,
		data :obj,
		type : "post",
		success : function(data) {
			console.log(data);
			if(data){
				AlertBox.alert("保存成功！");
				MAIN_PAGE_WINDOW.searchData();
				AlertBox.onHide(function(){
					loadMessgeNum()
				})
			}else{
				AlertBox.alert("保存失败！");
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
	var obj = getNweData();
	obj.isEdit=2;
	$.ajax({
		url : "/photo/photoEdit/editPic", 
		dataType : "json", 
		async : true,
		data :obj,
		type : "post",
		success : function(data) {
			console.log(data);
			if(data){
				AlertBox.alert("保存成功！");
				MAIN_PAGE_WINDOW.searchData();
				AlertBox.onHide(function(){
					loadMessgeNum();
				})
			}else{
				AlertBox.alert("保存失败！");
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
function getNweData(){
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
			parent.closeCurPage();
		},
		error : function() {
			parent.closeCurPage();
		}
	})
}