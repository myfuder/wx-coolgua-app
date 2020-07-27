//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitList: [{
      id: 1
    }],
    id: null,
    detailInfo: [],
    appointDetail: {},
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  // 初始化数据
  initData: function(){
    (0, api.getActivityPair)({
      query: {
        id: this.data.id
      },
      success: function (res) {
        const isEn = _self.data.isEn;
        res.data.result.map(item => {
          item.startTime = util.formatNumberTime(item.predictStartTime, 'H:i')
          item.endTime = util.formatNumberTime(item.predictEndTime, 'H:i')
          isEn ? item.tagName = item.tagEnglishNames.join(',') : item.tagName = item.tagNames.join(',')
        })
        _self.setData({
          detailInfo: res.data.result
        })
      }
    });
    (0, api.getActivityDetail)({
      query: {
        id: this.data.id
      },
      success: function (res) {
        // res.data.result.map(item => {
        //   item.startTime = util.formatNumberTime(item.predictStartTime, 'H:i')
        //   item.endTime = util.formatNumberTime(item.predictEndTime, 'H:i')
        //   item.tagName = item.tagNames.join(',')
        // })
        _self.setData({
          appointDetail: res.data.result
        })
      }
    }) 
  },
  goToMeeting(e) {
    var that = this
    api.getInterMeetingPurchaser({
      method: 'GET',
      query: {
        meetingid: e.currentTarget.dataset.meetingid
      },
      success: (res) => {
        const nowTime = new Date()
        if (res.data.code == '0') {
          if (nowTime - this.tapTime < 1000) {
            return
          }
          console.log(e.currentTarget.dataset)
          const url = `/packageTencentCloud/pages/meeting/meeting?id=${res.data.result}&toID=${e.currentTarget.dataset.supplierid}`
          console.log(url)
          wx.navigateTo({
            url,
          })
        }
        this.setData({
          'tapTime': nowTime
        })
      }
    })
  },
  
  onLoad: function (options) {
    _self = this
    this.setData({
      id: options.id,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
    _self.initData()
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
