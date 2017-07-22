export const scriptContent = `<script type="text/javascript" charset="utf-8">
    ;(function (W, D) {
        W.ec_corpid = '${window.csCorpId}';
        W.ec_cskey = '${window.csKey}';
        var s = D.createElement('script');
        s.src = '//1.staticec.com/kf/sdk/js/ec_cs.js';
        D.getElementsByTagName('head')[0].appendChild(s);
    })(window, document);
</script>`;

export const hexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;

export const authErrorType = {
    sessionError: 0,
    networkError: 1,
};
