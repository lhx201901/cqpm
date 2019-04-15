/**
 * 分页
 */
function paging(loadPage) {
	if (allPage > 1 && allPage!=currentPage) {
		$('.page-next').addClass('active');
		$('.page-last').addClass('active');
	}
	$('.page-all').html(allPage);
	$('.page-current').html(currentPage);
	//上一页、下一页
	$('.page-operate').off("click").on("click",function(){
		
		if (!$(this).hasClass('active')) {
			return;
		}
		if ($(this).hasClass('page-first')) {
			$('.page-first').removeClass('active');
			$('.page-pre').removeClass('active');
			currentPage = 1;
			if (allPage > 1) {
				$('.page-next').addClass('active');
				$('.page-last').addClass('active');
			}
			$('.page-current').html(currentPage);
			loadPage();
		}
		if ($(this).hasClass('page-pre')) {
			if (currentPage >= 2) {
				currentPage -= 1;
				$('.page-current').html(currentPage);
			}

			if (allPage > 1 && currentPage !== allPage) {
				$('.page-next').addClass('active');
				$('.page-last').addClass('active');
			}

			if (currentPage === 1) {
				$('.page-first').removeClass('active');
				$('.page-pre').removeClass('active');
			}
			loadPage();
		}
		if ($(this).hasClass('page-next')) {
			if (currentPage <= (allPage - 1)) {
				currentPage =(parseFloat(currentPage)+1);
				$('.page-current').html(currentPage);
			}
			if (allPage > 1 && currentPage !== 1) {
				$('.page-first').addClass('active');
				$('.page-pre').addClass('active');
			}
			if (currentPage === allPage) {
				$('.page-next').removeClass('active');
				$('.page-last').removeClass('active');
			}
			loadPage();
		}
		if ($(this).hasClass('page-last')) {
			$('.page-next').removeClass('active');
			$('.page-last').removeClass('active');
			currentPage = allPage;
			if (allPage > 1) {
				$('.page-first').addClass('active');
				$('.page-pre').addClass('active');
			}
			$('.page-current').html(currentPage);
			loadPage();
		}
	});
	//go
	$('.go').off("click").on("click",function() {
		var pageText=$("#pageText").val();
		if(pageText>allPage || pageText==0){
			AlertBox.alert("输入页数不存在！");
		}else if(pageText.trim().length==0){
			AlertBox.alert("输入页数为空！");
		}else{
			currentPage=pageText;
			$('.page-current').html(currentPage);
			if (allPage > 1 && currentPage !== 1) {
				$('.page-first').addClass('active');
				$('.page-pre').addClass('active');
			}
			if (currentPage === 1) {
				$('.page-first').removeClass('active');
				$('.page-pre').removeClass('active');
			}
			if (currentPage === allPage) {
				$('.page-next').removeClass('active');
				$('.page-last').removeClass('active');
			}
			loadPage();
		}
		
	});
}
