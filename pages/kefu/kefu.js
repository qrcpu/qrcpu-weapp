
const app = getApp();
Page({
  data: {
    kefuTel: app.globalData.kefuTel
  },
  tapKeFuTel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.kefuTel
    })
  },
  tapCopyTel: function () {
    var that = this;
    wx.showModal({
      content: '复制手机号 > 添加客服为好友',
      confirmText: '复制',
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: that.data.kefuTel,
            success: function (res) {
              wx.showToast({
                title: '已复制',
                icon: 'success',
                duration: 1000
              })
            }
          })

        }
      }
    })


  }


 
})