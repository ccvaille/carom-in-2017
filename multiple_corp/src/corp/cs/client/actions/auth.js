import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { authErrorType } from 'constants/shared';

// eslint-disable-next-line import/prefer-default-export
export function simulateLogin() {
    return () => restHub.get(ApiUrls.simulateLogin)
                        .then(({ errorCode, errorMsg }) => {
                            if (errorCode === 40001) {
                                return {
                                    ok: false,
                                    reason: authErrorType.sessionError,
                                };
                            }

                            if (errorMsg && errorMsg.indexOf('网络异常') === -1) {
                                window.location = 'http://www.workec.com/login';
                                return {
                                    ok: false,
                                    reason: authErrorType.networkError,
                                };
                            }

                            return {
                                ok: true,
                                reason: '',
                            };
                        });
}
