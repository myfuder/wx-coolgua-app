//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
import { dateStr4ios} from "../../../../../utils/util";
Page({
  data: { 
    exhibitList: [{
      id: 1
    }],
    exhibits: [],
    list: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  // 初始化数据
  initData: function(){
    (0, api.getActivityPairList)({
      success: function (res) {
        let PairList = res.data.result;
        _self.nowTime1(PairList);
        _self.setData({
          list: res.data.result
        })
        setTimeout(() => {
                  _self.initData()
                }, 1000)
      }
    });
  },
  // 倒计时
  nowTime1(list) {//时间函数 
    var len = list.length
    for (var i = 0; i < len; i++) {
      var start = Date.parse(list[i].activityTime+" "+list[i].startTime)
      // console.log(start)
      // 当前时间的时间戳
      var timestamp = Date.parse(new Date());
      // console.log(timestamp)
      var intDiff = start - timestamp;//获取数据中的时间戳 
      // console.log(intDiff)
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间 
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        intDiff--;
        var str = hour + ':' + minute + ':' + second
      } else {
        var str = "已结束！";
        clearInterval(this.timer1);
      }
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  // goDetailPage: function(e) {
  //   wx.navigateTo({
  //     url: `/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail?id=${e.currentTarget.dataset.id}`,
  //   })
  // },

  //进入会议
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
          const url = `/packageTencentCloud/pages/meeting/meeting?id=${res.data.result}&toID=${e.currentTarget.dataset.supplierid}`
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

  
  onLoad: function () {
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
  },
  onShow:function(){
    _self = this
    _self.initData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
