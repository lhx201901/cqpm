var MAIN_PAGE_WINDOW =null;
var id;
var isEdit=0;
$(function() {
	//初始化调用
	initDatePicker();
	initKeywordsTips();
	$("#mainRemark").keyup(initTextareaTip);
	$("#secondRemark").keyup(initTextareaTip);
	var MODULE_ID = GetRequest().pid;
	MAIN_PAGE_WINDOW = parent.document.getElementById("tab_frame_"+MODULE_ID).contentWindow;
	id = GetRequest().id;
	if(id!=undefined && id!=""){
		findById(id);
	}else{
		initPicTypes("图库",1);
	}
	
})

/**
 * 根据id查询
 * @param id
 */
function findById(id){
	$.ajax({
		url : "/photo/textTemplate/findById", 
		dataType : "json", 
		async : true,
		data : {
			id:id
		},
		type : "post",
		success : function(data) {
			if(data!=null){
				$("#name").val(data.name);
				$("#title").val(data.title);
				$("#mainRemark").val(data.mainRemark);
				$("#secondRemark").val(data.secondRemark);
				$("#picDd").val(data.picDd);
				$("#picSyz").val(data.picSyz);
				$("#picPssj").val(data.picPssj==null?"":dateFtt("yyyy-MM-dd", new Date(data.picPssj)));
				$("#picMj").val(data.picMj);
				$("#picType").val(data.picType);
				var arr = data.picGjz.split("@");
				$("#KeywordTips").empty();
				for(var i=0;i<arr.length;i++){
					if(arr[i].trim().length>0){
						$("#KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
					}
				}
				initPicTypes("图库",1);
				if(data.typeOne!=null && data.typeOne!=""){
					$("#picType1").val(data.typeOne);
				}
				if(data.typeTwo!=null && data.typeTwo!=""){
					initPicTypes(data.typeOne,2);
					$("#picType2").val(data.typeTwo);
				}
				if(data.typeThree!=null && data.typeThree!=""){
					initPicTypes(data.typeTwo,3);
					$("#picType3").val(data.typeThree);
				}
				if(data.typeFour!=null && data.typeFour!=""){
					initPicTypes(data.typeThree,4);
					$("#picType4").val(data.typeFour);
				}
				if(data.typeFive!=null && data.typeFive!=""){
					initPicTypes(data.typeFour,4);
					$("#picType5").val(data.typeFive);
				}
				initTextareaTip();
				if(data.isEdit==1){
					isEdit=1;
					$("#picTypesSel .sct").each(function(){
						$(this).attr("disabled","disabled");
					});
				}
			}
		},
		error : function() {
		}
	});
}

/**
 * 新增保存
 */
function addSave(_this){
	$(_this).attr("onclick","");
	$(_this).css("background","#c0c1c0");
	var name = $("#name").val();
	var title = $("#title").val();
	var mainRemark = $("#mainRemark").val();
	var secondRemark = $("#secondRemark").val();
	var picDd = $("#picDd").val();
	var picSyz = $("#picSyz").val();
	var picPssj = $("#picPssj").val();
	var picMj = $("#picMj").val();
	var picType = $("#picType").val();
	var picGjz = $("#Keywords").val();
	var typeOne=$("#picType1").val();
	var typeTwo=$("#picType2").val();
	var typeThree=$("#picType3").val();
	var typeFour=$("#picType4").val();
	var typeFive=$("#picType5").val();
	var picGjz = new Array();
	$("#KeywordTips a").each(function(){
		picGjz.push($(this).text());
	});
	var obj ={};
	if(id!=undefined && id!=""){
		obj.id=id;
	}
	obj.name=name;
	obj.title=title;
	obj.mainRemark=mainRemark;
	obj.secondRemark=secondRemark;
	obj.picDd=picDd;
	obj.picSyz=picSyz;
	if(picPssj.trim().length!=0){
		obj.picPssj=new Date(picPssj);
	}
	obj.picMj=picMj;
	obj.picType=picType;
	obj.picGjz=picGjz;
	obj.typeOne = (typeOne!=undefined?typeOne:"");
	obj.typeTwo =(typeTwo!=undefined?typeTwo:"");
	obj.typeThree = (typeThree!=undefined?typeThree:"");
	obj.typeFour = (typeFour!=undefined?typeFour:"");
	obj.typeFive = (typeFive!=undefined?typeFive:"");
	obj.picGjz = picGjz.join("@");
	$.ajax({
		url : "/photo/textTemplate/add", 
		dataType : "json", 
		async : true,
		data : obj,
		type : "post",
		success : function(data) {
			if(data.resultStatus){
				AlertBox.alert(data.resultInfo);
				MAIN_PAGE_WINDOW.loadPage();
				AlertBox.onHide(function(){
					parent.closeCurPage();
				})
			}else{
				AlertBox.alert(data.resultInfo);
				AlertBox.onHide(function(){
					$(_this).attr("onclick","addSave(this)");
					$(_this).css("background","#d53638");
				})
			}
		},
		error : function() {
			AlertBox.alert("系统错误！");
			AlertBox.onHide(function(){
				$(_this).attr("onclick","addSave(this)");
				$(_this).css("background","#d53638");
			})
		}
	});
	
}

/**
 * 重置
 */
function cancle(){
	$("#name").val("");
	$("#title").val("");
	$("#mainRemark").val("");
	$("#secondRemark").val("");
	$("#picDd").val("");
	$("#picSyz").val("");
	$("#picPssj").val("");
	$("#picMj").val("");
	$("#picType").val("");
	$("#Keywords").val("");
	initTextareaTip();
}

//日期初始化
function initDatePicker() {
	laydate.render({
		elem: '#picPssj' //开始日期
	});
}
//绑定关键词点击
function initKeywordsTips() {
	$("#Keywords").on("keyup", function(e) {
		var ev = e;
		if (ev.keyCode == 13 && $(this).val()) {
			$("#KeywordTips").append('<a>' + $(this).val() + '<i class="ico ico17"></i></a>');
			$(this).val("");
		}
	})
	if(isEdit==0){
		$("#KeywordTips").on("click", ".ico", function() {
			$(this).parent("a").remove();
		})
	}
}


/**
 * 加载分类
 */
function initPicTypes(pname,picType){
	if(pname.length==0){
		$("#picTypesSel #picType"+picType).parent().nextAll().remove();
		$("#picTypesSel #picType"+picType).parent().remove();
		return;
	}
	$.ajax({
		url : "/photo/narClassify/loadEntitysByPname",
		dataType : "json",
		async : false,
		data : {
			pname:pname
		},
		type : "post",
		success : function(data) {
			if(data.length!=0 || picType==1){
				var  html='<div class="img_sel"><select class="sct" id="picType'+picType+'">';
				html+='<option value="">选择分类</option>';
				$.each(data, function(i, val) {
					html+='<option value="'+val.narName+'">'+val.narName+'</option>';
				});
				html+='</select></div>';
				$("#picTypesSel").append(html);
				$("#picTypesSel #picType"+picType).change(function(){
					var pname=$('#picType'+picType).val();
					initPicTypes(pname,picType+1);
				});
			}else{
				$("#picTypesSel #picType"+picType).parent().nextAll().remove();
				$("#picTypesSel #picType"+picType).parent().remove();
			}
		},
		error : function() {
		}
	});
}