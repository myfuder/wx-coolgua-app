// packageExhibitor/pages/zEdition1/me/myInvitation/index.js
import {getString} from "../../../../../locals/lang.js";
import {ajax, dateStr4ios} from "../../../../../utils/util";
import {API_URL} from "../../../../../utils/constant";
let storage = require("../../../../../utils/storage.js");
let constant = require("../../../../../utils/constant");

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingRili: false,
    currentTabIndex: 0,
    current_menus: 0,
    current_menus1: 0,


    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    day: 0,
    yearMonth: '',
    yearMonthRi: '',
    result: [],
    week: '周一',
    month_one: 0,
    shiqing_list: [],
    month_en_list: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ],
    month_en_number: 0,
    weeken_list: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ],
    weeken_number: 0,

    faqi_list: [],//发起预约的列表
    shoudao_list: [],//收到预约的列表

    rili_list: [],//日历下的列表
    language: '',
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

    // 再次发起预约
    date_time: '',
    timeStart: '',
    timeEnd: '',
    is_time_show: false,
    is_time: '',//1就是发起的，2就是收到的
    currentDay: new Date().getDate(),
    loadingData: false,
    loadingData1: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScheduleStat();
    if (options.richeng) {
      this.setData({
        currentTabIndex: 1
      })
      this.currentTabIndex = 1
    }
    if (this.data.currentTabIndex == 0) {
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu1'),
      })
    } else {
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu2'),
      })
    }

    this.setData({
      switchTabStr: [
        getString('exhibitors_index', 'app.mine.menu1'),
        getString('exhibitors_index', 'app.mine.menu2')
      ],
      Invitation_fa: getString('exhibitors_index', 'app.home.zedition5'),//我发起的预约
      Invitation_shou: getString('exhibitors_index', 'app.home.zedition6'),//我收到的预约
      meeting_enter: getString('exhibitors_index', 'app.activity.status1'),//进入会议
      meeting_start: getString('exhibitors_index', 'app.home.zedition7'),//会议开启倒计时
      Expired: getString('exhibitors_index', 'app.home.zedition8'),//已过期
      appointment: getString('exhibitors_index', 'app.home.zedition9'),//预约主题
      Invitation_time: getString('exhibitors_index', 'app.home.zedition10'),//邀约时间
      time_fa: getString('exhibitors_index', 'app.home.zedition11'),//发起时间
      time_beizhu: getString('exhibitors_index', 'app.home.zedition12'),//备注时间
      Contacts: getString('exhibitors_index', 'app.home.zedition13'),//联系人
      Quxiao: getString('exhibitors_index', 'app.home.zedition14'),//取消预约
      faqi_agian: getString('exhibitors_index', 'app.home.zedition15'),//再次发起预约
      Queren: getString('exhibitors_index', 'app.home.zedition16'),//确认
      Jujue: getString('exhibitors_index', 'app.home.zedition17'),//拒绝
      Tixing: getString('exhibitors_index', 'app.home.zedition18'),//提醒对方
      //再次发起预约
      label1: getString('wp', 'app.invitaion.dialog.theme'),
      label2: getString('wp', 'app.invitaion.dialog.theme.placeholder'),
      label3: getString('wp', 'app.invitaion.dialog.date'),
      label4: getString('wp', 'app.invitaion.dialog.date.placeholder'),
      label5: getString('wp', 'app.invitaion.dialog.time.start'),
      label6: getString('wp', 'app.invitaion.dialog.time.placeholder'),
      label7: getString('wp', 'app.invitaion.dialog.time.end'),
      label8: getString('wp', 'app.invitaion.dialog.msg'),
      label9: getString('wp', 'app.invitaion.dialog.msg.placeholder'),
      label10: getString('wp', 'app.btn.cancel'),
      label11: getString('wp', 'app.btn.sure'),
    })
    // 访问接口
    if (options.richeng) {
      this.riqi_on()
    } else {
      this.on_loading()
    }
    // 判断语言类型
    // en为英文
    //zh_CN为中文
    var language = wx.getStorageSync('lang')
    console.log(language)
    this.setData({
      language: language
    })
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
        // console.log(res.data)
        if (res.data.code == '0') {
          // console.log(res.data.result)
          let menus;
          let menus1;
          if (userType == constant.ROLE_TYPE.EXHIBITOR) {
            menus = [
              {
                title: getString('exhibitors_index', 'app.home.zedition1'),
                unreadNum: 0,
                count:res.data.result.invite[0].confirmed ? res.data.result.invite[0].confirmed : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition2'),
                unreadNum: 1,
                count:res.data.result.invite[0].tobeconfirmed ? res.data.result.invite[0].tobeconfirmed : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition3'),
                unreadNum: 2,
                count:res.data.result.invite[0].refuse ? res.data.result.invite[0].refuse : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition4'),
                unreadNum: 3,
                count:res.data.result.invite[0].cancel ? res.data.result.invite[0].cancel : '0',
              },
            ],
              menus1 = [
                {
                  title: getString('exhibitors_index', 'app.home.zedition1'),
                  unreadNum: 0,
                  count:res.data.result.invite[1].confirmed ? res.data.result.invite[1].confirmed : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition2'),
                  unreadNum: 1,
                  count:res.data.result.invite[1].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition19'),
                  unreadNum: 2,
                  count:res.data.result.invite[1].refuse ? res.data.result.invite[1].refuse : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition4'),
                  unreadNum: 3,
                  count:res.data.result.invite[1].cancel ? res.data.result.invite[1].cancel : '0',
                }]
          } else {
            menus = [
              {
                title: getString('exhibitors_index', 'app.home.zedition1'),
                unreadNum: 0,
                count:res.data.result.invite[1].confirmed ? res.data.result.invite[1].confirmed : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition2'),
                unreadNum: 1,
                count:res.data.result.invite[1].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition3'),
                unreadNum: 2,
                count:res.data.result.invite[1].refuse ? res.data.result.invite[1].refuse : '0',
              }, {
                title: getString('exhibitors_index', 'app.home.zedition4'),
                unreadNum: 3,
                count:res.data.result.invite[1].cancel ? res.data.result.invite[1].cancel : '0',
              },
            ],
              menus1 = [
                {
                  title: getString('exhibitors_index', 'app.home.zedition1'),
                  unreadNum: 0,
                  count:res.data.result.invite[0].confirmed ? res.data.result.invite[1].confirmed : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition2'),
                  unreadNum: 1,
                  count:res.data.result.invite[0].tobeconfirmed ? res.data.result.invite[1].tobeconfirmed : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition19'),
                  unreadNum: 2,
                  count:res.data.result.invite[0].refuse ? res.data.result.invite[1].refuse : '0',
                }, {
                  title: getString('exhibitors_index', 'app.home.zedition4'),
                  unreadNum: 3,
                  count:res.data.result.invite[0].cancel ? res.data.result.invite[1].cancel : '0',
                }]
          }
          that.setData({
            menus: menus,
            menus1: menus1
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("page ---onHide---");
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    wx.setStorageSync('needLoadUnread', true)
  },
  //页面刚渲染方法
  on_loading() {
    // 访问接口
    var url = app.globalData.host
    //我发起的预约
    wx.request({
      url: url + '/api3/schedule/getSchedulePurchasers',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 0,
        status: 0,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        let one = res.data.result.data
        one.forEach(function (item, index) {
          // 开始时间
          var a = item.activityTimeBegin + ':00'
          a = a.replace(/-/g, '/')
          var time3 = Date.parse(a)
          // 结束时间
          var b = item.activityTimeEnd + ':00'
          b = b.replace(/-/g, '/')

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
        if (res.data.result.data.length > 0) {
          var that = this
          // that.timer1 = setInterval(function () {
          that.nowTime1(one)
          that.setData({
            faqi_list: one,
          })
          // }, 1000);
        } else {
        }
      },
      fail: res => {
        console.log(res)
      }
    })
    //我收到的预约
    wx.request({
      url: url + '/api3/schedule/getSchedulePurchasers',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        status: 0,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        console.log(res)
        this.setData({
          shoudao_list: res.data.result.data,
        })
        let one = res.data.result.data
        one.forEach(function (item, index) {
          // 开始时间
          console.log("===item.activityTimeBegin + ':00'=====>", item.activityTimeBegin + ':00')
          var a = item.activityTimeBegin + ':00'
          a = a.replace(/-/g, '/')
          console.log("===  var a = item.activityTimeBegin + ':00'=====>", a)
          var time3 = new Date(a).valueOf()
          // 结束时间
          var b = item.activityTimeEnd + ':00'
          b = b.replace(/-/g, '/')
          var time4 = new Date(b).valueOf()
          // 当前时间的时间戳
          var timestamp = new Date().valueOf()
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

        if (res.data.result.data.length > 0) {
          var that = this
          // that.timer2 = setInterval(function () {
          that.nowTime2(one)
          that.setData({
            shoudao_list: one,
          })
          // }, 1000);
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  //点击进入会议按钮(发起收到通用)
  enterRoom: function (e) {
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
          this.setData({'tapTime': nowTime})
        }
      },
    })

  },

  // 时间
  cancleClick() {
    this.setData({
      is_time_show: false,
      label2: '',
      label9: '',
    })
  },
  inputChange(event) {
    console.log(event)
    this.label2 = event.detail.value;
  },
  inputRemarkChange(event) {
    this.label9 = event.detail.value;
  },
  validateInput() {
    if (!this.data.label2) {
      if (this.data.language == 'en') {
        this.toast("Please fill in the title")
      } else {
        this.toast("请填写标题")
      }
      return false;
    } else if (!this.data.date_time) {
      if (this.data.language == 'en') {
        this.toast("Please fill in the date")
      } else {
        this.toast("请填日期")
      }
      return false
    } else if (!this.data.timeStart) {
      if (this.data.language == 'en') {
        this.toast("Please fill in the start time")
      } else {
        this.toast("请填写开始时间")
      }
      return false
    } else if (!this.data.timeEnd) {

      if (this.data.language == 'en') {
        this.toast("Please fill in the end time")
      } else {
        this.toast("请填写结束时间")
      }
      return false
    } else if (!this.data.label9) {

      if (this.data.language == 'en') {
        this.toast("Please fill in the remark")
      } else {
        this.toast("请填写备注")
      }
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
  // 再次发起预约
  sureClick() {
    if (!this.validateInput()) {
      return
    }
    var Url = app.globalData.host
    wx.request({
      url: Url + '/api3/schedule/readd/' + this.data.time_id + '/' + '0',
      method: 'GET',
      data: {
        activityTime: this.data.date_time,
        activityStart: this.data.timeStart,
        activityEnd: this.data.timeEnd,
        remark: this.data.label9,
        top: this.data.label2
      },
      success: res => {
        if (res.data.result == null) {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'Launch a success',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '发起成功',
              icon: 'none',
              duration: 3000,
            })
          }
          if (this.data.is_time == 1) {
            this.setData({
              faqi_list: [],
            })
            if (this.current_menus == 2) {
              this.loading_one(5)
            } else if (this.current_menus == 3) {
              this.loading_one(6)
            }
          }
          // 我收到的预约
          else if (this.data.is_time == 2) {
            this.setData({
              shoudao_list: [],
            })
            if (this.current_menus1 == 2) {
              this.loading(5)
            } else if (this.current_menus1 == 3) {
              this.loading(6)
            }
          }
          this.setData({
            is_time_show: false,
            label2: '',
            label9: '',
          })
        } else {
          var one = res.data.result.countDown
          var h = Math.floor(one / 60 / 60);
          var m = Math.floor(one / 60 % 60);
          var s = Math.floor(one % 60);
          console.log(h)
          console.log(m)
          console.log(s)

          if (this.data.language == 'en') {
            var time = 'Please initiate in ' + h + 'hours,' + m + 'minutes and ' + s + 'seconds'
          } else {
            var time = '请' + h + '小时' + m + '分钟' + s + '秒后再发起'
          }
          wx.showToast({
            title: time,
            icon: 'none',
            duration: 3000,
          })
          this.setData({
            is_time_show: false,
            label2: '',
            label9: '',
          })
        }
      }
    })
  },
  bindDateChange(e) {
    this.setData({
      date_time: e.detail.value
    })
  },
  bindTimeStartChange(e) {
    this.setData({
      timeStart: e.detail.value
    })
  },
  bindTimeEndChange(e) {
    this.setData({
      timeEnd: e.detail.value
    })
  },
  // 收到预约tabber的点击
  loading(option) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/getSchedulePurchasers',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        status: option,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        console.log(res)
        var one = res.data.result.data
        one.forEach(function (item, index) {
          // 开始时间
          var a = item.activityTimeBegin + ':00'
          a = a.replace(/\-/g, '/')
          var time3 = Date.parse(a)
          // 结束时间
          var b = item.activityTimeEnd + ':00'
          b = b.replace(/\-/g, '/')
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
        console.log(one)
        this.setData({
          shoudao_list: one,
        })
        console.log(this.faqi_list)
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 发起预约tabber的点击
  loading_one(option) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/getSchedulePurchasers',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 0,
        status: option,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        console.log(res)
        var one = res.data.result.data
        one.forEach(function (item, index) {
          // 开始时间
          var a = item.activityTimeBegin + ':00'
          a = a.replace(/-/g, '/')
          var time3 = Date.parse(a)
          // 结束时间
          var b = item.activityTimeEnd + ':00'
          b = b.replace(/-/g, '/')

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
        if (res.data.result.data.length > 0) {
          var that = this
          if (option == 0) {
            that.timer2 = setInterval(function () {
              that.nowTime2(one)
              that.setData({
                faqi_list: one,
              })
            }, 1000);
          } else {
            clearInterval(that.timer2)
            that.setData({
              faqi_list: one,
            })
          }

        } else {
          this.setData({
            faqi_list: [],
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 点击取消预约按钮(发起收到通用)
  quxiao(event) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/cancel/' + event.currentTarget.dataset.item,
      method: 'GET',
      data: {},
      success: res => {
        if (res.data.code == '0') {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'Cancelled',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '已取消',
              icon: 'none',
              duration: 3000,
            })
          }
          this.setData({
            faqi_list: [],
          })
          this.setData({
            shoudao_list: [],
          })
          if (this.data.current_menus == 0) {
            this.loading_one(0)
          } else if (this.data.current_menus == 1) {
            this.loading_one(2)
          }
          if (this.data.current_menus1 == 0) {
            this.loading(0)
          } else if (this.data.current_menus1 == 1) {
            this.loading(2)
          }
        }
      }
    })
  },
  //点击提醒按钮（发起收到通用）
  tixing(event) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/appointmentreminder/' + event.currentTarget.dataset.item,
      method: 'POST',
      data: {},
      success: res => {
        if (res.data.code == '0') {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'Alerted',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '已提醒',
              icon: 'none',
              duration: 3000,
            })
          }
          this.setData({
            faqi_list: [],
          })
          this.loading_one(2)
        }
      }
    })
  },
  // 点击再次发起预约（发起）
  yuyue1(event) {
    console.log(event)
    this.setData({
      is_time_show: true,
      is_time: 1,
      time_id: event.currentTarget.dataset.item.id,
      label2: event.currentTarget.dataset.item.top,
      label9: event.currentTarget.dataset.item.remark,
    })
  },
  // 点击再次发起预约（收到）
  yuyue2(event) {
    this.setData({
      is_time_show: true,
      is_time: 2,
      time_id: event.currentTarget.dataset.item.id,
      label2: event.currentTarget.dataset.item.top,
      label9: event.currentTarget.dataset.item.remark,
    })
  },

  // 待确认的预约里点击确认(收到)
  queren(event) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/confirmed/' + event.currentTarget.dataset.item,
      method: 'GET',
      data: {},
      success: res => {
        if (res.data.code == '0') {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'Confirmed',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '已确认',
              icon: 'none',
              duration: 3000,
            })
          }
          this.setData({
            shoudao_list: [],
          })
          this.loading(2)
        }
      }
    })
  },
  // 待确认的预约里点击拒绝(收到)
  jujue(event) {
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/refuse/' + event.currentTarget.dataset.item,
      method: 'GET',
      data: {},
      success: res => {
        if (res.data.code == '0') {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'Rejected',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '已拒绝',
              icon: 'none',
              duration: 3000,
            })
          }
          this.setData({
            shoudao_list: [],
          })
          this.loading(2);
          this.getScheduleStat();
        }
      }
    })
  },

  // 我的预约----点击tabber栏----有三个

  // 组件方法列表
  switchTabClick(event) {
    this.setData({
      currentTabIndex: event.currentTarget.dataset.idx
    })
    if (event.currentTarget.dataset.idx == 0) {
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu1'),
      })
    } else {
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu2'),
      })
    }
    if (event.currentTarget.dataset.idx == 0) {
      this.on_loading()
      clearInterval(this.timer3);
    } else {
      // console.log('1111')
      this.riqi_on()
      clearInterval(this.timer1);
      clearInterval(this.timer1_2);
      clearInterval(this.timer1_3);
      clearInterval(this.timer1_4);
      clearInterval(this.timer2);
      clearInterval(this.timer2_2);
      clearInterval(this.timer2_3);
      clearInterval(this.timer2_4);
    }
  },
  // 我的发起的预约,点击tabber栏
  async loadingMyAcquire(e) {
    var idx = e.currentTarget.dataset.idx
    var status = 0
    if (idx == 0) {
      status = 0
    }
    if (idx == 1) {
      status = 2
    }
    if (idx == 2) {
      status = 5
    }
    if (idx == 3) {
      status = 6
    }
    var params = {
      pageNum: 1,
      pageSize: 10,
      sponsor: 0,
      status,
      supplierId: wx.getStorageSync('userInfo').id
    }
    this.setData({
      loadingData: true,
    })
    var result = await ajax.get(`${API_URL}/schedule/getSchedulePurchasers`, params)
    var one = result.result.data
    one.forEach(function (item, index) {
      // 开始时间
      var a = dateStr4ios(item.activityTimeBegin)
      var time3 = new Date(a).getTime()
      // 结束时间
      var b = dateStr4ios(item.activityTimeEnd)
      var time4 = new Date(b).getTime()
      // 当前时间的时间戳
      var timestamp = new Date(new Date()).getTime()
      // console.log("===timestamp=====>", timestamp)
      // console.log("=====item.activityTimeBegin===>",item.activityTimeBegin)
      // console.log("==== a====>", a)
      // console.log("===time3=====>", time3)
      // console.log("====timestamp < time3====>", timestamp < time3)
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

    this.setData({
      faqi_list: one,
      loadingData: false,
    })
  },
  switchTabClick_two(event) {
    var url = app.globalData.host
    this.setData({
      current_menus: event.currentTarget.dataset.idx,
      faqi_list: []
    })
    this.loadingMyAcquire(event)
  },
  // 我的收到的预约,点击tabber栏
  switchTabClick_three(event) {
    var that = this
    var url = app.globalData.host
    this.setData({
      current_menus1: event.currentTarget.dataset.idx,
      shoudao_list: []
    })
    var status = 0
    var idx = event.currentTarget.dataset.idx
    if (idx == 0) {
      status = 0
    }
    if (idx == 1) {
      status = 2
    }
    if (idx == 2) {
      status = 5
    }
    if (idx == 3) {
      status = 6
    }
    this.setData({
      loadingData1: true
    });
    //我发起的预约
    wx.request({
      url: url + '/api3/schedule/getSchedulePurchasers',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        status: status,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        // console.log('发起--------')
        var one = res.data.result.data
        one.forEach(function (item, index) {
          // 开始时间
          var a = dateStr4ios(item.activityTimeBegin)
          var time3 = new Date(a).getTime()
          // 结束时间
          var b = dateStr4ios(item.activityTimeEnd)
          var time4 = new Date(b).getTime()
          // 当前时间的时间戳
          var timestamp = new Date(new Date()).getTime()
          // 当 当前的时间戳小于开始时间的时间戳,说明会议还没开始
          // console.log("==timestamp======>", timestamp)
          // console.log("==time3======>", time3)
          // console.log("====timestamp < time3====>", timestamp < time3)
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
        that.setData({
          loadingData1: false,
          shoudao_list: one,
        })
      },
    })


    /* if (event.currentTarget.dataset.idx == 0) {

     } else if (event.currentTarget.dataset.idx == 1) {
       clearInterval(this.timer2);
       console.log('待确认')
       wx.request({
         url: url + '/api3/schedule/getSchedulePurchasers',
         method: 'GET',
         data: {
           pageNum: 1,
           pageSize: 10,
           sponsor: 1,
           status: 2,
           supplierId: wx.getStorageSync('userInfo').id
         },
         success: res => {
           console.log(res)
           console.log('发起--------')
           var one = res.data.result.data
           one.forEach(function (item, index) {
             // 开始时间
             var a = item.activityTimeBegin + ':00'
             var time3 = Date.parse(a)
             // 结束时间
             var b = item.activityTimeEnd + ':00'
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
           if (res.data.result.data.length > 0) {
             var that = this
             // that.timer2 = setInterval(function () {
             // 	// console.log(one)
             // 	// console.log('日历倒计时----')
             that.setData({
               shoudao_list: one,
             })
             // }, 1000);
           } else {
             this.setData({
               shoudao_list: [],
             })
           }
         },
         fail: res => {
           console.log(res)
         }
       })
     } else if (event.currentTarget.dataset.idx == 2) {
       clearInterval(this.timer2);
       console.log('被拒绝')
       wx.request({
         url: url + '/api3/schedule/getSchedulePurchasers',
         method: 'GET',
         data: {
           pageNum: 1,
           pageSize: 10,
           sponsor: 1,
           status: 5,
           supplierId: wx.getStorageSync('userInfo').id
         },
         success: res => {
           console.log(res)
           console.log('发起--------')
           var one = res.data.result.data
           one.forEach(function (item, index) {
             // 开始时间
             var a = item.activityTimeBegin + ':00'
             var time3 = Date.parse(a)
             // 结束时间
             var b = item.activityTimeEnd + ':00'
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
           if (res.data.result.data.length > 0) {
             this.setData({
               shoudao_list: one,
             })
             // }, 1000);
           } else {
             this.setData({
               shoudao_list: [],
             })
           }
         },
         fail: res => {
           console.log(res)
         }
       })
     } else if (event.currentTarget.dataset.idx == 3) {
       clearInterval(this.timer2);
       console.log('已取消')
       wx.request({
         url: url + '/api3/schedule/getSchedulePurchasers',
         method: 'GET',
         data: {
           pageNum: 1,
           pageSize: 10,
           sponsor: 1,
           status: 6,
           supplierId: wx.getStorageSync('userInfo').id
         },
         success: res => {
           console.log(res)
           console.log('发起--------')
           var one = res.data.result.data
           console.log(one)
           one.forEach(function (item, index) {
             // 开始时间
             var a = item.activityTimeBegin + ':00'
             var time3 = Date.parse(a)
             // 结束时间
             var b = item.activityTimeEnd + ':00'
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
           if (res.data.result.data.length > 0) {
             var that = this
             that.setData({
               shoudao_list: one,
             })
           } else {
             this.setData({
               shoudao_list: [],
             })
           }
         },
         fail: res => {
         }
       })*/
    // }
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }

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
  nowTime1_2(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
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
  nowTime1_3(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
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
  nowTime1_4(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
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
  nowTime2(list) {//时间函数
    var len = list.length
    for (var i = 0; i < len; i++) {
      var activityTimeBegin = list[i].activityTimeBegin
      activityTimeBegin = activityTimeBegin.replace(/\-/g, '/')
      var start = Date.parse(activityTimeBegin + ':00')

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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
      } else {
        var str = "已结束！";
        clearInterval(this.timer2);
      }
      //       // console.log(str);
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  nowTime2_2(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
        // console.log(str)
      } else {
        var str = "已结束！";
        clearInterval(this.timer2);
      }
      //       // console.log(str);
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  nowTime2_3(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
        // console.log(str)
      } else {
        var str = "已结束！";
        clearInterval(this.timer2);
      }
      //       // console.log(str);
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  nowTime2_4(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
        // console.log(str)
      } else {
        var str = "已结束！";
        clearInterval(this.timer2);
      }
      //       // console.log(str);
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },
  nowTime3(list) {//时间函数
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
        if (day > 0) {
          var str = day + ':' + hour + ':' + minute + ':' + second
        } else {
          var str = hour + ':' + minute + ':' + second
        }
        console.log(str)
      } else {
        var str = "已结束！";
        clearInterval(this.timer3);
      }
      list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    return list
  },


  // 我的日程
  riqi_on() {
    this.setData({
      rili_list: '',
    })
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    this.dateInit();
    if (wx.getStorageSync('lang') == 'en') {
      this.setData({
        date: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      })
    }
    this.setData({
      year: year,
      month: month,
      month_one: month,
      month_en_number: month,
      isToday: '' + year + month + now.getDate(),
      day: day
    })
    this.getSchechuleDays(new Date())
  },
  dateFill(day) {
    if (day < 10) {
      return "0" + day
    } else {
      return day
    }
  },
  /**
   * @desc获取我的日程
   * @params day*/
  getSchechuleDays(day_) {
    var self = this
    let now = new Date(day_);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    this.setData({
      week: this.week_Method(now),
    })

    // 计算年月
    if (month < 10) {
      console.log('进入if')
      this.setData({
        yearMonth: year + '-0' + month,
      })
    } else {
      console.log('不进入')
      this.setData({
        yearMonth: year + '-' + month,
      })
    }
    this.setData({
      yearMonthRi: this.data.yearMonth + "-" + this.dateFill(day)
    })
    console.log(this.data.yearMonthRi)
    var url = app.globalData.host

    this.setData({
      rili_list:[],
      loadingRili: true
    })
    wx.request({
      url: url + '/api3/schedule/supplierSchedule',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        yearMonth: this.data.yearMonth,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        console.log(res)
        this.setData({
          shiqing_list: res.data.result
        }, () => self.merrayRedCountWithDateArray())
      }
    })

    //获取当天的日程
    wx.request({
      url: url + '/api3/schedule/supplierDaySchedule',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        day: this.data.yearMonthRi,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        var one = res.data.result
        one.forEach(function (item, index) {
          // 开始时间
          var a = item.activityTimeBegin + ':00'
          var time3 = Date.parse(a)
          // 结束时间
          var b = item.activityTimeEnd + ':00'
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
        var that = this
        that.setData({
          rili_list: one,
          loadingRili: false
        })
      }
    })
  },
  // 计算星期几的方法---nowDate---2001-02-01
  week_Method(nowDate) {
    let nowWeek = nowDate.getDay();
    this.setData({
      weeken_number: nowDate.getDay()
    })
    let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let week_one = arr[nowWeek]
    console.log('计算出星期的方法：')
    return week_one
  },
  exhibitorInvite: function (event) {
    var id = event.currentTarget.dataset.id;
    var that = this
    var url = app.globalData.host + '/api3/schedule/supplierFinish/' + id;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          wx.showToast({
            title: '已完成邀约!',
            icon: 'none',
            duration: 1000,
            success: function () {
              that.riqi_on()
            }
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

  //在30day中加入小红点
  merrayRedCountWithDateArray() {
    this.data.shiqing_list.map(item1 => {
      var days = item1 && item1.activityTime && item1.activityTime.split("-")
      var day = parseInt(days[days.length - 1])
      if (day) {
        this.data.dateArr.map((item2, index) => {
          if (item2.dateNum == day) {
            this.data.dateArr[index].count = item1.count
            this.data.dateArr[index].isshow = true
          }
        })
      }
    })
    this.setData({
      dateArr: this.data.dateArr
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    console.log(now)
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();                          		//目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    console.log("===startWeek=====>", startWeek)
    console.log("===dayNums=====>", dayNums)
    console.log("==arrLen======>", arrLen)
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (month + 1 < 10) {
          obj = {
            isToday: '' + year + '0' + (month + 1) + '0' + num,
            dateNum: num,
            weight: 5
          }
        } else if (num < 10) {
          obj = {
            isToday: '' + year + (month + 1) + '0' + num,
            dateNum: num,
            weight: 5
          }
        } else if (num < 10 && month + 1 < 10) {
          obj = {
            isToday: '' + year + '0' + (month + 1) + '0' + num,
            dateNum: num,
            weight: 5
          }
        }

      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    //日历主题30day
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    if (month < 9) {
      this.setData({
        yearMonth: year + '-0' + this.data.month,
      })
    } else {
      this.setData({
        yearMonth: year + '-' + this.data.month,
      })
    }
    var url = app.globalData.host
    var currentDay=this.data.currentDay?this.dateFill(this.data.currentDay):new Date().getDay();
    this.getSchechuleDays(`${year}/${month + 1}/${currentDay}`)
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    if (month < 9) {
      console.log('进入if')
      this.setData({
        yearMonth: year + '-0' + this.data.month,
      })
    } else {
      console.log('不进入')
      this.setData({
        yearMonth: year + '-' + this.data.month,
      })
    }
    var url = app.globalData.host
    var currentDay=this.data.currentDay?this.dateFill(this.data.currentDay):new Date().getDay();
    this.getSchechuleDays(`${year}/${month + 1}/${currentDay}`)
  },

  // 点击日期
  lookHuoDong(event) {
    this.setData({
      rili_list: '',
    })
    clearInterval(this.timer3);
    console.log(event)
    let week1
    if (event.currentTarget.dataset.month < 10 && event.currentTarget.dataset.datenum < 10) {
      console.log('类型1')
      week1 = event.currentTarget.dataset.year + '-0' + event.currentTarget.dataset.month + '-0' + event.currentTarget.dataset.datenum
      this.setData({
        yearMonthRi: event.currentTarget.dataset.year + '-0' + event.currentTarget.dataset.month + '-0' + event.currentTarget.dataset.datenum,
        month_one: event.currentTarget.dataset.month,
        day: event.currentTarget.dataset.datenum,
        currentDay: event.currentTarget.dataset.datenum,
        month_en_number: event.currentTarget.dataset.month,
      })
    } else if (event.currentTarget.dataset.month < 10 && event.currentTarget.dataset.datenum > 9) {
      console.log('类型2')
      week1 = event.currentTarget.dataset.year + '-0' + event.currentTarget.dataset.month + '-' + event.currentTarget.dataset.datenum
      this.setData({
        yearMonthRi: event.currentTarget.dataset.year + '-0' + event.currentTarget.dataset.month + '-' + event.currentTarget.dataset.datenum,
        month_one: event.currentTarget.dataset.month,
        day: event.currentTarget.dataset.datenum,
        currentDay: event.currentTarget.dataset.datenum,
        month_en_number: event.currentTarget.dataset.month,
      })
    } else if (event.currentTarget.dataset.month > 9 && event.currentTarget.dataset.datenum < 9) {
      console.log('类型3')
      week1 = event.currentTarget.dataset.year + '-' + event.currentTarget.dataset.month + '-0' + event.currentTarget.dataset.datenum
      this.setData({
        yearMonthRi: event.currentTarget.dataset.year + '-' + event.currentTarget.dataset.month + '-0' + event.currentTarget.dataset.datenum,
        month_one: event.currentTarget.dataset.month,
        day: event.currentTarget.dataset.datenum,
        month_en_number: event.currentTarget.dataset.month,
        currentDay: event.currentTarget.dataset.datenum,
      })
    } else if (event.currentTarget.dataset.month > 9 && event.currentTarget.dataset.datenum > 9) {
      console.log('类型4')
      week1 = event.currentTarget.dataset.year + '-' + event.currentTarget.dataset.month + '-' + event.currentTarget.dataset.datenum
      this.setData({
        yearMonthRi: event.currentTarget.dataset.year + '-' + event.currentTarget.dataset.month + '-' + event.currentTarget.dataset.datenum,
        month_one: event.currentTarget.dataset.month,
        day: event.currentTarget.dataset.datenum,
        month_en_number: event.currentTarget.dataset.month,
        currentDay: event.currentTarget.dataset.datenum,
      })
    }
    // 点击日期,赋值给月,日

    //计算星期
    let nowDate = new Date(week1);
    this.setData({
      week: this.week_Method(nowDate),
    })
    var url = app.globalData.host
    wx.request({
      url: url + '/api3/schedule/supplierDaySchedule',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10,
        sponsor: 1,
        day: this.data.yearMonthRi,
        supplierId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        console.log(res)
        var one = res.data.result
        one.forEach(function (item, index) {
          // 开始时间
          var a = item.activityTimeBegin + ':00'
          var time3 = Date.parse(a)
          // 结束时间
          var b = item.activityTimeEnd + ':00'
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
        var that = this
        if (res.data.result.length > 0) {
          that.nowTime3(one)
          that.setData({
            rili_list: one,
          })

          /* that.timer3 = setInterval(function () {
             console.log(one)
             console.log('日历倒计时----')
           }, 1000);*/
        } else {
          if (this.data.language == 'en') {
            wx.showToast({
              title: 'No appointment',
              icon: 'none',
              duration: 2000
            })
          } else {
            // wx.showToast({
            //     title: '暂无预约',
            //     icon: 'none',
            //     duration: 2000
            // })
          }
          console.log(one)
          that.setData({
            rili_list: one,
          })
          clearInterval(that.timer3);
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
})