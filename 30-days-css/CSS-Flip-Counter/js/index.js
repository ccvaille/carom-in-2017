$('document').ready(function() {
    num = parseInt($('.hinge .top').text());
    function add() {
        num++;
        var un = num + 1 ;
        if (num > 9) {
            num = 0;
        }
        if (un > 9) {
            un = 0;
        }
        $('.unbefore,.unback').text(un);
        $('.hinge .top').text(num);
        $('.hinge .bottom').text(un);
    }

    // $('.time-box').click(function() {
        $('.time-box li').addClass('ani');
        var time = setInterval(add, 1000);
    // })
})
