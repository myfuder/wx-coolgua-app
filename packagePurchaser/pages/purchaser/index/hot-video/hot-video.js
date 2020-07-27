//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {
    exhibitList: [{
      id: 1
    }],
    exhibits: [],
    currentType: 1,
    liveList:[],
    videoList: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    totalPage: 1,
    currentPage: 1,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    exhibitId:'' //展商调我的直播列表id
  },
  releaseLive:function(){
    wx.navigateTo({
      url: `/packageExhibitor/pages/newedition/liveRelease/liveRelease`,
    })
  },
  // 初始化数据
  initData: function () {
    const exhibits = [];
    (0, api.getLiveList)({
      query: {
        id: this.data.exhibitId||storage.getActivityDetail().id
      },
      data: {
        pageNum: _self.data.currentPage,
        pageSize: 10
      },
      success: function (res) {
        if(res.data.code==0){
          res.data.result.data.map(item => {
            item.videoCoverImage = item.coverImage;
            item.videoTitle = item.theme
            item.videoPopular = item.number
          })
          _self.setData({
            liveList: res.data.result.data
          })

        }
      }
    });
    (0, api.getVideoList)({
      data: {
        pageNum: _self.data.currentPage,
        pageSize: 10
      },
      query: {
        id: storage.getActivityDetail().id
      },
      success: function (res) {
        res.data.result.data.map(item => {
          item.id = item.supplierId
        })
        _self.setData({
          videoList: res.data.result.data
        })
      }
    });
  },
  goDetailPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}`,
    })
  },
  changeTypeTap: function (e) {
    _self.setData({
      currentType: parseInt(e.currentTarget.dataset.type)
    })
    this.initData()
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.langTranslate['直播'],
    });
    console.log(options,"kkkkkkkkkkkkkkk");
    let exhibitId = options&&options.id?options.id:'';
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
      exhibitId
    })
  },
  onShow: function () {
    console.log(333)
    _self = this
    _self.initData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
