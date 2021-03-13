module.exports = {
  devServer: {
    proxy: {
      '/chat/*': {
        //这里最好有一个 /
        target: 'http://121.199.31.210:8000', // 后台接口域名
        ws: true, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
      },
    },
    disableHostCheck: true,
  },
  //webpack4.0 开启热更新
};
