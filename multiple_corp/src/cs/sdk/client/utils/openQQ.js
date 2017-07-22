module.exports = function (qqUrl, csid) {
    var iframeQQ = document.createElement('iframe');
    iframeQQ.setAttribute('src', qqUrl);
    iframeQQ.setAttribute('name', csid);
    iframeQQ.style.display = 'none';
    document.body.appendChild(iframeQQ);

    setTimeout(function () {
        document.body.removeChild(iframeQQ);
    }, 100);
};
