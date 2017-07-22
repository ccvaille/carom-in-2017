import { SET_LOCALE } from 'constants/LocaleActionTypes';

// eslint-disable-next-line import/prefer-default-export
export function setLocale(payload) {
    return {
        type: SET_LOCALE,
        payload,
    };
}
