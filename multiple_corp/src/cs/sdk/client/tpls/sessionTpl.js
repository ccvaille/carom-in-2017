export default (data) => {
    const { kfInfo } = data;
    return (`
        <div class="web-cs-modal">
            <div class="small-cs-online">
                <ul class="btn-control">
                    <li class="min"></li>
                    <li class="close"></li>
                </ul>
                <div class="small-cs-head">
                    <img src="${kfInfo.pic}" alt="">
                    <div class="small-cs-head-text">
                        <p>${kfInfo.showname}</p>
                        <span>EC将会为您竭诚服务</span>
                    </div>
                </div>
                <div class="small-cs-left">
                    <div class="small-cs-content" style="display: none;">
                        <div class="auto-end-text">您好，由于很久没有收到您的消息，系统自动结束了对话。如有需要欢迎咨询。</div>
                    </div>
                    <div class="small-cs-footer ec-cs-ctrls">
                        <ul class="small-cs-icon">
                            <li><img src="css/img/expression.png" alt="选择表情"></li>
                            <li><img src="css/img/file.png" alt="选择文件"></li>
                            <li><img src="css/img/pic.png" alt="发送图片"></li>
                        </ul>
                        <div class="small-cs-input">
                            <textarea></textarea>
                        </div>
                        <div class="small-cs-footer-btn">
                            <a href="javascript:;" class="ec-btn ec-btn-cancel">取消</a>
                            <a href="javascript:;" class="ec-btn">发送</a>
                        </div>
                        <div class="auto-end-footer-text ec-cs-ctrls" style="display: none;">
                            对话已经结束，您可以 <a href="javascript:;">继续会话</a> 或 <a href="javascript:;">留言</a>
                        </div>
                    </div>
                </div>
                <div class="small-cs-right">
                    <div class="cs-img"></div>
                    <h4>谭小平</h4>
                    <ul>
                        <li><span>职位：</span>客服专员</li>
                        <li><span>电话：</span>0755-26523362</li>
                        <li><span>手机：</span>13526253212</li>
                        <li><span>邮箱：</span><a href="mailto:kefu@workec.com">kefu@workec.com</a></li>
                        <li><span>签名：</span>异常问题请电话联系</li>
                    </ul>
                </div>
            </div>
        </div>
    `);
}
