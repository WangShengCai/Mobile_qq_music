// 主入口文件
(function () {
    // 简易操作
    var $ = window.Zepto;
    // 简易操作
    var $scope = $(document.body);
    // 简易操作
    var root = window.player;
    // 定时器标识
    var timer = null;
    // 数据列表
    var dataList;
    // 数据列表长度
    var len;
    // 音频管理
    var audio = root.audioManager;
    // 歌曲按钮管理
    var control;

    /**
     * 请求数据
     */
    function getData(url) {
        $.ajax({
            url: url,
            type: "GET",
            success: function (data) {
                bindEvent();
                bindTouch();
                root.render(data[0]);                               // 默认加载第一项
                dataList = data;
                len = data.length;
                audio.getAudio(data[0].audio);                      // 默认加载第一首
                control = new root.controlIndex(len);
                root.progress.renderAllTime(dataList[0].duration);  // 默认加载第一首的总时长
                root.playList.renderList(data);                     // 播放列表的总数据量
            },
            error: function (e) {
                console.log(e.status, e.statusText);
            }
        })
    }
    getData("../mock/data.json");

    /**
     * 点击事件绑定
     */
    function bindEvent() {
        $('body').on('change:play', function (e, index, flag) {
            // 渲染页面
            root.render(dataList[index]);
            // 实时切换歌曲
            audio.getAudio(dataList[index].audio);
            root.progress.renderAllTime(dataList[index].duration);
            // 上一曲，下一曲点击切换时自动清空左侧所有时间
            root.progress.updata(0);
            if (audio.status == 'play' || flag) {
                audio.play();
                rotate(0);
                root.progress.start();
            } else {
                audio.pause();
                clearInterval(timer);
                $('.song-img .img-box').attr('data-deg', 0);
                $('.song-img .img-box').css({ transform: 'rotateZ(0deg)' });
            }
        })
        // 上一曲
        $('.control .prev').on('click', function () {
            var i = control.prev();
            $('body').trigger('change:play', i);
        })
        // 播放 暂停
        $('.control .play').on('click', function () {
            if (audio.status == 'pause') {
                audio.play();
                // 拿到上次旋转停止处的角度
                var deg = $('.img-box').attr('data-deg');
                rotate(deg);
                // 开始渲染进度条
                root.progress.start();
            } else {
                audio.pause();
                clearInterval(timer);
                // 停止渲染进度条
                root.progress.stop();
            }
            $('.control .play').toggleClass('playing');
        })
        // 下一曲
        $('.control .next').on('click', function () {
            var i = control.next();
            $('body').trigger('change:play', i);
        })
        // 播放列表项点击
        $('.control .list').on('click', function () {
            root.playList.show(control);
        })
    }

    /**
     * 拖拽事件绑定
     */
    function bindTouch() {
        var $slidePoint = $scope.find(".slider");
        var offset = $scope.find(".pro-time").offset();
        var left = offset.left;
        var width = offset.width;
        
        //绑定拖拽事件 开始拖拽 ： 取消进度条渲染
        $slidePoint.on("touchstart", function () {
            root.progress.stop();
        }).on("touchmove", function (e) {
            //计算拖拽的百分比 更新我们的当前时间和进度条
            var x = e.changedTouches[0].clientX;
            var percent = (x - left) / width;
            if (percent > 1 || percent < 0) {
                percent = 0;
            }
            root.progress.updata(percent)
        }).on("touchend", function (e) {
            //计算百分比 跳转播放 重新开始进度条渲染 
            var x = e.changedTouches[0].clientX;
            var percent = (x - left) / width;
            if (percent > 1 || percent < 0) {
                percent = 0;
            }
            var curDuration = dataList[control.index].duration;
            var curTime = curDuration * percent;
            audio.jumpToplay(curTime);
            root.progress.start(percent);
            $scope.find(".play").addClass("playing");
        })
    }

    /**
     * 旋转CD
     */
    function rotate(deg) {
        clearInterval(timer);
        deg = +deg;
        timer = setInterval(function () {
            deg += 2;
            // 设置之后方便暂停播放之后再次播放能够从上次的位置开始旋转
            $('.song-img .img-box').attr('data-deg', deg);
            $('.song-img .img-box').css({
                transform: 'rotateZ(' + (deg % 360) + 'deg)',
            })
        }, 60);
    }
}());