function offset( options ) {
    // Preserve chaining for setter
        // if ( arguments.length ) {
        //     return options === undefined ?
        //         this :
        //         this.each( function( i ) {
        //             jQuery.offset.setOffset( this, options, i );
        //         } );
        // }

        var doc, docElem, rect, win,
            elem = options;

        if ( !elem ) {
            return;
        }

        // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
        // Support: IE <=11 only
        // Running getBoundingClientRect on a
        // disconnected node in IE throws an error
        if ( !elem.getClientRects().length ) {
            return { top: 0, left: 0 };
        }

        rect = elem.getBoundingClientRect();

        doc = elem.ownerDocument;
        docElem = doc.documentElement;
        win = doc.defaultView;

        // console.log(win, 'hhhhhhhhh')

        return {
            top: rect.top + win.pageYOffset - docElem.clientTop ,
            left: rect.left + win.pageXOffset - docElem.clientLeft
        };
};

module.exports = offset;
