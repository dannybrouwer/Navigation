var eformity = eformity || {};
eformity.framework = eformity.framework || {};

var activeVisible = null;

(function () {
    // init
    var privateMember = function () {
    };

    this.toggleVisibility = function (elem) {
        if (activeVisible) {
            $(activeVisible).fadeOut(100);

            if (activeVisible.is(elem)) {
                activeVisible = null;
                return;
            }
        }
        activeVisible = elem;
        $(elem).fadeIn(100);
    }
}).call(eformity.framework);