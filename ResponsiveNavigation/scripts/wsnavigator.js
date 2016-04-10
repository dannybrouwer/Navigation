(function ($) {
    var PLUGIN_NS = 'wsnavigator';
    $(window).resize(function () {
        $('.ws-navigator').each(function () {
            $(this).wsnavigator().reflow();
        });
    });    

    var wsnavigator = function (target, options) {
        this.$T = $(target);
        // init
        this.options = $.extend(
             true,
             {
                 reflow: false,
                 reflowWidthNav: 400,
                 reflowWidthTab: 100,
                 maxWidth: 2000,
                 type: "",
             },
             options
         );
        this._init(target, this.options);
        return this;
    }

    wsnavigator.prototype.isNavigator = function () {
        return this.options.type == "navigator";
    }

    wsnavigator.prototype.isTab = function () {
        return this.options.type == "tab";
    }

    wsnavigator.prototype.reflow = function () {
        if (!this.options.reflow)
            return;
        var overflowMenu = this._getOverflowMenu().find("ul");
        this._submenuToHeaderNavigation(overflowMenu);
        this._headernavigationToSubmenu(overflowMenu);
        this._invalidateOverflowMenu(overflowMenu);
    }

    wsnavigator.prototype.display = function (item) {
        if (this.isNavigator())
            $(item).css('display', 'inline-block');
        else
            $(item).css('display', 'table-cell');
    }

    wsnavigator.prototype.hideOverflowMenu = function () {
        var current = this;
        var overflowMenu = current._getOverflowMenu();
        $(overflowMenu).wsmenu().hide();
    }

    /* Initializer */
    wsnavigator.prototype._init = function (target, options) {
        var current = this;
        if (current.isNavigator())
            this.$T.addClass("ws-navigator");
        else
            this.$T.addClass("wstabs-nav");
        this._setOrder();
        this._createOverflowMenu();
        this.displayItems();
        this._connectEvents();
        this._setMaxWidth();
        this.reflow();
    };

    wsnavigator.prototype.displayItems = function () {
        var current = this;
        var headerItems = this.$T.find("> li:not(:last-child)").each(function (ndx, elem) {
            //IE is somestimes 1 pixel off when in zoom mode
            var removeItem = $(window).width() < ($(document).width() - 1);
            if (!removeItem)
                current.display(this);
        });
    }

    wsnavigator.prototype._invalidateOverflowMenu = function (overflowMenu) {
        var ellipsMenu = this.$T.find("> li").last();
        var subMenu = overflowMenu.find("> li");
        if (subMenu.length > 0)
        {
            this.display(ellipsMenu);
        }
        else
            ellipsMenu.css('display', 'none');
    }

    wsnavigator.prototype._moveToHeader = function( item ) {
        headerItems = this.$T.find("> li:not(:last-child)");
        var current = this;
        if (headerItems.length == 0)
            item.insertBefore(this.$T.find("> li"));
        else {
            var bItem = null;
            for (i = 0; i < headerItems.length; i++)
                if (item.data("order") < $(headerItems[i]).data("order"))
                    bItem = headerItems[i];

            if (bItem) 
                item.insertBefore(bItem);
            else
                item.insertAfter(headerItems.last());
        }
        current.display(item);
    }

    wsnavigator.prototype._headernavigationToSubmenu = function (overflowMenu) {
        var current = this;
        headerItems = this.$T.find("> li:not(:last-child)");
        for (var i = headerItems.length - 1; i >= 0; i--) {
            var headerNavigationSection = this.$T.parent().width();
            if ($(overflowMenu).length > 0)
                headerNavigationSection = headerNavigationSection - 40;

            if (current.isNavigator())
                var removeItem = (headerNavigationSection - 1) < current.$T.width();
            else
                var removeItem = current.$T.width() < current.$T.get(0).scrollWidth;

            var reflow;
            var active;
            if (current.isTab()) {
                reflow = this.options.reflowWidthTab;
                active = "a:not('.active-tab')";
            }
            else {
                reflow = this.options.reflowWidthNav;
                active = "a:not('.active')";
            }

            var currentItem = $(headerItems[i]);
            if (removeItem && (currentItem.has(active).length == 1) || ($(window).width() < reflow)) {
                if (current.isNavigator())
                    currentItem.css('display', '');
                else
                    currentItem.css('display', 'block');
                currentItem.prependTo(overflowMenu);
            } else
                this.display(currentItem);
        }
    }

    wsnavigator.prototype._submenuToHeaderNavigation = function (overflowMenu) {
        var menuItems = overflowMenu.find("> li");
        var current = this;
        var headerNavigationSection = this.$T.parent().width();

        for (var i = 0; i < menuItems.length; i++) {
            //IE is somestimes 1 pixel off when in zoom mode
            if (current.isNavigator())
                var removeItem = (headerNavigationSection - 1) < current.$T.width();
            else
                var removeItem = current.$T.width() < current.$T.get(0).scrollWidth;

            var active;
            if (current.isNavigator())
                active = "a:not('.active')";
            else
                active = "a:not('.active-tab')";

            var currentItem = $(menuItems[i]);
            if (!removeItem || currentItem.has(active).length == 0) {
                this._moveToHeader(currentItem);
            }
        }
    }

    wsnavigator.prototype._setOrder = function () {
        var index = 1;
        this.$T.find("> li").each(function () {
            $(this).data("order", index);
            index++;
        });
    };

    wsnavigator.prototype._setMaxWidth = function (maxWidth) {
        var current = this;
        if (current.isTab())
            var tabs = this.$T.css("max-width", this.options.maxWidth + "px");
    }

    wsnavigator.prototype._createOverflowMenu = function () {
        var current = this;
        var overflowMenu =  $("<div class='ws-navigator-overflow-menu'><ul></ul></div>");
        if (current.isTab())
            overflowMenu = overflowMenu.addClass("overflowTab"); 
        $(overflowMenu).wsmenu({ autoResize: true });
        
        var ellipsMenu = $("<li><a class='ellipse' href=''><span class='fa fa-ellipsis-h header-button'></span></a></li>");
        ellipsMenu.find("a").click(function () {
            eformity.framework.toggleVisibility(overflowMenu);
            return false;
        });

        $(ellipsMenu).append(overflowMenu);
        this.$T.append(ellipsMenu);
        this.$T.data('eformity.overflowmenu', overflowMenu);
        return overflowMenu;
    };

    wsnavigator.prototype._getOverflowMenu = function () {
        var result = this.$T.data('eformity.overflowmenu');
        return result;
    };

    wsnavigator.prototype._connectEvents = function () {
        var current = this;
        this.$T.find("> li:not(:last-child) > a").click(function () {
            if (current.isNavigator()) {
                var url = $(this).attr("href");
                current.$T.find("a").removeClass("active");
                $(this).addClass("active");
            } else
            {
                // remove active div and active tab
                $(".pane div").removeClass("active-tab-div");
                current.$T.find(" > li > a").removeClass("active-tab");

                //set div and tab active
                $($(this).attr("href")).addClass("active-tab-div");
                $($(this).addClass("active-tab"));

                var overflowMenu = current._getOverflowMenu();
                $(overflowMenu).wsmenu().hide();
                current.reflow();
            }
            return false;
        })
    }

    $.fn[PLUGIN_NS] = function (methodOrOptions) {
        if (!$(this).length) {
            return $(this);
        }
        var instance = $(this).data(PLUGIN_NS);
        if (instance) {
            return instance;

        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            instance = new wsnavigator($(this), methodOrOptions);    // ok to overwrite if this is a re-init
            $(this).data(PLUGIN_NS, instance);
            return instance;

            // CASE: method called before init
        } else if (!instance) {
            $.error('Plugin must be initialised before using method: ' + methodOrOptions);

            // CASE: invalid method
        } else if (methodOrOptions.indexOf('_') == 0) {
            $.error('Method ' + methodOrOptions + ' is private!');
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist.');
        }
    };
})(jQuery);