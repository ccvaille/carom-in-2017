export default (data) => `
<div class="ec--small-cs">
    <div class="ec--btn-control">
        <a class="ec--min"></a>
        <a class="ec--close"></a>
    </div>
    <div class="small-cs-head">
        <img src="css/img/p.png" alt="">
        <div class="small-cs-head-text">
            <p>${data.name}</p>
            <span>EC将会为您竭诚服务</span>
        </div>
    </div>
    <div class="small-cs-content">
        <div class="auto-end-text">您好，由于很久没有收到您的消息，系统自动结束了对话。如有需要欢迎咨询。</div>
    </div>
    <div class="small-cs-footer">
        <ul class="small-cs-icon">
            <li><img src="css/img/expression.png" alt="选择表情"></li>
            <li><img src="css/img/file.png" alt="选择文件"></li>
            <li><img src="css/img/pic.png" alt="发送图片"></li>
        </ul>
        <div class="small-cs-input">
            <textarea></textarea>
        </div>
        <div class="small-cs-footer-btn">
            <a href="javascript:;" class="ec-btn">发送</a>
        </div>
        <div class="auto-end-footer-text">
            对话已经结束，您可以 <a href="javascript:;">继续会话</a> 或 <a href="javascript:;">留言</a>
        </div>
    </div>
</div>
`;
