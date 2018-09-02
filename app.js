//app.js
var util = require('./utils/util.js'), util_md5 = require('./utils/md5.js');
App({
  // onLaunch: function () {
  //   console.log(util.formatTime(new Date()));
  // },
  globalData: {
    apiDomain: "https://demo.qrcpu.com",//改为您的 接口域名
    kefuTel: "17012345678", //改为您的 客服电话 + 微信
    tokenKey:"test-qrcpu.com"//请求签名key，与后台custom.php token_keys 设置一样就行
  },
  qrcpuTokenData:function(){
    var that = this;
    var _timestamp = util.getTimestamp();
    return {
      "qrcpu_time": _timestamp,
      "qrcpu_token": util_md5.hexMD5(that.globalData.tokenKey + _timestamp)
    };

  }


})