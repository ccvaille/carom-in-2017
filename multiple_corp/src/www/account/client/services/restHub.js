import xAxios from './xAxios';

const getDefaultOpts = {
    method: 'get',
};

const postDefaultOpts = {
    method: 'post',
};

const postOssDefaultOpts = {
    method: 'post',
};

const postFormDefaultOpts = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
};

const putDefaultOpts = {
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'put',
};

const removeDefaultOpts = {
    method: 'delete',
};

const getSerializedObject = (object) => {
    let serializedString = '';
    Object.keys(object).forEach((key) => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
};

const getFormData = (object) => {
    const data = new FormData();
    Object.keys(object).forEach(key => data.append([key], object[key]));
    return data;
};

const restHub = {
    get(url, opts = { params: {} }) {
        /* eslint-disable no-param-reassign */
        if (opts.params && Object.keys(opts.params).length > 0) {
            if (url.indexOf('?') > -1) {
                url += getSerializedObject(opts.params);
            } else {
                url += `?${getSerializedObject(opts.params)}`;
            }
        }
        delete opts.params;
        /* eslint-enable no-param-reassign */
        return xAxios(url, {
            ...getDefaultOpts,
            opts,
        });
    },

    post(url, opts = { data: {} }) {
        const options = {
            ...postDefaultOpts,
            ...opts,
        };
        return xAxios(url, options);
    },

    postForm(url, opts = { data: {} }) {
        const options = {
            ...postFormDefaultOpts,
            ...opts,
            data: getSerializedObject(opts.data),
        };
        return xAxios(url, options);
    },

    uploadToOss(url, opts = { data: {} }) {
        const options = {
            ...postOssDefaultOpts,
            ...opts,
            isOss: true,
            data: getFormData(opts.data),
        };
        return xAxios(url, options);
    },

    uploadFile(url, opts = { data: {} }) {
        const options = {
            ...postOssDefaultOpts,
            ...opts,
            isOss: opts.isOss,
            data: getFormData(opts.data),
        };
        return xAxios(url, options);
    },

    put(url, opts = { data: {} }) {
        const options = {
            ...putDefaultOpts,
            ...opts,
        };
        return xAxios(url, options);
    },

    remove(url, opts) {
        const options = { ...removeDefaultOpts, opts };
        return xAxios(url, options);
    },
};

export default restHub;
