/**
 * @doc 树形浏览插件
 * @author Heanes
 * @time 2016-11-28 17:11:27 周一
 */
;(function ($, window, document, undefined) {
    "use strict";
    var pluginName = 'treeView';

    var _default = {};
    _default.settings = {
        data: '',                       // 列表树上显示的数据
        getDataUrl: '',                 // 菜单数据获取的URL
        nodeIcon: 'fa fa-list',         // 节点图标
        nodeIconType: '',               // todo 节点图标展示方式，icon-图标样式，img-传入图片
        iconCollapse: '',               // 合上时的图标
        iconExpand: '',                 // 展开时的图标
        iconEmpty: 'icon-empty',        // 空节点时图标
        colorOnHover: '',               // 鼠标浮上时的前景颜色
        backgroundColorOnHover: '',     // 鼠标浮上时的背景颜色
        showIcon: true,                 // 是否显示图标
        collapseOnIcon: false,          // todo 点击折叠图标才折叠菜单

        enableTopSwitch: false,         // 开启顶部切换标识
        topSwitcherTarget: '',          // 开启了顶部切换后，根节点展示在此处(填写jQuery选择器支持的字符)

        enableIndentLeft: false,        // 是否允许向左缩进
        indentLeftDelay: 1000,          // 向左缩进的动画延时毫秒数

        multiSelect: false,

        // 事件处理
        onNodeSelected: undefined,      // 点击节点事件
        onNodeCollapsed: undefined,     // 节点折叠事件
        onNodeExpanded: undefined,      // 节点展开事件
        onTopSwitch: undefined,         // 顶部切换事件
        onTreeIndentLeft: undefined,    // 树向左边缩进事件

        // 待用
        some: ''                        // 待用
    };
    _default.options = {
        silent: false,
        ignoreChildren: false
    };

    var TreeView = function (element, options) {
        this.$element = $(element);
        this.init(options);

        return {
            // Options (public access)
            options: this.options,

            // Initialize / destroy methods
            init:                   $.proxy(this.init, this),
            remove:                 $.proxy(this.remove, this),

            // Methods
            // Expand / collapse methods
            collapseAll:            $.proxy(this.collapseAll, this),
            collapseNode:           $.proxy(this.collapseNode, this),
            expandAll:              $.proxy(this.expandAll, this),
            expandNode:             $.proxy(this.expandNode, this),
            toggleExpandedState:    $.proxy(this.toggleExpandedState, this),

            // 事件
            selectNode:             $.proxy(this.selectNode, this),

            // prepare use
            test:                   $.proxy(this.test, this)
        };
    };

    /**
     * @doc 初始化
     * @param options
     */
    TreeView.prototype.init = function (options) {
        this.tree = [];
        this.nodes = [];

        if (options.data) {
            if (typeof options.data === 'string') {
                options.data = $.parseJSON(options.data);
            }
            this.tree = $.extend(true, [], options.data);
            delete options.data;
        }
        this.options = $.extend({}, _default.settings, options);

        // 顶部根节点切换
        if(this.options.enableTopSwitch && this.options.topSwitcherTarget){
            this.$treeTopTarget = $(this.options.topSwitcherTarget);
            if(this.$treeTopTarget && this.$treeTopTarget.length > 0){
                this.enableTopSwitch = true;
            }
        }
        // 向左缩进
        if(this.options.enableIndentLeft){
            this.enableIndentLeft = true;
        }

        this.setInitialStates({ nodes: this.tree }, 0);
        this.render();
        this.subscribeEvents();
    };

    /**
     * @doc 状态相关初始化
     * @param node
     * @param level
     */
    TreeView.prototype.setInitialStates = function (node, level) {
        if (!node.nodes) return;
        level += 1;

        var parent = node;
        var _this = this;
        $.each(node.nodes, function checkStates(index, node) {
            // 节点ID，每push一次将会增加一次长度，从而使nodeId变成唯一的一个自增索引值
            node.nodeId = _this.nodes.length;
            // 节点父ID
            node.parentId = parent.nodeId;

            // 状态相关
            node.state = node.state || {};

            _this.nodes.push(node);
            // 递归
            if (node.nodes) {
                _this.setInitialStates(node, level);
            }
        });

    };
    /**
     * @doc 各类事件绑定
     */
    TreeView.prototype.subscribeEvents = function () {
        // 点击折叠/展开
        this.$element.on('click', $.proxy(this.clickHandler, this));
        // 向左缩进

        // 顶部根节点切换
        if(this.enableTopSwitch){
            this.$treeTopTarget.on('click', $.proxy(this.switchHandler, this));
        }

        // 用户定义的传入的事件
        if (typeof (this.options.onNodeSelected) === 'function') {
            this.$element.on('nodeSelected', this.options.onNodeSelected);
        }
        if (typeof (this.options.onTopSwitch) === 'function') {
            this.$element.on('topSwitch', this.options.onTopSwitch);
        }
        if (typeof (this.options.onTreeIndentLeft) === 'function') {
            this.$element.on('treeIndentLeft', this.options.onTreeIndentLeft);
        }

    };

    /**
     * @doc 点击切换左侧树
     */
    TreeView.prototype.switchHandler = function (event) {
        var $target = $(event.target);
        var $nodeDom = this.findNodeDom($target);
        if(!$nodeDom) return;
        $nodeDom.parent().children().removeClass('active');
        $nodeDom.addClass('active');
        // console.log($target);
    };

    /**
     * @doc 点击事件绑定
     */
    TreeView.prototype.clickHandler = function (event) {
        var $target = $(event.target);
        var $nodeDom = this.findNodeDom($target);
        var node = this.findNode($nodeDom);

        // 左侧树折叠
        if(!node && this.options.enableIndentLeft){
            var $lapHandle = this.findLapDom($target);
            if($lapHandle){
                this.toggleLap($lapHandle, _default.options);
            }
        }

        if (!node || node.state.disabled) return;

        var classList = [];
        var $iconList = $nodeDom.find('i.icon');
        $iconList.each(function getNodeIconClassList(i, item) {
            $(item).attr('class') ? classList = classList.concat($(item).attr('class').split(' ')) : null;
        });
        $.unique(classList);

        // 节点相关事件
        if(classList.indexOf('node-collapse-expand-icon') != -1){
            this.toggleExpandedState(node, _default.options);
            this.render();
        }else{

            if (node.selectable) {
                // 节点选择
                this.toggleSelectedState(node, _default.options);
            } else {
                this.toggleExpandedState(node, _default.options);
            }
            this.render();
        }
        // todo 节点check选中事件
    };

    /**
     * @doc 交替缩进
     * @param $lapDom
     * @param options
     */
    TreeView.prototype.toggleLap = function ($lapDom, options) {
        if (!$lapDom || $lapDom.length == 0) return;
        // todo 向左缩进的延时动画
        this.$lapHandle.toggleClass('lapped');
        this.$treeLeftWrap.toggleClass('lapped');
    };

    /**
     * @doc 交替展开折叠状态
     * @param node
     * @param options
     */
    TreeView.prototype.toggleExpandedState = function (node, options) {
        if (!node) return;
        this.setExpandedState(node, !node.state.expanded, options);
    };

    /**
     * @doc 设置节点为展开状态
     * @param node
     * @param state
     * @param options
     */
    TreeView.prototype.setExpandedState = function (node, state, options) {
        if (state === node.state.expanded) return;

        if (state && node.nodes) {
            node.state.expanded = true;
        } else if (!state) {

            // Collapse a node
            node.state.expanded = false;
            if (!options.silent) {
                this.$element.trigger('nodeCollapsed', $.extend(true, {}, node));
            }

            // Collapse child nodes
            if (node.nodes && !options.ignoreChildren) {
                $.each(node.nodes, $.proxy(function (index, node) {
                    this.setExpandedState(node, false, options);
                }, this));
            }
        }
    };

    /**
     * @doc 查找节点
     * @param $target
     * @returns {*}
     */
    TreeView.prototype.findNode = function ($target) {
        var $nodeDom;
        if(!$target.attr('data-nodeId')){
            $nodeDom = this.findNodeDom($target);
        }else{
            $nodeDom = $target;
        }
        var nodeId = $nodeDom.attr('data-nodeId');
        var node = this.nodes[nodeId];

        if (!node) {
            console.log('Error: node does not exist');
        }
        return node;
    };

    /**
     * @doc 查找节点dom
     * @param $target
     * @returns {*}
     */
    TreeView.prototype.findNodeDom = function ($target) {
        var $nodeDom = $target.closest('li.tree-node');

        if (!$nodeDom || $nodeDom.length == 0) {
            console.log('Error: nodeDom does not exist');
        }
        console.log('findNodeDom:');
        console.log($nodeDom);
        return $nodeDom;
    };

    /**
     * @doc 搜索多个节点
     * @param pattern
     * @param modifier
     * @param attribute
     * @returns {*}
     */
    TreeView.prototype.findNodes = function (pattern, modifier, attribute) {

        modifier = modifier || 'g';
        attribute = attribute || 'text';

        var _this = this;
        return $.grep(this.nodes, function (node) {
            var val = _this.getNodeValue(node, attribute);
            if (typeof val === 'string') {
                return val.match(new RegExp(pattern, modifier));
            }
        });
    };

    /**
     * @doc 获取节点值
     * @param obj
     * @param attr
     * @returns {*}
     */
    TreeView.prototype.getNodeValue = function (obj, attr) {
        var index = attr.indexOf('.');
        if (index > 0) {
            var _obj = obj[attr.substring(0, index)];
            var _attr = attr.substring(index + 1, attr.length);
            return this.getNodeValue(_obj, _attr);
        }
        else {
            if (obj.hasOwnProperty(attr)) {
                return obj[attr].toString();
            }
            else {
                return undefined;
            }
        }
    };

    /**
     * @doc 查找折叠按钮dom
     * @param $target
     */
    TreeView.prototype.findLapDom = function ($target) {
        var $lapDom = $target.closest('.lap-handle');
        if (!$lapDom || $lapDom.length == 0) {
            console.log('Error: lapDom does not exist');
            return null;
        }
        return $lapDom;
    };

    /**
     * @doc 获取节点是否是展开状态
     * @param nodeData 节点数据
     * @returns {boolean}
     * @author Heanes
     * @time 2016-11-29 19:37:05 周二
     */
    TreeView.prototype.getIsExpanded = function (nodeData) {
        return nodeData.state != undefined ? (nodeData.state.expanded != undefined && nodeData.state.expanded) : false;
    };
    /**
     * @doc 渲染左侧菜单
     * @author Heanes
     * @time 2016-11-29 16:49:23 周二
     */
    TreeView.prototype.render = function () {
        if (!this.initialized) {

            // 左侧树缩略
            this.$lapHandle = '';
            if(this.options.enableIndentLeft){
                this.$lapHandle = $(this.template.lapHandle);
            }

            // 左侧树
            this.$treeLeftWrap = $(this.template.treeLeftWrap);

            this.initialized = true;
        }

        // 顶部根节点切换
        if(this.enableTopSwitch){
            this.$treeTop = $(this.template.treeTop);
            this.$treeTopTarget.empty()
                .append(this.$treeTop.empty());
        }

        // 左侧树及顶部切换
        this.$element.empty()
            .append(this.$lapHandle)
            .append(this.$treeLeftWrap.empty());
        this.$treeLeftWrap.append(this.buildTree(this.tree, 0));
        // todo 如果没有任何节点是展开状态，则设置第一个节点为展开状态
    };

    /**
     * @doc 构建树
     * @param nodes
     * @param level
     */
    TreeView.prototype.buildTree = function (nodes, level, toSwitch) {
        if (!nodes) return;
        level += 1;
        //console.log(level);

        var _this = this;
        // 如果开启切换，则顶级当作0级
        if(_this.enableTopSwitch){
            level--;
        }
        toSwitch = toSwitch || false;
        if(toSwitch){
            level++;
            console.log('%c ' + level + ' out loop', 'background:#222;color:#3c8dbc;font-size:14px;');
        }

        var $treeUl = level == 1 ? '' : $(_this.template.treeLeftGroup);
        if(toSwitch) $treeUl = $(_this.template.treeLeftGroup);

        $.each(nodes, function addNodes(id, node) {
            // console.log('%c ' + level + ' in loop', 'background:#222;color:#bada55');
            // 在顶部不切换的情况下第一级节点都用ul包住，顶部切换时第二级节点用ul包住
            level <= 1 && !toSwitch ? $treeUl = $(_this.template.treeLeftGroup) : null;

            var $treeNodeLi = $(_this.template.node).attr('data-nodeId', node.nodeId);
            var $treeNodeWrap = $(_this.template.nodeWrap);

            // 顶部切换器
            if(level == 0){
                // 根节点放置在顶部切换
                // 添加图标icon
                if (_this.options.showIcon) {
                    var topIconClassList = ['node-icon'];
                    topIconClassList.push(node.nodeIcon || _this.options.nodeIcon);
                    $treeNodeWrap
                        .append($(_this.template.icon)
                            .addClass(topIconClassList.join(' '))
                        );
                }

                // 添加文字及链接
                $treeNodeWrap
                    .append($(_this.template.nodeText)
                        .append(node.text)
                    );
                // 添加到顶部切换器dom中
                _this.$treeTop
                    .append($treeNodeLi
                        .append($treeNodeWrap)
                    );

                var $treeLi = '';
                if(node.nodes){
                    // console.log(node.nodes);
                    $treeLi = $(_this.template.node);
                    _this.$treeLeftWrap.append(_this.buildTree(node.nodes, 0, true));
                }
                // console.log($treeLi.html());
                //_this.$treeLeftWrap.append($treeUl.append($treeLi));
                console.log('level 0 append');
            }
            else{
                // 左侧树
                // 按子菜单层级缩进
                if(level > 0){
                    console.log('%c' + level, 'background:#222;color:#3c8dbc;font-size:14px;');
                    for (var i = 0; i < (level - 1); i++) {
                        $treeNodeWrap.append(_this.template.indent);
                    }
                }

                // 添加折叠及其他样式
                var ceIconClassList = [];
                if (node.nodes && node.nodes.length > 0) {
                    ceIconClassList.push('node-collapse-expand-icon');
                    node.state.expanded ? ceIconClassList.push(_this.options.iconCollapse)
                        : ceIconClassList.push(_this.options.iconExpand);
                    $treeNodeWrap
                        .append($(_this.template.icon)
                            .addClass(ceIconClassList.join(' '))
                        );
                } else {
                    ceIconClassList.push(_this.options.iconEmpty);
                }

                // 添加图标icon
                if (_this.options.showIcon) {
                    var nodeIconClassList = ['node-icon'];
                    nodeIconClassList.push(node.nodeIcon || _this.options.nodeIcon);
                    $treeNodeWrap
                        .append($(_this.template.icon)
                            .addClass(nodeIconClassList.join(' '))
                        );
                }

                // 添加文字及链接
                $treeNodeWrap
                    .append($(_this.template.nodeText)
                        .append(node.text)
                    );

                // 添加到dom中
                $treeUl.append($treeNodeLi.append($treeNodeWrap));

                //console.log('buildTree: level: ' + level);
                //console.log($treeNodeLi.html());
                // 递归
                if (node.nodes && node.nodes.length > 0 && node.state.expanded && !node.state.disabled) {
                    $treeNodeLi.append(_this.buildTree(node.nodes, level));
                }

                console.log(toSwitch);
                if(level == 1 && !toSwitch){
                    console.log('append treeLeft');
                    _this.$treeLeftWrap.append($treeUl);
                }
            }
        });
        //console.log('return at last');
        return $treeUl;
    };

    /**
     * @doc 折叠菜单
     * @param identifiers
     * @param options
     */
    TreeView.prototype.collapseNode = function (identifiers, options){
        ;
    };
    /**
     * @doc 打开菜单
     * @param identifiers
     * @param options
     */
    TreeView.prototype.expandNode = function (identifiers, options){
        ;
    };

    /**
     * @doc 交替选择状态(数据)
     * @param node
     * @param options
     */
    TreeView.prototype.toggleSelectedState = function (node, options) {
        if (!node) return;
        this.setSelectedState(node, !node.state.selected, options);
    };

    /**
     * @doc 设置节点为选中状态(数据)
     * @param node
     * @param state
     * @param options
     */
    TreeView.prototype.setSelectedState = function (node, state, options) {
        if (state === node.state.selected) return;

        if (state) {

            // If multiSelect false, unselect previously selected
            if (!this.options.multiSelect) {
                $.each(this.findNodes('true', 'g', 'state.selected'), $.proxy(function (index, node) {
                    this.setSelectedState(node, false, options);
                }, this));
            }

            // Continue selecting node
            node.state.selected = true;
            if (!options.silent) {
                this.$element.trigger('nodeSelected', $.extend(true, {}, node));
            }
        }
        else {

            // Unselect node
            node.state.selected = false;
            if (!options.silent) {
                this.$element.trigger('nodeUnselected', $.extend(true, {}, node));
            }
        }
    };

    /**
     * @doc 交替节点选择(dom)
     * @param identifiers
     * @param options
     */
    TreeView.prototype.toggleNodeSelected = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleSelectedState(node, options);
        }, this));

        this.render();
    };

    TreeView.prototype.forEachIdentifier = function (identifiers, options, callback) {

        options = $.extend({}, _default.options, options);

        if (!(identifiers instanceof Array)) {
            identifiers = [identifiers];
        }

        $.each(identifiers, $.proxy(function (index, identifier) {
            callback(this.identifyNode(identifier), options);
        }, this));
    };

    TreeView.prototype.identifyNode = function (identifier) {
        return ((typeof identifier) === 'number') ?
            this.nodes[identifier] :
            identifier;
    };

    /**
     * @doc 模版
     */
    TreeView.prototype.template = {
        treeTop:            '<ul class="tree-top-list"></ul>',
        treeLeftWrap:       '<div class="tree-list-wrap"></div>',
        treeLeftGroupWrap:  '<div class="tree-group-wrap"></div>',
        treeLeftGroup:      '<ul class="tree-group"></ul>',
        nodeWrap:           '<span class="node-wrap"></span>',
        node:               '<li class="tree-node"></li>',
        link:               '<a href="javascript:;" class="node-wrap"></a>',
        nodeText:           '<span class="node-text"></span>',
        indent:             '<span class="indent"></span>',
        icon:               '<i class="icon"></i>',
        badge:              '<span class="badge"></span>', // 标记该菜单下有多少子菜单
        lapHandle:          '<div class="tree-list-lap">'
                                + '<a href="javascript:" class="lap-handle" id="lapHandle" title="收缩/展开">'
                                    + '<i class="fa fa-exchange" aria-hidden="true"></i>'
                                + '</a>'
                            + '</div>' // 折叠功能
    };

    /**
     * @doc 获取节点
     * @param nodeId
     * @returns {*}
     */
    TreeView.prototype.getNode = function (nodeId) {
        return this.nodes[nodeId];
    };

    /**
     * @doc 获取父节点
     * @param identifier
     * @returns {*}
     */
    TreeView.prototype.getParent = function (identifier) {
        var node = this.identifyNode(identifier);
        return this.nodes[node.parentId];
    };
    /**
     * @doc 获取菜单数据
     * @author Heanes
     * @time 2016-11-29 16:40:18 周二
     */
    TreeView.prototype.getNodeListData = function(url, method, option){
        var nodeDataJsonUrl = url || '';
        if(nodeDataJsonUrl == ''){
            return null;
        }
        var _this = this;
        switch (method){
            case 'json':
                $.getJSON(nodeDataJsonUrl, function(data){
                    _default.settings.data = data;
                    _this.init(_default, option);
                });
                break;
            case 'get':
                $.ajax();
                return null;
        }
    };

    /**
     * @doc 显示错误
     * @param message
     */
    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    /**
     * @doc jQuery写法
     * @param options
     * @param args
     * @returns {*}
     */
    $.fn[pluginName] = function (options, args) {
        var result;
        this.each(function () {
            var _this = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                }
                else {
                    if (!(args instanceof Array)) {
                        args = [ args ];
                    }
                    result = _this[options].apply(_this, args);
                }
            }
            else if (typeof options === 'boolean') {
                result = _this;
            }
            else {
                $.data(this, pluginName, new TreeView(this, $.extend(true, {}, options)));
            }
        });
        return result || this;
    };
})(jQuery, window, document);