/*eslint-disable */
var actTypes = {
    SET_CS_INFO: 'SET_CS_INFO'
};
var csInfoActs = {
    actTypes: actTypes,
    setCsInfo: function (data) {
        return {
            type: actTypes.SET_CS_INFO,
            payload: {
                data: data
            }
        };
    }
};

module.exports = csInfoActs;
/*eslint-enable */
