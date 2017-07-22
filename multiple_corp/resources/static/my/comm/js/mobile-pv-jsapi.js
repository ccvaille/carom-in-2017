!function(window) {

    var callbacks = {};
    var callbackCount = 0;

    var __ec_bridge__ = {
        /**
         * popShareActionSheet
         * @param  {Object}   params   {title, description, url, imageUrl, type:1场景秀0表单}
         * @param  {Function} callback function (result, error) {}
         * @return {void}
         */
        presentShareActionSheet: function (params, callback) {
            window.__ec_native__ && __ec_native__.presentShareActionSheet(JSON.stringify(params), this.__registerCallback('presentShareActionSheet', callback));
        },

        /**
        * openWebview
        * @param  {Object}   params   {title, description, url, imageUrl, type:1场景秀0表单}
        * @param  {Function} callback function (result, error) {}
        * @return {void}
        */
        openWebview: function (params, callback) {
            window.__ec_native__ && __ec_native__.openWebview(JSON.stringify(params), this.__registerCallback('openWebview', callback));
        },

        /**
         * setTitle
         * @param {Object}   params   {title}
         * @param {Function} callback function (result, error) {}
         */
        setTitle: function (params, callback) {
            window.__ec_native__ && __ec_native__.setTitle(JSON.stringify(params), this.__registerCallback('setTitle', callback));
        },


        /**
         * openSingleSelectableDepartmentPanel
         * 调起选人组件
         * @param {Object}   params   {}
         * @param {Function} callback function (result, error) {}
         */
        openSingleSelectableDepartmentPanel: function (params, callback) {
            window.__ec_native__ && __ec_native__.openSingleSelectableDepartmentPanel(JSON.stringify(params), this.__registerCallback('openSingleSelectableDepartmentPanel', callback));
        },


        __registerCallback: function (prefix, callback) {
            if (!callback) {
                return;
            }
            var callbackName = prefix + '_callback_' + callbackCount++;
            callbacks[callbackName] = callback;

            return callbackName;
        },


        __invokeCallback: function (callbackName, result, error) {
            var callback = callbacks[callbackName];
            if (!callback) {
                console.log('CallbackName: `' + callbackName + '` is not found.');
                return;
            }
            console.log('CallbackName: `' + callbackName + '` is invoked.');
            callback(result, error);
            delete callbacks[callbackName];
        }
    };

    window.__ec_bridge__ = __ec_bridge__;

}(window);
