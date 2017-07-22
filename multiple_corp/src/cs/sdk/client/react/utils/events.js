var Events = {
    stopPropagation: function(event) {
        if (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    },
    preventDefault: function(event) {
        if (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
}

module.exports = Events;
