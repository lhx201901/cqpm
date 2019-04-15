var PICURI="http://127.0.0.1:8083/photo/upload/DATA/";
//var PICURI="/photo/DATA/";
var USRSESSION=null;
$(function() {
	//初始化事件
	initOpenTab();
	initCustomSelect();
	initTextareaTip();
	if(window.top==window.self){
		checksessoin();
	}else{
		checksessoin();
		//getSessoin();
	}
})
//在父窗体打开tab的a标签绑定事件
function initOpenTab() {
	$("body").on("click", "a", function(e) {
		var ev = e || event;
		ev.stopPropagation();
		if ($(this).hasClass("open_in_parent") && parent && parent.createPage) {
			var linkstr = $(this).attr("href");
			var id = $(this).attr("id");
			var text = $(this).attr("title") || "新标签";
			parent.createPage(text, linkstr, true, id);
			return false;
		}
	})
}
//初始化自定义下拉框事件
function initCustomSelect(){
	$(".sr_sl_most").on("click", "li a", function(){
		$(this).parents(".sr_sl_most").siblings("input[type=text]").val($(this).text());
	})
}
//有文字限制的文本框初始化
function initTextareaTip() {
	$(".limit_text").each(function() {
		var max = parseInt($(this).attr("max"));
		if (max) {
			$(this).siblings(".zsum").text($(this).val().length + " / " + max);
			$(this).on("keydown", function() {
				if ($(this).val().length > max) {
					return false;
				}
				$(this).siblings(".zsum").text($(this).val().length + " / " + max);
			})
		}
	})
}

jQuery.fn.showAlert = function() {
	this.show();
	if (parent && parent.showAlert) {
		parent.showAlert();
	}
}
jQuery.fn.hideAlert = function() {
	this.hide();
	if (parent && parent.hideAlert) {
		parent.hideAlert();
	}
}

/**************************************时间格式化处理************************************/
/**
 * 用法
 * var html=dateFtt("yyyy-MM-dd hh:mm:ss", new Date(data.downloadTime));
 * 
 * yyyy-MM-dd hh:mm:ss 可变
 * 
 * Date 时间
 * 
 */
function dateFtt(fmt, date) {  
	var o = {
		"M+" : date.getMonth() + 1, //月份   
		"d+" : date.getDate(), //日   
		"h+" : date.getHours(), //小时   
		"m+" : date.getMinutes(), //分   
		"s+" : date.getSeconds(), //秒   
		"q+" : Math.floor((date.getMonth() + 3) / 3), //季度   
		"S" : date.getMilliseconds()
	//毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 将时间戳转化为日期格式
 * 时间戳为10位需*1000，时间戳为13位的话不需乘1000
 * @param timestamp
 * @returns {String}
 */
function timestampToTime(timestamp) {
	//var term=Number(timestamp);
   // var date = new Date(term);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var date = new Date(timestamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D;
}
/**
 * 获取url参数并返回对象
 * @returns {Object}
 */
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	url = decodeURI(url);
	
	
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * 登录过期，跳转登录页面
 */
function checksessoin() {
	$.ajax({
		url : "/photo/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(!data.resultStatus){
				AlertBox.alert(data.resultInfo);
				AlertBox.onHide(function(){
					parent.window.location.href="../../html/login/login.html";
				})
	    	}else{
	    		USRSESSION=data.resultData;
	    	}
		},
		error : function() {
		}
	});
}

/**
 * 得到session
 */
function getSessoin() {
	$.ajax({
		url : "/photo/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {			
			if(data.resultStatus){
				USRSESSION=data.resultData;
	    	}
		},
		error : function() {
		}
	});
}

/**
 * 下载
 * 
 * @param picXh
 */
function downloadYt(picXh) {
	AlertBox.alert("图片下载中，请稍等！","下载提示");
	var url="/photo/dowanloadYt?picXh="+ picXh;
	 var xhr = new XMLHttpRequest();
	  xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
	  xhr.responseType = "blob";  // 返回类型blob
	  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
	  xhr.onload = function () {
	    // 请求完成
	    if (this.status === 200) {
		     var contentType = xhr.getResponseHeader("Content-Type");
		     if(contentType.split(";")[0] == "application/json"){
		            var reader = new FileReader();
		            reader.readAsText(xhr.response);
		            reader.onload = function (oFREvent) {
		                AlertBox.alert(reader.result);
		            };
		       }else{
		 	      // 返回200
		    	  AlertBox.hide();
		 	      var blob = this.response;
		 	      var repStr=xhr.getResponseHeader('Content-Disposition');
		 	      var filename = repStr.substring(repStr.indexOf("=")+1,repStr.length);
		 	      saveFile(blob, decodeURIComponent(filename));
		       }
	    }else{
	    	AlertBox.alert("下载出错!");
	    }
	  };
	  // 发送ajax请求
	  xhr.send()
}

/**
 * 保存文件
 * @param blob
 * @param fileName
 */
function saveFile(blob, fileName){ 
	var b = getBrowser(); 
	if(b =="Chrome"){ 
		var link = document.createElement('a'); 
		var file = new Blob([blob], { type: 'application/octet-stream' }); 
		link.href = window.URL.createObjectURL(file); 
		link.download = fileName; link.click(); 
	} else if(b =="Firefox"){ 
		var file = new File([blob], fileName, { type: 'application/octet-stream' }); 
		var url = URL.createObjectURL(file); //window.location.href = url; 
		parent.location.href = url; 
	} else if(b=="IE"){ 
		var file = new Blob([blob], { type: 'application/force-download' }); 
		window.navigator.msSaveBlob(file, fileName); 
	} 
}

/**
 * 得到浏览器版本
 * @returns {String}
 */
function getBrowser() { 
	var ua = window.navigator.userAgent; 
	//var isIE = window.ActiveXObject != undefined && ua.indexOf("MSIE") != -1; 
	var isIE = !!window.ActiveXObject || "ActiveXObject" in window; 
	var isFirefox = ua.indexOf("Firefox") != -1; 
	var isOpera = window.opr != undefined; 
	var isChrome = ua.indexOf("Chrome") && window.chrome; 
	var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1; 
	if (isIE) {
		return "IE"; 
	} else if (isFirefox) { 
		return "Firefox";
	} else if (isOpera) { 
		return "Opera"; 
	} else if (isChrome) { 
		return "Chrome";
	} else if (isSafari) {
		return "Safari"; 
	} else { 
		return "Unkown"; 
	} 
}
/**
 * 弹出图片大图
 * @param path
 */
function picLarge(path){
	if(path!=undefined && path!=null){		
		AlertBox.picAlert('<img  src="' + PICURI + "/"+path + '" style="height:auto;width:auto;">',
		"图片显示");
	}
}