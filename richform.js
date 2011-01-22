(function($) {
	function RichSelect(el) {
		var menubox = el.find(".menubox");
		var menutext = menubox.children(".menutext");
		var richopt = menubox.find(".richopt");
		var menu = el.find(".menu");
		menu = menu.size() ? menu : null;
		var valstore = menubox.find(".valstore");
		valstore = valstore.size() ? valstore : null;
		return {
			menu : menu,
			valstore : valstore,
			removeval : menubox.find(".removeval"),
			name : (valstore ? valstore.attr("name") : menu.attr("name")),
			getVal : function() {
				var val;
				if(valstore) {
					val = valstore.val();
				}
				else {
					var option = menu.children("option:selected");
					if(option.size()) val = option.val();
				}
				return val;
			},
			updateMenubox : function(option) {
				option = option || menu.children("option:selected");
				if(option.hasClass("richopt")) {
					menutext.text(": ");
					richopt.removeClass("jshidden");
					menubox.removeClass("jshidden");
					var inputs = richopt.find("input");
					if(inputs.size()) {
						inputs.first().select();
					}
				}
				else {
					if(!richopt.hasClass("jshidden")) richopt.addClass("jshidden");
					menutext.text(": " + option.text());
					menubox.removeClass("jshidden");
				}
			},
			updateMenu : function() {
				if(!menu) return;
				var option;
				var found = false;
				if(valstore) {
					menu.children().each(function(i, el) {
						option = $(el);
						if(option.val() === valstore.val()) {
							option.attr("selected", "selected");
							found = true;
							return false;
						}
					});
				}
				else {
					option = menu.children("option:selected");
					if(option.size()) found = true;
				}
				if(found) this.updateMenubox(option);
			},
			updateValstore : function() {
				var option = menu.children("option:selected");
				if(option.size()) {
					if(valstore) valstore.val(option.val());
					this.updateMenubox(option);
				}
			},
			removeVal : function() {
				menubox.addClass("jshidden");
				menutext.text("");
				if(valstore) valstore.val("");
				if(menu) menu.get(0).selectedIndex = -1;
			},
			showMenu : function() {
				var el = menu ? menu : menubox;
				el.toggleClass("jshidden");
				return !el.hasClass("jshidden");
			}
		}
	}
	$(function() {
		var selects = [];
		$(".richselect").each(function(i, el) {
			el = $(el); // jQuerify
			var select = RichSelect(el);
			selects.push(select);
			el.click(function(e) {
				var target = $(e.target);
				if(!(target.is(".showmenu") || target.is(".menutext") || target.is(".richselect"))) {
					return;
				}
				var visible = select.showMenu();
				if(!visible && target.is(".showmenu"))
				{
					e.preventDefault();
				}
			});
			select.menu.change(function() {
				select.updateValstore();
				$(this).toggleClass("jshidden");
			});
			select.valstore.change(function() {
				select.updateMenu();
			});
			select.removeval.click(function() {
				select.removeVal();
			});
		});
	});
})(jQuery);