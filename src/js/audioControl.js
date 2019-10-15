// 关于音频
(function ($,root) {

    function AudioManager() {
        this.audio = new Audio();        // 创建一个audio对象
        this.status = 'pause';           // audio默认状态
    }

    AudioManager.prototype = {
        // 播放
        play : function () {
            this.audio.play();
            this.status = 'play';
        },
        // 暂停
        pause : function () {
            this.audio.pause();
            this.status = 'pause';
        },
        // 设置audio
        getAudio : function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        // 设置播放时间
        jumpToplay : function(time){
            this.audio.currentTime = time;
            this.play();
        }   
    }

    // 暴露接口
    root.audioManager = new AudioManager();

} (window.Zepto,window.player || (window.player = {})));