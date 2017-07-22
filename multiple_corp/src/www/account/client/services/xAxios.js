import axios from 'axios';

const axiosIns = axios.create({
    baseURL: 'https://html.workec.com/visitwww/',
    timeout: 3000,
    withCredentials: true,
});

const errorMessages = res => ({
    code: -100,
    message: `${res.status} ${res.statusText}`,
});

function check404(resp) {
    if (resp.status === 404) {
        return Promise.reject(errorMessages(resp));
    }
    return resp;
}

function jsonParse(resp) {
    return {
        ...resp,
        jsonResult: resp.data,
    };
}

function errorMessageParse(url, opts, resp) {
    const { ret, msg } = resp.jsonResult;
    let { code } = resp.jsonResult;

    if (code !== 0 && code !== 200 && ret !== 200 && ret !== 0) {
        if (code === undefined && ret !== undefined) {
            code = ret;
        }

        return Promise.reject({ message: msg, code, jsonResult: resp.jsonResult });
    }
    return resp;
}

function xAxios(url, opts) {
    return axiosIns(url, opts)
    .then(check404)
    .then(jsonParse)
    .then(errorMessageParse.bind(null, url, opts))
    .catch((errorObj) => {
        const { message, jsonResult } = errorObj;
        let { code } = errorObj;

        let errorMsg = '';
        if (message.indexOf('Network') > -1 || message.indexOf('网络') > -1) {
            code = -50000;
            errorMsg = '网络异常';
        } else if (typeof message === 'object' || errorObj instanceof SyntaxError) {
            errorMsg = '系统繁忙';
        } else {
            errorMsg = message || '系统繁忙';
        }

        return { errorCode: code, errorMsg, jsonResult };
    });
}

module.exports = xAxios;
