(function($) {

	function esayTable(dom, options) {
		this.container = dom;
		this.options = $.extend(true, {}, options);
		this.init(true);
	}
	
	esayTable.prototype.init = function(isFirst){
		this.createTable();
		if(isFirst){
			this.bindEvent();
		}
	}
	
	esayTable.prototype.setData = function(data){
		this.options.data = data;
		this.init();
	}

	esayTable.prototype.createTable = function() {
		var html = '<table class="caiwu_li">';
		html += this.createHeader();
		html += this.createRow();
		html += '</table>';
		this.container.html(html);
	}
	
	esayTable.prototype.bindEvent = function(){
		var self = this;
		var click = this.options.rowClick;
		var doubleClick = this.options.rowDoubleClick;
		this.container.on("click", "input[type=checkbox]", function(e){
			var ev = e || event;
			ev.stopPropagation();
		}).on("dblclick", "input[type=checkbox]", function(e){
			var ev = e || event;
			ev.stopPropagation();
		})
		this.container.on("click", "tr.esay_table_row", function(e){
			var ev = e || event;
			if($(ev.target).hasClass("stop_row_click")) return;
			var data = self.options.data;
			var idx = $(this).attr("idx")
			if(click) click(data[idx]);
		})
		this.container.on("dblclick", "tr.esay_table_row", function(e){
			var ev = e || event;
			if($(ev.target).hasClass("stop_row_click")) return;
			var data = self.options.data;
			var idx = $(this).attr("idx")
			if(doubleClick) doubleClick(data[idx]);
		})
		this.container.on("change", "input.all_checkbox", function(){
			var val = this.checked;
			self.container.find("input.row_checkbox").each(function(){
				this.checked = val;
			})
		})
		this.container.on("change", "input.row_checkbox", function(){
			var data = self.options.data;
			var allChecked = self.container.find("input.all_checkbox");
			if(allChecked){
				allChecked[0].checked = (self.getCheckedItem().length === data.length)
			}
		})
	}
	
	esayTable.prototype.getCheckedItem = function(){
		var data = this.options.data;
		var checkedItems = [];
		this.container.find("input.row_checkbox:checked").each(function(){
			checkedItems.push(data[this.value])
		})
		return checkedItems;
	}

	esayTable.prototype.createRow = function() {
		var data = this.options.data;
		var columns = this.options.columns;
		var isHideCheckbox = this.options.hideCheckbox;
		var html = "";
		if(data) {
			$.each(data, function(k, v) {
				html += "<tr idx="+k+" class='esay_table_row "+(k%2 == 1 ? "even" : "")+"'>";
				if(!isHideCheckbox) {
					html += '<td><input class="row_checkbox" type="checkbox" value='+k+'></td>';
				}
				$.each(columns, function(key, val) {
					html += '<td style="text-align: '+(val.align || "left")+'">';
					html += val.render ? val.render(v) : (val.field ? v[val.field] : "");
					html += '</td>';
				});
				html += '</tr>';
			});
		}
		if(!html){
			html = "<tr><td class='table_empty_tip' colspan="+ columns.length +" >"+(this.options.emptyTip || "暂无相关数据")+"</td></tr>"
		}
		return html;
	}

	esayTable.prototype.createHeader = function() {
		var columns = this.options.columns;
		var isHideCheckbox = this.options.hideCheckbox;
		var html = "";
		if(columns) {
			html += "<tr>";
			if(!isHideCheckbox) {
				html += '<th width="80px"><input class="all_checkbox" type="checkbox"> 全选</th>';
			}
			$.each(columns, function(key, val) {
				html += '<th style="text-align: '+(val.align || "left")+'" width="' + (val.width || "auto") + '">';
				html += val.title || ("列" + key);
				html += '</th>';
			})
			html += '</tr>';
		}
		return html;
	}

	$.fn.easyTable = function(opt) {
		return new esayTable(this, opt || {});
	}

})(jQuery)