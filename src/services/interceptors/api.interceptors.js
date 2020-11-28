import localStorageUtils from '../../utils/localStorage.utils';

export const requestInterceptor = config => {
  if (config.url.includes('/public')) {
    return config;
  }

  const { token } = localStorageUtils.get();

  config.headers.Authorization = `Bearer ${token}`;

  return config;
};

export const errorInterceptor = error => {
  if (error.response.data.status === 401 && error.response.data.type === 'Auth-Token-Expired') {
    localStorageUtils.delete();

    window.location = '/?expired=true';
  }

  return Promise.reject(error);
};
