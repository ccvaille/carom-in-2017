var React = require('react');

var usedEmotions = require('../consts/GuestUsedEmotions');

var Emotion = React.createClass({
    select: function (event, emotion) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        this.props.onSelect(emotion);
    },
    render: function () {
        return (
            <div className="dFace">
                <div className="facelist">
                {
                    usedEmotions.map(function (emotion,index) {
                        var emotionClasses = 'face-ele a' + index;
                        return (
                            <a
                                className= { emotionClasses }
                                href="javascript:;"
                                title={ emotion }
                                onClick={function (e) {
                                    this.select(e, emotion);
                                }.bind(this)}
                                key={ emotion }></a>
                        );
                    }.bind(this))
                }
                </div>
            </div>
        );
    }
});

module.exports = Emotion;
