var currentPage = 1;
var pageSize = 10;
var allPage;
var MODULE_ID="";

/**
 * 文字模板--js
 */
$(function(){
	MODULE_ID = GetRequest().pid;
	loadPage();
	$("#pageText").val("");
	$(".ed_msl a").click(function() {
		$(".ed_msl a").removeClass("cur");
		$(this).addClass("cur");
		currentPage=1;
		$("#pageText").val("");
		loadPage();
	});
	
})

/**
 * 加载分页数据
 */
function loadPage(){
	if ($(".ed_msl .cur").text() == "我的模版") {
		getMyTemplate();
	} else if ($(".ed_msl .cur").text() == "参考模版") {
		getSysTemplate();
	}
}

/**
 * 获取我的模板
 */
function getMyTemplate(){
	var obj = {};
	obj.pageIndex = currentPage;
	if(currentPage==1){
		obj.pageSize = 11;
	}else{
		obj.pageSize = 12;
	}
	obj.orderBy="id";
	$.ajax({
		url : "/photo/textTemplate/findBySubordinate",
		dataType : "json",
		async : true,
		data : obj,
		type : "post",
		success : function(data) {
			var html='<li><div class="up_txt_bg"><a title="添加模版" class="open_in_parent" onclick="addText(this)">'
				+'<samp class="up_adimg">添加文字模版</samp></a></div></li>';
			if(data.resultStatus){
				var rm=data.resultData;
				allPage = rm.tatalPages;
				$.each(rm.rows, function(i, val) {
					html+='<li><div class="up_txt_bg">';
					html+='<p class="tit">标题</p>';
					html+='<p class="kds">'+val.title+'</p>';
					html+='<div class="con"><p class="ti">图片说明</p>';
					html+='<p class="ci">'+val.mainRemark+'</p></div>';
					html+='<div class="sel"><p class="ti">图片分类</p><p class="ci">';
					html+= val.typeOne?'<a href="#">'+val.typeOne+'</a>':"";
					html+=val.typeTwo?'<a href="#">'+val.typeTwo+'</a>':"";
					html+=val.typeThree?'<a href="#">'+val.typeThree+'</a>':"";
					html+=val.typeFour?'<a href="#">'+val.typeFour+'</a>':"";
					html+=val.typeFive?'<a href="#">'+val.typeFive+'</a>':"";
					html+='</p></div>';
					html+='<div class="up_txt_ibg"></div>';
					html+='<div class="up_txt_ied">';
					html+='<a title="编辑模版" class="open_in_parent" onclick="editText(this)" attrId="'+val.id+'" ><i class="ico ico18 mr5" ></i>编辑</a>';
					html+='<a class="delete_temp" onclick="delText('+val.id+')"><i class="ico ico19 mr5"></i>删除</a>';
					html+='</div></div>';
					html+='<div class="sel_ti">'+val.name+'</div></li>';
				});
			}else{
				AlertBox.alert(data.resultInfo);
			}
			$("#TempList").empty();
			$("#TempList").html(html);
			paging(loadPage);
		},
		error : function() {
		}
	});
}

/**
 * 获取系统参考模板
 */
function getSysTemplate(){
	var obj = {};
	obj.pageIndex = currentPage;
	obj.pageSize = 12;
	$.ajax({
		url : "/photo/textTemplate/findBySys",
		dataType : "json",
		async : true,
		data :obj,
		type : "post",
		success : function(data) {
			allPage = data.tatalPages;
			var html='';
			$.each(data.rows, function(i, val) {
				html+='<li><div class="up_txt_bg">';
				html+='<p class="tit">标题</p>';
				html+='<p class="kds">'+val.title+'</p>';
				html+='<div class="con"><p class="ti">图片说明</p>';
				html+='<p class="ci">'+val.mainRemark+'</p></div>';
				html+='<div class="sel"><p class="ti">图片分类</p><p class="ci">';
				html+= val.typeOne?'<a href="#">'+val.typeOne+'</a>':"";
				html+=val.typeTwo?'<a href="#">'+val.typeTwo+'</a>':"";
				html+=val.typeThree?'<a href="#">'+val.typeThree+'</a>':"";
				html+=val.typeFour?'<a href="#">'+val.typeFour+'</a>':"";
				html+=val.typeFive?'<a href="#">'+val.typeFive+'</a>':"";
				html+='</p></div>';
				html+='<div class="up_txt_ibg"></div>';
				html+='<div class="up_txt_ied">';
				html+='<a title="查看模版" class="open_in_parent" onclick="selectText(this)" attrId="'+val.id+'" ><i class="ico ico23 mr5" ></i>查看</a>';
				html+='</div></div>';
				html+='<div class="sel_ti">'+val.name+'</div></li>';
			});
			$("#TempList").empty();
			$("#TempList").html(html);
			paging(loadPage);
		},
		error : function() {
		}
	});
}


/**
 * 添加模板
 * @param _this
 */
function addText(_this){
	$(_this).attr('href',"../../html/textTemplate/text_temp_add.html?pid="+MODULE_ID);
}

/**
 * 编辑模板
 * @param _this
 */
function editText(_this){
	var id=$(_this).attr("attrId");
	$(_this).attr('href',"../../html/textTemplate/text_temp_add.html?pid="+MODULE_ID+"&id="+id);
}

/**
 * 查询模板
 * @param _this
 */
function selectText(_this){
	var id=$(_this).attr("attrId");
	$(_this).attr('href',"../../html/textTemplate/text_temp_detail.html?pid="+MODULE_ID+"&id="+id);
}

/**
 * 删除模板
 * @param id
 */
function delText(id){
	$.ajax({
		url : "/photo/textTemplate/deleteByIds", 
		dataType : "json", 
		async : true,
		data : {
			ids:id
		},
		type : "post",
		success : function(data) {
			if(data.resultStatus){
				AlertBox.alert(data.resultInfo);
				AlertBox.onHide(function(){
					loadPage();
				})
			}else{
				AlertBox.alert(data.resultInfo);
			}
			
		},
		error : function() {
		}
	})
}
