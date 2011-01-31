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
		return (el ? !el.hasClass("jshidden") : null);
	}
	function RichSelect(el) {
		// Object for rich menu functionality
		var name, showmenu, menubox, menutext, richopt, menu, valstore;
		var showMenu = function() {
			var el = menu ? menu : menubox;
			show(el);
			if(menu) {
				menu.focus();
			}
		}
		var hideMenu = function() {
			var el = menu ? menu : menubox;
			hide(el);
			var inputs = richopt.find("input");
			// Select form element for added usability
			if(inputs.size()) {
				inputs.first().select();
			}
		}
		var getVal = function() {
			var val;
			if(valstore) {
				val = valstore.val();
			}
			else {
				var option = menu.children("option:selected");
				if(option.size()) val = option.val();
			}
			return val;
		}
		var updateMenubox = function(option) {
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
		}
		var updateMenu = function() {
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
			if(found) updateMenubox(option);
		}
		var updateValstore = function() {
			// Update valstore from selected menu option
			var option = menu.children("option:selected");
			if(option.size()) {
				updateMenubox(option);
				if(valstore) valstore.val(option.val());
			}
		}
		var removeVal = function() {
			// Remove value and collapse menu button to initial form
			showmenu.removeColon();
			hide(menubox);
			menutext.text("");
			if(valstore) valstore.val("");
			if(menu) {
				menu.get(0).selectedIndex = -1;
				hide(menu);
			}
		}
		showmenu = (function() {
			// Object for manipulating showmenu
			var label = el.find(".showmenu");
			label.click(function(e) {
				e.preventDefault();
			});
			var labeltext;
			function init() {
				labeltext = label.contents().get(0).nodeValue;
			}
			return {
				obj : label,
				addColon : function() {
					// Show colon in label when expanded
					init();
					if(labeltext.indexOf(":") == -1) {
						label.contents().get(0).nodeValue = $.trim(labeltext) + ":";
					}
				},
				removeColon : function() {
					// Remove colon in label when collapsed
					init();
					label.contents().get(0).nodeValue = labeltext.replace(":", "");
				}
			}
		})();
		showmenu.removeColon();
		menubox = el.find(".menubox");
		// Add empty element for holding option text
		menubox.prepend("<span />");
		menutext = menubox.children().first();
		richopt = menubox.find(".richopt");
		menu = el.find(".menu");
		menu = menu.size() ? menu : null; // Check for existence of menu
		// Make into multiline select
		menu.attr("size", menu.children().size());
		hide(menubox, richopt, menu);
		// Set menu to show below button
		menu.css("top", el.innerHeight() - 2);
		valstore = menubox.find(".valstore");
		valstore = valstore.size() ? valstore : null; // Check for existence of valstore
		name = (valstore ? valstore.attr("name") : menu.attr("name"));
		// Event handlers for menu button
		el.click(function(e) {
			var target = $(e.target);
			if(target.is(".menubox label") || target.is("input") || target.is(".removeval")) {
				return;
			}
			if(visible(menu))
				hideMenu();
			else
				showMenu();
			e.stopPropagation(); // Don't let the document close the menu again
		});
		el.jkey('space', function() {
			showMenu();
		});
		// Event handlers keep menu and valstore in sync
		menu.click(function(e) {
			updateValstore();
			// The richselect click handler hides the menu
		});
		menu.change(function(e) {
			updateValstore();
		});
		menu.jkey('enter', function() {
			updateValstore();
			hideMenu();
		});
		// Prevent pressing enter in the menu from submitting the form
		menu.keypress(function(e) {
			if(e.which == 13) e.preventDefault();
		});
		valstore.change(function() {
			updateMenu();
		});
		// Add remove button
		menubox.append($("<img />", {
			src : "remove.png",
			alt : "remove",
			"class" : "removeval",
			click : function() {
				removeVal();
			}
		}));
		// Add dropdown image
		el.append($("<img />", {
			src : "dropdown.png",
			alt : "dropdown"
		}));
		// Public object properties and methods (pretty much everything by now)
		return {
			menu : menu,
			menubox : menubox,
			menutext : menutext,
			valstore : valstore,
			name : name,
			showMenu : showMenu,
			hideMenu : hideMenu,
			getVal : getVal,
			updateMenubox : updateMenubox,
			updateMenu : updateMenu,
			updateValstore : updateValstore,
			removeVal : removeVal
		}
	}
	// Array holding all rich menus
	var selects = [];
	$(function() {
		// Reset form
		$("form").get(0).reset();
		// Close any open menu
		$(document).click(function() {
			for(var i = 0; i < selects.length; i++) {
				if(visible(selects[i].menu)) selects[i].hideMenu();
			}
		});
	});
	// jQuery plugin
	$.richselect = $.richselect || function(selector, callback) {
		var a = [];
		$(selector).each(function(i, el) {
			var select = RichSelect($(el));
			a[a.length] = select;
			selects[selects.length] = select;
			if(typeof callback === "function") callback(select);
		});
		return a;
	}
	$.richselect.selects = $.richselect.selects || selects;
})(jQuery);