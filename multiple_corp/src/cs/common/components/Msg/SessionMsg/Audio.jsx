/*eslint-disable*/
var React = require('react');

var msgStates = require('~cscommon/consts/msgStates');

var $audio;
function playAudio($tag, audio) {
    $audio && $audio.pause();
    $tag.play();
    $audio = $tag;
};

var audioStates = {
    LOADING: 'LOADING',
    LOADING_FAILD: 'LOADING_FAILD',
    PLAYING: 'PLAYING',
    PLAYED: 'PLAYED',
};

var playingAudio = '';

module.exports = React.createClass({
    getInitialState: function () {
        return {
            audioState: audioStates.LOADING,
            duration: 0
        };
    },
    onload: function () {
        this.setState({
            duration: Math.min(Math.round(this.refs.audio.duration), 59),
            audioState: audioStates.LOADED
        });
    },
    play: function () {
        var msg = this.props.msg;
        playAudio(this.refs.audio, msg.audio);
    },
    onPlay: function () {
        this.props.onAudioPlay && this.props.onAudioPlay();
        this.setState({
            audioState: audioStates.PLAYING
        });
    },
    onPause: function () {
        this.onEnded();
    },
    onEnded: function () {
        this.props.onAudioEnded && this.props.onAudioEnded();
        this.setState({
            audioState: audioStates.PLAYED
        });
        this.refs.audio.currentTime = 0;
    },
    onError: function () {
        this.setState({
            audioState: audioStates.LOADING_FAILD
        })
    },
    reload: function () {
        if (this.reloaded) {
            return;
        }
        var msg = this.props.msg;
        this.reloaded = true;
        this.refs.audio.src = msg.audio + '?' + new Date().getTime();
    },
    getAudioState: function () {
        var msg = this.props.msg;

        switch (this.state.audioState) {
            case audioStates.LOADING_FAILD:
                return 'media-loading-faild';
            case audioStates.LOADED:
                return 'media-loaded';
            case audioStates.PLAYING:
                return 'media-playing';
            case audioStates.PLAYED:
                return 'media-played';
            case audioStates.LOADING:
                return 'media-loading';
            default:
                return '';
        }
    },
    render: function () {
        var msg = this.props.msg;
        var audioStateCls = this.getAudioState();
        return (
            <p>
                <a
                    className={ 'audio ' + audioStateCls }
                    href="javascript:;"
                    onClick={ this.play }
                    style={ { width: this.state.duration * 3 } }
                >
                    <i className={ 'icon-audio' }></i>
                </a>
                {
                    this.state.duration ?
                    <span className="audio-duration">{ this.state.duration + '\'\''}</span>
                    : null
                }
                <span
                    className={ 'audio-state ' + audioStateCls }
                    onClick={ this.reload }
                ></span>
                <audio
                    ref="audio"
                    src={ msg.audio }
                    onLoadedMetadata={ this.onload }
                    onPlay={ this.onPlay }
                    onEnded={ this.onEnded }
                    onError={ this.onError }
                    onPause={ this.onPause }
                    style={{ dispaly: 'none' }}
                />
            </p>
        );
    }
});
