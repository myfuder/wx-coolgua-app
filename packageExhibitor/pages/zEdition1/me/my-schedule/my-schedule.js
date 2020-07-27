//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {
    exhibitList: [{
      id: 1
    }],
    exhibits: [],
    statusList: [],
    currentStatus: 0,
    weekNameArr: ['日', '一', '二', '三', '四', '五', '六'],
    lists: [],
    dayCount: 31,
    startDate: null,
    staticImageUrl: constant.STATIC_IMAGE_URL,
    scheduleList: [],
    receiveStatusList: [],
    currentReceiveStatus: 0,
    date: '',
    todayDate: '',
    // 日程
    myDateScheduleList: [],
    // 参数部分
    dateParam: '',
    yearMonthParam: '',
    firstDay: 0,
    // 进入会议所需参数
    roomID: '',
    userID: 'user1',
    template: 'grid',
    cloudenv: 'PRO',
    scene: 'rtc',
    localVideo: true,
    localAudio: true,
    enableEarMonitor: false,
    enableAutoFocus: true,
    localMirror: 'auto',
    enableAgc: true,
    enableAns: true,
    encsmall: false,
    frontCamera: 'front',
    resolution: 'SD',
    debugMode: false,
    currentIndex: 0,
    dialogHide: true,
    date: '',
    dayText: '',
    startTime: '',
    endTime: '',
    inviteSupplierId: null,
    remark: '',
    topTheme: '',
    Rreadd: {},
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
  },
  // 初始化数据
  initData: function () {
    const isEn = _self.data.isEn
    const statusList = [{
      label: isEn ? 'Confirmed' : '已确认',
      value: 0
    }, {
      label: isEn ? 'Items to be confirmed' : '待确认',
      value: 2
    }, {
      label: isEn ? 'Reject' : '被拒绝',
      value: 5
    }, {
      label: isEn ? 'Cancelled' : '已取消',
      value: 6
    }]
    const receiveList = [{
      label: isEn ? 'Confirmed' : '已确认',
      value: 0
    }, {
      label: isEn ? 'Items to be confirmed' : '待确认',
      value: 2
    }, {
      label: isEn ? 'Reject' : '已拒绝',
      value: 5
    }, {
      label: isEn ? 'Cancelled' : '已取消',
      value: 6
    }],
      lists = [];
    for (let i = 0; i < _self.getAllDay(_self.data.startDate.getFullYear(), _self.data.startDate.getMonth() + 1); i++) {
      lists.push({
        id: i,
        value: i + 1
      })
    }
    _self.setData({
      statusList: statusList,
      receiveStatusList: receiveList,
      lists: lists
    })
  },
  getPurchaserSchedule: function () {
    // 我的日程
    (0, api.getSupplierDaySchedule)({
      data: {
        pageNum: 1,
        pageSize: 200,
        supplierId: storage.getUserInfo().id,
        yearMonth: this.data.yearMonthParam,
        day: this.data.dateParam,
        sponsor:'0'
      },
      success: function (res) {
        _self.setData({
          myDateScheduleList: res.data.result
        })
      }
    });
  },
  exhibitorInvite:function(event){
    (0, api.getSupplierFinish)({
      query: {
        id: event.currentTarget.dataset.id
      },
      success: function (res) {
        wx.showToast({
          title: '已完成邀约!',
        })
        _self.getPurchaserSchedule()
      }
    });
  },
  // 下个月
  nextDateTap: function () {
    const nextDate = this.getNextMonth(this.data.yearMonthParam.split('-')[0], this.data.yearMonthParam.split('-')[1]);
    this.setData({
      yearMonthParam: nextDate.year + '-' + util.formatDateStr(nextDate.month),
      dateParam: nextDate.year + '-' + util.formatDateStr(nextDate.month) + '-01',
      date: nextDate.year + '年' + nextDate.month + '月',
      lists: _self.getDays(nextDate.year, nextDate.month),
      firstDay: this.getFirstDayWeek(nextDate.year, nextDate.month)
    });
  },
  lastDateTap: function () {
    const nextDate = this.getLastMonth(this.data.yearMonthParam.split('-')[0], this.data.yearMonthParam.split('-')[1]);
    this.setData({
      yearMonthParam: nextDate.year + '-' + util.formatDateStr(nextDate.month),
      dateParam: nextDate.year + '-' + util.formatDateStr(nextDate.month) + '-01',
      date: nextDate.year + '年' + nextDate.month + '月',
      lists: _self.getDays(nextDate.year, nextDate.month),
      firstDay: this.getFirstDayWeek(nextDate.year, nextDate.month)
    });
  },
  getDays: function (year, month) {
    const lists = []
    for (let i = 0; i < _self.getAllDay(year, month); i++) {
      lists.push({
        id: i,
        value: i + 1
      })
    }
    return lists
  },
  /**
   * 获取下一个月
   *
   * @date 格式为yyyy-mm的日期，如：2014、01
   */
  getNextMonth(year, month) {
    var days = new Date(year, month, 0);
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    return {
      year: year2,
      month: month2
    };
  },
  /**
   * 获取下一个月
   *
   * @date 格式为yyyy-mm的日期，如：2014、01
   */
  getLastMonth(year, month) {
    var days = new Date(year, month, 0);
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12;
    }
    return {
      year: year2,
      month: month2
    };
  },
  // 刷新日程
  refreshDateTap: function (e) {
    let date = e.currentTarget.dataset.day
    date < 10 ? date = '0' + date : '';
    this.setData({
      dateParam: this.data.yearMonthParam + '-' + date,
      todayDate: this.data.yearMonthParam + '-' + date
    })
    this.getPurchaserSchedule()
  },
  // 倒计时
  nowTime1(list) {//时间函数 
    var len = list.length
    for (var i = 0; i < len; i++) {
      var start = Date.parse(list[i].activityTimeBegin + ':00')
      // var start=1586945660
      // console.log(start)

      // 当前时间的时间戳
      var timestamp = Date.parse(new Date()) / 1000
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
        // console.log(str)     
      } else {
        var str = "已结束！";
        clearInterval(this.timer1);
      }
      //       // console.log(str); 
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去 
    }
    return list
  },
  toast(str) {
    wx.showToast({
      title: str,
      icon: 'none'
    })
  },
  cancelPopupTap: function () {
    this.setData({
      dialogHide: true
    })
  },
  changeTopTheme: function (e) {
    this.setData({
      topTheme: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const date = e.detail.value.replace('-', '/')
    this.setData({
      date: e.detail.value,
      dayText: util.setDayText(new Date(date).getDay())
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  changeRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  goDetailPage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail',
    })
  },
  /** 获取某年某月的第一天是星期几，返回0-6 */
  getFirstDayWeek(year, month) {
    var d = new Date();
    d.setYear(year);
    d.setMonth(month - 1);
    d.setDate(1);
    return d.getDay()
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
  },
  /** 获取某个月有多少天 */
  getAllDay(year, month) {
    const day = new Date(year, month, 0)
    return day.getDate()
  },
  onShow: function () {
    _self = this;
    const currentDate = new Date();
    let year = currentDate.getFullYear(),
      month = currentDate.getMonth() + 1,
      date = currentDate.getDate();
    month < 10 ? month = '0' + month : '';
    date < 10 ? date = '0' + date : '';
    // 周几，第几天
    let dayNum = this.getFirstDayWeek(year, parseInt(month)),
      dayText = ''
    if (dayNum === 0) {
      dayText = '周日'
    } else if (dayNum === 1) {
      dayText = '周一'
    } else if (dayNum === 2) {
      dayText = '周二'
    } else if (dayNum === 3) {
      dayText = '周三'
    } else if (dayNum === 4) {
      dayText = '周四'
    } else if (dayNum === 5) {
      dayText = '周五'
    } else if (dayNum === 6) {
      dayText = '周六'
    }
    _self.setData({
      startDate: currentDate,
      date: year + '年' + parseInt(month) + '月',
      yearMonthParam: year + '-' + month,
      dateParam: year + '-' + month + '-' + date,
      firstDay: dayNum,
      dayText: dayText,
      todayDate: `今天·${parseInt(month)}月${parseInt(date)}日·${dayText}`
    })
    _self.initData()
  },

  goToMeeting(e) {
		var Url = app.globalData.host
		var that = this
		wx.request({
			url: Url + '/api3/meeting/getDetail/' + e.currentTarget.dataset.item.meetingId,
			method: "GET",
			data: {},
			success: res => {
				if (res.data.code == '0') {
					const nowTime = new Date()
					if (nowTime - that.tapTime < 1000) {
						return
					}

					that.setData({
						roomID: res.data.result.roomId
						// roomID:'2043066033'
					})
					wx.showToast({
						title: that.data.roomID,
						icon: 'none',
						duration: 3000,
					})

					console.log(e.currentTarget.dataset.item)
					console.log(this.data.roomID)
					const url = `/packageTencentCloud/pages/meeting/meeting?id=${this.data.roomID}&toID=${e.currentTarget.dataset.item.purchaserId}`
					console.log(url)
					wx.redirectTo({
						url: url,
					})
					this.setData({ 'tapTime': nowTime })
				}
			},
		})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})