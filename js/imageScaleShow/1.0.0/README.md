# imageScaleShow
类淘宝京东商品内页，商品相册鼠标浮上放大显示

## 简介
类淘宝京东商品内页，给一个图片列表，其中包含缩略图，中等大小的图，大图，就可以将鼠标浮上时实现局部大图查看效果

## 特点
js配置性质指定大图路径，鼠标置于图片上再加载大图，可以减小加载大图带来的页面加载速度损耗

## Demo
demo样式见: [imageScaleShow demo](http://cdn.heanes.com/js/imageScaleShow/1.0.0/demo/ "imageScaleShow demo")

## 使用说明
imageScaleShow.js调用很简单，只需普通jQuery插件使用的三步即可:
#### 第一步：页面头部引入样式文件
    <link type="text/css" rel="stylesheet" href="css/imageScaleShow.css">
#### 第二步：引入js脚本
    // jQuery库依赖
    <script type="text/javascript" src="js/jquery.min.js"></script>

    // autoCatalog.js
    <script type="text/javascript" src="js/imageScaleShow.js"></script>

#### 第三步：imageScaleShow
    // 配置
    $('#pictureList').imageScaleShow({
        // 小图资源路径列表
        'imageSmallSrcList': [
            'image/small/01.jpg',
            'image/small/02.jpg',
            'image/small/03.jpg',
            'image/small/04.jpg',
            'image/small/05.jpg'
        ],
        // 中图资源路径列表
        'imageMiddleSrcList': [
            'image/middle/01.jpg',
            'image/middle/02.jpg',
            'image/middle/03.jpg',
            'image/middle/04.jpg',
            'image/middle/05.jpg'
        ],
        // 大图资源路径列表
        "imageBigSrcList": [
           'image/big/01.jpg',
           'image/big/02.jpg',
           'image/big/03.jpg',
           'image/big/04.jpg',
           'image/big/05.jpg',
           'image/big/06.jpg'
       ]
    });


## 参数说明
- `imageSmallSrcList`
  - **数据类型**： 数组,数组内元素无个数限制
  - **默认值**： `[]`
  - **含义**： 小图资源路径列表
  - **示例**： `[
                    'image/small/01.jpg',
                    'image/small/02.jpg',
                    'image/small/03.jpg'
                ]`
                
- `imageMiddleSrcList`
  - **数据类型**： 数组,数组内元素无个数限制
  - **默认值**： `[]`
  - **含义**： 中图资源路径列表
  - **示例**： `[
                    'image/middle/01.jpg',
                    'image/middle/02.jpg',
                    'image/middle/03.jpg'
                ]`

- `imageBigSrcList`
    - **数据类型**： 数组,数组内元素无个数限制
    - **默认值**： `[]`
    - **含义**： 大图资源路径列表，js指定，可以减少一次性加载大图带来的加载速度损耗,若不指定则将直接将中图放大显示
    - **示例**： `[
                      'image/big/01.jpg',
                      'image/big/02.jpg',
                      'image/big/03.jpg'
                  ]`

## License
* 本项目的所有代码按照 [MIT License](https://github.com/racaljk/hosts/blob/master/LICENSE) 发布
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)

