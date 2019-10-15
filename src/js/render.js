// 实现页面渲染 img + info + like-btn
(function ($,root) {

  function renderImg(src) {
    var img = new Image();
    img.src = src;
    img.onload = function () {
        $('.img-box img').attr('src',src);
        // 进行高斯模糊渲染背景
        root.blurImg(img,$('body'));
    }
  }

  function renderInfo(info) {
    var str = '<div class="song-name">'+ info.song +'</div>\
               <div class="singer-name">'+ info.singer +'</div>\
               <div class="album-name">'+ info.album +'</div>\
              ';
    $('.song-info').html(str);
  }

  function renderIsLike(like) {
    if(like) {
        $('.control .like').addClass('liking');
    } else {
        $('.control .like').removeClass('liking');
    }
  }

// 暴露一个接口
  root.render = function (data) {
    renderImg(data.image);
    renderInfo(data);
    renderIsLike(data.isLike);
  }

} (window.Zepto,window.player || (window.player = {})));