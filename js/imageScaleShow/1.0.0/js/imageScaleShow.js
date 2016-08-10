/**
 * @doc 鼠标浮上时放大显示效果，类淘宝京东商品内页图片浏览效果
 * @author FangGang,Heanes,heanes@163.com
 * @time 2016-08-09 11:29:26 周二
 */
"use strict";
!(function ($, window, undefined) {
    $.fn.imageScaleShow = function (userConf) {
        var defaultConf = {
                // 大图资源
                'imageBigSrcList': []
            },
            conf = $.extend({}, defaultConf, userConf || {});
        var $imageScaleShow = this;
        var $imageThumbList = $imageScaleShow.find('.image-thumb .thumb-list a');
        var $imageShowList = $imageScaleShow.find('.image-show .show-list li');
        var $imageShowBig = $imageScaleShow.find('.image-show-big');
        $imageShowBig.append('<img class="image-big"/>');
        var $imageShowBigImg = $imageShowBig.find('img');

        // 大图资源处理
        var imageBigSrcList = conf.imageBigSrcList.length > 0 ? conf.imageBigSrcList : [];
        if(imageBigSrcList == [] || imageBigSrcList.length == 0){
            $imageShowList.find('img').each(function(i, item){
                imageBigSrcList.push($(item).attr('src'));
            });
        }

        // 缩略图点击切换
        var selectImage = 0;
        $imageThumbList.each(function(i, item){
            $(item).on('click mouseenter', function(){
                $imageThumbList.removeClass('selected');
                $(this).addClass('selected');
                $imageShowList.removeClass('show');
                $imageShowList.eq(i).addClass('show');
                selectImage = i;
                $imageShowBigImg.attr('src', imageBigSrcList[i]);
            });
        });
        // 缩略图导航左右切换
        var $thumbListUl = $imageScaleShow.find('.image-thumb .thumb-list');
        var $thumbListLi = $thumbListUl.find('li');
        var thumbOneWidth = $thumbListLi.outerWidth(true);
        $thumbListUl.css({'width': ($thumbListLi.length + 1) * thumbOneWidth});
        var thumbNavClickCount = 0;
        $('#thumbNavRight').on('click', function () {
            var left = parseInt($thumbListUl.css('left'));
            left = isNaN(left) ? 0 : left;
            if(thumbNavClickCount > $thumbListLi.length - 6) return;
            $thumbListUl.animate({'left': (left - thumbOneWidth)});
            thumbNavClickCount++;
            // 把左侧的设置为选中
            if(selectImage <= thumbNavClickCount){
                selectImage++;
                $imageThumbList.eq(thumbNavClickCount).trigger('click');
            }
        });
        $('#thumbNavLeft').on('click', function () {
            var left = parseInt($thumbListUl.css('left'));
            left = isNaN(left) ? 0 : left;
            if(thumbNavClickCount <= 0) return;
            $thumbListUl.animate({'left': (left + thumbOneWidth)});
            thumbNavClickCount--;
            if(selectImage >= ($thumbListLi.length - thumbNavClickCount - 1)){
                selectImage--;
                $imageThumbList.eq(selectImage).trigger('click');
            }
        });

        // 鼠标浮上放大
        var $imageShow = $imageScaleShow.find('.image-show');
        var $cursorSelectArea = $imageScaleShow.find('#cursorSelectArea');
        var imageShowPositionTop = $imageShow.position().top, imageShowPositionLeft = $imageShow.position().left;
        var imageShowOffsetTop = $imageShow.offset().top, imageShowOffsetLeft = $imageShow.offset().left;
        var selectWidth = $cursorSelectArea.width(), selectHeight = $cursorSelectArea.height();
        var moveXMax = imageShowPositionLeft + $imageShow.width() - selectWidth, moveYMax = imageShowPositionTop + $imageShow.height() - selectHeight;
        var scaleRatio = $imageShowBigImg.width() / $imageShow.width();

        $imageShow.on({
            mouseenter: function() {
                $imageShowBig.show();
            },
            mouseleave: function() {
                $imageShowBig.hide();
                $cursorSelectArea.hide();
            },
            mousemove: function (event) {
                var cursorX = event.pageX, cursorY = event.pageY;
                var moveOffsetLeft = cursorX - imageShowOffsetLeft - selectWidth / 2;
                var moveOffsetTop = cursorY - imageShowOffsetTop - selectHeight / 2;
                var moveLeft = moveOffsetLeft > 0 ? moveOffsetLeft : 0;
                var moveTop = moveOffsetTop > 0 ? moveOffsetTop : 0;
                moveLeft = moveLeft > moveXMax ? moveXMax : moveLeft;
                moveTop = moveTop > moveYMax ? moveYMax : moveTop;
                $cursorSelectArea.css({
                    'left': moveLeft,
                    'top': moveTop
                });
                $cursorSelectArea.show();
                // 放大的图片移动位子
                $imageShowBigImg.css({
                    'left': -moveLeft * scaleRatio,
                    'top': -moveTop * scaleRatio
                });
            }
        });
    }
}(jQuery, window));