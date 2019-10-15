// 进度条
(function ($, root) {

    // 简易操作
    var $scope = $(document.body);
    // 外界传入的总时长
    var curDuration;
    // 定时器标识
    var frameId;
    // 百分比
    var lastPercent = 0;
    // 开始时间戳
    var startTime;

    /**
     * 入口函数吧
     * @param {*} duration 外界传入的总时长
     */
    function renderAllTime(duration) {
        lastPercent = 0;
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find(".all-time").html(allTime);
    }

    //把秒转换成分和秒
    function formatTime(duration) {
        duration = Math.round(duration);                    // 四舍五入
        var minute = Math.floor(duration / 60);             // 分钟
        var second = duration - minute * 60;                // 秒钟
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        return minute + ":" + second;
    }

    // 根据百分比更新数据
    function updata(precent) {
        var curTime = precent * curDuration;                        // 百分比*总时长
        curTime = formatTime(curTime);                              // 格式化时间格式
        $scope.find(".cur-time").html(curTime);
        var percentage = (precent - 1) * 100 + "%";                 // 计算translate的偏移量
        $scope.find(".pro-top").css({
            transform: "translateX(" + percentage + ")"
        })
    }

    // 开始渲染进度条
    function start(precentage) {
        // 判断从主入口js文件传进来的百分比是有值
        lastPercent = precentage === undefined ? lastPercent : precentage;
        // 清除定时器
        cancelAnimationFrame(frameId);
        // 开始时间戳
        startTime = new Date().getTime();
        function frame() {
            // 每隔16.7ms再次获取一次时间戳
            var curTime = new Date().getTime();
            // 计算百分比
            var precent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (precent < 1) {
                frameId = requestAnimationFrame(frame);             // 调用定时器
                updata(precent);
            } else {
                cancelAnimationFrame(frameId);                      // 清除定时器
                $scope.find(".next").trigger("click");              // 如果到最后是播放着结束的，那么就自动插入下一曲
            }
        }
        frame();                                                    // 首次调用定时器
    }
    
    // 结束渲染进度条
    function stop() {
        // 停止的时候记录一个时间戳
        var stopTime = new Date().getTime();
        // 计算百分比
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        // 清除定时器
        cancelAnimationFrame(frameId);
    }

    // 向主js文件的window暴露一个属性，这个属性是一个对象
    root.progress = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        updata: updata
    }

})(window.Zepto, window.player || (window.player = {}));