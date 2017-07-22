var localStorageFix = {
    setItem: function(key, value) {
         try {
             window.localStorage.setItem(key, value);
         } catch (error) {
         }
    },
    getItem: function(key) {
        try {
           return window.localStorage.getItem(key)
        } catch (error) {
            return '';
        }
    }
};

module.exports = {
    localStorageFix: localStorageFix
};
