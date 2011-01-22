(function($) {
	function changeMultiple(method, arg) {
		// Apply the same method and arg to multiple objects
		return function() {
			var args = arguments;
			if(!args.length) return false; // no args
			for(var i = 0; i < args.length; i++) {
				if(args[i] && args[i][method]) args[i][method](arg);
			}
			return true;
		}
	}
	var show = changeMultiple("removeClass", "jshidden");
	var hide = changeMultiple("addClass", "jshidden");
	var toggle = changeMultiple("toggleClass", "jshidden");
	function visible(el) {
		return !el.hasClass("jshidden");
	}
	function RichSelect(el) {
		// Object for rich menu functionality
		var showmenu = (function() {
			// Object for manipulating showmenu
			var label = el.find(".showmenu");
			var labeltext;
			function init() {
				labeltext = label.html();
				labeltext = labeltext.slice(0, labeltext.indexOf("<")); // Select text until first HTML element
			}
			return {
				addColon : function() {
					// Show colon in label when expanded
					init();
					if(labeltext.indexOf(":") == -1) {
						label.contents().first().remove(); // Remove text node
						label.prepend(labeltext.trim() + ":");
					}
				},
				removeColon : function() {
					// Remove colon in label when collapsed
					init();
					label.contents().first().remove(); // Remove text node
					label.prepend(labeltext.replace(":", "")); // Add same text without colon
				}
			}
		})();
		showmenu.removeColon();
		var menubox = el.find(".menubox");
		// Add empty element for holding option text
		menubox.prepend("<span />");
		var menutext = menubox.children().first();
		var richopt = menubox.find(".richopt");
		var menu = el.find(".menu");
		menu = menu.size() ? menu : null; // Check for existence of menu
		hide(menubox, richopt, menu);
		var valstore = menubox.find(".valstore");
		valstore = valstore.size() ? valstore : null; // Check for existence of valstore
		// Public object properties and methods (pretty much everything by now)
		return {
			menu : menu,
			menubox : menubox,
			menutext : menutext,
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
				showmenu.addColon();
				option = option || menu.children("option:selected");
				if(option.hasClass("richopt")) {
					menutext.text("");
					show(richopt, menubox);
					var inputs = richopt.find("input");
					// Select form element for added usability
					if(inputs.size()) {
						inputs.first().select();
					}
				}
				else {
					if(!richopt.hasClass("jshidden")) show(richopt);
					menutext.text(option.text());
					show(menubox);
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
				showmenu.removeColon();
				hide(menubox);
				menutext.text("");
				if(valstore) valstore.val("");
				if(menu) menu.get(0).selectedIndex = -1;
			},
			showMenu : function() {
				// Show or hide menu
				var el = menu ? menu : menubox;
				toggle(el);
				return visible(el);
			}
		}
	}
	$(function() {
		// init function
		// Add js styles
		$("head").append($("<link />", {
			rel : "Stylesheet",
			type : "text/css",
			href : "js.css"
		}));
		// Array holding all rich menus (currently not used, maybe convenient later - or not)
		var selects = [];
		// Instantiate objects and add event handlers (possibly event handlers should be added inside RichSelect?)
		$(".richselect").each(function(i, el) {
			el = $(el); // jQuerify
			var select = RichSelect(el);
			selects.push(select);
			// Event handler for menu button
			el.click(function(e) {
				var target = $(e.target);
				if(!(target.is(".showmenu") || target.is(".menubox") || target.is(".richselect"))) {
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
				toggle($(this));
			});
			select.valstore.change(function() {
				select.updateMenu();
			});
			// Add remove button
			select.menubox.append($("<input />", {
				type : "button",
				value : "<",
				click : function() {
					select.removeVal();
				}
			}));
		});
	});
})(jQuery);