/**
 * Created by jf on 2015/9/11.
 */

$(function () {

    var pageManager = {
        _isCachePage: false,//是否保留返回时上一页数据状态
        $container: $('.js_container'),
        _pageStack: [],
        _configs: [],
        _defaultPage: null,
        _pageIndex: 1,
        setDefault: function (defaultPage) {
            this._defaultPage = this._find('name', defaultPage);
            return this;
        },
        init: function () {
            var self = this;
            console.log('init');
            $(window).on('hashchange', function () {
                console.log('hashchange');
                var state = history.state || {};
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self._defaultPage;
                if (this._isCachePage && (state._pageIndex <= self._pageIndex || self._findInStack(url))) {

                    self._back(page);
                } else {
                    self._go(page);

                }
            });

            if (history.state && history.state._pageIndex) {
                this._pageIndex = history.state._pageIndex;
            }

            this._pageIndex--;

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var page = self._find('url', url) || self._defaultPage;
            this._go(page);
            return this;
        },
        push: function (config) {
            console.log('push config:' + config);
            this._configs.push(config);

            return this;
        },
        go: function (to) {
            console.log('go:' + to);
            var config = this._find('name', to);

            if (!config) {
                console.log('go false' + config);
                return;
            }
            console.log('go' + config.url);
            location.hash = config.url;
        },
        _go: function (config) {
            console.log('_go config:' + config);
            console.log('_go _pageIndex:' + this._pageIndex);
            this._pageIndex++;

            history.replaceState && history.replaceState({ _pageIndex: this._pageIndex }, '', location.href);
            $('.js_container');
            var html = $(config.template).html();
            var $html = $(html).addClass('slideIn').addClass(config.name).css('min-height', parseInt($('.js_container').css('height')) - 0);
            if (!this._isCachePage) {
                this.$container.html('');
            }
            this.$container.append($html);

            // $('.js_container').addClass('container');
            //$('.' + config.name).css('overflow-y', 'auto!important');
            //$('.' + config.name).css('margin-bottom', '0px');
            //$('.' + config.name).css('min-height', parseInt($('.js_container').css('height'))-12);
            //$('.' + config.name).addClass('page');
            //alert($('.js_container').css('height'));
            //alert(parseInt($('.js_container').css('height')) - 6);
            this._pageStack.push({
                config: config,
                dom: $html
            });

            if (!config.isBind) {
                this._bind(config);
            }
            console.log('_go');
            return this;
        },
        back: function () {
            console.log('back');
            history.back();
        },
        _back: function (config) {
            console.log('_back _pageIndex:' + this._pageIndex);
            this._pageIndex--;

            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var found = this._findInStack(url);
            var html = $(config.template).html();
            if (!found) {

                var $html = $(html).css('opacity', 1).addClass(config.name);
                //var $html = $(html).addClass(config.name);

                $html.insertBefore(stack.dom);

                if (!config.isBind) {
                    this._bind(config);
                }

                this._pageStack.push({
                    config: config,
                    dom: $html
                });

            }
            this._hidOtherPage(config);



            stack.dom.addClass('slideOut').on('animationend', function () {
                stack.dom.remove();
            }).on('webkitAnimationEnd', function () {
                stack.dom.remove();
            });

            return this;
        },
        _findInStack: function (url) {
            console.log('_findInStack url:' + url);
            var found = null;
            for (var i = 0, len = this._pageStack.length; i < len; i++) {
                var stack = this._pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }
            return found;
        },
        _hidOtherPage: function (page) {

            var found = null;
            for (var i = 0, len = this._pageStack.length; i < len; i++) {
                var stack = this._pageStack[i];
                if (stack.config.url === page.url) {
                    $('.' + stack.config.name).show();
                } else {
                    $('.' + stack.config.name).hide();
                }
            }

        },
        _find: function (key, value) {
            console.log('_find  key, value:' + key + '  ' + value);
            var page = null;
            for (var i = 0, len = this._configs.length; i < len; i++) {
                if (this._configs[i][key] === value) {
                    page = this._configs[i];
                    break;
                }
            }
            console.log('page  ' + page);
            return page;
        },
        _bind: function (page) {
            console.log('_bind:' + page);
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        }
    };
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

    $(".weui_tabbar_item").on('click', function (e) {
        var id = $(this).data('id');
        pageManager.go(id);
        console.log('item' + id);

    })


    var appIndex = {
        name: 'appIndex',
        url: '#appIndex',
        template: '#tpl_appIndex',
        events: {
            '.js_grid': {
                click: function (e) {
                    var id = $(this).data('id');
                    pageManager.go(id);
                }
            }
        }
    };



    var defaultpage = {
        name: 'defaultpage',
        url: '#defaultpage',
        template: '#tpl_defaultpage'
    };

    var my = {
        name: 'my',
        url: '#my',
        template: '#tpl_my',
        events: {
            '.weui_btn': {
                click: function (e) {

                    try {

                        $.ajax({
                            type: "GET",
                            //url: "http://localhost:16560/Games/Kaisuo/SubmitComplain", //跨域URL
                            url: "http://admin.91wzs.com/Games/Kaisuo/SubmitComplain", //跨域URL
                            data: {
                                "type": $("input[name='radio1']:checked").val(),
                                "comments": $("#comments").val(),
                                "url": window.location.host,
                                "para": GetQueryString("type")
                            },
                            cache: false,
                            async: false,
                            dataType: "json",
                            success: function (result) {
                                

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert(errorThrown); // 调用本次AJAX请求时传递的options参数

                            }
                        });


                    } catch (e) {
                        alert('系统繁忙，请稍后再试' + e)
                    }
                     
                   
                    var id = $(this).data('id');
                    pageManager.go(id);
                }
            }
        }

    };

    var msg = {
        name: 'msg',
        url: '#msg',
        template: '#tpl_msg',
        
    };

    var help = {
        name: 'help',
        url: '#help',
        template: '#tpl_help'
    };



    var sendRedByGroup = {
        name: 'sendRedByGroup',
        url: '#sendRedByGroup',
        template: '#tpl_sendRedByGroup'
    };

    var actionSheet = {
        name: 'actionsheet',
        url: '#actionsheet',
        template: '#tpl_actionsheet',
        events: {
            '#showActionSheet': {
                click: function () {
                    var mask = $('#mask');
                    var weuiActionsheet = $('#weui_actionsheet');
                    weuiActionsheet.addClass('weui_actionsheet_toggle');
                    mask.show().addClass('weui_fade_toggle').one('click', function () {
                        hideActionSheet(weuiActionsheet, mask);
                    });
                    $('#actionsheet_cancel').one('click', function () {
                        hideActionSheet(weuiActionsheet, mask);
                    });
                    weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');

                    function hideActionSheet(weuiActionsheet, mask) {
                        weuiActionsheet.removeClass('weui_actionsheet_toggle');
                        mask.removeClass('weui_fade_toggle');
                        weuiActionsheet.on('transitionend', function () {
                            mask.hide();
                        }).on('webkitTransitionEnd', function () {
                            mask.hide();
                        })
                    }
                }
            }
        }
    };
    pageManager
    .push(my)
    .push(msg)
    .push(sendRedByGroup)

    .push(appIndex)
    .push(defaultpage)
    .push(actionSheet)
    .setDefault('my')
    .init();
});