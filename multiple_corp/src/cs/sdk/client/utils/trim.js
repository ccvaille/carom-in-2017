String.prototype.trim = String.prototype.trim || function () {
    var pattern = /(^ *| *$)/g;
    this.replace(pattern, '');
};
