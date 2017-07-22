import fetch from 'isomorphic-fetch';
// import cookie from 'react-cookie';
// import { API_PREFIX } from './Network';

const errorMessages = res => ({
  code: -100,
  message: `${res.status} ${res.statusText}`,
});

function checkLogin(res) {
  if (res.url.indexOf('/login') > -1) {
    const protocol = location.protocol;
    let host = location.host;
    if (host.indexOf('static.workec.com') > -1) {
      host = 'www.workec.com';
    }

    location.replace(`https://www.workec.com/login?from=${protocol}//${host}`);
  }

  return res;
}

function check401(res) {
  if (res.status === 401) {
    location.href = '/401';
  }
  return res;
}

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function jsonParse(res) {
  return res.json().then(jsonResult => ({ ...res, jsonResult }));
}

function errorMessageParse(res) {
  const { code, msg } = res.jsonResult;
  if (code !== 0) {
    return Promise.reject({ message: msg, code });
  }
  return res;
}

function xFetch(url, options) {
  // const urlWithPrefix = `${API_PREFIX}${url}`;
  const opts = {
    mode: 'cors',
    credentials: options.isOss ? '' : 'include',
    ...options,
  };
  opts.headers = {
    ...opts.headers,
    // authorization: cookie.get('authorization') || '',
  };

  return fetch(url, opts)
    // .then(check401)
    .then(check404)
    .then(checkLogin)
    .then(jsonParse)
    .then(errorMessageParse)
    .catch(errorObj => {
      const { code, message } = errorObj;
      let errorMsg = '';
      if (typeof message === 'object') {
        errorMsg = '系统繁忙';
      } else if (message.indexOf('Unexpected') > -1) {
        errorMsg = '系统繁忙';
      } else {
        errorMsg = message;
      }

      return { errorCode: code, errorMsg };
    });
}

export default xFetch;
