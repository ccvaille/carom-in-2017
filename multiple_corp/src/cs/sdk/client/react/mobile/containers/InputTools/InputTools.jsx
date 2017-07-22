var React = require('react');
var getLanguagePackage = require('utils/locale');

// from http://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
var validImageHeader = ['89504e47', '47494638', 'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2']; // png, gif, jpg

var InputTools = React.createClass({
    onImageSelect: function(e) {
        var num = 1;
        var file = e.target.files[0];
        var that = this;
        if (!file) {
            return false;
        }

        if (window.FileReader && window.Blob) {
            // console.log('have file reader')
            var blob = e.target.files[0];
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = "";
                for(var i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
                // Check the file signature against known types
                if (validImageHeader.indexOf(header) === -1) {
                    alert('请您发送 gif、jpg、jpeg、png格式的图片，给您带来不便请谅解');
                    document.getElementById('picform').reset();
                    return false;
                }
                that.props.uploadPic(blob);
                that.props.updateTimeout();
            }
            fileReader.readAsArrayBuffer(blob);
        } else if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value)) {
            // console.log('type error')
            alert('请您发送 gif、jpg、jpeg、png格式的图片，给您带来不便请谅解');
            document.getElementById('picform').reset();
            return false
        } else {
            this.props.uploadPic(e.target.files[0]);
            this.props.updateTimeout();
        }
    },

    render: function() {
        var app = this.props.app;
        return (
            <div className="mobile-input-tools">
                <div className="input-tools">
                    <a className="emotion" href="javascript:;" title="表情" onClick={this.props.showEmotions}></a>
                    <a className="pic" href="javascript:;" title="图片">
                        <form id="picform">
                            <input
                                id="picfile"
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/gif"
                                onChange={this.onImageSelect}
                            />
                        </form>
                    </a>
                    {
                        app.appData && app.appData.csinfo && app.appData.csinfo.showqq
                        ?
                            <a className="qq" href="javascript:;" title="QQ会话" onClick={this.props.goQQ}></a>
                        : null
                    }
                </div>
            </div>
        );
    }
});

module.exports = InputTools;
