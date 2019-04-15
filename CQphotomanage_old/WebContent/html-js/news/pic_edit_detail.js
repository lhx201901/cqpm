var MAIN_PAGE_WINDOW =null;
var _ID;
var _OBJ={};
$(function() {
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

/**
 * 界面赋值
 * @param obj
 */
function objToNewData(obj) {
	$("#newData #Title").val(obj.picMc);
	$("#newData #MainExplain").val(obj.picZsm);
	$("#newData #MinorExplain").val(obj.picFsm);
	$("#newData #Adress").val(obj.picDd);
	$("#newData #Author").val(obj.picSyz);
	$("#newData #CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");
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
	$("#newData #picTypes").html(html);
	$("#newData #picMjSel").val(obj.picMj);
	$("#newData #picTypeSel").val(obj.picType);
	$("#newData #KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#newData #KeywordTips").append('<a>' + arr[i] + '</a>');
			}
		}
	}
	$("#sendRemark").html(obj.sendRemark);
	$("#sendTime").html(dateFtt("yyyy-MM-dd", new Date(obj.sendTime)));
	$("#picScz").html(obj.picScz);
	if(obj.editTime!=null){
		$("#editRemark").html(obj.editRemark);
		$("#editTime").html(dateFtt("yyyy-MM-dd", new Date(obj.editTime)));
		$("#editUserName").html(obj.editUserName);
	}else{
		$("#editRemark").parent().remove();
		$("#editTime").parent().remove();
		$("#editUserName").parent().remove();
	}
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