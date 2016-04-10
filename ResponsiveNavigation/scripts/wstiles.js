var eformity = eformity || {};
eformity.wstiles = eformity.wstiles || {};
(function ($) {
    var PLUGIN_NS = 'wstiles';

    var wstiles = function (target, options) {
        this.$T = $(target);

        // init
        this.options = $.extend(
             true,
             {
                 defaultColor: "#FFFF00",
                 defaultIcon: "fa-envelope",
             },
             options
         );

        this.$T.data('eformity.wstiles', this);

        this._init(target, this.options);
        return this;
    }

    /* Initializer */
    wstiles.prototype._init = function (target, options) {
        //Add styling
        this.$T.addClass("tile-content");
        this._transform();

        var color = this.options.defaultColor;
        this.$T.find("> li").each(function () {

            $(this).css({ 'background-color': options.defaultColor });
            var colorName = $(this).data("color");
            if (colorName)
                $(this).css({ 'background-color': colorName });
        });
    };

    /* Public  */
    wstiles.prototype._transform = function () {
        if (this.options.showIcon) {
            this.showIcon();
        }
        
        var defaultIcon = this.options.defaultIcon;
        //Create tiles
        this.$T.find("> li").each(function () {
            var iconName = $(this).data("icon");
            var titleName = $(this).data("text");
            var urlName = $(this).data("url");

            var title = $("<span>" + titleName + "</span>")
            var icon = $("<i class='fa " + iconName + " fa-3x fa-inverse'></i>");

            if (iconName)
                var icon = $("<i class='fa " + iconName + " fa-3x fa-inverse'></i>");
            else
                var icon = $("<i class='fa " + defaultIcon + " fa-3x fa-inverse'></i>");

            $(this).append(icon);
            $(this).append(title);
            $(this).attr("onclick", "location.href='" + urlName + "'");
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
            instance = new wstiles($(this), methodOrOptions);    // ok to overwrite if this is a re-init
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