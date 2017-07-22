!function(window) {

    var callbacks = {};
    var callbackCount = 0;

    //存放客户端主动调用web的方法
    var registedEvents={};

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

        endPullToRefresh:function(params,callback){
            window.__ec_native__ && __ec_native__.endPullToRefresh(JSON.stringify(params), this.__registerCallback('endPullToRefresh', callback));
        },

        setWebViewHeaderBackgroudColor:function(params,callback){
            window.__ec_native__ && __ec_native__.setWebViewBackgroudColor(JSON.stringify(params), this.__registerCallback('setWebViewBackgroudColor', callback));
        },

        setWebViewFooterBackgroudColor:function(params,callback){
            window.__ec_native__ && __ec_native__.setWebViewFooterBackgroudColor(JSON.stringify(params), this.__registerCallback('setWebViewFooterBackgroudColor', callback));
        },

        openCustomerInfoView:function(params,callback){
            window.__ec_native__ && __ec_native__.openCustomerInfoView(JSON.stringify(params), this.__registerCallback('openCustomerInfoView', callback));
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
            var registedEvent = registedEvents[callbackName];
            if(registedEvent){
                callbackName(result, error);
                return;
            }

            var callback = callbacks[callbackName];
            if (callback) {
                console.log('CallbackName: `' + callbackName + '` is invoked.');
                callback(result, error);
                delete callbacks[callbackName];
            }
        },
        
        //注册事件，客户端主动调用页面方法，例如广播消息，下拉刷新
        addEventListener: function (callbackName, callback) {
            if (!callback) {
                return;
            }
            registedEvents[callbackName] = callback;
        },

        //取消注册事件
        removeEventListener: function (callbackName) {
            if(registedEvents.callbackName){
                delete registedEvents.callbackName
            }
        },
    };

    window.__ec_bridge__ = __ec_bridge__;

}(window);
