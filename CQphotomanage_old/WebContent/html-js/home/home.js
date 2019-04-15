$(function() {
	$("#SuperSearch").click(function() {
		AlertBox.confirm(null, "高级搜索",higth_search,null)

	})
	if(USRSESSION!=null){
		loadHomeData();
	}
	//搜索抗增加回车检索按钮功能
	$('#searchW_words').keydown(function(e){
		if(e.keyCode==13){
			searchData();
		}
	})
})


/**
 * 根据id查询
 * @param id
 */
function loadHomeData(){
	$.ajax({
		url : "/photo/retriebe/loadHomePage", 
		dataType : "json", 
		async : true,
		data : {},
		type : "post",
		success : function(data) {
			var html = "";
			$.each(data, function(key, val) {
				html +=' <div class="pic_box">';
				html += '<div class="pic_tit">';
				html += '<span>'+val.name+'</span> <a title="'+val.name+'" class="open_in_parent" href="../../html/pics/pics.html?pid=nar_'+val.id+'" id="nar_'+val.id+'" >更多</a>';
				html += '</div>';
				html += '<div class="pic_li">';
				html += '<ul class="clearfix">';
				$.each(val.data, function(key1, val1) {
					html += '<li>';
					html += '<div class="picn">';
					html += '<a href="javascript:void(0)" onclick=clickOne(\''+val1.pic_lyljm+'\') ondblclick="clickdbl(\''+val1.pic_xh+'\')">';
					html += '<p>';
					html += '<img src="'+PICURI+val1.pic_lylys+'" onload="this.clientHeight > this.clientWidth ? this.style.height = \'100%\' : this.style.width = \'100%\'">';
					html += '</p>';
//					html += '<span style="background: url('+PICURI+val1.pic_lylys+')"></span>';
					html += '</a>';
					html += '</div>';
					html += '</li>';
	 			});
				html += '</ul>';
				html += '</div>';
				html += '</div>';
 			});
			$(".pic_list").html(html);
		},
		error : function() {
			AlertBox.alert("查询加载失败！");
		}
	});
}

function toDetail(uuid){
	var url = "../../html/pics/picDetail.html?uuid="+uuid+"&type=d_photo_pic";
	url = encodeURI(url);
	parent.createPage("详情",url , true, "picsDetail"+uuid);
}
/**
 * 检索
 */
function searchData(){
	var text = $("#searchW_words").val();
	var url = "../../html/search/search.html?text="+text+"&TYPE_ONE=all";
	url = encodeURI(url);
	parent.createPage("检索结果",url , true, "searchData");
}

function higth_search(){
	//alert(1);
}
var timer=null;
//单击
function clickOne(path){
	clearTimeout(timer);
	timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
		//alert("单击事件");
		picLarge(path);
	}, 400);
}
//双击
function clickdbl(picXh){
	clearTimeout(timer);
	//alert("双击事件");
	toDetail(picXh);
}