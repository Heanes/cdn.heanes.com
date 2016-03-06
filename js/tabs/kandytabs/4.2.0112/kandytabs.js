/**
 * JQuery Tab Plugin KandyTabs 4.2.0112 
 */
; (function($) {
    $.fn.KandyTabs = function(b) {
        var c = [];
        this.each(function() {
            if (b === false) {
                if (this.KandyTabs) {
                    this.KandyTabs.revert();
                    this.KandyTabs = null
                }
            } else {
                if (!this.KandyTabs) {
                    var a = new KandyTabs(this, b);
                    if (a.init()) {
                        this.KandyTabs = a;
                        c.push(a)
                    } else a = null
                } else c.push(this.KandyTabs)
            }
        });
        if (c.length === 0) c = false;
        if (c.length === 1) c = c[0];
        return c
    };
    var k = document.URL.toLowerCase() + "&",
    KandyTabs = function(e, f) {
        var g = $(e).data("attr", {
            id: e.id,
            "class": e.className
        }),
        $child = g.children(),
        opts = this.set = this.get = $.extend(true, {},
        KandyTabs.defaults, f),
        bodyCSS = {},
        contCSS = {},
        _this = this,
        _current = this.get.now = g.attr("id") && k.indexOf(e.id + ":") > -1 ? parseInt(k.split(e.id + ":")[1].split("&")[0]) : opts.current,
        _all = $child.length,
        _tag = _btn = _cont = "div",
        _num = 0,
        _titleHeight = 0,
        _rollWidth = 0,
        _html = e.innerHTML,
        _delay = null,
        _autoTime = null,
        _scrollTime = null,
        _paused = false,
        _contStr = "",
        _playDir = "",
        _easing = $.easing[opts.easing] ? opts.easing: "swing",
        _tabable = true,
        _isAjax = false,
        _isIframe = false,
        _isSlide = opts.type == "slide",
        _isFold = opts.type == "fold",
        _isCol = opts.column > 0,
        _isRoll = opts.action == "roll",
        _isTop = opts.direct == "top",
        _isBtm = opts.direct == "bottom",
        _isL = opts.direct == "left",
        _isR = opts.direct == "right",
        _isX = (_isL || _isR),
        $title,
        $body,
        $fold,
        $roll,
        $process,
        $btn,
        $cur,
        $cont,
        $b,
        $c,
        $scroll,
        $add,
        $del,
        $left,
        $right,
        $nav,
        $prev,
        $next,
        $now,
        $all,
        $ctrl,
        $play,
        $pause,
        $hover;
        this.init = function() {
            if (typeof opts.ready == "function") opts.ready(g, this);
            if (_all < 2) return false;
            if ((opts.btn && !g.find(opts.btn)[0]) && (opts.cont && !g.find(opts.cont)[0])) return false;
            this.build();
            if (opts.child[1] && g.find(opts.child[0])) $(opts.child[0]).KandyTabs(opts.child[1]);
            if (typeof opts.done == "function") opts.done($btn, $cont, g, this);
            this.tab(_current);
            return true
        };
        this.revert = function() {
            g.html(_html);
            g.attr(g.data("attr"));
            if (opts.full) g.css({
                position: "",
                top: "",
                right: "",
                bottom: "",
                left: ""
            })
        };
        this.build = function() {
            switch (e.tagName) {
            case "DL":
                $title = $("<dt/>");
                $body = $("<dd/>");
                _tag = "dd";
                _btn = "dt";
                _cont = "dd";
                break;
            case "UL":
                $title = $("<li/>");
                $body = $("<li/>");
                _tag = _btn = _cont = "li";
                break;
            case "OL":
                $title = $("<li/>");
                $body = $("<li/>");
                _tag = _btn = _cont = "li";
                break;
            default:
                $title = $("<div/>");
                $body = $("<div/>")
            }
            opts.id && g.attr("id", opts.id);
            g.addClass(opts.classes);
            opts.except && j.except(_tag);
            if (_isCol && _isSlide) j.column(_tag);
            if (opts.process && opts.auto) j.process(_tag);
            if (opts.btn && opts.cont) {
                $btn = g.children().children(f.btn).addClass("tabbtn").bind(opts.trigger,
                function() {
                    h.trigger($btn.index(this) + 1)
                });
                $cont = g.children().children(f.cont).addClass("tabcont");
                $title = $btn.parent().addClass("tabtitle");
                $body = $cont.parent().addClass("tabbody");
                _num = $btn.length;
                _all = _num * 2;
                if (_isRoll) {
                    j.roll();
                    $cont.show().appendTo($roll);
                    $body.height($cont.eq(_current - 1).height())
                } else $cont.eq(_current - 1).siblings().hide();
                opts.del && j.del()
            } else {
                if (_isFold) {
                    j.fold();
                    opts.scroll = false
                } else {
                    g.prepend($title.addClass("tabtitle"), $body.addClass("tabbody"));
                    if (opts.full) {
                        g.css({
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        });
                        $body.css({
                            height: "100%",
                            width: "100%"
                        });
                        opts.resize = false
                    }
                    _isRoll && j.roll()
                }
            }
            if (opts.scroll || opts.add) j.scroll("ins");
            opts.scroll && j.scroll("fill");
            opts.add && j.add(_tag);
            if (!_isSlide) _all = Math.round(_all / 2);
            if (!opts.btn && !opts.cont) {
                for (var i = 0; i < _all; i++) {
                    _isSlide ? this.add($child.eq(i)) : this.add($child.eq(i * 2), $child[i * 2 + 1] ? $child.eq(i * 2 + 1) : opts.lang.empty)
                }
            }
            opts.except && g.find(".tabexcept[class*='title']").prependTo(g);
            opts.nav && j.nav(_tag, _current, _all);
            if (opts.ctrl) {
                j.ctrl(_tag); ! opts.auto && $ctrl.children().toggle()
            }
            $roll && j.roll("dir");
            if ($fold && (_isL || _isR)) j.fold("horiz");
            if (opts.action == "slifade") {
                $body.css({
                    overflow: "hidden",
                    height: opts.full ? "100%": $cont.eq(_current - 1).height()
                });
                bodyCSS = j.css($body);
                if (bodyCSS.position == "static") $body.css("position", "relative");
                $cont.css({
                    position: "absolute",
                    left: bodyCSS.padding[3],
                    top: bodyCSS.padding[0],
                    right: bodyCSS.padding[1]
                });
                if (!opts.full) {
                    $(window).resize(function() {
                        $body.stop().height($cont.eq(_this.get.now - 1).height())
                    })
                }
            }
            $hover = !opts.hover ? g: $(opts.hover);
            $hover.hover(function() {
                opts.auto && _this.pause();
                if (opts.process && opts.auto) $process.stop();
                _paused = true
            },
            function() {
                _paused = false;
                opts.auto && _this.play(_playDir);
                if (opts.process && opts.auto) h.process()
            })
        };
        this.add = function(b, c, d) {
            if (b === true) {
                b = opts.lang.btn;
                d = true
            }
            if (c === true) {
                _isSlide ? c = b: c = opts.lang.cont;
                d = true
            }
            if (_isSlide) {
                if (!b) c = opts.lang.cont;
                if (!c) c = b
            } else {
                if (!b) b = opts.lang.btn;
                if (!c) c = opts.lang.cont
            }
            if (typeof b == "string") b = $(b).html() ? $(b) : $("<" + _btn + ">" + b + "</" + _btn + ">");
            if (typeof c == "string") c = $(c).html() ? $(c) : $("<" + _cont + ">" + c + "</" + _cont + ">");
            _num++;
            switch (opts.type) {
            case "slide":
                $title.append("<span class='tabbtn'>" + _num + "</span>");
                c.appendTo($roll ? $roll: $body).ChangeTag(_isCol ? ".tabcont": "div.tabcont");
                break;
            case "fold":
                (_isR ? c: b).insertBefore($fold).ChangeTag(_isR ? ".tabcont": ".tabbtn"); (_isR ? b: c).insertBefore($fold).ChangeTag(_isR ? ".tabbtn": ".tabcont");
                break;
            default:
                b.appendTo($title).ChangeTag("span.tabbtn");
                c.appendTo($roll ? $roll: $body).ChangeTag("div.tabcont")
            }
            $btn = ($fold ? $fold.siblings(".tabbtn") : $title.children(".tabbtn")).unbind(opts.trigger).bind(opts.trigger,
            function() {
                $del && $(this).children(".tabdel").show();
                h.trigger($btn.index(this) + 1)
            }).mouseout(function() {
                _delay && clearTimeout(_delay)
            });
            $cont = $fold ? $fold.siblings(".tabcont") : ($roll ? $roll: $body).children(".tabcont");
            opts.full && $cont.last().css({
                backgroundImage: function(i, s) {
                    if (s != "none") {
                        return s
                    } else {
                        var a = $("img", this).hide();
                        if (a[0]) return "url(" + $("img", this)[0].src + ")"
                    }
                },
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: $roll ? g.width() : "100%",
                height: $roll ? g.height() : "100%"
            });
            _isIframe = c.find("a[rel*='iframe']")[0];
            _isIframe && j.iframe($cont.last(), _isIframe.href);
            _isAjax = c.find("a[rel*='ajax']")[0];
            _isAjax && ($btn.last().data("ajax", $(_isAjax).attr("href")), j.ajax($cont.last(), $(_isAjax).attr("href")));
            $scroll && $scroll.appendTo($title);
            opts.del && j.del(_num - 1);
            if (!$roll) $cont.not(":eq(" + _current + ")").hide();
            if (_num > _all) {
                if ($roll) {
                    $c = $cont.last();
                    if (_isX) {
                        $c.css("float", "left");
                        $c.css("margin-left", contCSS.margin[3]); ! _isCol && $c.width(bodyCSS.width);
                        _rollWidth += $c.outerWidth(true);
                        if (contCSS.margin[1] != 0 && !opts.loop) $c.css("margin-right", 0).prev().css("margin-right", "");
                        $roll.width(_rollWidth * (opts.loop ? 2 : 1))
                    } else $c.css("margin-bottom", bodyCSS.padding[2]);
                    if (opts.loop) {
                        $c.insertAfter($cont.eq(_all - 1)).clone().appendTo($roll);
                        _isIframe && j.iframe($c, _isIframe[2]);
                        _isAjax && j.ajax($c, _isAjax[2]);
                        $cont = $roll.children(".tabcont:lt(" + _num + ")")
                    }
                }
                _all++;
                $all && $all.text(_all);
                $next && $next.removeClass("tabnextno");
                $right && $right.removeClass("tabrightno")
            }
            if (_num >= _all && opts.scroll) {
                if ($btn.css("float") == "none" && _titleHeight < $btn.last().position().top) _titleHeight += $btn.outerHeight(true);
                if (_titleHeight == 0) _titleHeight = $btn.outerHeight(true);
                j.scroll("add")
            }
            this.get.all = _all;
            d && this.tab(_num)
        };
        this.del = function(i) {
            if (i instanceof $) {
                i = $btn.index(i) + 1
            } else if ((typeof i == "string" || typeof i == "object") && $(i)[0]) {
                i = $btn.index($(i)) + 1
            }
            if (_all <= 1) return false;
            this.get.all = _all = _num = _all - 1;
            i = !i ? _all: --i;
            if ($roll && !opts.loop) _rollWidth -= $cont.eq(i).outerWidth(true);
            $btn.eq(i).remove();
            $cont.eq(i).remove();
            $btn = $fold ? $fold.siblings(".tabbtn") : $title.children(".tabbtn");
            $cur = $fold ? $fold.siblings(".tabcur") : $title.children(".tabcur");
            $cont = $fold ? $fold.siblings(".tabcont") : ($roll ? $roll: $body).children(".tabcont");
            if ($roll) {
                if (opts.loop) {
                    $cont = $roll.children(".tabcont:lt(" + _all + ")");
                    $roll.children(".tabcont").not($cont).eq(i).remove()
                } else {
                    $roll.width(_rollWidth)
                }
            }
            if (opts.nav) {
                $now.text($btn.index($cur) + 1);
                $all.text(_all)
            };
            if (_isSlide)(opts.del ? $btn.find("kbd") : $btn).text(function(n) {
                return n + 1
            }); ! $cur[0] && this.tab(_all);
            opts.scroll && j.scroll("del")
        };
        this.tab = function(i) {
            if (!_tabable) return;
            if (i instanceof $) {
                i = $btn.index(i) + 1
            } else if ((typeof i == "string" || typeof i == "object") && $(i)[0]) {
                i = $btn.index($(i)) + 1
            }
            if ($btn[i - 1] && $btn[i - 1].className.indexOf("tabcur") > -1) return;
            if (opts.auto) this.pause();
            var a = i;
            if (parseInt(i))--i;
            if (i >= _all) i = _all - 1;
            if (i < 0) i = 0;
            if (i === "prev") i = _current > 0 ? --_current: (opts.loop || opts.auto === true ? _all - 1 : 0);
            if (i === "next") i = _current < _all - 1 ? ++_current: (opts.loop || opts.auto === true ? 0 : _all - 1);
            $b = $btn.eq(i);
            $c = $cont.eq(i);
            if (opts.nav && !opts.loop) {
                i == 0 ? $prev.addClass("tabprevno")[0].title = opts.lang.first[0] : $prev.removeClass("tabprevno")[0].title = opts.lang.prev[0];
                i == _all - 1 ? $next.addClass("tabnextno")[0].title = opts.lang.last[0] : $next.removeClass("tabnextno")[0].title = opts.lang.next[0]
            }
            $now && $now.text(i + 1);
            $b.stop(false, true).addClass("tabcur").siblings(".tabcur").removeClass("tabcur");
            $b.data("ajax") && j.ajax($c, $b.data("ajax"));
            if (opts.scroll && $btn[i].style.display == "none") {
                _scrollTime = setInterval(function() {
                    $btn[i].style.display != "none" ? (clearInterval(_scrollTime), _scrollTime = null) : $left.trigger("click", [20])
                },
                50)
            }
            if (opts.scroll && $btn[i].offsetTop + ($btn.css("float") != "none" ? 2 : 0) > _titleHeight) {
                _scrollTime = setInterval(function() {
                    $btn[i].offsetTop + ($btn.css("float") != "none" ? 2 : 0) < _titleHeight ? (clearInterval(_scrollTime), _scrollTime = null) : $right.trigger("click", [20])
                },
                50)
            }
            if (opts.process && opts.auto && !_paused) h.process();
            if (this.set.action == "roll" && !$roll) opts.action = "slide";
            if (this.set.action != "roll" && $roll) opts.action = "roll";
            _tabable = false;
            switch (opts.action) {
            case "fade":
                $c.stop(false, true).fadeIn(opts.last,
                function() {
                    _tabable = true
                }).siblings(".tabcont").hide();
                break;
            case "slide":
                if ($fold && (_isX)) {
                    $c.stop(false, true).delay().animate({
                        width: contCSS.width,
                        marginLeft: contCSS.margin[3],
                        marginRight: contCSS.margin[1],
                        paddingLeft: contCSS.padding[3],
                        paddingRight: contCSS.padding[1],
                        borderLeftWidth: contCSS.border[3],
                        borderRightWidth: contCSS.border[1]
                    },
                    opts.last, _easing).siblings(".tabcont").animate({
                        width: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0
                    },
                    opts.last, _easing,
                    function() {
                        _tabable = true
                    })
                } else {
                    $c.stop(false, true).slideDown(opts.last, _easing).siblings(".tabcont").slideUp(opts.last,
                    function() {
                        _tabable = true
                    })
                }
                break;
            case "roll":
                h.roll(i, a);
                break;
            case "slifade":
                $c.stop(false, true).width("").show().css("z-index", 0).siblings().fadeOut(opts.last,
                function() {
                    _tabable = true
                }).css("z-index", _all);
                h.resize($c, opts.resize);
                break;
            default:
                $c.stop(false, true).show().siblings(".tabcont").hide();
                _tabable = true
            }
            if (typeof opts.custom == "function") opts.custom($btn, $cont, i, g, this);
            _current = i;
            this.get.now = i + 1;
            if (parseInt(opts.auto) && opts.auto > 0) {
                if (a == "next" && i == _all - 1 || a == "prev" && i == 0) opts.auto--;
                if (opts.auto == 0) this.pause(true)
            }
            if (opts.auto && !_paused) this.play(_playDir)
        };
        this.play = function(a, b) {
            $pause && $pause.show().siblings().hide();
            switch (a) {
            case "prev":
                _playDir = "prev";
                break;
            case "reverse":
                _playDir = _playDir == "prev" ? "next": "prev";
                break;
            case true:
                _playDir = "next";
                b = true;
                break;
            default:
                _playDir = "next"
            }
            if (parseInt(a)) b = a;
            if (b && !opts.auto) opts.auto = b;
            _autoTime = setTimeout(function() {
                _this.tab(_playDir)
            },
            opts.stall)
        };
        this.pause = function(a) {
            if (a == true && opts.auto) opts.auto = false;
            $play && $play.show().siblings().hide();
            _autoTime && clearTimeout(_autoTime);
            _autoTime = null
        };
        var h = {
            trigger: function(i) {
                if (opts.trigger != "mouseover" && opts.trigger != "mouseenter") {
                    _this.tab(i)
                } else {
                    _delay && clearTimeout(_delay);
                    _delay = setTimeout(function() {
                        _this.tab(i)
                    },
                    opts.delay)
                }
            },
            roll: function(i, a) {
                var b = $cont.eq(0),
                $roLast = $cont.eq( - 1),
                $roNow = $cont.eq(i),
                _roDir = opts.direct,
                _roLen = 0,
                _isNext = a == "next" && i == 0,
                _isPrev = a == "prev" && i == _all - 1;
                if (_isR) _roDir = "left";
                if (_isBtm) _roDir = "top";
                _roLen = -$roNow.position()[_roDir];
                if (opts.loop) {
                    if (_isNext) {
                        if (_isL || _isTop) {
                            _roLen = -$roLast.position()[_roDir] - $roLast[_roDir == "left" ? "outerWidth": "outerHeight"](true)
                        } else {
                            _roLen = -b.position()[_roDir];
                            $roll.css(_roDir, -b.position()[_roDir] - b[_roDir == "left" ? "outerWidth": "outerHeight"](true))
                        }
                    }
                    if (_isPrev) {
                        if (_isL || _isTop) {
                            _roLen = -$roLast.position()[_roDir];
                            $roll.css(_roDir, _roLen - $roLast[_roDir == "left" ? "outerWidth": "outerHeight"](true))
                        } else {
                            _roLen = -b.position()[_roDir] - b[_roDir == "left" ? "outerWidth": "outerHeight"](true)
                        }
                    }
                } else {
                    if (_isL && $roll.width() - $roNow.position().left < bodyCSS.width + contCSS.margin[3]) {
                        _roLen = -($roNow.position().left - (bodyCSS.width + contCSS.margin[3] - ($roll.width() - $roNow.position().left)));
                        _this.get.all = _all = _num = i + 1;
                        if ($next) $next.addClass("tabnextno")[0].title = opts.lang.last[0]
                    } else if (_isTop && $roll.height() - $roNow.position().top < bodyCSS.height + contCSS.margin[0] + contCSS.margin[2]) {
                        _roLen = -($roNow.position().top - (bodyCSS.height + contCSS.margin[0] + contCSS.margin[2] - ($roll.height() - $roNow.position().top)));
                        _this.get.all = _all = _num = i + 1;
                        if ($next) $next.addClass("tabnextno")[0].title = opts.lang.last[0]
                    }
                }
                $roll.stop(false, true).animate(_roDir == "left" ? {
                    left: _roLen
                }: {
                    top: _roLen
                },
                opts.last, _easing,
                function() {
                    if (opts.loop) {
                        if (_isNext) $roll.css(_roDir, (_isL || _isTop) ? 0 : _roLen);
                        if (_isPrev) $roll.css(_roDir, -$roLast.position()[_roDir])
                    }
                    _tabable = true
                });
                h.resize($roNow, opts.resize)
            },
            resize: function(a, b) {
                if (!b) return;
                var c = a.width(),
                objHeight = a.height(),
                duration = opts.last && opts.last * 2 > opts.stall ? parseInt(opts.stall) - 200 : opts.last * 2;
                if (g.css("float") != "none" && $body.width() == 0) {
                    if (_isTop || _isBtm) $cont.css({
                        float: "left",
                        clear: "left"
                    });
                    $body.width("auto");
                    a.width() < $body.width() && a.width($body.width());
                    c = a.width();
                    objHeight = a.height();
                    $body.stop().animate({
                        height: objHeight,
                        width: c
                    },
                    duration)
                } else {
                    if (a.outerWidth(true) != $body.width() && !_isCol && opts.action != "slifade") a.width($body.width());
                    $body.stop().animate({
                        height: objHeight
                    },
                    duration)
                }
            },
            process: function() {
                switch (true) {
                case opts.process.indexOf("w+") > -1 : $process.stop().width(0).animate({
                        width: opts.process.split("+")[1] ? parseInt(opts.process.split("+")[1]) : g.width()
                    },
                    opts.stall);
                    break;
                case opts.process.indexOf("w-") > -1 : $process.stop().width(opts.process.split("-")[1] ? parseInt(opts.process.split("-")[1]) : g.width()).animate({
                        width: 0
                    },
                    opts.stall);
                    break;
                case opts.process.indexOf("h+") > -1 : $process.stop().height(opts.process.split("+")[1] ? parseInt(opts.process.split("+")[1]) : g.height()).hide().slideDown(opts.stall);
                    break;
                case opts.process.indexOf("h-") > -1 : $process.stop().height(opts.process.split("+")[1] ? parseInt(opts.process.split("+")[1]) : g.height()).show().slideUp(opts.stall);
                    break;
                default:
                    $process.stop().width(g.width()).animate({
                        width:
                        0
                    },
                    opts.stall)
                }
            }
        };
        var j = {
            scroll: function(b) {
                switch (b) {
                case "ins":
                    $title.append($scroll = $("<ins class='tabscroll' style='text-decoration:none'/>"));
                    break;
                case "fill":
                    $title.css({
                        overflow:
                        $title.css("overflow") != "hidden" ? "hidden": "",
                        position: $title.css("position") == "static" ? "relative": ""
                    });
                    _titleHeight = $title.height();
                    $scroll.append($left = $("<i class='tableft tableftno' style='display:none;cursor:pointer' title='" + opts.lang.first[0] + "'>" + opts.lang.left[1] + "</i>").click(function(a, t) {
                        if ($btn.first().is(":visible")) return false;
                        $right.removeClass("tabrightno")[0].title = opts.lang.right[0];
                        $title.find(".tabbtn:visible").first().prev().show(t ? t: 200,
                        function() {
                            if ($btn.first().is(":visible")) $left.addClass("tableftno")[0].title = opts.lang.first[0]
                        })
                    }), $right = $("<i class='tabright' style='display:none;cursor:pointer' title='" + opts.lang.right[0] + "'>" + opts.lang.right[1] + "</i>").click(function(a, t) {
                        if ($btn.filter(":visible").length == 1 || $btn.filter(":visible").last()[0] && $btn.filter(":visible").last().position().top + ($btn.css("float") != "none" ? 2 : 0) < _titleHeight) return false;
                        $left.removeClass("tableftno")[0].title = opts.lang.left[0];
                        $btn.filter(":visible").first().hide(t ? t: 200,
                        function() {
                            if ($btn.filter(":visible").last().position().top + ($btn.css("float") != "none" ? 2 : 0) < _titleHeight) $right.addClass("tabrightno")[0].title = opts.lang.last[0]
                        })
                    }));
                    break;
                default:
                    var c = $btn.last().position().top + ($btn.css("float") != "none" ? 2 : 0);
                    if (b == "del" && $btn.not(":visible").length > 0) $btn.not(":visible").last().show(200);
                    if (c > _titleHeight) {
                        $scroll.css({
                            position: "absolute",
                            "z-index": 99
                        }).children().fadeIn();
                        if ($btn.css("float") != "none") {
                            $scroll.css({
                                top: 0,
                                right: 0
                            });
                            $title.css({
                                "padding-right": $scroll.outerWidth(true),
                                height: _titleHeight
                            })
                        } else {
                            $scroll.css({
                                bottom: 0
                            });
                            $title.css({
                                height: _titleHeight - $scroll.outerHeight(true),
                                "padding-bottom": $scroll.outerHeight(true) + $btn.outerHeight(true)
                            })
                        }
                    } else if (c <= _titleHeight && $btn.first().is(":visible")) {
                        if (b == "add") return;
                        $scroll.attr("style", "text-decoration:none").find("i").fadeOut();
                        $title.css({
                            "padding-right": "",
                            "padding-bottom": "",
                            height: ""
                        })
                    }
                }
            },
            add: function(a) { ($fold ? $fold: $scroll)[$fold ? "after": "prepend"]($add = $("<b class='tabadd' style='cursor:pointer' title='" + opts.lang.add[0] + "'>" + opts.lang.add[1] + "</b>").click(function() {
                    _this.add()
                }));
                $fold && $add.removeClass().wrap("<" + a + " class='tabadd'/>")
            },
            del: function(n) { (n > -1 ? $btn.eq(n) : $btn).wrapInner("<kbd/>").append($del = $("<sup class='tabdel' style='cursor:pointer;display:none' title='" + opts.lang.del[0] + "'>" + opts.lang.del[1] + "</sup>")).bind({
                    mouseover: function() {
                        $(this).find(".tabdel").show()
                    },
                    mouseout: function() {
                        $(this).find(".tabdel").hide()
                    }
                }).find(".tabdel").click(function() {
                    _this.del($(this).parent())
                })
            },
            process: function(a) {
                opts.process = $.trim(opts.process.toString().toLowerCase());
                g.append($process = $("<" + a + " class='tabprocess' style='overflow:hidden;" + (opts.process.split("#")[1] ? "background-color:#" + opts.process.split("#")[1] : "") + "'/>"));
                if (opts.process.split("#")[0]) opts.process = opts.process.split("#")[0];
                if ($process.height() == 0) $process.height("100%");
                if ($process.width() == 0) $process.width("100%");
                if (opts.process.indexOf("w") > -1) $process.height(parseInt(opts.process.split("w")[0]));
                if (opts.process.indexOf("h") > -1) $process.width(parseInt(opts.process.split("h")[0]))
            },
            column: function(a) {
                if (!opts.loop) {
                    if (_isR) _isR = false,
                    _isL = true,
                    opts.direct = "left";
                    if (_isBtm) _isBtm = false,
                    _isTop = true,
                    opts.direct = "top"
                }
                _all = _all / opts.column;
                _all = _all > Math.round(_all) ? Math.round(_all) + 1 : Math.round(_all);
                for (var i = 0; i < _all; i++) {
                    $child.slice(i * opts.column, i * opts.column + opts.column).wrapAll("<" + e.tagName.toLowerCase() + "/>")
                }
                $child = g.children().not(opts.except)
            },
            except: function(b) {
                g.find(opts.except).addClass("tabexcept").each(function() {
                    var a = this.tagName.toLowerCase(),
                    isH = a.indexOf("h") > -1 ? "tabexcept-title": "";
                    if (isH) {
                        if (b == "dd") {
                            $(this).ChangeTag("dt." + isH)
                        } else if (b == "li") {
                            $(this).wrapInner("<" + a + ">").ChangeTag("li." + isH);
                            opts.except += "," + this.className
                        } else $(this).addClass(isH)
                    }
                });
                $child = g.children().not(opts.except);
                _all = $child.length
            },
            nav: function(a, b, c) {
                g.append($nav = $('<' + a + ' class="tabnav"/>'));
                $nav.append($prev = $('<em class="tabprev" title="' + opts.lang.prev[0] + '">' + opts.lang.prev[1] + '</em>').click(function() {
                    this.className.indexOf("no") < 0 && _this.tab("prev")
                }), '<span class="tabpage"/>', $next = $('<em class="tabnext" title="' + opts.lang.next[0] + '">' + opts.lang.next[1] + '</em>').click(function() {
                    this.className.indexOf("no") < 0 && _this.tab("next")
                }));
                if (!_isCol || opts.loop) $nav.find("span").append($now = $('<b class="tabnow">' + b + '</b>'), '<i>&nbsp;/&nbsp;</i>', $all = $('<b class="taball">' + c + '</b>'))
            },
            ctrl: function(a) {
                g.append($ctrl = $('<' + a + ' class="tabctrl"/>'));
                $ctrl.append($pause = $('<b class="tabpause" title="' + opts.lang.pause[0] + '">' + opts.lang.pause[1] + '</b>').click(function() {
                    opts.auto = false;
                    _this.pause()
                }), $play = $('<b class="tabplay" title="' + opts.lang.play[0] + '" style="display:none">' + opts.lang.play[1] + '</b>').click(function() {
                    opts.auto = true;
                    _this.play()
                }))
            },
            fold: function(a) {
                switch (a) {
                case "horiz":
                    var b = 0;
                    contCSS = j.css($cont);
                    $btn.css("float", "left").each(function() {
                        b += $(this).outerWidth(true)
                    });
                    $cont.css({
                        float: "left",
                        width: g.width() - b - contCSS.padding[1] - contCSS.padding[3] - contCSS.margin[1] - contCSS.margin[3] - contCSS.border[1] - contCSS.border[3]
                    });
                    contCSS.width = $cont.width();
                    g.height(Math.max(parseInt($btn.outerHeight(true)), parseInt($cont.outerHeight(true))));
                    if (opts.action == "slide") g.css("overflow", "hidden");
                    break;
                default:
                    g.prepend($fold = $("<" + _tag + " style='display:none!important'/>"));
                    if (opts.action == "slifade") opts.action = "fade";
                    if (_isRoll) opts.action = "slide"
                }
            },
            roll: function(a) {
                switch (a) {
                case "dir":
                    contCSS = j.css($cont);
                    if (_isX) {
                        if (bodyCSS.width == 0) {
                            $body.width(bodyCSS.width = g.width() - $title.outerWidth(true) - bodyCSS.padding[1] - bodyCSS.padding[3] - bodyCSS.margin[1] - bodyCSS.margin[3] - bodyCSS.border[1] - bodyCSS.border[3]);
                            $cont.css({
                                marginLeft: contCSS.margin[3] = bodyCSS.padding[3],
                                marginRight: contCSS.margin[1] = bodyCSS.padding[1]
                            })
                        }
                        if (!- [1, ]) $roll.width(99999);
                        $cont.css("float", "left");
                        if (!opts.loop && contCSS.margin[1] > 0) $cont.last().css("margin-right", 0); ! _isCol && $cont.width(bodyCSS.width);
                        for (var i = 0; i < _all; i++) _rollWidth += $cont.eq(i).outerWidth(true);
                        $roll.css({
                            marginTop: bodyCSS.padding[0],
                            marginLeft: bodyCSS.padding[3] - contCSS.margin[3],
                            width: _rollWidth * (opts.loop ? 2 : 1),
                            overflow: "hidden",
                            zoom: 1
                        });
                        if (( - [1, ] ? bodyCSS.height: $body.height()) == 0) setTimeout(function() {
                            $body.height($cont.outerHeight(true))
                        },
                        500);
                        if (_isCol && !opts.loop && bodyCSS.width != contCSS.width) $title.hide()
                    } else {
                        if (contCSS.margin[2] < bodyCSS.padding[2]) $cont.css("margin-bottom", contCSS.margin[2] = bodyCSS.padding[2]);
                        $roll.css({
                            marginLeft: bodyCSS.padding[3],
                            marginTop: bodyCSS.padding[0] - contCSS.margin[3]
                        });
                        if (( - [1, ] ? bodyCSS.height: $body.height()) == 0) {
                            setTimeout(function() {
                                $body.height(bodyCSS.height = contCSS.height)
                            },
                            500)
                        } else {
                            if (_isCol && !opts.loop && bodyCSS.height != contCSS.height) $title.hide()
                        }
                    } (_isR || _isBtm) && $roll.html($cont.get().reverse());
                    opts.loop && $roll.append($roll.children().clone());
                    break;
                default:
                    bodyCSS = j.css($body);
                    $body.css("overflow", "hidden").append($roll = $("<div class='tabroll' style='position:absolute;top:0;left:0;'/>"));
                    if (bodyCSS.position == "static") $body.css("position", "relative")
                }
                if (opts.full) {
                    $(window).resize(function() {
                        $body.find(".tabcont").width(g.width()).height(g.height());
                        $roll.css({
                            left: _isX ? -g.width() * (_this.get.now - 1) : 0,
                            top: _isX ? 0 : -g.height() * (_this.get.now - 1),
                            width: _isX ? g.width() * _all * (opts.loop ? 2 : 1) : "",
                            height: _isX ? "": g.height() * _all * (opts.loop ? 2 : 1)
                        })
                    })
                }
            },
            css: function(a) {
                return {
                    width: a.width(),
                    height: a.height(),
                    padding: [parseInt(a.css("padding-top")) || 0, parseInt(a.css("padding-right")) || 0, parseInt(a.css("padding-bottom")) || 0, parseInt(a.css("padding-left")) || 0],
                    margin: [parseInt(a.css("margin-top")) || 0, parseInt(a.css("margin-right")) || 0, parseInt(a.css("margin-bottom")) || 0, parseInt(a.css("margin-left")) || 0],
                    border: [parseInt(a.css("border-top-width")) || 0, parseInt(a.css("border-right-width")) || 0, parseInt(a.css("border-bottom-width")) || 0, parseInt(a.css("border-left-width")) || 0],
                    position: a.css("position")
                }
            },
            ajax: function(a, b) {
                if (b.substr(0, 1) == "#") {
                    $(b) && a.html($(b).clone().show())
                } else {
                    a.load(b,
                    function(s) { ! s && a.html(opts.lang.empty)
                    })
                }
            },
            iframe: function(a, b) {
                a.html($("<iframe id='tabiframe" + $(".tabiframe").length + 1 + "' class='tabiframe' src='" + b + "' frameborder='0' scroll='auto' width='100%' height='100%'/>").load(function() {
                    if (b.indexOf("http://") > -1) {
                        this.height = b.split("h:")[1] ? b.split("h:")[1] + "&".split("&")[0] : "" || 200
                    } else {
                        this.height = $(this).contents().height();
                        this.width = $(this).contents().width();
                        if (a.css("overflow") != "auto") a.css("overflow", "auto")
                    }
                    if (_isRoll || opts.action == "slifade") $body.animate({
                        height: this.height
                    })
                }))
            }
        }
    };
    KandyTabs.defaults = {
        classes: "kandyTabs",
        id: "",
        btn: "",
        cont: "",
        type: "tab",
        trigger: "mouseover",
        hover: "",
        action: "toggle",
        full: false,
        easing: "linear",
        custom: {},
        delay: 200,
        last: 400,
        current: 1,
        direct: "top",
        column: 0,
        except: "",
        child: [],
        ready: {},
        done: {},
        auto: false,
        stall: 5000,
        scroll: false,
        add: false,
        del: false,
        process: false,
        ctrl: false,
        nav: false,
        loop: false,
        resize: true,
        lang: {
            left: ["\u524D\u4E00\u4E2A\u9009\u9879", "&lt;"],
            right: ["\u540E\u4E00\u4E2A\u9009\u9879", "&gt;"],
            first: ["\u5DF2\u662F\u9996\u4E2A", "&lt;"],
            prev: ["\u524D\u4E00\u4E2A", "&lt;"],
            next: ["\u540E\u4E00\u4E2A", "&gt;"],
            last: ["\u5DF2\u662F\u672B\u4E2A", "&gt;"],
            add: ["\u65b0\u589e\u9009\u9879", "+"],
            del: ["\u5220\u9664\u9009\u9879", "x"],
            play: ["\u64AD\u653E", "&gt;&gt;"],
            pause: ["\u6682\u505C", "&#124; &#124;"],
            btn: "\u65b0\u9009\u9879",
            cont: "\u65b0\u5185\u5bb9",
            empty: "\u6682\u65E0\u5185\u5BB9"
        }
    };
    $.fn.ChangeTag = function(c) {
        var d = /^(a|abbr|br|button|hr|i|iframe|img|input|ins|label|ol|ul)$/i,
        tarTag = c ? c: "div";
        return this.each(function() {
            var a = -[1, ] ? this.tagName.toLowerCase() : this.tagName,
            newTag = tarTag.indexOf(".") > -1 ? (tarTag.split(".")[0] ? tarTag.split(".")[0] : (d.test(a) ? "div": a)) : tarTag,
            clsTag = tarTag.indexOf(".") > -1 ? tarTag.substr(tarTag.indexOf(".") + 1, tarTag.length).replace(".", " ") : "";
            if (d.test(a)) {
                $(this).wrap("<" + newTag + "/>").parent().addClass(clsTag)
            } else {
                var b = $(this).addClass(clsTag).wrap("<div/>").parent().html().replace("<" + a, "<" + newTag).replace("</" + a + ">", "</" + newTag + ">");
                $(this).unwrap().replaceWith(b)
            }
        })
    }
})(jQuery);