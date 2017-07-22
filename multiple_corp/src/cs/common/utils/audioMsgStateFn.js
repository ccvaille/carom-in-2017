/*eslint-disable */
window.audioMetaDataLoaded = function (audio) {
    var duration = document.createTextNode('（' + parseInt(audio.duration) + 's）');
    audio.parentNode.appendChild(duration);
};
