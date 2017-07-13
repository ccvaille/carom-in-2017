$('document').ready(function() {
    num = parseInt($('.hinge .top').text());

    function add() {
        num++;
        if (num > 9) {
            num = 0;
        }
        $('.unbefore,.unback').text(num);
        $('.hinge .top,.hinge .bottom').text(num);
    }
    $('.time-box li').addClass('ani');
    var time = setInterval(add, 1000);
})
