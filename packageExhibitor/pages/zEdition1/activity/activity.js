//activity.js
//获取应用实例
import {API_URL} from "../../../../utils/constant";
import {ajax, mergeArray} from "../../../../utils/util";

const app = getApp()
let _self = null;
let api = require("../../../../utils/api"), constant = require("../../../../utils/constant"),
  i18n = require('../../../../i18n/i18n.js'), storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
let TIME = 60
Page({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    concurrentEvents: [],
    pagination: {
      pageNum: 1,
      pageSize: 10,
    },
    isMore: true,
    ismyself: false,
  },
  onLoad: function (options) {
    app.editTabBar();
    _self = this
    _self.setData({
      ismyself: options.ismyself,
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
      this.activitypair();
  },
  //同期活动列表
  activitypair: function (e) {
    var Url = app.globalData.host
    wx.request({
      url: Url + '/api3/activitypair/slist/' + storage.getUserInfo().id,
      method: "GET",
      data: {},
      success: res => {
        _self.setData({
          concurrentEvents:res.data.result
        })

      }
    })
  },
  goOverview: function (event) {
    var tid = event.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '../activityDetail/activityDetail?tid=' + tid
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // onReachBottom() {
  //   this.initData()
  // }
})
