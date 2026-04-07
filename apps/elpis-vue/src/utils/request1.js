import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

const service = axios.create({
  baseURL: '/api/prod-api'
});

service.interceptors.request.use(
  config => {
    config.headers.Authorization =
      localStorage.getItem(
        'HRM_TOKEN'
      );
    return config;
  },
  error => {
    return Promise.reject(
      error
    );
  }
);

service.interceptors.response.use(
  res => res,
  error => {
    switch (
      error.response.status
    ) {
      case 401:
        if (
          router.history
            .current.name ===
          'login'
        ) {
          return;
        }
        router.push({
          path: '/login',
          query: {
            redirect:
              router.history
                .current.path
          }
        });
        break;

      default:
        break;
    }

    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    });
    return Promise.reject(
      error
    );
  }
);

export default service;
