// packageExhibitor/pages/zEdition1/components/bizComponents/myGetInvitation/index.js
import {getString} from "../../../../../../locals/lang.js";

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    liveId: {
      type: String
    }
  },
  lifetimes: {
    created: function () {
    },
    attached() {
      // 判断语言类型
      var language = wx.getStorageSync('lang')
      this.setData({
        language: language
      })
      this.setData({
        menus: [
          {
            title: getString('exhibitors_index', 'app.home.zedition1'),
            unreadNum: 0
          }, {
            title: getString('exhibitors_index', 'app.home.zedition2'),
            unreadNum: 1
          }, {
            title: getString('exhibitors_index', 'app.home.zedition19'),
            unreadNum: 2
          }, {
            title: getString('exhibitors_index', 'app.home.zedition4'),
            unreadNum: 3
          },
        ],
        Invitation_shou: getString('exhibitors_index', 'app.home.zedition6'),//我收到的预约
        Invitation_fa: getString('exhibitors_index', 'app.home.zedition5'),//我发起的预约
        meeting_enter: getString('exhibitors_index', 'app.activity.status1'),//进入会议
        meeting_start: getString('exhibitors_index', 'app.home.zedition7'),//会议开启倒计时
        Expired: getString('exhibitors_index', 'app.home.zedition8'),//已过期
        appointment: getString('exhibitors_index', 'app.home.zedition9'),//预约主题
        Invitation_time: getString('exhibitors_index', 'app.home.zedition10'),//邀约时间
        time_fa: getString('exhibitors_index', 'app.home.zedition11'),//发起时间
        time_beizhu: getString('exhibitors_index', 'app.home.zedition12'),//备注时间
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
      console.log(this.data.liveId)
      this.switchTabClick_three({
        currentTarget: {
          dataset: {
            idx: 0
          }
        }
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    current_menus1: 0,
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
    time_id: '',
    shoudao_list: []
    // liveId:'',
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 时间
    cancleClick() {
      this.setData({
        is_time_show: false,
        label2: '',
        label9: '',
      })
    },
    inputChange(event) {
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
          top: this.data.label2,
          liveId: this.data.liveId
        },
        success: res => {
          if (res.data.result == null) {

            if (this.data.language == 'en') {
              wx.showToast({
                title: 'Launch successful',
                icon: 'none',
                duration: 3000,
              })
            } else {
              wx.showToast({
                title: '发起成功',
                icon: 'none',
                duration: 3000,
              })
            }
            this.setData({
              shoudao_list: [],
              is_time_show: false,
              date_time: '',
              timeStart: '',
              timeEnd: '',
              label2: '',
              label9: '',
            })
            if (this.data.current_menus1 == 2) {
              this.loading(5)
            } else if (this.data.current_menus1 == 3) {
              this.loading(6)
            }
          } else {
            this.setData({
              is_time_show: false,
              date_time: '',
              timeStart: '',
              timeEnd: '',
              label2: '',
              label9: '',
            })
            var one = res.data.result.countDown
            var h = Math.floor(one / 60 / 60);
            var m = Math.floor(one / 60 % 60);
            var s = Math.floor(one % 60);
            console.log(h)
            console.log(m)
            console.log(s)

            if (this.data.language == 'en') {
              var time = 'Please start in' + h + 'hours,' + m + 'minutes and' + s + 'seconds'
            } else {
              var time = '请' + h + '小时' + m + '分钟' + s + '秒后再发起'
            }
            wx.showToast({
              title: time,
              icon: 'none',
              duration: 3000,
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
    // 我的收到的预约,点击tabber栏
    switchTabClick_three(event) {
      this.setData({
        shoudao_list: []
      })
      var url = app.globalData.host
      this.setData({
        current_menus1: event.currentTarget.dataset.idx
      })
      let status = 0
      if (event.currentTarget.dataset.idx == 0) {
        console.log('已确认')
        //我发起的预约
        status = 0
      } else if (event.currentTarget.dataset.idx == 1) {
        status = 2
      } else if (event.currentTarget.dataset.idx == 2) {
        status = 5
      } else if (event.currentTarget.dataset.idx == 3) {
        status = 6
      }
      wx.request({
        url: url + '/api3/schedule/getSchedulePurchasers',
        method: 'GET',
        data: {
          pageNum: 1,
          pageSize: 10,
          sponsor: 1,
          status: status,
          supplierId: wx.getStorageSync('userInfo').id,
          liveId: this.data.liveId
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
            if (status == 0) {
              that.timer2 = setInterval(function () {
                that.nowTime2(one)
                that.setData({
                  shoudao_list: one
                })
              }, 1000);
            } else {
              clearInterval(that.timer2)
              that.setData({
                shoudao_list: one
              })
            }

          } else {
            clearInterval(this.timer2)
            this.setData({
              shoudao_list: []
            })

            if (this.data.language == 'en') {
              wx.showToast({
                title: 'No appointment',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '暂无预约',
                icon: 'none',
                duration: 2000
              })
            }
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    },
    nowTime2(list) {//时间函数
      var len = list.length
      for (var i = 0; i < len; i++) {
        var start = Date.parse(list[i].activityTimeBegin + ':00')
        // 当前时间的时间戳
        var timestamp = Date.parse(new Date()) / 1000
        var intDiff = start - timestamp;//获取数据中的时间戳
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
          clearInterval(this.timer2);
        }
        list[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
      }
      return list
    },
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
          supplierId: wx.getStorageSync('userInfo').id,
          liveId: this.data.liveId
        },
        success: res => {
          console.log(res)
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
            console.log('11111')
            console.log(res.data.result.data.length)
            var that = this
            if (this.data.current_menus1 == 0) {
              that.timer2 = setInterval(function () {
                that.nowTime2(one)
                that.setData({
                  shoudao_list: one
                })
              }, 1000);
            } else {
              clearInterval(that.timer2)
              that.setData({
                shoudao_list: one
              })
            }

          } else {
            var that = this
            that.setData({
              shoudao_list: []
            })
            console.log(this.data.shoudao_list)
            if (this.data.language == 'en') {
              wx.showToast({
                title: 'No appointment',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '暂无预约',
                icon: 'none',
                duration: 2000
              })
            }
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    },

    // 待确认的预约里点击确认
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
              shoudao_list: []
            })
            this.loading(2)
          }
        }
      })
    },
    // 待确认的预约里点击拒绝
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
              shoudao_list: []
            })
            this.loading(2)
          }
        }
      })
    },

    // 已确认的预约里取消预约
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
              shoudao_list: []
            })
            this.loading(0)
          }
        }
      })
    },
    // 已确认的预约里进入会议
    enterRoom: function (e) {
      console.log(e)
      var Url = app.globalData.host
      console.log(Url)
      console.log(e.currentTarget.dataset.item.meetingId)
      var that = this
      wx.request({
        url: Url + '/api3/meeting/getDetail/' + e.currentTarget.dataset.item.meetingId,
        method: "GET",
        data: {},
        success: res => {
          console.log(res)
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
            const url = `/packageTencentCloud/pages/meeting/meeting?id=${this.data.roomID}&toID=${e.currentTarget.dataset.item.purchaserId}`

            // const roomUrl = `../../im/room/room?roomID=${this.data.roomID}` +
            //       `&template=${this.data.template}` +
            //       `&debugMode=${this.data.debugMode}` +
            //       `&cloudenv=${this.data.cloudenv}` +
            //       `&localVideo=${this.data.localVideo}` +
            //       `&localAudio=${this.data.localAudio}` +
            //       `&enableEarMonitor=${this.data.enableEarMonitor}` +
            //       `&enableAutoFocus=${this.data.enableAutoFocus}` +
            //       `&localMirror=${this.data.localMirror}` +
            //       `&enableAgc=${this.data.enableAgc}` +
            //       `&enableAns=${this.data.enableAns}` +
            //       `&encsmall=${this.data.encsmall}` +
            //       `&frontCamera=${this.data.frontCamera}` +
            //       `&videoWidth=${this.data.videoWidth}` +
            //       `&videoHeight=${this.data.videoHeight}` +
            //       `&scene=${this.data.scene}` +
            //       `&minBitrate=${this.data.minBitrate}` +
            //       `&maxBitrate=${this.data.maxBitrate}`
            const reg = /^[0-9a-zA-Z]*$/
            console.log('e.currentTarget.dataset.item')
            if (this.data.userID.match(reg) === null) {

              if (this.data.language == 'en') {
                wx.showToast({
                  icon: 'none',
                  title: 'User name is English plus number',
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '用户名为英文加数字',
                })
              }
            } else {
              wx.navigateTo({
                url,
              })
              this.setData({'tapTime': nowTime})
            }
            console.log('2222222222')
          }

        },
      })

    },
    // 点击再次发起预约
    yuyue1(event) {
      this.setData({
        is_time_show: true,
        time_id: event.currentTarget.dataset.item.id,
        label2: event.currentTarget.dataset.item.top,
        label9: event.currentTarget.dataset.item.remark,
      })
    },
    // 点击再次发起预约
    yuyue2(event) {
      this.setData({
        is_time_show: true,
        time_id: event.currentTarget.dataset.item.id,
        label2: event.currentTarget.dataset.item.top,
        label9: event.currentTarget.dataset.item.remark,
      })
    },
  }
})
