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
			label.click(function(e) {
				e.preventDefault();
			});
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
				}
				else {
					if(!richopt.hasClass("jshidden")) hide(richopt);
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
				if(menu) {
					menu.get(0).selectedIndex = -1;
					hide(menu);
				}
			},
			showMenu : function() {
				// Show or hide menu
				var el = menu ? menu : menubox;
				show(el);
				if(menu) {
					menu.focus();
				}
			},
			hideMenu : function() {
				var el = menu ? menu : menubox;
				hide(el);
				var inputs = richopt.find("input");
				// Select form element for added usability
				if(inputs.size()) {
					inputs.first().select();
				}
			}
		}
	}
	$(function() {
		// init function
		// Add js styles
		var stylesheet = document.createElement("link");
		stylesheet.setAttribute("rel", "Stylesheet");
		stylesheet.setAttribute("type", "text/css");
		stylesheet.setAttribute("href", "js.css");
		document.getElementsByTagName("head")[0].appendChild(stylesheet);
		// Reset form
		$("form").get(0).reset();
		// Array holding all rich menus (currently not used, maybe convenient later - or not)
		var selects = [];
		// Instantiate objects and add event handlers (possibly event handlers should be added inside RichSelect?)
		$(".richselect").each(function(i, el) {
			el = $(el); // jQuerify
			var select = RichSelect(el);
			selects.push(select);
			// Event handlers for menu button
			el.click(function(e) {
				var target = $(e.target);
				if(target.is(".menubox label") || target.is("input") || target.is(".removeval")) {
					return;
				}
				if(visible(select.menu))
					select.hideMenu();
				else
					select.showMenu();
			});
			el.jkey('space', function() {
				select.showMenu();
			});
			// Make into multiline select
			select.menu.attr("size", select.menu.children().size());
			// Event handlers keep menu and valstore in sync
			select.menu.click(function(e) {
				select.updateValstore();
				// The richselect click handler hides the menu
			});
			select.menu.change(function(e) {
				select.updateMenubox();
			});
			select.menu.jkey('enter', function() {
				select.updateValstore();
				select.hideMenu();
			});
			// Prevent pressing enter in the menu from submitting the form
			select.menu.keydown(function(e) {
				if(e.which == 13) e.preventDefault();
			});
			select.valstore.change(function() {
				select.updateMenu();
			});
			// Add remove button
			select.menubox.append($("<img />", {
				src : "remove.png",
				alt : "remove",
				"class" : "removeval",
				click : function() {
					select.removeVal();
				}
			}));
			// Add dropdown image
			el.append($("<img />", {
				src : "dropdown.png",
				alt : "dropdown"
			}));
		});
	});
})(jQuery);