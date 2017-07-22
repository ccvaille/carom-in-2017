import fetch from 'isomorphic-fetch';


function check401(res) {
  if (res.status === 401) {
    location.href = '//my.workec.com/form';
  }
  return res;
}


function jsonParse(res) {
  return res.json();
}

// function errorMessageParse(res) {
//     const { code, msg } = res.jsonResult;
//     if (code !== 0 && code !== 200) {
//         return Promise.reject({ message: msg, code });
//     }
//     return res;
// }

function xFetch(url, options) {
  const opts = {
    mode: 'cors',
    credentials: options.isOss ? '' : 'include',
    ...options,
  };
  opts.headers = {
      "X-Requested-With": "XMLHttpRequest",
    ...opts.headers,
  };

  return fetch(url, opts)
    .then(check401)
    .then(jsonParse)
      .catch((err)=>{
          console.log(err);
      });
}

export default xFetch;
