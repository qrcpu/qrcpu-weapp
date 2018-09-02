// pages/template_view.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    template_id:0,
    title:"",
    totals:"",
    template_qrcode: { "cover": "", "thumb":"/image/pic.png"},
    content:"",
    copyright:"",
    price:0.00

  },
  tapPreview:function(){
    var _cover = this.data.template_qrcode.cover;
    wx.previewImage({
      current: _cover,
      urls: [_cover]
    })
  },
  tapUse:function(){
    var _template_id = this.data.template_id;
    wx.navigateTo({
      url: "/pages/qrcpu_generator/qrcpu_generator?template_id=" + _template_id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (!options.template_id || options.template_id <=0){
      wx.showModal({
        content: "您查看的模板不存在",
        showCancel: false,
      })
      return false;
    }

    var that = this;
    that.setData({
      template_id: options.template_id
    });


    var _tokenData = app.qrcpuTokenData();
    var _data = {
      qrcpu_time: _tokenData.qrcpu_time,
      qrcpu_token: _tokenData.qrcpu_token,
      template_id: options.template_id
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
      url: app.globalData.apiDomain + "/qrcpuapi/template_view.html",
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
          var _setData = res.data.data;
          that.setData(_setData);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
      }

    });


      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '美化你的二维码',
	  desc: '免费使用模板美化二维码',
      path: '/pages/template_view/template_view?template_id=' + that.template_id
    }
  }
})