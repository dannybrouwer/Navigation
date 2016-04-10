(function ($) {
    var PLUGIN_NS = 'wsmenu';
    var wsmenu = function (target, options) {
        this.$T = $(target);

        this.options = $.extend(
             true,
             {
                 beforeHtml: null,
                 autoResize: false,
                 autoHide: false,
                 resizeWidth: 600,
             },
             options
         );

        this._init(target, this.options);
        return this;
    }

    /* Initializer */
    wsmenu.prototype._init = function (target, options) {
        this.$T.addClass("wsmenu");
        this._enhangeMenu();
        this._connectResize();
        this._connectEvents();
    };

    wsmenu.prototype._checkOptions = function () {
        if (this.options.autoHide) 
            this.hide();

        if (this.options.beforeHtml)
            this._enhangeMenu();

        if (this.options.autoResize)
            this._connectResize();
    };

    wsmenu.prototype._enhangeMenu = function () {
        $("<div></div")
        $(this.options.beforeHtml).prependTo(this.$T);
    }

    wsmenu.prototype._connectResize = function () {
        var current = this;
        $(window).resize(function () {
            current._resize();
        });
        this._resize();
    }

    wsmenu.prototype._connectEvents = function () {
        var current = this;
        this.$T.find("a").click(function () {
            var url = $(this).data("url");
            if (url == null) {
                current.hide();
                return false;
            }
            else
            {
                current.$T.find("a").removeClass("active");
                $(this).addClass("active");

                eformity.framework.loadContent(url, {
                    complete: function ()
                    {
                        if (current.options.autoHide)
                            current.hide();
                    }
                })
            };
            return false;
        })
    }

    wsmenu.prototype._resize = function () {
        if ($(window).width() > this.options.resizeWidth) {
            this.desktop();
        }
        else {
            this.mobile();
        }
    };

    /* Public  */
    wsmenu.prototype.mobile = function () {
        this.$T.addClass("mobile");
    };

    wsmenu.prototype.desktop = function () {
        this.$T.removeClass("mobile");
    };

    wsmenu.prototype.show = function () {
        this.$T.show();
    };

    wsmenu.prototype.hide = function () {
        //visibleDivId = null;
        activeVisible = null;
        this.$T.hide();
    };

    wsmenu.prototype.fadeIn = function () {
        this.$T.fadeIn();
    };

    wsmenu.prototype.toggleVisible = function () {
        this.$T.fadeToggle();
    };

    $.fn[PLUGIN_NS] = function (methodOrOptions) {
        if (!$(this).length) {
            return $(this);
        }
        var instance = $(this).data(PLUGIN_NS);
        if (instance) {
            return instance;

        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            instance = new wsmenu($(this), methodOrOptions);    // ok to overwrite if this is a re-init
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