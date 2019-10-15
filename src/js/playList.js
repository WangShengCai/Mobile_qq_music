// 点击右下角列表项播放
(function($,root){

    var $scope = $(document.body);
    var control;
    var $playList = $("<div class = 'play-list'>"+
        "<div class='play-header'>播放列表</div>" + 
        "<ul class = 'list-wrapper'></ul>" +
        "<div class='close-btn'>关闭</div>"+
    "</div>");
    //渲染我们的播放列表dom
    function renderList(dataList){
        var html = '';
        for(var i = 0;i < dataList.length;i++){
            html += "<li><h3 >"+dataList[i].song+"&nbsp;&nbsp; - <span>"+dataList[i].singer+"</span></h3></li>";
        }
        $playList.find(".play-list ul").html(html);
        $scope.append($playList);
        bindEvent();
    }  
    function show(controlmanager){
        control = controlmanager;
        $playList.addClass("show");
        signSong(control.index);
    }
    function bindEvent(){
        $playList.on("click",".close-btn",function(){
            $playList.removeClass("show");
        })
        $playList.find("li").on("click",function(){
            var index = $(this).index();
            signSong(index);
            // 播放歌曲
            control.index = index;
            $scope.trigger("change:play",[index,true]);
            $scope.find(".play").addClass("playing");
            setTimeout(function(){
                $playList.removeClass("show")
            }, 800);
        })
    }
    // 当前点击的列表项变红色
    function signSong(index){
        $playList.find(".sign").removeClass("sign");
        $playList.find("ul li").eq(index).addClass("sign");
    }

    root.playList = {
        renderList : renderList,
        show : show
    }

})(window.Zepto,window.player || (window.player = {}));