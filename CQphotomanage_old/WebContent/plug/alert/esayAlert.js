$(function(){
	var obj = {};
	
	var container = $("#ModalAlert");
	var headerBox = container.find(".ui_tit");
	var contentBox = container.find(".ui_con");
	var footerBox = container.find(".ui_btj");
	var closeBtn = container.find(".close");
	var showCallback = null;
	var hideCallback = null;
	
	closeBtn.click(function(){
		obj.hide();
	})
	
	obj.alert = function(content, title){
		if(title!=undefined && title!=null&&title.length>0){
			headerBox.html(title);
		}else if(title!=undefined && title!=null && title.length==0){
			headerBox.html("消息提示");
		}else{
			headerBox.html("消息提示");
		}
		
		if(content){
			contentBox.html('<div style="padding: '+(title ? 20 : 0)+'px 40px 20px;text-align: center;width: 180px;">'+content+'</div>');
		}
		
//		footerBox.css("text-align", "center");
		
		footerBox.html("<a onclick='AlertBox.hide()' class=\"btn\">关闭</a>")
		
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	obj.audit = function(content, title,funHtml){
		if(title){
			headerBox.html(title);
		}else{
			headerBox.hide();
		}
		
		if(content){
			contentBox.html('<div style="padding: '+(title ? 20 : 0)+'px 40px 20px;text-align: center;width: 380px;">'+content+'</div>');
		}
			
		footerBox.html(funHtml+"<a onclick='AlertBox.hide()' class=\"btn ml10\">关闭</a>")
		
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	obj.alertNoClose = function(content){
		headerBox.hide();
		closeBtn.hide();
		footerBox.hide();
		if(content){
			contentBox.html('<div style="padding: '+(0)+'px 40px 20px;text-align: center;width: 180px;">'+content+'</div>');
		}
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	
	obj.revert = function(){
		headerBox.show();
		closeBtn.show();
		footerBox.show();
	}
	
	obj.confirm = function(content, title, sureFn, param, config){
		config || (config = {});
		if(title){
			headerBox.html(title);
			headerBox.show();
		}else{
			headerBox.hide();
		}
		
		if(content){
			contentBox.html(content);
		}
		
//		footerBox.css("text-align", "right");
		
		footerBox.html("<a class=\"btn btn_ok\">"+ (config.sureText || "确认") +"</a><a onclick='AlertBox.hide()' class=\"btn ml10\">"+ (config.closeText || "关闭") +"</a>");
		
		footerBox.off('click').on("click", ".btn_ok", function(){
			if(sureFn) sureFn(param);
		})
		
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	
	//自定义
	obj.confirmIs = function(content, title,sureFn,offFn,config){
		config || (config = {});
		if(title){
			headerBox.html(title);
			headerBox.show();
		}else{
			headerBox.hide();
		}
		if(content){
			contentBox.html(content);
		}
		footerBox.html("<a class=\"btn btn_ok\">"+ (config.sureText || "确认") +"</a><a class=\"btn ml10 btn_off \">"+ (config.closeText || "关闭") +"</a>");
		footerBox.find(".btn_ok").off('click').on("click",function(){
			if(sureFn) sureFn();
		});
		footerBox.find(".btn_off").off('click').on("click",function(){
			if(offFn) offFn();
		});
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	
	obj.hide = function(){
		container.hide();
		if(parent && parent.hideAlert){
			parent.hideAlert();
		}
		if(hideCallback) hideCallback();
		$(".ui_btj").html("");
	}
	
	obj.onHide = function(callback){
		hideCallback = callback;
	}
	
	obj.onShow = function(callback){
		showCallback = callback;
	}
	obj.picAlert = function(content, title){
		if(title!=null&&title.length>0){
			headerBox.html(title);
		}else if(title!=null && title.length==0){
			headerBox.html("消息提示");
		}else{
			headerBox.hide();
		}
		
		if(content){
			contentBox.html('<div style="padding: '+(title ? 20 : 0)+'px 40px 20px;display:flex;align-items:center; justify-content:center;">'+content+'</div>');
		}
		
//		footerBox.css("text-align", "center");
		
		footerBox.html("<a onclick='AlertBox.hide()' class=\"btn\">关闭</a>")
		
		if(showCallback) showCallback();
		container.show();
		if(parent && parent.showAlert){
			parent.showAlert();
		}
	}
	window.AlertBox = obj;
})
