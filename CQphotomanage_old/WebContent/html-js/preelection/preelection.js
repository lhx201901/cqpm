var currentPage = 1;
var pageSize = 30;
var allPage;
var MODULE_ID="";
var TABLE="d_photo_pic";
/**
 * 我的预选--js
 */
$(function() {
	MODULE_ID = GetRequest().pid;
	$("#SuperSearch").click(function(){
		findPreeBySession();
	});
	initDatePicker();
	//初始化
	initCheckedAll();
	initDeleteChecked();
	findPreeBySession();
	$("#pageSizeSel").find("option[value='"+pageSize+"']").attr("selected",true);
	$("#pageSizeSel").change(function(){
		pageSize=$(this).val();
		$("#pageSizeSel").val(pageSize);
		findPreeBySession();
	});
	initTypeChange();
})
function initTypeChange() {
	$("#ds >a").click(function() {
		$(this).addClass("cur").siblings("a").removeClass("cur");
		TABLE = $(this).attr("title");
		currentPage=1;
		findPreeBySession();
	})
}
/**
 * 查询当前用户的预选列表
 */
function findPreeBySession(){
	var obj = {};
	obj.pageIndex = currentPage;
	obj.pageSize = pageSize;
	obj.orderBy="id";
	obj.orderDesc=1;
	obj.startTime=$("#h_sysj_start").val()?$("#h_sysj_start").val():"";
	obj.endTime=$("#h_sysj_end").val()?$("#h_sysj_end").val():"";
	var scopeStart="";
	var scopeEnd="";
	var pic_scsj=getTime();
	if(pic_scsj.length>0){
		scopeStart = pic_scsj.split("@#@")[0];
		scopeEnd = pic_scsj.split("@#@")[1];
	}
	obj.scopeStart=scopeStart;
	obj.scopeEnd=scopeEnd;
	if(TABLE=="d_photo_pic"){
		$.ajax({
			url : "/photo/preelection/findBySubordinate",
			dataType : "json",
			async : true,
			data : obj,
			type : "post",
			success : function(data) {
				var html='';
				if(data.resultStatus){
					var rm=data.resultData;
					allPage = rm.tatalPages;
					$.each(rm.rows, function(i, val) {
						html+='<li><label>';
						html+='<input hidden="hidden" type="checkbox" name="images" attrId="'+val.id+'"/>';
						html+='<div class="picn"><div class="picn_nbx">';
						html+='<p><img src="' + PICURI+val.picLylys+'" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//						html+='<span style="background: url(' + PICURI+val.picLylys+')"></span>';
						html+='<div class="bg"></div>';
						html+='<div class="ed_sel_ok"><i class="ico ico20"></i></div>';
						html+='<div class="up_txt_ied">';
						html+='<a title="编辑说明" class="open_in_parent" onclick="editPree(this)" attrId="'+val.id+'">编辑</a>';
						html+='<a onclick="downloadYt(\'' + val.picXh + '\')">下载</a>';
						html+='</div>';
						html+='</div></div>';
						html+='</label></li>';
					});
				}else{
					AlertBox.alert(data.resultInfo);
				}
				if(""==html){
					html="没查询到数据!";
				}
				$("#preeList").empty();
				$("#preeList").html(html);
				paging(findPreeBySession);
			},
			error : function() {
			}
		});
	}else{
		$.ajax({
			url : "/photo/preelectionTj/findBySubordinate",
			dataType : "json",
			async : true,
			data : obj,
			type : "post",
			success : function(data) {
				var html='';
				if(data.resultStatus){
					var rm=data.resultData;
					allPage = rm.tatalPages;
					$.each(rm.rows, function(key, val) {
						console.log(val);
						
						html+='<li><label>';
						html+='<input hidden="hidden" type="checkbox" name="images" attrId="'+val.id+'"/>';
						html+='<div class="picn"><div class="picn_nbx">';
						html+='<p><img src="' + PICURI+val.tjFmlj+'" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'"></p>';
//						html+='<span style="background: url(' + PICURI+val.picLylys+')"></span>';
						html+='<div class="bg"></div>';
						html+='<div class="ed_sel_ok"><i class="ico ico20"></i></div>';
						html+='<div class="up_txt_ied up_txt_ied_tj">';
						html+='<a title="查看图片" class="open_in_parent" onclick="showTjPic(this)" attrId="'+val.tjXh+'">查看图片</a>';
						html+='</div>';
						html+='</div></div>';
						html+='</label></li>';
					});
				}else{
					AlertBox.alert(data.resultInfo);
				}
				if(""==html){
					html="没查询到数据!";
				}
				$("#preeList").empty();
				$("#preeList").html(html);
				paging(findPreeBySession);
			},
			error : function() {
			}
		});
	}
}
function  selectChange(_this){
	currentPage=1;
	findPreeBySession();
}
function getTime() {

	var nowdate = new Date();
	var pic_scsj = $("#pic_scsj").val();
	var y = nowdate.getFullYear();
	var m = nowdate.getMonth() + 1;
	if(m<10){
		m="0"+m;
	}
	var d = nowdate.getDate();
	if(d<10){
		d = "0"+d;
	}
	var newdateString = y + '-' + m + '-' + d;
	if (pic_scsj == "今日") {
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		
		pic_scsj = pic_scsj+'@#@'+newdateString;
		
	} else if (pic_scsj == "一周") {
		nowdate.setDate(nowdate.getDate()-8);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'@#@'+newdateString;
	}else if(pic_scsj == "一月"){
		nowdate.setMonth(nowdate.getMonth() - 1);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'@#@'+newdateString;
	}else if(pic_scsj == "三月"){
		nowdate.setMonth(nowdate.getMonth() - 3);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'@#@'+newdateString;
	}else if(pic_scsj == "半年"){
		nowdate.setMonth(nowdate.getMonth() - 6);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'@#@'+newdateString;
	}else if(pic_scsj == "一年"){
		nowdate.setMonth(nowdate.getMonth() - 12);
		nowdate.setDate(nowdate.getDate()-1);
		var y = nowdate.getFullYear();
		var m = nowdate.getMonth() + 1;
		if(m<10){
			m="0"+m;
		}
		var d = nowdate.getDate();
		if(d<10){
			d = "0"+d;
		}
		pic_scsj = y + '-' + m + '-' + d;
		pic_scsj = pic_scsj+'@#@'+newdateString;
	}else{
		pic_scsj = "";
	}
	return pic_scsj;
}
/**
 * 编辑页
 * @param _this
 */
function editPree(_this){
	var id=$(_this).attr('attrId');
	$(_this).attr('href',"../../html/preelection/preelection_edit.html?pid="+MODULE_ID+"&id="+id);
}

// 初始化全选事件
function initCheckedAll(){
	$("#CheckedAll").change(function(){
		var val = this.checked;
		$("input[name=images]").each(function(){
			this.checked = val;
		})
	})
}

//绑定删除事件
function initDeleteChecked(){
	$("#Delete").click(function(){
		var arr = new Array();
		$("#preeList input[type=checkbox]:checked").each(function(){
			var attrId=$(this).attr("attrId");
			arr.push(attrId);
		});
		var ids = arr.join(",");
		if(ids.trim().length==0){
			AlertBox.alert("未选中项!");
			return;
		}
		AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认删除预选？</div>', null, function(){
			if(TABLE=='d_photo_pic'){

				$.ajax({
					url : "/photo/preelection/deleteByIds",
					dataType : "json",
					async : true,
					data : {
						ids : ids
					},
					type : "post",
					success : function(data) {
						if(data){
							AlertBox.alert("删除成功!");
							AlertBox.onHide(function(){
								findPreeBySession();
							});
						}else{
							AlertBox.alert("删除失败！");
						}
						
					},
					error : function() {
						AlertBox.alert("系统错误，请稍后重试！");
					}
				});
			
			}else{

				$.ajax({
					url : "/photo/preelectionTj/deleteByIds",
					dataType : "json",
					async : true,
					data : {
						ids : ids
					},
					type : "post",
					success : function(data) {
						if(data){
							AlertBox.alert("删除成功!");
							AlertBox.onHide(function(){
								findPreeBySession();
							});
						}else{
							AlertBox.alert("删除失败！");
						}
						
					},
					error : function() {
						AlertBox.alert("系统错误，请稍后重试！");
					}
				});
			
			}
		})
	});
	
	$("#goToFz").click(function(){
		var arr = new Array();
		$("input[type=checkbox]:checked").each(function(){
			var attrId=$(this).attr("attrId");
			arr.push(attrId);
		});
		var ids = arr.join(",");
		if(ids.trim().length==0){
			AlertBox.alert("未选中项!");
			return;
		}
		AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认进入方正？</div>', null, function(){
			$.ajax({
				url : "/photo/preelection/gotofz",
				dataType : "json",
				async : true,
				data : {
					ids : ids
				},
				type : "post",
				success : function(data) {
					if(data){
						AlertBox.alert("删除成功!");
						AlertBox.onHide(function(){
							findPreeBySession();
						});
					}else{
						AlertBox.alert("删除失败！");
					}
					
				},
				error : function() {
					AlertBox.alert("系统错误，请稍后重试！");
				}
			});
			
		})
	})
}

/**
 * 日期初始化
 */
function initDatePicker() {
	$.datepicker.regional['zh-CN'] = {
		closeText : '关闭',
		prevText : '<上月',
		nextText : '下月>',
		currentText : '今天',
		monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
				'十月', '十一月', '十二月' ],
		monthNamesShort : [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
				'十一', '十二' ],
		dayNames : [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
		dayNamesShort : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
		dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
		weekHeader : '周',
		dateFormat : 'yy-mm-dd',
		firstDay : 1,
		isRTL : false,
		showMonthAfterYear : true,
		yearSuffix : '年'
	};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	$(".time_picker_handle").datepicker({
		dateFormat : "yy-mm-dd",
	      changeMonth: true,
	      changeYear: true,
		onSelect : function(val) {
			var minDom = $(this).attr("minlimit");
			var maxDom = $(this).attr("maxlimit");
			if (minDom) {
				$(minDom).datepicker("option", "maxDate", val);
			}
			if (maxDom) {
				$(maxDom).datepicker("option", "minDate", val);
			}
		}
	});
}

function showTjPic(_this){
	var tjXh=$(_this).attr('attrId');
	$(_this).attr('href',"../../html/preelection/preelectionTjDetail.html?tjXh="+tjXh+"&MODULE_ID="+MODULE_ID);
}