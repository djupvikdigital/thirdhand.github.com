(function($) {
	function hide(els) {
		// Hide elements that are to be shown on events
		// els is array
		if(typeof els === "object" && els instanceof Array) {
			for(var i = 0; i < els.length; i++) {
				if(els[i] && els[i].addClass) els[i].addClass("jshidden");
			}
		}
		else if(els && els.addClass) els.addClass("jshidden"); // els is single element
		else return false; // fail
		return true;
	}
	function RichSelect(el) {
		// Object for rich menu functionality
		var menubox = el.find(".menubox");
		var menutext = menubox.prepend("<span />");
		var richopt = menubox.find(".richopt");
		var menu = el.find(".menu");
		menu = menu.size() ? menu : null; // Check for existence of menu
		hide([menubox, richopt, menu]);
		var valstore = menubox.find(".valstore");
		valstore = valstore.size() ? valstore : null; // Check for existence of valstore
		// Public object properties and methods
		return {
			menu : menu,
			menubox: menubox,
			valstore : valstore,
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
				// Shows selected option. If option is a richopt show that element.
				option = option || menu.children("option:selected");
				if(option.hasClass("richopt")) {
					richopt.removeClass("jshidden");
					menubox.removeClass("jshidden");
					var inputs = richopt.find("input");
					if(inputs.size()) {
						inputs.first().select();
					}
				}
				else {
					if(!richopt.hasClass("jshidden")) richopt.addClass("jshidden");
					menutext.text(option.text());
					menubox.removeClass("jshidden");
				}
			},
			updateMenu : function() {
				// Update selected menu option from valstore value
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
				// Update valstore from selected menu option
				var option = menu.children("option:selected");
				if(option.size()) {
					if(valstore) valstore.val(option.val());
					this.updateMenubox(option);
				}
			},
			removeVal : function() {
				// Remove value and collapse menu button to initial form
				menubox.addClass("jshidden");
				menutext.text("");
				if(valstore) valstore.val("");
				if(menu) menu.get(0).selectedIndex = -1;
			},
			showMenu : function() {
				// Show or hide menu
				var el = menu ? menu : menubox;
				el.toggleClass("jshidden");
				return !el.hasClass("jshidden");
			}
		}
	}
	$(function() {
		// Add js styles
		$("head").append($("<link />", {
			rel : "Stylesheet",
			type : "text/css",
			href : "js.css"
		}));
		var selects = [];
		$(".richselect").each(function(i, el) {
			el = $(el); // jQuerify
			var select = RichSelect(el);
			selects.push(select);
			// Event handler for menu button
			el.click(function(e) {
				var target = $(e.target);
				if(!(target.is(".showmenu") || target.is(".menutext") || target.is(".richselect"))) {
					return;
				}
				var visible = select.showMenu();
				if(!visible && target.is(".showmenu")) {
					e.preventDefault();
				}
			});
			// Make into multiline select
			select.menu.attr("size", select.menu.children().size());
			// Event handlers keep menu and valstore in sync
			select.menu.change(function() {
				select.updateValstore();
				$(this).toggleClass("jshidden");
			});
			select.valstore.change(function() {
				select.updateMenu();
			});
			// Add remove button
			select.menubox.append($("<input />", {
				type : "button",
				value : "&lt;",
				click : function() {
					select.removeVal();
				}
			}));
		});
	});
})(jQuery);