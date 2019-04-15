/**
 * 登录--js
 */
$(function() {
	checksessoin();
	$(document).keydown(function (event) {
        //enter登录
        if (event.keyCode == 13) {
            login();
        }
    });
})


/**
 * 登陆
 */
function login(){
	var loginName = $("#loginName").val();
	var password = $("#password").val();
	if(loginName.length==0||password.length==0){
		$box.promptBox("请输入用户名或密码");
		return;
	}
	$.ajax({
         url: '/photo/user/login',
         type: 'post',
         data: {
             "loginName": loginName,
             "password": password
         },
         dataType: 'json',
         success: function (data) {
             if (data.resultStatus == true){ 
            	 window.location.href = "../../html/index/index.html";
             } else if (data.resultStatus == false) {
            	 AlertBox.alert(data.resultInfo);
             } 
         }
     });
}

/**
 * session存在，跳转首页
 */
function checksessoin() {
	$.ajax({
		url : "/photo/user/loginSession",
		dataType : "json",
		async : false,
		data : {},
		type : "post",
		success : function(data) {
			if(data.resultStatus){
				AlertBox.alert("已登录，跳转首页");
				AlertBox.onHide(function(){
					window.location.href="../../html/index/index.html";
				})
	    	}
		},
		error : function() {
		}
	});
}


/**
 * 忘记密码
 */
function forgetPwd(){
	AlertBox.alert("请联系管理员重置密码！");
}