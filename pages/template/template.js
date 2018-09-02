//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    catList: [
      { cat_id: 0, cat_name: "全部模板" }
    ],
    dataList: [
      // { template_id: 1, title: "模板1", template_qrcode: { cover: "/image/icon_moban_HL.png" } }
    ],
    curCatId: 0
  },
  page_index: 0,
  page_total: 0,
  onShareAppMessage: function () {
    var _cat_id = this.data.curCatId;
    return {
      title: '二维码模板',
      desc: '免费使用模板美化二维码',
      path: '/pages/index/index?cat_id=' + _cat_id
    }
  },
  onLoad: function (options) {
    var that = this;
    if (options.cat_id>0){
      that.setData({
        curCatId: options.cat_id
      }, function () {
        that.onReachBottom();
      });
    }else{
      that.onReachBottom();
    }
    
  },
  tapSwitchCat: function (e) {
    var that = this;
    let id = e.target.dataset.cat_id;
    //reset
    that.page_index = 0;
    that.page_total = 0;

    that.setData({
      dataList:[],
      curCatId:id
    },function(){
      that.onReachBottom();
    });

  },
  onReachBottom: function () {

    var that = this;
    if (that.page_total > 0 && that.page_index >= that.page_total){
      wx.showModal({
        content: '已加载完',
        showCancel: false
      });
      return false;
    }
    var _tokenData = app.qrcpuTokenData();
    var _data = {
      qrcpu_time: _tokenData.qrcpu_time,
      qrcpu_token: _tokenData.qrcpu_token,
      kwd:"",
      cat_id: that.data.curCatId,
      cat_count: that.data.catList.length,
      page_index: parseInt(that.page_index) +1
    };
    //本地缓存

    //发起网络请求
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    //console.log('onReachBottom')
    //return ;
    wx.request({
      url: app.globalData.apiDomain + "/qrcpuapi/template.html",
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
          try {
            if (res.data.count <= 0) {
              that.page_total = 1;
              wx.showModal({
                content: '暂无记录',
                showCancel: false
              });
            } else {
              that.page_index = parseInt(res.data.page_index);
              that.page_total = parseInt(res.data.page_total);

              var _setData = {};

              var _list = res.data.data;
              if (_list.length > 0)
              {
                var _dataArray = that.data.dataList;
                for (var i in _list) {
                  _dataArray.push(_list[i]);
                }
                _setData.dataList = _dataArray;
              }

              _list = res.data.cat_list;
    
              if (_list.length >0){
                var _catArray = that.data.catList;
                if (_catArray.length <=1){//防重复请求
                  for (var i in _list) {
                    _catArray.push(_list[i]);
                  }
                  _setData.catList = _catArray;
                }
              }

              that.setData(_setData);

            }



          } catch (e) {
            console.log("reg onReachBottom 错误")
          }
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
