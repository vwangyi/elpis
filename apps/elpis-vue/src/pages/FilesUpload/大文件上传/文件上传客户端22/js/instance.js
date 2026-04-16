let instance = axios.create();
instance.defaults.baseURL = 'http://127.0.0.1:8888';
instance.defaults.headers['Content-Type'] = 'multipart/form-data';
instance.defaults.transformRequest = (data, headers) => {
  const contentType = headers['Content-Type'];
  if (contentType === 'application/x-www-form-urlencoded')
    return Qs.stringify(data);
  return data;
};
instance.interceptors.response.use(response => {
  return response.data;
});

function cancelRequest(config) {
  // 1. 标记
  const controller = new AbortController();
  config.signal = controller.signal;
  return {
    promise: req(config),
    cancel: controller.abort,
    controller
  };
}

// const { promise, cancel } = cancelRequest(data);
