
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    template_id: 0,
    qrdata:"",
    is_show_qrcode:false,
    template_qrcode:"/image/pic.png"
  },
  tapPreview: function () {
    var _cover = this.data.template_qrcode;
    wx.previewImage({
      current: _cover,
      urls: [_cover]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.template_id) {
      this.setData({
        template_id: options.template_id
      });
    }
    // console.log(this.data.template_id);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (that.data.template_id <= 0) {
      wx.showModal({
        content: '请先选择二维码模板',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/index/index'
            })
          }
        }
      })
      return false;
    }


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
      template_id:that.data.template_id,
      qrdata: _formData.qrdata
    };
    // console.log(_data);
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
      url: app.globalData.apiDomain + "/qrcpuapi/generator.html",
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
            is_show_qrcode: true,
            template_qrcode: res.data.data
          }, function () {
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