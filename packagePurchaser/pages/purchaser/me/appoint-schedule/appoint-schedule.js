//index.js
//获取应用实例
import {ajax, dateStr4ios} from "../../../../../utils/util";
import {API_URL} from "../../../../../utils/constant";
const {calendar} = require('../../../../../common/staticImageContants');

const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {
    currentSelectDay: "",
    exhibitList: [{
      id: 1
    }],
    calendar:calendar,
    exhibits: [],
    currentType: 1,
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
    isEn: i18n.isEn(),
    loadingData:false,
    loadingData1:false,
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
    let lists = [];
    this.getSendTap()
    this.getReceiveTap()
    for (let i = 0; i < _self.getAllDay(_self.data.startDate.getFullYear(), _self.data.startDate.getMonth() + 1); i++) {
      lists.push({
        id: i,
        value: i + 1
      })
    }
    _self.setData({
      lists: lists
    })
    this.getScheduleStat();
  },
  // 邀约统计
getScheduleStat: function () {
  var that = this;
  var user = storage.getUserInfo();
  var userType = storage.getRoleType();
  if (userType == constant.ROLE_TYPE.EXHIBITOR) {
    var url = app.globalData.host + '/api3/schedule/getScheduleStat/' + user.id;
  } else {
    var url = app.globalData.host + '/api3/schedule/getPurchaserScheduleStat/' + user.id;
  }
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      if (res.data.code == '0') {
        let isEn = _self.data.isEn
        console.log(res.data.result)
        let statusList;
        let receiveList;
        if (userType == constant.ROLE_TYPE.EXHIBITOR) {
          statusList = [{
            label: isEn ? 'Confirmed' : '已确认',
            value: 0,
            count:res.data.result.invite[0].confirmed ? res.data.result.invite[0].confirmed : '0',

          }, {
            label: isEn ? 'Items to be confirmed' : '待确认',
            value: 2,
            count:res.data.result.invite[0].tobeconfirmed ? res.data.result.invite[0].tobeconfirmed : '0',
          }, {
            label: isEn ? 'Reject' : '被拒绝',
            value: 5,
            count:res.data.result.invite[0].refuse ? res.data.result.invite[0].refuse : '0',
          }, {
            label: isEn ? 'Cancelled' : '已取消',
            value: 6,
            count:res.data.result.invite[0].cancel ? res.data.result.invite[0].cancel : '0',
          }]
          receiveList = [{
              label: isEn ? 'Confirmed' : '已确认',
              value: 0,
              count:res.data.result.invite[1].confirmed ? res.data.result.invite[1].confirmed : '0',
            }, {
              label: isEn ? 'Items to be confirmed' : '待确认',
              value: 2,
              count:res.data.result.invite[1].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
            }, {
              label: isEn ? 'Reject' : '已拒绝',
              value: 5,
              count:res.data.result.invite[1].refuse ? res.data.result.invite[1].refuse : '0',
            }, {
              label: isEn ? 'Cancelled' : '已取消',
              value: 6,
              count:res.data.result.invite[1].cancel ? res.data.result.invite[1].cancel : '0',
            }]
        } else {
          statusList = [{
            label: isEn ? 'Confirmed' : '已确认',
            value: 0,
            count:res.data.result.invite[1].confirmed ? res.data.result.invite[1].confirmed : '0',

          }, {
            label: isEn ? 'Items to be confirmed' : '待确认',
            value: 2,
            count:res.data.result.invite[1].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
          }, {
            label: isEn ? 'Reject' : '被拒绝',
            value: 5,
            count:res.data.result.invite[1].refuse ? res.data.result.invite[1].refuse : '0',
          }, {
            label: isEn ? 'Cancelled' : '已取消',
            value: 6,
            count:res.data.result.invite[1].cancel ? res.data.result.invite[1].cancel : '0',
          }]
          receiveList = [{
              label: isEn ? 'Confirmed' : '已确认',
              value: 0,
              count:res.data.result.invite[0].confirmed ? res.data.result.invite[1].confirmed : '0',
            }, {
              label: isEn ? 'Items to be confirmed' : '待确认',
              value: 2,
              count:res.data.result.invite[0].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
            }, {
              label: isEn ? 'Reject' : '已拒绝',
              value: 5,
              count:res.data.result.invite[0].refuse ? res.data.result.invite[1].refuse : '0',
            }, {
              label: isEn ? 'Cancelled' : '已取消',
              value: 6,
              count:res.data.result.invite[0].cancel ? res.data.result.invite[1].cancel : '0',
            }]
        }
        _self.setData({
          statusList: statusList,
          receiveStatusList: receiveList
        })
      } else {
        console.log(res.data.message)
      }
    },
    fail: function (error) {
      console.log(error)
    }
  })
},
  async getMonthSchecdule() {
    // https//ywmatch.coolgua.com:9998/api3/schedule/purchaserSchedule
    var result = await ajax.get(`${API_URL}/schedule/purchaserSchedule`, {
      pageNum: 1,
      pageSize: 200,
      purchaserId: storage.getUserInfo().id,
      yearMonth: this.data.yearMonthParam,
    })
    if (result.code != 0) {
      return false
    }
    var monthList = result.result
    /*合并2个array */
    for (let i = 0; i < this.data.lists.length; i++) {
      for (let j = 0; j < monthList.length; j++) {
        var day = monthList[j].activityTime.split('-')[2]
        if (day == this.data.lists[i].value) {
          this.data.lists[i].count = monthList[j].count
        }
      }
    }
    this.setData({
      lists: this.data.lists
    })
  },
  getPurchaserSchedule: function () {
    this.getMonthSchecdule();
    // 我的日程
    (0, api.getPurchaserDaySchedule)({
      data: {
        pageNum: 1,
        pageSize: 200,
        purchaserId: storage.getUserInfo().id,
        yearMonth: this.data.yearMonthParam,
        day: this.data.dateParam
      },
      success: function (res) {
        _self.setData({
          myDateScheduleList: res.data.result
        })
      }
    });
  },
  exhibitorInvite: function (event) {
    (0, api.getpurchaserFinish)({
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
    }, () => this.getMonthSchecdule());
  },
  lastDateTap: function () {
    const nextDate = this.getLastMonth(this.data.yearMonthParam.split('-')[0], this.data.yearMonthParam.split('-')[1]);
    this.setData({
      yearMonthParam: nextDate.year + '-' + util.formatDateStr(nextDate.month),
      dateParam: nextDate.year + '-' + util.formatDateStr(nextDate.month) + '-01',
      date: nextDate.year + '年' + nextDate.month + '月',
      lists: _self.getDays(nextDate.year, nextDate.month),
      firstDay: this.getFirstDayWeek(nextDate.year, nextDate.month)
    }, () => this.getMonthSchecdule());
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
    let date = e&&e.currentTarget&&e.currentTarget.dataset&&e.currentTarget.dataset.day||new Date().getDate();
    date < 10 ? date = '0' + date : '';
    this.setData({
      dateParam: this.data.yearMonthParam + '-' + date,
      todayDate: this.data.yearMonthParam + '-' + date,
      currentSelectDay: date
    })
    this.getPurchaserSchedule()
  },
  getSendTap: function () {
    // 我发起的邀约
    _self.setData({
      loadingData:true
    });
    (0, api.getScheduleSuppliers)({
      data: {
        pageNum: 1,
        pageSize: 200,
        purchaserId: storage.getUserInfo().id,
        status: this.data.currentStatus,
        sponsor: 1
      },
      success: function (res) {
        let one = res.data.result.data
        _self.setData({
          loadingData:false,
          exhibits: res.data.result.data
        })
        one.forEach(function (item, index) {
          // 开始时间
          var a = dateStr4ios(item.activityTimeBegin)
          var time3 = Date.parse(a)
          // 结束时间
          var b = dateStr4ios(item.activityTimeEnd)
          var time4 = Date.parse(b)
          // 当前时间的时间戳
          var timestamp = Date.parse(new Date())
          // 当 当前的时间戳小于开始时间的时间戳,说明会议还没开始
          if (timestamp < time3) {
            one[index].iska = '1'
          }
          // 当 当前时间的时间戳大于结束时间的时间戳,说明会议已结束
          else if (timestamp > time4) {
            one[index].iska = '2'
          }
          // 会议正在进行
          else if (time3 < timestamp && time4 > timestamp) {
            one[index].iska = '3'
          }
        })
        _self.nowTime1(one)
        _self.setData({
          exhibits: one,
        })
        // _self.setData({
        //   exhibits: res.data.result.data
        // })
      }
    });
  },
  getReceiveTap: function () {
    // 我收到的邀约
    _self.setData({loadingData1:true});
    (0, api.getScheduleSuppliers)({
      data: {
        pageNum: 1,
        pageSize: 200,
        purchaserId: storage.getUserInfo().id,
        status: this.data.currentReceiveStatus,
        sponsor: 0
      },
      success: function (res) {
        let one = res.data.result.data
        _self.setData({
          loadingData1:false,
          scheduleList: res.data.result.data
        })
        one.forEach(function (item, index) {
          // 开始时间
          var a = dateStr4ios(item.activityTimeBegin)
          var time3 = Date.parse(a)
          // 结束时间
          var b = dateStr4ios(item.activityTimeEnd)
          var time4 = Date.parse(b)
          // 当前时间的时间戳
          var timestamp = Date.parse(new Date())
          // 当 当前的时间戳小于开始时间的时间戳,说明会议还没开始
          if (timestamp < time3) {
            one[index].iska = '1'
          }
          // 当 当前时间的时间戳大于结束时间的时间戳,说明会议已结束
          else if (timestamp > time4) {
            one[index].iska = '2'
          }
          // 会议正在进行
          else if (time3 < timestamp && time4 > timestamp) {
            one[index].iska = '3'
          }
        })
        _self.nowTime1(one)
        _self.setData({
          scheduleList: one,
        })
      }
    });
  },
  // 倒计时
  nowTime1(list) {//时间函数 
    var len = list.length
    for (var i = 0; i < len; i++) {
      var start = Date.parse(list[i].activityTimeBegin + ':00')
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
      } else {
        var str = "已结束！";
        clearInterval(this.timer1);
      }
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  //取消邀约
  cancelSchedule: function (e) {
    const id = e.currentTarget.dataset.id;
    (0, api.cancelSchedule)({
      query: {
        id: id
      },
      isNullToken: true,
      success: function (res) {
        wx.showToast({
          title: '取消成功',
        })
        setTimeout(() => {
          _self.getSendTap()
        }, 1000)
      }
    });
  },
  
  //提醒邀约
  // tixing: function (e) {
  //   const id = e.currentTarget.dataset.id;
  //   (0, api.reminder)({
  //     query: {
  //       id: id
  //     },
  //     isNullToken: true,
  //     success: function (res) {
  //       // console.log(res)
  //       wx.showToast({
  //         title: '提醒成功',
  //       })
  //       // _self.nowTime2(res.result.countDown);
  //       setTimeout(() => {
  //         _self.getSendTap()
  //       }, 1000)
  //     }
  //   });
  // },
  
  //再次发起邀约
  yuyue1: function (e) {
    this.setData({
      dialogHide: true,
      Rreadd: e.currentTarget.dataset.item,
      topTheme: e.currentTarget.dataset.item.top,
      remark: e.currentTarget.dataset.item.remark,
      date: '',
      dayText: '',
      startTime: '',
      endTime: '',
      inviteSupplierId: e.currentTarget.dataset.item.supplierId,
      // remark: '',
      // topTheme: e.currentTarget.dataset.item.top,
    })
  },
  validateInput() {
    if (!this.data.topTheme) {
      this.toast("请填写主题")
      return false;
    } else if (!this.data.date) {
      this.toast("请填日期")
      return false
    } else if (!this.data.startTime) {
      this.toast("请填写开始时间")
      return false
    } else if (!this.data.endTime) {
      this.toast("请填写结束时间")
      return false
    }
    return true
  },
  toast(str) {
    wx.showToast({
      title: str,
      icon: 'none'
    })
  },
  sureClick: function () {
    if (!this.validateInput()) {
      return
    }
    const id = this.data.Rreadd.id;
    (0, api.readd)({
      query: {
        id: id,
        src: '1'
      },
      data: {
        activityTime: this.data.date,
        activityStart: this.data.startTime + ':00',
        activityEnd: this.data.endTime + ':00',
        remark: this.data.remark,
        top: this.data.topTheme
      },
      method: 'GET',
      isNullToken: true,
      success: function (res) {
        wx.showToast({
          title: '再次邀约成功',
        })
        setTimeout(() => {
          _self.setData({
            dialogHide: true
          })
          _self.getSendTap()
        }, 1000)
      }
    });
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
  //拒绝邀约
  refuseSchedule: function (e) {
    const id = e.currentTarget.dataset.id;
    (0, api.refuseSchedule)({
      query: {
        id: id
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          _self.getReceiveTap()
        }, 1000)
      }
    });
  },
  //确认邀约
  queren: function (e) {
    const id = e.currentTarget.dataset.id;
    (0, api.confirmedSchedule)({
      query: {
        id: id
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(() => {
          _self.getReceiveTap()
        }, 1000)
      }
    });
  },
  goDetailPage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail',
    })
  },
  changeTypeTap: function (e) {
    _self.setData({
      currentType: parseInt(e.currentTarget.dataset.type)
    })
    console.log(this.data.currentType === 2)
    if (this.data.currentType === 2) {
      this.getPurchaserSchedule()
    }
  },
  changeStatusTap: function (e) {
    _self.setData({
      currentStatus: parseInt(e.currentTarget.dataset.type),
      currentIndex: parseInt(e.currentTarget.dataset.idx)
    });
    console.log(_self.data.currentIndex, 'yue')
    this.getSendTap();
  },
  changeReceiveStatusTap: function (e) {
    _self.setData({
      currentReceiveStatus: parseInt(e.currentTarget.dataset.type)
    });
    this.getReceiveTap();
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
    if (options.type !== undefined) {
      this.setData({
        currentType: parseInt(options.type)
      })
    }
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
      currentSelectDay: new Date().getDate()
    },()=>  this.refreshDateTap())


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
    }, () => this.getMonthSchecdule())
    _self.initData()
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})