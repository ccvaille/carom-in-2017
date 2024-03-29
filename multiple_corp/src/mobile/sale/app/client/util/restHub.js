import xFetch from './xFetch';
import Cookie from 'react-cookie';

const postDefaultOpts = {
    headers: {
        'Content-Type': 'application/json',
        // 'X-XSRF-TOKEN': Cookie.load('XSRF-TOKEN')
    },
    method: 'POST',
};

const postOssDefaultOpts = {
    method: 'POST',
};

const postFormDefaultOpts = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
};

const putDefaultOpts = {
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'PUT',
};

const removeDefaultOpts = {
    method: 'DELETE',
};

const getSerializedObject = (object) => {
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
};


const getFormData = (obj) => {
    const formData = [];
    for(const key in obj){
        if(key == "users"){
            obj[key].map((item, index) => {
                formData.push(key + '[' + index + '][id]' + '=' + item.id);
                formData.push(key + '[' + index + '][name]' + '=' + item.name);
                formData.push(key + '[' + index + '][type]' + '=' + item.type);
                formData.push(key + '[' + index + '][parent_id]' + '=' + item.parent_id);
            })
        }else{
            formData.push(key + '=' + obj[key]);
        }
    }
    return formData.join("&");
}

const restHub = {
    get(url, opts = {params: {}}) {
        if (opts.params && Object.keys(opts.params).length > 0) {
            if (url.indexOf('?') > -1) {
                url += getSerializedObject(opts.params);
            }
            else {
                url += '?' + getSerializedObject(opts.params);
            }
        }
        delete opts.params;
        return xFetch(url, opts);
    },

    post(url, opts = {body: {}}) {
        const options = {
            ...postDefaultOpts,
            ...opts,
            body: JSON.stringify(opts.body),
        };
        return xFetch(url, options);
    },

    postOld(url, opts = {body: {}}) {
        const options = {
            ...postFormDefaultOpts,
            ...opts,
            body: getSerializedObject(opts.body),
        };
        return xFetch(url, options);
    },

    postForm(url, opts = {body: {}}) {
        const options = {
            ...postFormDefaultOpts,
            ...opts,
            body: getFormData(opts.body),
        };
        return xFetch(url, options);
    },

    uploadFile(url, opts = {body: {}}) {
        const options = {
            ...postOssDefaultOpts,
            ...opts,
            isOss: true,
            body: getFormData(opts.body),
        };
        return xFetch(url, options);
    },

    put(url, opts = {body: {}}) {
        const options = {
            ...putDefaultOpts,
            ...opts,
            body: JSON.stringify(opts.body),
        };
        return xFetch(url, options);
    },

    remove(url, opts) {
        const options = {...removeDefaultOpts, opts};
        return xFetch(url, options);
    },
};

export default restHub;
