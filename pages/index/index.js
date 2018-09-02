
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    template_id: 0,
    qrdata:"",
    is_show_qrcode:false,
    template_qrcode:"/image/pic.png",
    color_array: ['高级黑', '中国红', '微信绿', '武藤蓝'],
    color_index: 0,
    xt_array: ['液态', '直角', '圆圈'],
    xt_index: 1,
    qrsize:300
  },
  onShareAppMessage: function () {
    return {
      title: '个性二维码制作',
      desc: '免费使用模板美化二维码',
      path: '/pages/index/index'
    }
  },
  sliderSize:function(e){
    this.setData({
      qrsize: e.detail.value
    })
  },
  bindPickerColor: function (e) {
    this.setData({
      color_index: e.detail.value
    })
  },
  bindPickerXt: function (e) {
    this.setData({
      xt_index: e.detail.value
    })
  },
  tapPreview: function () {
    var _cover = this.data.template_qrcode;
    wx.previewImage({
      current: _cover,
      urls: [_cover]
    })
  },


  tapScan: function (event) {
    var that = this;
    wx.scanCode({
      fail:function(){
        wx.showModal({
          content: '未识别出二维码',
          showCancel: false
        })
      },
      success: (res) => {
        that.setData({
          qrdata: res.result
        });
        
      }
    })
  },
  bindFormSubmit:function(e){
    var that = this;
    var _formData = e.detail.value;
    if (_formData.qrdata==""){
      wx.showModal({
        content: '请输入二维码内容',
        showCancel:false
      })
      return false;
    }

    var _tokenData = app.qrcpuTokenData();
    var _data = {
      qrcpu_time: _tokenData.qrcpu_time,
      qrcpu_token: _tokenData.qrcpu_token,
      qrsize: that.data.qrsize,
      color_index: that.data.color_index,
      xt_index: that.data.xt_index,
      qrdata: _formData.qrdata
    };
  
    //本地缓存

    //load data
    //发起网络请求
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    //console.log('onReachBottom')
    //return ;
    wx.request({
      url: app.globalData.apiDomain + "/qrcpuapi/easy_generator.html",
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: _data,
      complete: function () {
        wx.hideToast();
      },
      fail: function (res) {
        wx.showModal({
          title: '请求失败',
          content: res.errMsg,
          showCancel: false,
        })
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            is_show_qrcode:true,
            template_qrcode: res.data.data
          },function(){
            that.tapPreview();
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
      }

    });




  }

})