var fileArray = [];
var textObjArray = [];
// 文件分割上传的间隙大小 10M
var fileSplitSize = 1024 * 1024 * 10;
/**
 * 上传图片js
 */
$(function() {
	//作者历史记录
	initAuthorBur();
	// 初始化上传
	initFileUpload();
	// 时间选择初始化
	initDatePicker();
	// 关键字初始化
	initKeywordsTips();
	// 输入改变
	initInputChange();
	// 选择模板
	selectText();
	initPicTypes("图库", 1);
	// 查询临时图片信息
	//findPicsBySession();  //20190118
	// 选择模板触发时间
	$("#selectText").change(function() {
		//var fileId = $("#UploadImages").find(".active").attr("fileId");
		var textId = $("#selectText").val();
		if (textId.trim().length == 0) {
			resetData();
			return;
		}
		$.ajax({
			url : "/photo/textTemplate/findById",
			dataType : "json",
			async : true,
			data : {
				id : textId
			},
			type : "post",
			success : function(data) {
			
/*				if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
					obj = textObjArray[fileId];
				}*/
				var obj ={}; 
				$("#UploadImages").find(".active").each(function(i){
					 obj = {};
					 if (textObjArray[$(this).attr("fileId")] != undefined && textObjArray[$(this).attr("fileId")] != null) {
							//obj = textObjArray[fileId];
							obj.picXh = textObjArray[$(this).attr("fileId")].picXh;
							obj.picFiletype=textObjArray[$(this).attr("fileId")].picFiletype;
							obj.picFilesize=textObjArray[$(this).attr("fileId")].picFilesize;
					 }
					obj.picMc = data.title;
					obj.picZsm = data.mainRemark;
					obj.picFsm = data.secondRemark;
					obj.picDd = data.picDd;
					obj.picSyz = data.picSyz;
					obj.picSysj = data.picPssj;
					obj.typeOne = data.typeOne;
					obj.typeTwo = data.typeTwo;
					obj.typeThree = data.typeThree;
					obj.typeFour = data.typeFour;
					obj.typeFive = data.typeFive;
					obj.picMj = data.picMj;
					obj.picType = data.picType;
					obj.picGjz = data.picGjz;
					textObjArray[$(this).attr("fileId")]=obj;
				 });

				objToData(obj);
				initTextareaTip();
/*				var obj = {};
				if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
					obj = textObjArray[fileId];
				}
				obj.picMc = data.title;
				obj.picZsm = data.mainRemark;
				obj.picFsm = data.secondRemark;
				obj.picDd = data.picDd;
				obj.picSyz = data.picSyz;
				obj.picSysj = data.picPssj;
				obj.typeOne = data.typeOne;
				obj.typeTwo = data.typeTwo;
				obj.typeThree = data.typeThree;
				obj.typeFour = data.typeFour;
				obj.typeFive = data.typeFive;
				obj.picMj = data.picMj;
				obj.picType = data.picType;
				obj.picGjz = data.picGjz;
				textObjArray[fileId] = obj;
				//console.log(obj);
				objToData(obj);
				initTextareaTip();*/
			},
			error : function() {
			}
		});
	});
	initInputValue();
	//初始化右键弹出选择菜单
	//initRightKeyMenu();
	
	
})
/**
 * 初始化上传
 */
function initFileUpload() {
	var deleteDom = null;
	$("#UploadFile").on("change", function() {
		var files = this.files;
		//console.log(textObjArray);
		//console.log(files);
		//console.log("====");
		if(textObjArray.length+files.length>4){
			AlertBox.alert("选择的图片数量大于四张，请重新选择！");
			return;
		}
		$.each(files, function(key, val) {
			var file = val;
			var name = file.name;
			//console.log(file);
			var size = file.size, type = file.type || "", 
			id = (file.lastModified + "").replace(/\W/g, '') + size + type.replace(/\W/g, '') + name.replace(/\s/g,"");;
			/*if (size > 1024 * 1024 * 1024 * 2) {// 大于2G
				AlertBox.alert("文件过大！");
				return;
			} */
			if (size >  1024 * 1024 *20) {// 大于20M
				AlertBox.alert(name+"<br/>文件大小不能超过20M,请重新选择！","消息提示");
				return;
			} else if (fileArray.indexOf(id) != -1) {
				AlertBox.alert(name+"文件已存在！","消息提示");
				return;
			} else {
				fileArray.push(id);
				fileArray[id] = file;
				textObjArray.push(id);
				var obj = {};
				obj.picXh = guid();
				obj.picFiletype=name.substring(name.lastIndexOf(".")+1).toUpperCase();
				obj.picFilesize=size;
				textObjArray[id] = obj;
			}
			// 图片添加显示
			var dealPic = html5Reader(file);
			var item = $('<li class="pic_item picn" fileId=' + id + '>' 
					+ '<div class="upload_img" ><div class="ed_sel_ok"><i class="ico ico20"></i></div></div><img class="ed_sel_del" src="../../images/close.png" />'
					+'<div class="up_img_jd" style="width:0%" updata=0 ><s class="up_img_jd_s">0%</s></div>'
					+'</li>');
			item.find(".upload_img").append(dealPic);
			$("#UploadFile").parents(".up_adimg_bg").before(item);
			$("input[name='qcfsj']").click(function(e){
				  e.stopPropagation();//阻止冒泡
				});
		});
		limitBehaviour();
		//console.log(textObjArray);
		//console.log(files);
	})

	// 点击触发事件
	//点击图片切换事件
	$("#UploadImages").on("click", ".pic_item", function(e) {
		_this=this;
		clearTimeout(timer);
		timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
			//alert("单击事件");
		
		 if(e.ctrlKey){
			 if($(_this).hasClass("active")){
				 $(_this).removeClass("active");
			 }else{
				 $(_this).addClass("active");
			 }
		 }else{
			 getData(_this);
		 }
			
		}, 200);
/*		if (!$(this).hasClass("active")) {


			getData(this);
		}*/
	})
	// 删除图片
	$("#UploadImages").on("click", ".ed_sel_del", function() {
		deleteDom = $(this).parents(".picn");
		AlertBox.confirm('<div style="padding: 0px 80px 20px;">确认删除图片？</div>', "删除提示", sureDelete, deleteDom);
	});
}

/**
 * 显示中图
 */
function showMiddlePic(){
	
}


/**
 * 上传功能
 */
function FileUploadPlug(){
	return{
	   cutSize:1*1024 * 1024,
	   url:"",
	   fileArray:[],
	   /**
	    * 返回结果数据
	    */

	   cutPicArray:[],
	   picUpResult:{},
	   _this:null,
	   //初始化
	   init:function(_fileArray,_url){
		   this.url=_url;
		   this.fileArray=_fileArray;
		   _this=this;
	   },
		/**
		 * 图片切分
		 * 返回值 array 切分后的数据
		 */
		cutPic: function (picFile,id){
			var nowSize=0;
			var pic=[];
			var k=0;
		 	var zolFileCutCount= picFile.size%this.cutSize>0? Math.floor( picFile.size/this.cutSize)+1:picFile.size/this.cutSize;
			while(true){
				var obj={};
				k++;
				//if(nowSize>=picFile.size||picFile.size-nowSize< this.cutSize||picFile.size<=this.cutSize){
				
				if(nowSize==0){
					if( picFile.size<=this.cutSize){
						obj.cutFragment=picFile.slice(0,picFile.size);//剪切片段
						obj.startSize=nowSize;//开始尺寸
						obj.endSize=picFile.size;//结束尺寸
						obj.cutPicSize=obj.endSize-obj.startSize;
						obj.seq=k;
						obj.zolFileCutCount=zolFileCutCount
						obj.file=picFile;
						obj.isSuccess=false;
						obj.id=id;
						pic.push(obj);
						return pic;
					}else{
						obj.cutFragment=picFile.slice(0,this.cutSize);//剪切片段
						obj.startSize=0;
						obj.endSize=this.cutSize;
						obj.cutPicSize=obj.endSize-obj.startSize;
						obj.seq=k;
						obj.zolFileCutCount=zolFileCutCount
						obj.file=picFile;
						obj.isSuccess=false;
						obj.id=id;
						pic.push(obj);
					} 
				}else{
					if(nowSize+this.cutSize>=picFile.size){
						obj.cutFragment=picFile.slice(nowSize,picFile.size);//剪切片段
						obj.startSize=nowSize;//开始尺寸
						obj.endSize=picFile.size;//结束尺寸
						obj.cutPicSize=obj.endSize-obj.startSize;
						obj.seq=k;
						obj.zolFileCutCount=zolFileCutCount
						obj.file=picFile;
						obj.isSuccess=false;
						obj.id=id;
						pic.push(obj);
						return pic;
					}else{
						obj.cutFragment=picFile.slice(nowSize,nowSize+this.cutSize);//剪切片段
						obj.startSize=nowSize;
						obj.endSize=nowSize+this.cutSize;
						obj.cutPicSize=obj.endSize-obj.startSize;
						obj.seq=k;
						obj.zolFileCutCount=zolFileCutCount
						obj.file=picFile;
						obj.isSuccess=false;
						obj.id=id;
						pic.push(obj);
					}
				}
				nowSize=nowSize+this.cutSize;
			}
		},
		/**
		 * 进度条
		 */
		loadprogress :function (cutPic){
			var progressObj=$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd');
			progressObj.attr("updata",Number( progressObj.attr("updata"))+cutPic.cutPicSize);
			progressObj.attr("style","width:"+ Math.floor( Number( progressObj.attr("updata"))/cutPic.file.size*100)+"%");
			$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ).html( Math.floor(Number( progressObj.attr("updata"))/cutPic.file.size*100)+"%");
		},
		/**
		 * 执行上传
		 */
		sureUploadPic:function (){
			var _this=this;
			//上传片段组装
			_this.cutPicArray=[];
			for(var i=0;i< _this.fileArray.length;i++){
				_this.picUpResult[_this.fileArray[i]]=true;
				_this.cutPicArray =_this.cutPicArray.concat(_this.cutPic( _this.fileArray [ _this.fileArray[i]], _this.fileArray[i]));
			}
			//执行上传
			//console.log("=======");
			//console.log(_this.cutPicArray);
			$.each(_this.cutPicArray,function(indx,item){
				console.log(item.id+"----排序"+item.seq);
				if(_this.picUpResult[item.id]){
					console.log("图片id"+item.id+"图片"+item.seq+"--"+textObjArray[item.id].picXh)
					_this.upCutPic(item);
				}
			});
		},
		/**
		 * 上传单片段
		 * @param cutPic
		 */
		upCutPic:function(cutPic){
			var upThis=this;
			var data = new FormData();
			data.append("myFile",cutPic.cutFragment);//上传片段
			data.append("start",cutPic.startSize);//开始位置
			data.append("end",cutPic.endSize);//结束位置
			data.append("cutPicSize",cutPic.cutPicSize);//上传图片的字节数
			data.append("seq",cutPic.seq);//片段序号
			data.append("fileid",cutPic.id);//文件的原始名称
			data.append("picXh",textObjArray[cutPic.id].picXh);//随机文件序号
			data.append("fileSuffix",cutPic.file.name.substring( cutPic.file.name.lastIndexOf(".") + 1).toLowerCase());
			data.append("fileName",encodeURIComponent(textObjArray[cutPic.id].picXh+ "." + cutPic.file.name.substring( cutPic.file.name.lastIndexOf(".") + 1).toLowerCase()));//文件名称
			data.append("fileSize",cutPic.file.size);//片段序号
			data.append("zolFileCutCount",cutPic.zolFileCutCount);//片段序号
			data.append("picInfo",JSON.stringify( textObjArray[cutPic.id]));//图片信息
			$.ajax({
			    url: this.url,
			    type: 'POST',
			    cache: false,
			    data: data,
			    async:true,
			    processData: false,
			    contentType: false
			}).done(function(res) {
				if(res.status){
					cutPic.isSuccess=true;
					upThis.loadprogress(cutPic);
					if(res.isComplete){
						$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd ' ).attr("style","width:100%");;
						$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ).html("上传成功!");
					}
				}else{
					upThis.picUpResult[cutPic.id]=false;
					cutPic.isSuccess=false;
					$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd ' ).attr("style","width:100%");;
					////console.log($('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ));
					if(res.msg && res.msg.length>10){						
						$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ).removeClass("up_img_jd_s");
						$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ).addClass("up_img_jd_new");
					}
					$('#UploadImages li[fileid="'+cutPic.id+'"] .up_img_jd s' ).html(res.msg);
				}
			}).fail(function(res) {
				cutPic.isSuccess=false;
			});
		}
}

}


// 删除图片
function sureDelete(deleteDom) {
	if (deleteDom) {
		var fileId = deleteDom.attr('fileId');
		var fileIdx = deleteDom.attr('fileIdx');
		if (fileIdx != undefined && fileIdx != "") {
			$.ajax({
				url : "/photo/temporaryPic/deleteById",
				dataType : "json",
				async : true,
				data : {
					id : fileIdx
				},
				type : "post",
				success : function(data) {
					if (data) {
						AlertBox.alert("删除成功！");
					}
				},
				error : function() {
				}
			});
		} else {
			fileArray.splice(fileArray.indexOf(fileId), 1);
		}
		textObjArray.splice(textObjArray.indexOf(fileId), 1);
		////console.log(textObjArray);
		deleteDom.remove();
		deleteDom = null;
		limitBehaviour();
		AlertBox.hide();
	}
}

/**
 * 限制图片数量为4
 */
function limitBehaviour() {
	var items = $("#UploadImages").children(".pic_item");
	if (items.length == 0) {
		resetData();
	}
	if (items.length >= 4) {
		$(".up_adimg_bg").hide();
	} else {
		$(".up_adimg_bg").show();
	}
	$.each(items, function(k, v) {
		if (k == 0)
			getData(this);
		if (k > 3)
			$(this).remove();
	})
}

/**
 * 获取当前图片的信息
 * 
 * @param val
 */
function getData(val) {
	$("#selectText").val("");
	//if (!$(val).hasClass("active")) {
		$(val).addClass("active").siblings("li.pic_item").removeClass("active");
	//}
	////console.log("###############");
	////console.log( $(val));
	var fileId = $(val).attr("fileId");
	//console.log(fileId);
	//console.log(textObjArray);
	var fileIdx = $(val).attr("fileIdx");
	if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
		var obj = textObjArray[fileId];
		objToData(obj);
		// 左侧栏显示数据
/*		var tempBox = $("#TextTemplate");
		if (fileIdx != undefined && fileIdx != "") {
			var html = "";
			html += obj.picMc ? ("<p>标题：" + obj.picMc + "</p>") : "";
			html += obj.picZsm ? ("<p>主说明：" + obj.picZsm + "</p>") : "";
			html += obj.picFsm ? ("<p>分说明：" + obj.picFsm + "</p>") : "";
			html += obj.picDd ? ("<p>图片地点：" + obj.picDd + "</p>") : "";
			html += obj.picSyz ? ("<p>摄影作者：" + obj.picSyz + "</p>") : "";
			html += obj.picSysj != null ? ("<p>拍摄时间：" + dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) + "</p>") : "";
			if (obj.typeOne != null && obj.typeOne != "") {
				html += "<p>图片分类：" + obj.typeOne + "  ";
				html += obj.typeTwo != null ? obj.typeTwo + "  " : "";
				html += obj.typeThree != null ? obj.typeThree + "  " : "";
				html += obj.typeFour != null ? obj.typeFour + "  " : "";
				html += obj.typeFive != null ? obj.typeFive + "  " : "";
				html += "</p>";
			}
			var picMj = obj.picMj == 0 ? "公开" : "非公开";
			html += obj.picMj ? ("<p>图片是否公开：" + picMj + "</p>") : "";
			var picType = obj.picType == 0 ? "横幅" : "竖幅"
			html += obj.picType ? ("<p>布局类型：" + picType + "</p>") : "";
			var arr = obj.picGjz.split("@");
			var html1 = '';
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].trim().length > 0) {
					html1 += arr[i] + " ";
				}
			}
			html += obj.picGjz ? ("<p>关键字：" + html1 + "</p>") : "";
			if (html) {
				tempBox.show();
			} else {
				tempBox.hide();
			}
			tempBox.html(html);
		} else {
			tempBox.empty();
			tempBox.hide();
		}*/
	}
	initTextareaTip();
}


/**
 * 判断数据是否发生了改变
 * @param val
 * @returns {Boolean}
 */
function compareData(){
	var resultObj={};
	var selectObj=$("#UploadImages > .active");
	if (textObjArray[selectObj.attr("fileId")] != undefined && textObjArray[selectObj.attr("fileId")] != null){
		var obj =findPicDetail(selectObj.attr("fileIdx")) ;
		if(obj.picMc != $("#Title").val()){
			resultObj.isChange=true;
			resultObj.message="标题";
			return resultObj;
		}
		if(obj.picZsm != $("#MainExplain").val()){
			resultObj.isChange=true;
			resultObj.message="主说明";
			return resultObj;
		}
		if(obj.picFsm != $("#MinorExplain").val()){
			resultObj.isChange=true;
			resultObj.message="分说明";
			return resultObj;
		}
		if(obj.picDd != $("#Adress").val()){
			resultObj.isChange=true;
			resultObj.message="图片地点";
			return resultObj;
		}
		if(obj.picSyz != $("#Author").val()){
			resultObj.isChange=true;
			resultObj.message="摄影作者";
			return resultObj;
		}
		if(dateFtt("yyyy-MM-dd", new Date(obj.picSysj))  != $("#CreateTime").val()){
			resultObj.isChange=true;
			resultObj.message="拍摄时间";
			return resultObj;
		}
		if($("#picType3").val()!=undefined&&$("#picType3").val()!=null&&obj.typeOne != $("#picType1").val()){
			resultObj.isChange=true;
			resultObj.message="图片分类";
			return resultObj;
		}
		if($("#picType3").val()!=undefined&&$("#picType3").val()!=null&&obj.typeTwo != $("#picType2").val()){
			resultObj.isChange=true;
			resultObj.message="图片分类";
			return resultObj;
		}
		if($("#picType3").val()!=undefined&&$("#picType3").val()!=null&&obj.typeThree != $("#picType3").val()){
			resultObj.isChange=true;
			resultObj.message="图片分类";
			return resultObj;
		}
		if($("#picType3").val()!=undefined&&$("#picType3").val()!=null&&obj.typeFour != $("#picType4").val()){
			resultObj.isChange=true;
			resultObj.message="图片分类";
			return resultObj;
		}
		if($("#picType3").val()!=undefined&&$("#picType3").val()!=null&&obj.typeFive != $("#picType5").val()){
			resultObj.isChange=true;
			resultObj.message="图片分类";
			return resultObj;
		}
		if(obj.picMj != $("#picMjSel").val()){
			resultObj.isChange=true;
			resultObj.message="密级类型";
			return resultObj;
		}
		if(obj.picType != $("#picTypeSel").val()){
			resultObj.isChange=true;
			resultObj.message="布局类型";
			return resultObj;
		}
		var picGjz = new Array();
		$("#KeywordTips a").each(function() {
			picGjz.push($(this).text());
		});
		if(null!=$("#Keywords").val()&&undefined!=$("#Keywords").val()&&""!=$("#Keywords").val()){
			picGjz.push($("#Keywords").val());
			$("#Keywords").val("");
		}
		if(obj.picGjz != picGjz.join("@")){
			resultObj.isChange=true;
			resultObj.message="关键字";
			return resultObj;
		}

	}
	resultObj.isChange=false;
	resultObj.message="";
	return resultObj;
}





/**
 * 界面赋值
 * 
 * @param obj
 */
function objToData(obj) {
	$("#picTypesSel").empty();
	initPicTypes("图库", 1);
	$("#Title").val(obj.picMc);
	$("#MainExplain").val(obj.picZsm);
	$("#MinorExplain").val(obj.picFsm);
	if(null==obj.picDd||undefined==obj.picDd||""==obj.picDd.replace(/\s+/g,"")){
		$("#Adress").val("重庆");
	}else{
		$("#Adress").val(obj.picDd);
	}
	$("#Author").val(obj.picSyz);
	
	if(null==obj.picSysj||undefined==obj.picSysj||obj.picSysj==0||""==new String( obj.picSysj).replace(/\s+/g,"")){
		$("#CreateTime").val( dateFtt("yyyy-MM-dd", new Date()));
	}else{
		$("#CreateTime").val(obj.picSysj != null ? dateFtt("yyyy-MM-dd", new Date(obj.picSysj)) : "");
	}
	if (obj.typeOne != null && obj.typeOne != "") {
		$("#picType1").val(obj.typeOne);
		initPicTypes(obj.typeOne, 2);
	}
	if (obj.typeTwo != null && obj.typeTwo != "") {
		$("#picType2").val(obj.typeTwo);
		initPicTypes(obj.typeTwo, 3);
	}
	if (obj.typeThree != null && obj.typeThree != "") {
		$("#picType3").val(obj.typeThree);
		initPicTypes(obj.typeThree, 4);
	}
	if (obj.typeFour != null && obj.typeFour != "") {
		$("#picType4").val(obj.typeFour);
		initPicTypes(obj.typeFour, 5);
	}
	if (obj.typeFive != null && obj.typeFive != "") {
		$("#picType5").val(obj.typeFive);
	}
	if(null==obj.picMj||undefined==obj.picMj||""==new String(obj.picMj).replace(/\s+/g,"")){
		$("#picMjSel").val(0);
	}else{
		$("#picMjSel").val(obj.picMj);
	}
	
	if(null==obj.picType||undefined==obj.picType||""==new String( obj.picType).replace(/\s+/g,"")){
		$("#picTypeSel").val(0);
	}else{
		$("#picTypeSel").val(obj.picType);
	}
	
	
	$("#KeywordTips").empty();
	if(obj.picGjz!=undefined && obj.picGjz!=""){
		var arr = obj.picGjz.split("@");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0) {
				$("#KeywordTips").append('<a>' + arr[i] + '<i class="ico ico17"></i></a>');
			}
		}
	}
}

/**
 * 兼容ie9的图片预览
 * @param file
 * @returns
 */
//function imageViewer(file){
//	var isIE = (navigator.userAgent.match(/MSIE/) != null);
//	if(isIE){
//		var pic = document.createElement("img");
//		pic.src = file.value;
//		return [pic];
//	}else{
//		return html5Reader(file);
//	}
//}

var timer=null;


/**
 * html5预览图片方法
 */
function html5Reader(file) {
	var pic = document.createElement("img");
	
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function() {
		pic.src = this.result;
	}
	pic.ondblclick=function(){
		clearTimeout(timer);
		AlertBox.picAlert(this.outerHTML,
		"图片显示");
	}
	return pic;
}



/**
 * 初始化input输入框事件
 */
function initInputChange() {
	$("#Title").blur(templateDeal);
	$("#MainExplain").keyup(templateDeal);
	$("#MinorExplain").keyup(templateDeal);
	$("#Adress").blur(templateDeal);
	$("#Author").blur(templateDeal);
	$("#CreateTime").blur(templateDeal);
	$("#picMjSel").change(templateDeal);
	$("#picTypeSel").change(templateDeal);
	$("#Keywords").blur(templateDeal);
}

/**
 * 文字模板动态拼接
 */
function templateDeal() {
	_this=this;
	 $("#UploadImages").find(".active").each(function(i){
		 var fileId =$(this).attr("fileId");
			var obj = {};
			if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
				obj.picXh = textObjArray[fileId].picXh;
				obj.picFiletype=textObjArray[fileId].picFiletype;
				obj.picFilesize=textObjArray[fileId].picFilesize;
				obj.picMc =textObjArray[fileId].picMc;
				obj.picZsm = textObjArray[fileId].picZsm;
				obj.picFsm = textObjArray[fileId].picFsm;
				obj.picDd =textObjArray[fileId].picDd;
				obj.picSyz = textObjArray[fileId].picSyz;
				obj.picSysj =textObjArray[fileId].picSysj;
				obj.picMj =textObjArray[fileId].picMj;
				obj.picType = textObjArray[fileId].picType;
				obj.picGjz =textObjArray[fileId].picGjz;
			}
			if(_this.id=="Title"){
				obj.picMc = $("#Title").val();
			}
			if(_this.id=="MainExplain"){
				obj.picZsm = $("#MainExplain").val();
			}
			if(_this.id=="MinorExplain"){
				obj.picFsm = $("#MinorExplain").val();
			}
			if(_this.id=="Adress"){
				obj.picDd = $("#Adress").val();
			}
			if(_this.id=="Author"){
				obj.picSyz = $("#Author").val();
			}
			if(_this.id=="CreateTime"){
				obj.picSysj = $("#CreateTime").val();
			}
			if(_this.id=="picMjSel"){
				obj.picMj = $("#picMjSel").val();
			}
			if(_this.id=="picTypeSel"){
				obj.picType = $("#picTypeSel").val();
			}
			if(_this.id=="Keywords"){
				var picGjz = new Array();
				$("#KeywordTips a").each(function() {
					picGjz.push($(this).text());
				});
				if(null!=$("#Keywords").val()&&undefined!=$("#Keywords").val()&&""!=$("#Keywords").val()){
					picGjz.push($("#Keywords").val());
					$("#KeywordTips").append('<a>' + $("#Keywords").val() + '<i class="ico ico17"></i></a>');
					$("#Keywords").val("");
				}
				obj.picGjz = picGjz.join("@");
			}
			obj.typeOne = $("#picType1").val();
			obj.typeTwo = $("#picType2").val();
			obj.typeThree = $("#picType3").val();
			obj.typeFour = $("#picType4").val();
			obj.typeFive = $("#picType5").val();
		

			textObjArray[fileId] = obj;
	 });
	initTextareaTip();
	
	
	
/*	var fileId = $("#UploadImages").find(".active").attr("fileId");
	var obj = {};
	if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
		obj = textObjArray[fileId];
	}
	obj.picMc = $("#Title").val();
	obj.picZsm = $("#MainExplain").val();
	obj.picFsm = $("#MinorExplain").val();
	obj.picDd = $("#Adress").val();
	obj.picSyz = $("#Author").val();
	obj.picSysj = $("#CreateTime").val();
	obj.typeOne = $("#picType1").val();
	obj.typeTwo = $("#picType2").val();
	obj.typeThree = $("#picType3").val();
	obj.typeFour = $("#picType4").val();
	obj.typeFive = $("#picType5").val();
	obj.picMj = $("#picMjSel").val();
	obj.picType = $("#picTypeSel").val();
	var picGjz = new Array();
	$("#KeywordTips a").each(function() {
		picGjz.push($(this).text());
	});
	if(null!=$("#Keywords").val()&&undefined!=$("#Keywords").val()&&""!=$("#Keywords").val()){
		picGjz.push($("#Keywords").val());
		$("#KeywordTips").append('<a>' + $("#Keywords").val() + '<i class="ico ico17"></i></a>');
		$("#Keywords").val("");
	}
	obj.picGjz = picGjz.join("@");
	textObjArray[fileId] = obj;
	initTextareaTip();*/
}

/**
 * 绑定关键词添加
 */
function initKeywordsTips() {
	$("#Keywords").on("keyup", function(e) {
		var ev = e;
		if (ev.keyCode == 13 && $(this).val()) {
			$("#KeywordTips").append('<a>' + $(this).val() + '<i class="ico ico17"></i></a>');
			$(this).val("");
			templateDeal();
		}
	})
	$("#KeywordTips").on("click", ".ico", function() {
		$(this).parent("a").remove();
		templateDeal();
	})
}

/**
 * 保存修改，保存临时图片表
 */
function saveEditPic() {
	//表单验证
	AlertBox.alertNoClose('<img src="../../images/loading.gif"><p>图片上传中……</p>');
	// 保存数据
	var listData = [];
	for (var i = 0; i < textObjArray.length; i++) {
		var key = textObjArray[i];
		//console.log(textObjArray[key]);
		var picMc = textObjArray[key].picMc;
		if (picMc == undefined || picMc.trim().length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片标题设置！");
			return;
		}
		listData.push(textObjArray[key]);
	}
	$("#savePic").attr("onclick", "");
	$("#savePic").css("background", "#c0c1c0");
	// 上传图片
	funFileUpload(fileArray[0]);
	$.ajax({
		url : "/photo/temporaryPic/addTempPic",
		dataType : "json",
		async : false,
		data : JSON.stringify(listData),
		contentType : "application/json;charset=UTF-8",
		type : "post",
		success : function(data) {
			AlertBox.hide();
			AlertBox.revert();
			if (data.status) {
				textObjArray = [];
				AlertBox.alert("保存修改成功！");
				AlertBox.onHide(function(){
					$('html').animate( {scrollTop: 0}, 500);
				});
			} else {
				AlertBox.alert('保存修改失败，请确认保存修改信息！');
			}
			$("#savePic").attr("onclick", "saveEditPic()");
			$("#savePic").css("background", "#d53638");
			//findPicsBySession();
		},
		error : function() {

		}
	});

}
//执行上传
function picUpload(){
	for (var i = 0; i < textObjArray.length; i++) {
		var key = textObjArray[i];
		console.log(textObjArray[key]);
		var picMc = textObjArray[key].picMc;
		var picSyz = textObjArray[key].picSyz;
		var picSysj = textObjArray[key].picSysj;
		var picZsm = textObjArray[key].picZsm;
		if (picMc == undefined || picMc.trim().length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片标题设置！");
			return;
		}
		/*if (picSysj == undefined || picSysj ==null || picSysj.length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片拍摄时间设置！");
			return;
		}*/
		if (picSyz == undefined || picSyz.trim().length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片摄影作者设置！");
			return;
		}
		if (picZsm == undefined || picZsm.trim().length == 0) {
			AlertBox.revert();
			AlertBox.alert("未完成全部图片主说明设置！");
			return;
		}
	}
	
	var upload= new FileUploadPlug();
	upload.init(fileArray,"/photo/uploadpic/upload");
	$(".up_img_jd_s").show();
	upload.sureUploadPic();
	$("#onUp").hide();
	$("#goUp").show();
}

/**
 * 存为模板
 */
function saveTempText(){
	var html='';
	html+='<div style="padding: 25px;" >'  
		+ '<div style="width:500px;text-align:left;"><p>模板名称：</p></div>'
		+ '<div style="width:500px;text-align:left;padding-top:12px;">'
		+ '<input placeholder="请输入模板名称" class="text" style="width:98%;padding: 1%;border:1px solid #ddd" id="textName">'
		+ '</div>'
		+ "</div>";
	AlertBox.confirmIs(html,'存为模板', 
			function(){
				AlertBox.hide();
				var fileId = $("#UploadImages").find(".active").attr("fileId");
				var obj = {};
				if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
					obj = textObjArray[fileId];
				}
				var textName=$("#textName").val();
				var newObj={};
				newObj.name=textName;
				newObj.title=$("#Title").val();;
				newObj.mainRemark=$("#MainExplain").val();;
				newObj.secondRemark=$("#MinorExplain").val();;
				newObj.picDd=$("#Adress").val();;
				newObj.picSyz=$("#Author").val();;
				var picSysj=$("#CreateTime").val();
				if(picSysj!= undefined && picSysj!=null||picSysj.trim().length!=0){
					 var date = eval('new Date(' + picSysj.replace(/\d+(?=-[^-]+$)/,    
		                     function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');    
					newObj.picPssj=date;//new Date(obj.picSysj);
				}else{
					newObj.picSysj=picSysj;
				}
				newObj.picMj=$("#picMjSel").val();;
				newObj.picType=$("#picTypeSel").val();
				
				var picGjz = new Array();
				$("#KeywordTips a").each(function() {
					picGjz.push($(this).text());
				});
				if(null!=$("#Keywords").val()&&undefined!=$("#Keywords").val()&&""!=$("#Keywords").val()){
					picGjz.push($("#Keywords").val());
					$("#KeywordTips").append('<a>' + $("#Keywords").val() + '<i class="ico ico17"></i></a>');
					$("#Keywords").val("");
				}
				newObj.picGjz = picGjz.join("@");
				newObj.typeOne = $("#picType1").val();
				newObj.typeTwo = $("#picType2").val();
				newObj.typeThree = $("#picType3").val();
				newObj.typeFour = $("#picType4").val();
				newObj.typeFive = $("#picType5").val();
				//console.log(newObj);
				$.ajax({
					url : "/photo/textTemplate/findByTemName", 
					dataType : "json", 
					async : false,
					data : {tempName:textName},
					type : "post",
					success : function(data) {
						if(null==data||undefined==data||""==data.resultInfo){
							 insertTemp(newObj);
						}else{
							
							AlertBox.confirm('<div style="padding: 0px 80px 20px;">该模板名('+textName+')已存在,是否替换？</div>', "", replaceTempName, {oldId:data.resultInfo.id,newObj:newObj});
						}
					},
					error : function() {
						AlertBox.alert("系统错误！");
					}
				});

			},
			function(){
				AlertBox.hide();
			},{sureText:"保存",closeText:"取消"})
}

/**
 * 替换模板
 * @param oldId 被替换的id
 * @param newObj 替换的对象
 */
var timer=null;
function replaceTempName(obj){
	obj.newObj.oldId=obj.oldId;
	$.ajax({
		url : "/photo/textTemplate/replaceTemp", 
		dataType : "json", 
		async : false,
		data : obj.newObj,
		type : "post",
		success : function(data) {
			AlertBox.alert(data.resultInfo);
			selectText();
			clearTimeout(timer);
			timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
				AlertBox.hide();
			}, 1500);
		},
		error : function() {
			AlertBox.alert("系统错误！");
		}
	});
}
/**
 * 增加模板
 * @param newObj
 */
function insertTemp(newObj){
	$.ajax({
		url : "/photo/textTemplate/add", 
		dataType : "json", 
		async : true,
		data : newObj,
		type : "post",
		success : function(addData) {
			if(addData.resultStatus){
				AlertBox.alert("保存成功！");
				selectText();
			}else{
				AlertBox.alert("保存失败，请稍后重试！");
			}
			clearTimeout(timer);
			timer = setTimeout(function () { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔
				AlertBox.hide();
			}, 1500);
		},
		error : function() {
			AlertBox.alert("系统错误！");
		}
	});
}

/**
 * 获取当前用户的临时上传列表
 */
function findPicsBySession() {
	$.ajax({
		url : "/photo/temporaryPic/loadTempPic",
		dataType : "json",
		async : true,
		data : {},
		type : "post",
		success : function(data) {
			var items = $("#UploadImages").children(".pic_item");
			$.each(items, function(k, v) {
				$(this).remove();
			})
			if(data!=null && data.length>0){
				AlertBox.confirmIs(
				'<div style="padding: 0px 80px 20px;">有'+data.length+'张图片未上传，是否选择继续上传？</div>',null, 
				function(){
					AlertBox.hide();
					$.each(data, function(key, val) {
						var item = $('<li class="pic_item picn" fileId=' + val.picXh + ' fileIdx="' + val.id + '">' + '<div class="upload_img"><div class="ed_sel_ok"><i class="ico ico20"></i></div></div><img class="ed_sel_del" src="../../images/close.png" />' + '</li>');
						item.find(".upload_img").append('<img src="' + PICURI+ val.picYtlj + '" />');
						$("#UploadFile").parents(".up_adimg_bg").before(item);
						textObjArray.push(val.picXh);
						textObjArray[val.picXh] = val;
					});
					limitBehaviour();
					$(".up_img_btn").show();
				},
				function(){
					AlertBox.hide();
					textObjArray=[];
					$.ajax({
						url : "/photo/temporaryPic/deleteTempPic",
						dataType : "json",
						async : true,
						data : {},
						type : "post",
						success : function(data) {
							
						},
						error : function() {
						}
					});
					
				},{sureText:"是",closeText:"否"})
			}else{
				initPicTypes("图库", 1);
			}
			
		},
		error : function() {

		}
	});
}

/**
 * 上传文件--临时文件上传tempPic至pic
 */
function saveToUpload() {
	//判断字段是否发生了改变
	var changeObj =compareData();
	if(changeObj.isChange ){
		AlertBox.alert("'"+changeObj.message+"'发生了改变,请先保存后上传!");
		return;
	}
	AlertBox.alertNoClose('<img src="../../images/loading.gif"><p>图片上传中……</p>');
	$("#saveToUpload").attr("onclick", "");
	$("#saveToUpload").css("background", "#c0c1c0");
	$.ajax({
		url : "/photo/photoPic/addPics",
		dataType : "json",
		async : true,
		data : {},
		type : "post",
		success : function(data) {
			AlertBox.hide();
			AlertBox.revert();
			if (data.resultStatus) {
				AlertBox.confirm('<div style="padding: 0px 80px 20px;">' + data.resultInfo + '</div>', "", reloadThis, "");
			}
		},
		error : function() {
		}
	});
}

/**
 * 重新加载当前页
 */
function reloadThis() {
	window.location.reload();
	AlertBox.hide();
}

/**
 * 重置数据，置空
 */
function resetData() {
	$("#TextTemplate").empty();
	$("#TextTemplate").hide();
	$(".up_img_btn").hide();
	$("#Title").val("");
	$("#MainExplain").val("");
	$("#MinorExplain").val("");
	$("#Adress").val("");
	$("#Author").val("");
	$("#CreateTime").val("");
	$("#picTypesSel #picType1").parent().nextAll().remove();
	$("#picType1").val("");
	$("#picMjSel").val();
	$("#picTypeSel").val();
	$("#KeywordTips").empty();
}

/**
 * 用于生成uuid
 * 
 * @returns
 */
function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
/**
 * 生成uuid
 * 
 * @returns {String}
 */
function guid() {
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * 单文件上传
 */
var funFileUpload = function(fileid, onsuccess, onerror, onpause) {
	//console.log("reupload1" + fileid);
	var file = fileArray[fileid], now = performance.now();
	if (!fileid || !file)
		return;
	//console.log("reupload2" + fileid);
	onsuccess = onsuccess || function() {
		//console.log("reupload3" + fileid);
		funFileUpload(fileArray[0]);
	};

	onerror = onerror || function() {
		//console.log("reupload4" + fileid);
		funFileUpload(fileArray[fileArray.indexOf(fileid) + 1]);
	};
	onpause = onpause || function() {
		//console.log("reupload5" + fileid);
		funFileUpload(fileArray[fileArray.indexOf(fileid) + 1]);
	};
	if (file.flagPause == true) {
		//console.log("reupload6" + fileid);
		onpause.call(fileid);
		return;
	}
	//console.log("reupload7" + fileid);
	// objStateElement.wait(fileid);
	// 文件分割上传
	// 文件大小和分割起点
	// 注释的是本地存储实现
	var size = file.size, start = localStorage[fileid] * 1 || 0;
	// start = $("filelist_" + fileid).filesize;
	//console.log("start1：" + start);
	if (size == start) {
		// 已经传过了
		fileArray.shift();
		if (delete fileArray[fileid])
			//console.log(fileArray.join() + "---上传成功");
		// objStateElement.success(fileid, now);
		// 回调
		onsuccess.call(fileid, {});
		localStorage.clear();
		return;
	}

	var funFileSize = function() {
		if (file.flagPause == true) {
			onpause.call(fileid);
			return;
		}
		var data = new FormData();
		var picXh = textObjArray[fileid].picXh;
		var name = file.name;
		var fileType = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
		var fileName = picXh + "." + fileType
		data.append("fileName", encodeURIComponent(fileName));
		data.append("fileid", fileid);
		data.append("myFile", file.slice(start, start + fileSplitSize));
		data.append("start", start + "");
		data.append("flag",(start + fileSplitSize)>=size?"COMPLETE":"UPLOAD");
		var p = "?name=" + encodeURIComponent(file.name) + "&fileid" + fileid + "&start" + start;
		// XMLHttpRequest 2.0 请求
		var xhr = new XMLHttpRequest();
		xhr.open("post", "/photo/temporaryPic/upload", false);
		// .setRequestHeader("X_Requested_With",
		// location.href.split("/")[5].replace(/[^a-z]+/g,"$"));
		// xhr.setRequestHeader("Content-type", "multipart/form-data");
		// 上传进度中
		xhr.upload.addEventListener("progress", function(e) {
			// objStateElement.backgroundSize(fileid, (e.loaded + start) / size
			// * 100);
		}, false);
		// ajax成功后
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					try {
						var json = JSON.parse(xhr.responseText);
						//console.log(json);
						temp = 2;
					} catch (e) {
						// objStateElement.error(fileid);
						return;
					}
					// var json = JSON.parse(xhr.responseText);
					if (!json || !json.succ) {
						// objStateElement.error(fileid);
						onerror.call(fileid, json);
						return;
					}

					if (start + fileSplitSize >= size) {
						// 超出，说明全部分割上传完毕
						// 上传队列中清除者一项
						fileArray.shift();
						if (delete fileArray[fileid])
							//console.log(fileArray.join() + "---上传成功");
						// objStateElement.success(fileid, now);
						// 回调
						onsuccess.call(fileid, json);
						filePath = json.data.savePath;
						var _EXIF = json.data.exif;
						//console.log(json.data);
						textObjArray[fileid].picYtlj = filePath;
						if (_EXIF != undefined) {
							textObjArray[fileid].picFbl = _EXIF.picFbl;
							textObjArray[fileid].picXjxh = _EXIF.picXjxh;
							textObjArray[fileid].picGqz = _EXIF.picGqz;
							textObjArray[fileid].picBgsj = _EXIF.picBgsj;
							textObjArray[fileid].picJj = _EXIF.picJj;
							textObjArray[fileid].picIso = _EXIF.picIso;
						}
						localStorage.clear();
					} else {
						// 尚未完全上传完毕
						// 改变下一部分文件的起点位置
						start += fileSplitSize;
						// 存储上传成功的文件点，以便出现意外的时候，下次可以断点续传
						localStorage.setItem(fileid, start + "");
						// 上传下一个分割文件
						funFileSize();

					}
				} else {
					// objStateElement.error(fileid);
				}
			}
		};

		xhr.send(data);
	};
	// 文件分割上传开始
	funFileSize();
};

/**
 * 日期初始化
 */
function initDatePicker() {
	laydate.render({
		elem: '#CreateTime' //开始日期
	});
}

/**
 * 加载分类
 */
function initPicTypes(pname, picType) {
	if (pname.length == 0) {
		$("#picTypesSel #picType" + picType).parent().nextAll().remove();
		$("#picTypesSel #picType" + picType).parent().remove();
		return;
	}
	$.ajax({
		url : "/photo/narClassify/loadEntitysByPname",
		dataType : "json",
		async : false,
		data : {
			pname : pname
		},
		type : "post",
		success : function(data) {
			if (data.length != 0 || picType == 1) {
				var html = '<div class="img_sel"><select class="sct" id="picType' + picType + '">';
				html += '<option selected="selected" value="其他">其他</option>';
				$.each(data, function(i, val) {
					
					if(val.narName=="全部图片"||val.narName=="其他"){
						
					}else{
						html += '<option value="' + val.narName + '">' + val.narName + '</option>';
					}
				});
				html += '</select></div>';
				$("#picTypesSel").append(html);
				$("#picTypesSel #picType" + picType).change(function() {
					var pname = $('#picType' + picType).val();
					$("#picTypesSel #picType" + picType).parent().nextAll().remove();
					initPicTypes(pname, picType + 1);
					templateDeal();
				});
			} else {
				$("#picTypesSel #picType" + picType).parent().nextAll().remove();
				$("#picTypesSel #picType" + picType).parent().remove();
			}
		},
		error : function() {
		}
	});
}

/**
 * 选择文字模板
 */
function selectText() {
	var obj = {};
	obj.orderBy = "id";
	obj.pageSize = 50;
	$.ajax({
		url : "/photo/textTemplate/findLyBySubordinate",
		dataType : "json",
		async : true,
		data : obj,
		type : "post",
		success : function(data) {
			var html = '<option value="">选择文字模板</option>';
			if (data.resultStatus) {
				$.each(data.resultData.rows, function(i, val) {
					html += '<option value="' + val.id + '">' + val.name + '</option>';
				});
			} else {
				AlertBox.alert(data.resultInfo);
			}
			$("#selectText").html(html);
		},
		error : function() {
		}
	});
}




/**
 * 初始化输入框的值
 */
function initInputValue(){
	$("#Adress").val("重庆");
	$("#CreateTime").val(dateFtt("yyyy-MM-dd", new Date()));
}

/**
 * 更新图片详细信息
 * obj 更新图片对象
 */
function findPicDetail(id){
	var obj=null;
	$.ajax({
		url : "/photo/temporaryPic/getTempPicById", 
		dataType : "json", 
		async : false,
		data : {id:id},
		type : "post",
		success : function(addData) {
			obj=addData;
		},
		error : function() {
		}
	});
	return obj;
}

/**
 * 显示历史记录框
 */
function selectAuthorRecordShow(){
	var data=readFromCookie();
	$(".authorRecord div").remove();
	$.each(data,function(indxe, item){
		$(".authorRecord").prepend('<div onclick="writeIntoInput(\''+item+'\')"><a  class="record_info_font"> '+item+'</a></div>');
	});
	$(".authorRecord").show();
}


function writeIntoInput(item){
	$("#Author").val(item);
	selectAuthorRecordHide();
}
/**
 * 隐藏历史框
 */
function selectAuthorRecordHide(){
	$(".authorRecord").hide();
}

/**
 * 向cookie写入数据
 * @param _value
 */
function writeIntoCookie(_value){
	if(_value==null||_value==undefined||''==_value||''==$.trim(_value)){
		return;
	}
	var ishave=false;
	var ard= $.cookie('authorRecord');
	if(ard==null){
		$.cookie('authorRecord', _value, { expires:  365  });
		return;
	}else{
		var arrayArd= ard.split("@");
		$.each(arrayArd,function(index,item){
			if(item==_value){
				ishave=true;
			}
		});
		if(ishave)
			return;
		if(arrayArd.length>=10){
			ard=ard.substring(ard.indexOf("@")+1,ard.length);
		}
		$.cookie('authorRecord', ard+"@"+_value, { expires:  365  });
	}
}

/**
 * 失去焦点触发的事件
 */
function authorFocusout(){
	writeIntoCookie($("#Author").val());
    setTimeout(function(){  
        // input框失去焦点，隐藏下拉框  
    	selectAuthorRecordHide();
    }, 200);  
    templateDeal() ;
}
/**
 * 读取cookie数据返回数组
 * @returns
 */
function readFromCookie(){
	var ard= $.cookie('authorRecord');
	if(ard==null||ard==undefined){
		 return [];
	}else{
		return ard.split("@");
	}
	
}
/**
 * 初始化作者历史记录事件
 */
function initAuthorBur(){
	$(".btn_clean").click(function(){
		$.cookie('authorRecord', null, { expires:  365  });
	});
	$("#Author").focusin(selectAuthorRecordShow);
	$("#Author").focusout(authorFocusout);
	
}
/**
 * 初始化右键
 */
function initRightKeyMenu(){
	var el = document.getElementById("picLi");
	var oMenu = document.getElementById("menu");
	el.oncontextmenu = function(e) {
		//左键--button属性=1，右键button属性=2
		if(e.button == 2) {
			e.preventDefault();
			if($("input[name='qcfsj']:checked").length<=0){
				return false;
			}
			
			var data= getMBSelect();
			if(data.length>0){
				var _x = e.clientX,
					_y = e.clientY;
				oMenu.style.display = "block";
				oMenu.style.left = _x + "px";
				oMenu.style.top = _y + "px";
				$("#menu ul li").remove();
				$.each(data,function(index,item){
					$("#menu ul").append("<li><a href='javascript:void(0)' onclick='selectThisMb("+item.id+",\""+item.name+"\")'>"+item.name+"</a></li>");
				});
			}else{
				AlertBox.alert("无模板数据!");
			}
		} 
	}
	$(document).bind("click",function(e){
        //id为menu的是菜单，id为open的是打开菜单的按钮            
        if($(e.target).closest("#menu").length == 0){
        //点击id为menu之外且id不是不是open，则触发
           $("#menu").hide();
        }
    });
}

/**
 * 获取模板数据
 * @returns {Array}
 */
function getMBSelect() {
	var obj = {};
	obj.orderBy = "id";
	obj.pageSize = 50;
	var resultObj=[];
	$.ajax({
		url : "/photo/textTemplate/findLyBySubordinate",
		dataType : "json",
		async : false,
		data : obj,
		type : "post",
		success : function(data) {
			if (data.resultStatus) {
				resultObj=data.resultData.rows;
			} 
		},
		error : function() {
		}
	});
	return resultObj;
}

function selectThisMb(id,name){
	$.ajax({
		url : "/photo/textTemplate/findById",
		dataType : "json",
		async : true,
		data : {
			id : id
		},
		type : "post",
		success : function(data) {
		
/*				if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
				obj = textObjArray[fileId];
			}*/
			$("input[name='qcfsj']:checked").each(function(i){
				var obj ={}; 
				obj = {};
				obj.picMc = data.title;
				obj.picZsm = data.mainRemark;
				obj.picFsm = data.secondRemark;
				obj.picDd = data.picDd;
				obj.picSyz = data.picSyz;
				obj.picSysj = data.picPssj;
				obj.typeOne = data.typeOne;
				obj.typeTwo = data.typeTwo;
				obj.typeThree = data.typeThree;
				obj.typeFour = data.typeFour;
				obj.typeFive = data.typeFive;
				obj.picMj = data.picMj;
				obj.picType = data.picType;
				obj.picGjz = data.picGjz;
				obj.picXh = textObjArray[$(this).attr("fileId")].picXh;
				obj.picFiletype = textObjArray[$(this).attr("fileId")].picFiletype;
				obj.picFilesize = textObjArray[$(this).attr("fileId")].picFilesize;
				textObjArray[$(this).attr("fileId")]=obj;
			 });
			
			var fileId = $("#UploadImages").find(".active").attr("fileId");
			var fzobj = {};
			if (textObjArray[fileId] != undefined && textObjArray[fileId] != null) {
				fzobj = textObjArray[fileId];
				objToData(fzobj);
				initTextareaTip();
			}else{
				resetData();
			}
		},
		error : function() {
		}
	});
	 $("#menu").hide();
}


function goUp(){
	$("#onUp").hide();
	$("#goUp").show();
	 location.reload();
}
