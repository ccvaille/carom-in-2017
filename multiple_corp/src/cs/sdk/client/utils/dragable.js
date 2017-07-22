/*eslint-disable */
var Event = require('../modules/Event');

var domUtils = require('./dom'),
    addEvent = domUtils.addEvent,
    getStyle = domUtils.getStyle,
    setStyle = domUtils.setStyle,
    getWindowWidth = domUtils.getWindowWidth,
    getWindowHeight = domUtils.getWindowHeight;

var Drag = function (opts){
    this.init(opts || {});
};

Drag.prototype = new Event();

Drag.prototype.init = function (opts){
    this.initElements(opts);
    this.bindEvents();
    this.updateBoundary(opts);
    this.fixDom();
};
Drag.prototype.initElements = function (opts){
    this.$ele = opts.ele;
    this.$ref = opts.ref || this.$ele;
    this.$wrapper = opts.wrapper || document.body;

    this.type = opts.type || '';

    this.draging = false;
    this.dis = {};
};
Drag.prototype.bindEvents = function (){
    var self = this;

    addEvent(this.$ref, 'mousedown', function (e){
        self.start({
            x: e.pageX || (e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft),
            y: e.pageY || (e.clientY + document.body.scrollTop || document.documentElement.scrollTop)
        });
    });
    addEvent(this.$wrapper, 'mousemove', function (e){
        if(!self.draging) return;
        self.move({
            x: e.pageX || (e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft),
            y: e.pageY || (e.clientY + document.body.scrollTop || document.documentElement.scrollTop)
        });
    });
    addEvent(this.$wrapper, 'mouseup mouseleave', function (){
        self.stop();
    });
};

Drag.prototype.start = function (mousePos) {
    this.draging = true;
    this.startPos = this.getPos();
    this.mouseStartPos = mousePos;
    this.emit('start');
};

Drag.prototype.move = function (mousePos) {
    var dis = {
        x: mousePos.x - this.mouseStartPos.x,
        y: mousePos.y - this.mouseStartPos.y
    };
    this.updatePos(dis);
    // 记录真实的移动距离
    this.dis = {
        x: this.pos.left - this.startPos.x,
        y: this.pos.top - this.startPos.y
    };
    // 去鼠标选中
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

    this.emit('move');
};

Drag.prototype.stop = function () {
    this.draging && this.emit('stop');

    this.dis = undefined;
    this.draging = false;
};

Drag.prototype.getPos = function (){
    var left = +getStyle(this.$ele, 'left').replace('px', ''),
        top = +getStyle(this.$ele, 'top').replace('px', '');

    return {
        x: (isNaN(left) ? '0' : left),
        y: (isNaN(top) ? '0' : top)
    };
};

Drag.prototype.updatePos = function (dis){
    return setStyle(this.$ele, {
        left: (this.type !== 'y' ? Math.max(Math.min(this.startPos.x + dis.x, this.maxX), this.minX) : 0) + 'px',
        top: (this.type !== 'x' ? Math.max(Math.min(this.startPos.y + dis.y, this.maxY), this.minY) : 0) + 'px'
    });
};

Drag.prototype.updateBoundary = function (opts){
    opts = opts || {};

    var left = +getStyle(this.$ele, 'left').replace('px', '');
    var top = +getStyle(this.$ele, 'top').replace('px', '');
    this.pos = {
        left: isNaN(left) ? '0' : left,
        top: isNaN(top) ? '0' : top
    };
    var wrapperWidth,
        wrapperHeight;

    if (this.$wrapper === window)  {
        wrapperWidth = getWindowWidth();
        wrapperHeight = getWindowHeight();
    } else {
        wrapperWidth = this.$wrapper.offsetWidth;
        wrapperHeight = this.$wrapper.offsetHeight;
    }

    this.maxX = opts.maxX || wrapperWidth - this.$ele.clientWidth;
    this.minX = opts.minX || 0;
    this.maxY = opts.maxY || wrapperHeight - this.$ele.clientHeight;
    this.minY = opts.minY || 0;
};

Drag.prototype.fixDom = function (){
    this.startPos = {
        x: this.$ele.offsetLeft,
        y: this.$ele.offsetTop
    };
    this.updatePos({
        x: 0,
        y: 0
    });
};

module.exports = function (opts) {
    return new Drag(opts);
};

