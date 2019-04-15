var currentPage = 1;
var pageSize = 20;
var allPage;
var MODULE_ID = "";
var thisWindowId="";
var MJ = 0;
/**
 * 我的上传--js
 */
$(function() {
	MODULE_ID = GetRequest().pid;
	thisWindowId=GetRequest().thisWindowId;
	initPage();
	
	$('#picGjz').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	})
	
})

/**
 * 获取检索参数
 * 
 * @returns {___anonymous412_413}
 */
function getSelectParam() {
	var obj = {};
	obj.pageIndex = currentPage;
	pageSize = $("#showPageSize").val();
	obj.pageSize = pageSize;
	var searchWord = {};
	obj.picOrTj = 2;
	searchWord.picMj = MJ;
	var term = $("#picGjz").val().replace(/ /g, '@');
	searchWord.searchWords = term;// 查询字段
	searchWord.tjXh = GetRequest().tjXh;;
	obj.conditions = JSON.stringify(searchWord);
	return obj;
}
/**
 * 点击检索
 */
function searchData() {
	var obj = getSelectParam();
	$.ajax({
		url : "/photo/photoPic/myUploadItems",
		dataType : "json", // 返回格式为json
		async : false,// 请求是否异步，默认为异步，这也是ajax重要特性
		data : obj, // 参数值
		type : "post", // 请求方式
		success : function(data) {
			allPage = data.tatalPages;
			html = '';
			$.each(data.rows, function(key, val) {
				html+='<li><label>';
				html+='<input hidden="hidden" type="checkbox" name="images" attrId="'+val.id+'"/>';
				html+='<div class="picn"><div class="picn_nbx">';
				html+='<p><img src="' + PICURI + val.picLylys + '" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//				html+= '<span style="background: url(' + PICURI+val.picLylys+')"></span>';
				html+='<div class="bg"></div>';
				html+='<div class="ed_sel_ok"><i class="ico ico20"></i></div>';
				html+='<div class="up_txt_ied" style="width:120px;top:25%;">';
				html+= '<a class="set_tj" onclick="setTjFm('+val.id+')"><i class="ico ico21 mr5"></i>设置图集封面</a>';
				html+='<a title="查询详情" class="edit_item" onclick="lookDetails(\''+val.picXh+'\')"><i class="ico ico23 mr5"></i>查看</a>';
				html+='<a title="编辑说明" class="edit_item" onclick="editPic(this)" attrId="'+val.id+'" attrXh="'+val.picXh+'"><i class="ico ico21 mr5"></i>编辑</a>';
				html+='<a class="edit_item" onclick="downloadYt(\''+val.picXh+'\')">下载</a>';
				html+='<a class="delete_item" onclick="delPic('+val.id+')"><i class="ico ico22 mr5"></i>删除</a>';
				html+='</div>';
				html+='</div></div>';
				html+='</label></li>';
			});
			$("#ImageList").html(html);
			paging(searchData);
		},
		error : function() {
		}
	})
}

/**
 * 初始化事件
 */
function initPage() {
	searchData();
	initAllCheck();
	initTypeChange();
}

/**
 * 单图，多图切换
 */
function initTypeChange() {
	$(".ed_msl>a").click(function() {
		$(this).addClass("cur").siblings("a").removeClass("cur")
		var title = $(this).attr("title");
		if (title == 1 || title == 0) {
			MJ = title;
		}
		searchData();
	})
}
/**
 * 初始化全选事件
 */
function initAllCheck() {
	var AllCheck = $("#AllCheck");
	AllCheck.change(function() {
		var value = this.checked;
		var checkItems = $("input[name=images]");
		$.each(checkItems, function(key, val) {
			this.checked = value;
		});
	});

	$("#Delete").click(function() {
		var arr = new Array();
		$("input[type=checkbox]:checked").each(function() {
			var attrId = $(this).attr("attrId");
			if(attrId!=undefined&&attrId!=''&&attrId!=null){				
				arr.push(attrId);
			}
		});
		var ids = arr.join(",");
		if (ids.trim().length == 0) {
			AlertBox.alert("未选中项!");
			return;
		}
	//	alert(ids);
		delPic(ids);
	});
}

/**
 * 设置图集封面
 * 
 * @param id
 */
function setTjFm(id) {
	AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认设置为图集封面？</div>', null, function() {
		$.ajax({
			url : "/photo/photoPic/setTjFm",
			dataType : "json",
			async : true,
			data : {
				id : id
			},
			type : "post",
			success : function(data) {
				if (data) {
					AlertBox.alert("设置封面成功！");
					parent.refreshTabByIndex(0);
				} else {
					AlertBox.alert("非公开图片不能设置为公开图集的封面！");
				}
			},
			error : function() {
				AlertBox.alert("查询加载失败！");
			}
		});
	});
}

/**
 * 删除单个图片
 * 
 * @param id
 */
function delPic(id) {
	AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认删除图片？</div>', null, function() {
		$.ajax({
			url : "/photo/photoPic/logicDeleteByIds",
			dataType : "json",
			async : true,
			data : {
				ids : id
			},
			type : "post",
			success : function(data) {
				if (data) {
					AlertBox.alert("删除成功！");
					AlertBox.onHide(function() {
						searchData();
					});
				} else {
					AlertBox.alert("删除失败！");
				}
			},
			error : function() {
				AlertBox.alert("查询加载失败！");
			}
		});
	});
}

/**
 * 编辑图片说明
 * 
 * @param id
 */
function editPic(_this) {
	var id=$(_this).attr('attrId');
	var picXh=$(_this).attr('attrXh');
	$.ajax({
		url : "/photo/photoPic/findById", 
		dataType : "json", 
		async : true,
		data : {
			id:id
		},
		type : "post",
		success : function(data) {
			if(data.picMj==0){
				AlertBox.confirm("<div style='padding: 25px;padding-top: 0px;' ><p>已经上传的公开图片不能直接修改，如需修改，请编写修改请求，由管理员统一修改</p></div>", null, function() {
					AlertBox.hide();
					parent.createPage("编写修改请求", "../../html/myupload/pic_edit_req.html?pid="+MODULE_ID+"&picXh="+picXh, true, "editPic");
				});
			}else{
				parent.createPage("编辑说明", "../../html/myupload/pic_edit_req.html?pid="+MODULE_ID+"&picXh="+picXh, true, "editPic");
			}
		},
		error : function() {
			AlertBox.alert("查询加载失败！");
		}
	});
}

/**
 * 查看图片详情
 * @param picXh
 */
function lookDetails(picXh){
	var url = "../../html/myDownload/picDetail.html?picXh="+picXh;
	url = encodeURI(url);
	parent.createPage("详情",url , true, "picsDetail");
}