var eformity = eformity || {};
eformity.notification = eformity.notification || {};

var centerNotification = $("<div class='notification-right-sidebar'> <h2>Notificaties</h2><ul></ul></div>");

(function () {
    var createWarning = function (content) {
        var warningNotification = $("<div class='warningNotification'><div class='warningDiv'><span class='fa fa-exclamation-circle fa-2x'></span></div>" +
            "<div class='warningContent  '><p>" + content + "</p></div>" +
            "<div class='closeIcon fa fa-times fa-1x'></div></div>");
        var body = $(document).find("body");
        body.prepend(warningNotification);
        return warningNotification;
    }
    this.warning = function (options) {
        var message = createWarning(options.content);
        var fullPage = $(document).find("#fullPage");

        var closeNotify = function () {
            fullPage.animate({ marginTop: '0px' });
            message.slideUp(options.timeout, function () {
                message.remove();
            });
        }

        var close = message.find(".closeIcon");
        if ($(close).click(function () {
            closeNotify();
        }))
        fullPage.animate({ marginTop: '40px' });
        message.slideDown(options.timeout);
    }

    var sideDivNotification = $("<ul class='sideNotification'> </ul>");
    var createNotification = function () {
        var body = $(document).find("body");
        body.append(sideDivNotification);
    }

    this.sideNotification = function (options) {
        createNotification();
        var icon = "fa-leaf";
        if (options.type == "information")
            icon = "fa-info-circle";
        else if (options.type == "warning")
            icon = "fa-exclamation-circle";

        var sideNotification = $("<li class='"+options.type+"'><div><i class='fa fa-remove'></i>" +
            "<span><i class='fa "+icon+" fa-3x'></i></span>" +
            "<div><span>"+options.title+"</span><span>"+options.message+"</span></div>" +
            "</div></li>");

        var notification = sideDivNotification;
        notification.css({ "display": "block" })
        notification.append(sideNotification);
        sideNotification.fadeIn("fast");

        var closeBox = function () {
            setInterval(function () {
                sideNotification.fadeOut(options.timeout, function () {
                    sideNotification.remove();
                });                
            }, options.stay)
        };

        sideNotification.animate({ right: '300px' }, options.timeout, function () {
            closeBox();
        });

        if (sideNotification.find(".fa-remove").click(function () {
            sideNotification.fadeOut("fast");
        }));
    };
    
    this.showNotificationcenter = function () {            
        var fullPage = $(document).find("#fullPage");
        fullPage.append(centerNotification);

        $(".notification-icon").click(function () {
            if ($(centerNotification).is(":visible")) {
                $(".notification-icon").removeClass("notification-icon-active");
                $(centerNotification).fadeOut("fast");
            }
            else{
                $(".notification-icon").addClass("notification-icon-active");
                $(".userMenu").hide();
                visibleDivId = null;
                $(centerNotification).show();
            }
        });
    }

    this.removeNotification = function (id) {
        $("#" + id).remove();
    }

    this.notificationCounter = function () {
        var counter = centerNotification.find("li").length;
        if (counter == 0) {
            $("#notification-counter").hide();
            var test = centerNotification.find("h2");
            $(test).text("Geen notificaties op het moment");
        }
        else
            //$("#notification-counter").text("2");
            $("#notification-counter").text(counter);
    }

    this.notificationCenter = function (options) {
        var notificationsUl = $(centerNotification).find("ul");
        var notification = $("<li id=" + options.id + "><b>" + options.title + "<span class='fa fa-times'></span></b><br />" + options.content + "</li>");
        notificationsUl.append(notification);

        $(notification).find("span").click(function () {
            eformity.notification.removeNotification(notification.attr("id"));
            eformity.notification.notificationCounter();
        });
        eformity.notification.notificationCounter();
    }
}).call(eformity.notification);