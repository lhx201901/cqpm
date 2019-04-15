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
	if(obj.operationTime!=null){
		$("#editRemark").html(obj.operationReason);
		$("#editTime").html(dateFtt("yyyy-MM-dd", new Date(obj.operationTime)));
		$("#editUserName").html(obj.operationUserName);
		
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