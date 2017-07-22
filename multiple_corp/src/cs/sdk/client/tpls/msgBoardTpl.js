export default `
<div class="small-cs-online small-cs-leave-mes" style="display: none;">
    <ul class="btn-control">
        <li class="min"></li>
        <li class="close"></li>
    </ul>
    <div class="small-cs-head">
        <img src="css/img/p.png" alt="">
        <div class="small-cs-head-text">
            <p>客服054号</p>
            <span>EC将会为您竭诚服务</span>
        </div>
    </div>
    <div class="small-cs-content">
        <div class="leave-mes-text">
            您好，我暂时不在线，您可以给我发送短信或者留言。
        </div>
        <ul>
            <li><span>姓名</span>
                <input type="text" class="ec-input">
            </li>
            <li><span>电话</span>
                <input type="text" class="ec-input">
            </li>
            <li><span>QQ</span>
                <input type="text" class="ec-input">
            </li>
            <li><span>邮箱</span>
                <input type="text" class="ec-input">
            </li>
            <li><span>备注</span>
                <textarea class="ec-input"></textarea>
            </li>
            <li><span>验证码</span>
                <input type="text" class="ec-input">
                <cite class="verification-code"></cite>
            </li>
        </ul>
    </div>
    <div class="small-cs-footer">
        <div class="small-cs-footer-btn">
            <a href="javascript" class="ec-btn ec-btn-cancel">关闭</a>
            <a href="javascript:;" class="ec-btn">提交</a>
        </div>
    </div>
</div>
`;
