var MAIN_PAGE_WINDOW =null;
var id;
var _OBJ={};
$(function() {
	//事件初始化
	$("#closeBtn").click(function(){
		parent.closeCurPage();
	});
	initDatePicker();
	initKeywordsTips();
	selectText();
	$("#MainExplain").keyup(initTextareaTip);
	$("#MinorExplain").keyup(initTextareaTip);
	var MODULE_ID = GetRequest().pid;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+MODULE_ID).contentWindow;
	id = GetRequest().id;
	findById(id);
	initSelectText();
})

/**
 * 根据id查询
 * @param id
 */
function findById(id){
	$.ajax({
		url : "/photo/preelection/findById", 
		dataType : "json", 
		async : true,
		data : {
			id:id
		},
		type : "post",
		success : function(data) {
			if(data.resultStatus){
				_OBJ=data.resultData;
				$("#picLyljm").attr("src", PICURI + _OBJ.picLyljm);
				objToData(_OBJ)
			}else{
				AlertBox.alert(data.resultInfo);
			}
		},
		error : function() {
		}
	});
}

/**
 * 修改保存
 */
function saveEditPic(_this){
	$(_this).attr("onclick","");
	$(_this).css("background", "#c0c1c0");
	$.ajax({
		url : "/photo/preelection/editSavePree", 
		dataType : "json", 
		async : true,
		data :getNweData() ,
		type : "post",
		success : function(data) {
			console.log(data);
			if(data){
				AlertBox.alert("已经修改！");
				MAIN_PAGE_WINDOW.findPreeBySession();
/*				AlertBox.onHide(function(){
					parent.closeCurPage();
				})*/
			}else{
				AlertBox.alert("保存失败！");
				AlertBox.onHide(function(){
					$(_this).attr("onclick","saveEditPic(this)");
					$(_this).css("background","#d53638");
				})
			}
		},
		error : function() {
			AlertBox.alert("系统错误！");
			AlertBox.onHide(function(){
				$(_this).attr("onclick","saveEditPic(this)");
				$(_this).css("background","#d53638");
			})
		}
	});
}

//日期初始化
function initDatePicker() {
	laydate.render({
		elem: '#CreateTime' //开始日期
	});
}
//绑定关键词添加
function initKeywordsTips() {
	$("#Keywords").on("keyup", function(e) {
		var ev = e;
		if (ev.keyCode == 13 && $(this).val()) {
			$("#KeywordTips").append('<a>' + $(this).val() + '<i class="ico ico17"></i></a>');
			$(this).val("");
		}
	})
	$("#KeywordTips").on("click", ".ico", function() {
		$(this).parent("a").remove();
	})
}

/**
 * 界面赋值
 * @param obj
 */
function objToData(obj) {
	$("#picTypesSel").empty();
	initPicTypes("图库", 1);
	$("#Title").val(obj.picMc);
	$("#MainExplain").val(obj.picZsm);
	$("#MinorExplain").val(obj.picFsm);
	$("#Adress").val(obj.picDd);
	$("#Author").val(obj.picSyz);
	$("#CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");
	if (obj.typeOne != null && obj.typeOne != "") {
		$("#picType1").val(obj.typeOne);
		initPicTypes(obj.typeOne, 2);
	}
	if (obj.typeTwo != null && obj.typeTwo != "") {
		$("#picType2").val(obj.typeTwo);
		initPicTypes(obj.typeTwo, 3);
	}
	if (obj.typeThree != null && obj.typeThree != "") {
		$("#picType3").val(obj.typeThree);
		initPicTypes(obj.typeThree, 4);
	}
	if (obj.typeFour != null && obj.typeFour != "") {
		$("#picType4").val(obj.typeFour);
		initPicTypes(obj.typeFour, 5);
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		$("#picType5").val(obj.typeFive);
	}
	$("#picMjSel").val(obj.picMj);
	$("#picTypeSel").val(obj.picType);
	$("#KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
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
 * 选择文字模板
 */
function selectText() {
	var obj = {};
	obj.orderBy = "id";
	obj.pageSize = 50;
	$.ajax({
		url : "/photo/textTemplate/findLyBySubordinate",
		dataType : "json",
		async : true,
		data : obj,
		type : "post",
		success : function(data) {
			var html = '<option value="">选择文字模板</option>';
			if (data.resultStatus) {
				$.each(data.resultData.rows, function(i, val) {
					html += '<option value="' + val.id + '">' + val.name + '</option>';
				});
			} else {
				AlertBox.alert(data.resultInfo);
			}
			$("#selectText").html(html);
		},
		error : function() {
		}
	});
}

/**
 * 选择模板触发事件
 */
function initSelectText(){
	$("#selectText").change(function() {
		var fileId = $("#UploadImages").find(".active").attr("fileId");
		var textId = $("#selectText").val();
		if (textId.trim().length == 0) {
			objToData(_OBJ);
			return;
		}
		$.ajax({
			url : "/photo/textTemplate/findById",
			dataType : "json",
			async : true,
			data : {
				id : textId
			},
			type : "post",
			success : function(data) {
				var obj={};
				obj.picMc = data.title;
				obj.picZsm = data.mainRemark;
				obj.picFsm = data.secondRemark;
				obj.picDd = data.picDd;
				obj.picSyz = data.picSyz;
				obj.picSysj = data.picPssj;
				obj.typeOne = data.typeOne;
				obj.typeTwo = data.typeTwo;
				obj.typeThree = data.typeThree;
				obj.typeFour = data.typeFour;
				obj.typeFive = data.typeFive;
				obj.picMj = data.picMj;
				obj.picType = data.picType;
				obj.picGjz = data.picGjz;
				objToData(obj);
			},
			error : function() {
			}
		});
	});
}

/**
 * 获取修改的数据
 */
function getNweData(){
	var obj = _OBJ;
	obj.picMc = $("#Title").val();
	obj.picZsm = $("#MainExplain").val();
	obj.picFsm = $("#MinorExplain").val();
	obj.picDd = $("#Adress").val();
	obj.picSyz = $("#Author").val();
	obj.picSysj =new Date($("#CreateTime").val());
	obj.typeOne = $("#picType1").val();
	obj.typeTwo = $("#picType2").val();
	obj.typeThree = $("#picType3").val();
	obj.typeFour = $("#picType4").val();
	obj.typeFive = $("#picType5").val();
	obj.picMj = $("#picMjSel").val();
	obj.picType = $("#picTypeSel").val();
	var picGjz = new Array();
	$("#KeywordTips a").each(function() {
		picGjz.push($(this).text());
	});
	obj.picGjz = picGjz.join("@");
	obj.picScsj =new Date(_OBJ.picScsj);
	return obj;
}