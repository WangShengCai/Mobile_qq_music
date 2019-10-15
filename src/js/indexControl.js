// 点击按钮判断下标值
(function ($, root) {

    function Control(len) {
        this.index = 0;
        this.len = len;
    }

    Control.prototype = {
        // 上一曲
        prev: function () {
            // 普通一点
            // if (this.index == 0) {
            //     this.index = len - 1;
            // } else {
            //     this.index --;
            // }
            // 高级一点
            return this.getIndex(-1);
        },
        // 下一曲
        next: function () {
            // 普通一点
            // if (this.index == len - 1) {
            //     this.index = 0;
            // } else { 
            //     this.index ++;
            // }
            // 高级一点
            return this.getIndex(1);
        },
        // 计算改变后的索引
        getIndex: function (val) {
            var index = this.index;
            var len = this.len;
            var curIndex = (index + val + len) % len;
            this.index = curIndex;
            return curIndex;
        }
    }

    // 暴露接口
    root.controlIndex = Control;

}(window.Zepto, window.player || (window.player = {})));