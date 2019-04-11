$(function() {
    'use strict';
    //下拉刷新页面
    $(document).on('refresh', '.pull-to-refresh-content', function(e) {
        // 模拟2s的加载过程
        setTimeout(function() {
            var cardNumber = $(e.target).find('.card').length + 1;
            var cardHTML = '<div class="card">' +
                '<div class="card-header">card' + cardNumber + '</div>' +
                '<div class="card-content">' +
                '<div class="card-content-inner">' +
                '这里是第' + cardNumber + '个card，下拉刷新会出现第' + (cardNumber + 1) + '个card。' +
                '</div>' +
                '</div>' +
                '</div>';

            $(e.target).find('.card-container').prepend(cardHTML);
            // 加载完毕需要重置
            $.pullToRefreshDone('.pull-to-refresh-content');
            //更新数据之后 判断是否开启上拉加载
            provideInfiniteScroll();
        }, 2000);
    });

    $(document).on('click', '.add_btn', function() {
        $.modal({
            title: '弹窗',
            text: '<textarea style=" width:100%;"></textarea>',
            buttons: [{
                text: '取消',
                onClick: function() {
                    $.alert('You clicked first button!')
                }
            },
                {
                    text: '确认',
                    bold: true,
                    onClick: function() {
                        $.alert('You clicked third button!')
                    }
                },
            ]
        })
    });
    //下拉是否正在加载
    var loading = false;
    //模拟后台ajax请求 分页大小
    var pageSize = 6;
    //模拟后台ajax请求 页码
    var pageIndex = 1;
    $(document).on('infinite', '.infinite-scroll-bottom', function() {
        // 如果正在加载，则退出
        if(loading) return;
        // 设置flag
        loading = true;
        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;
            var cur_index = $('.card-container .card').length;
            // 添加新条目
            var text=""
            for(var i=0;i<pageSize;i++){
                text+='<div class="card"><div class="card-header">card</div><div class="card-content">'
                    +'<div class="card-content-inner">上拉拉加载更多的'+(cur_index+i)+'card'
                    +'</div></div></div>'
            }
            $('.card-container').append(text)
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });


    //移除 上拉滚动事件监听 工作
    function detachInfiniteScroll(){
        $('.infinite-scroll-preloader').hide();
        $.detachInfiniteScroll($('#main_content'))
    }
    //判断是否应该开启上拉加载
    function provideInfiniteScroll(){
        //通过当前的列表容器的高度 与 窗口的高度做比对 
        //并且要求 上拉功能之前未出现过 才会开启上拉
        var card_height = $('.card-container').attr('clientHeight');
        if(card_height >= window.innerHeight && $('.infinite-scroll-preloader').css('display')!= 'none'){
            $('.infinite-scroll-preloader').show();
            $.attachInfiniteScroll($("#main_content"))
        }else{
            $('.infinite-scroll-preloader').hide();
            detachInfiniteScroll();
        }
    }
    $.init();
    //先取消掉 下拉无线再加功能
    detachInfiniteScroll();
})
