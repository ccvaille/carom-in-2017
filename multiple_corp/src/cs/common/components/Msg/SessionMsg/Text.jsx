/*eslint-disable*/
var React = require('react');
var usedEmotions = require('~cscommon/consts/usedEmotions');

var patterns = {
    emotion: /(\[[^\[\]]*\]|\[\[[^\[\]]*\]\])/g,
    link: /((((http|ftp|https):)?\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g
};

function textParser(content, type) {
    var pattern = patterns[type];
    var result = [],
        startPos = 0,
        endPos = 0,
        tempResult = pattern.exec(content);

    while(tempResult) {
        endPos = pattern.lastIndex;
        result.push({
            type: 'text',
            cont: content.slice(startPos, endPos).replace(tempResult[0], '')
        });
        result.push({
            type: type,
            cont: tempResult[0]
        });
        startPos = endPos;
        tempResult = pattern.exec(content);
    }

    result.push({
        type: 'text',
        cont: content.slice(startPos)
    });

    return result;
}

function parseText(content) {
    var nodes = [];
    textParser(content, 'link').forEach(function (item) {
        if (item.type === 'text') {
            textParser(item.cont, 'emotion').forEach(function (node) {
                nodes.push(node);
            });
        } else {
            nodes.push(item);
        }
    });
    return nodes;
}

function formatText(text) {
    return text.replace(/ /g, '&nbsp')
               .replace(/\n/g, '<br />');
}

function xssFilter(content) {
    var chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2f;'
    };
    var pattern = new RegExp('(' + Object.keys(chars).join('|') + ')', 'g');
    var safeCont = content.replace(pattern, function (key) {
        return chars[key];
    });
    return safeCont;
}

function textTransfer(text) {
    return formatText(
           xssFilter(
           text));
}

var emotionPath = require('~cscommon/consts/emotionPath');
module.exports = React.createClass({
    reloadEmotionTimes: {},
    reloadEmotion: function (emotionSrc) {
        var reloadTimes = this.reloadEmotionTimes[emotionSrc];
        if (!reloadTimes) {
            reloadTimes = this.reloadEmotionTimes[emotionSrc] = 0;
        }
        if (reloadTimes > 5) {
            return;
        }
        setTimeout(function () {
            this.refs.emotion.src = emotionSrc + '?' + new Date().getTime();
            this.reloadEmotionTimes[emotionSrc]++;
        }.bind(this), 1000);
    },
    renderTextNode: function (node) {
        switch (node.type) {
            case 'emotion': {
                var key = node.cont.replace(/\[|\]|\[\[|\]\]/g, '');

                if (usedEmotions.indexOf(key) === -1) {
                    return <span dangerouslySetInnerHTML={{ __html: textTransfer(node.cont) }} key={ Math.random() }></span>;
                }

                var emotionSrc = emotionPath + key + '.png';
                return <img
                            ref="emotion"
                            className="ec-qq-emoji"
                            src={ emotionSrc }
                            onError={ this.reloadEmotion.bind(this, emotionSrc) }
                            key={ Math.random() }
                        />;
            }
            case 'link':
                return <a href={ node.cont } target="_blank" key={ Math.random() }>{ node.cont }</a>;
            case 'text':
            default:
                return <span dangerouslySetInnerHTML={{ __html: textTransfer(node.cont) }} key={ Math.random() }></span>;
        }
    },
    render: function () {
        var textNodes = parseText(this.props.msg.text);
        return (
            <p>
            {
                textNodes.map(function (node) {
                    return this.renderTextNode(node);
                }.bind(this))
            }
            </p>
        );
    }
});
