// packageExhibitor/pages/zEdition1/me/index.js
import {getString} from "../../../../locals/lang.js";
import {
  defaultUserImage,
  icon_look, myself_activity,
  myself_hd, myself_invite, myself_kfdh, myself_left, myself_like, myself_message, myself_prooduct,
  myself_rc, myself_right,
  myself_sc_dz, myself_schedule, myself_service,
  myself_xx,
  myself_yy,
  myself_zp
} from "../../../../common/staticImageContants";
import {ajax, getCurrentPage1, logoutim} from "../../../../utils/util";
import api from "../../../../utils/api";
import {API_URL_V2} from "../../../../utils/constant";
//获取应用实例
const app = getApp()
const storage = require('../../../../utils/storage')
const i18n = require('../../../../i18n/i18n.js')
Page({

  /**
   * 组件的初始数据
   */
  data: {
    personalCenter:"https://live.signchinashow.com/icon/bbb123.png",
    defaultUserImage,
    info: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: '',
    hotline: '',
    height: wx.getSystemInfoSync().screenHeight,
    myself_zp,
    myself_yy,
    myself_rc,
    myself_xx,
    myself_hd,
    myself_sc_dz,
    myself_kfdh,
    myself_right,
    icon_look,
    lang: null,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    getStatOverview: {},
    //消息未读
    messageUnRead: 0,
    //begin icon
    myself_activity,
    myself_invite,
    myself_like,
    myself_message,
    myself_prooduct,
    myself_schedule,
    myself_service,
    myself_left,
    //end icon
  },
  /**
   * 组件的方法列表
   */
  /**
  * 页面加载完成执行
  */
  // lifetimes:{
  //   ready(){
  //   }
  // },
  onLoad: function (options) {
    app.editTabBar1();    //显示自定义的底部导航
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.mine'),
    })

  },
  onShow:function(){
    this.initData();
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })

  },
  // methods: {
    repassword() {
      this.setData({
        ismask: true
      })
    },
    cancel() {
      this.setData({
        ismask: false
      })
    },
    menuClick(event) {
      var that = this
      console.log(event)
      if (event.currentTarget.dataset.idx == 5) {
        if (that.data.hotline == '') {
          var tip = ''
          if (that.data.language != 'en') {
            tip = '暂无电话'
          } else {
            tip = 'no hotline'
          }
          wx.showToast({
            title: tip,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.makePhoneCall({
            phoneNumber: that.data.hotline,
            success: function (res) {
              console.log(res)
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }

      } else {
        wx.navigateTo({
          url: this.data.menus[event.currentTarget.dataset.idx].url,
        })
      }

    },
    detail() {
      wx.navigateTo({
        url: '/packageExhibitor/pages/newedition/myInformation/myInformation',
      })
    },
    getinfo: function () {
      var that = this
      var participant = wx.getStorageSync('userInfo').id // 展商id
      var url = app.globalData.host + '/api3/index/getStatOverview/' + participant + '/0';
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == '0') {
            that.setData({
              'menus[0].unreadNum': res.data.result.invite,
              'menus[1].unreadNum': res.data.result.schedule,
              'menus[2].unreadNum': res.data.result.exhibit,
              'menus[3].unreadNum': res.data.result.msg,
              'menus[4].unreadNum': res.data.result.live,
              getStatOverview: res.data.result||{}
            })
            getCurrentPage1().setData({
              getStatOverview: res.data.result||{}
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
      var url1 = app.globalData.host + '/api3/supplier/detail/' + participant;
      wx.request({
        url: url1,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == '0') {
            that.setData({
              info: res.data.result
            })
            getCurrentPage1().setData({
              userInfo: res.data.result
            })
          } else {

          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
      // var url2 = app.globalData.host + '/api3/index/getStatOverview/' + participant+'/0';
      // wx.request({
      //   url: url2,
      //   method: 'GET',
      //   header: {
      //     'Content-Type': 'application/json'
      //   },
      //   success: function(res){
      //     if(res.data.code==0){
      //       let info = that.data.info
      //       info.
      //       that.setData({
      //         info: res.data.result
      //       })
      //       getCurrentPage1().setData({
      //         userInfo: res.data.result
      //       })

      //     }
      //     console.log(res,"ttttttttttttt");
      //   },
      // })
    },
    bindoldpwdInput: function (e) {
      this.setData({
        oldPassword: e.detail.value
      })
    },
    bindnewpwdInput: function (e) {
      this.setData({
        newPassword: e.detail.value
      })
    },
    bindconpwdInput: function (e) {
      this.setData({
        confirmPassword: e.detail.value
      })
    },
    repwd() {
      if (this.data.oldPassword == '') {
        if (this.data.language != 'en') {
          wx.showToast({
            title: '请输入旧密码',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "Please enter the original password",
            icon: 'none',
            duration: 1000
          })
        }
        return;
      } else if (this.data.newPassword == '') {
        if (this.data.language != 'en') {
          wx.showToast({
            title: '请输入新密码',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "Please enter a new password",
            icon: 'none',
            duration: 1000
          })
        }
        return;
      } else if (this.data.confirmPassword == '' || this.data.confirmPassword != this.data.newPassword) {
        if (this.data.language != 'en') {
          wx.showToast({
            title: '请确认新密码',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "Please confirm the password",
            icon: 'none',
            duration: 1000
          })
        }
        return;
      } else if (this.data.oldPassword != wx.getStorageSync('password')) {
        if (this.data.language != 'en') {
          wx.showToast({
            title: '旧密码错误',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "Old password error",
            icon: 'none',
            duration: 1000
          })
        }
        return;
      }
      console.log('111')
      var that = this
      var id = wx.getStorageSync('userInfo').id // 展商id
      var projectId = wx.getStorageSync('activityDetail').id
      var timestamp = (new Date()).getTime();
      var userId = wx.getStorageSync('userInfo').id
      var companyId = wx.getStorageSync('activityDetail').companyId
      var appCode = 'appYW01'
      var url = app.globalData.host + '/cg/' + companyId + '/' + appCode + '/' + userId + '/v1/updatePassword/';
      wx.request({
        url: url,
        method: 'POST',
        data: {
          // accessToken:,
          projectId: projectId,
          timeStamp: timestamp,
          confirmPassword: that.data.confirmPassword,
          id: id,
          newPassword: that.data.newPassword,
          oldPassword: that.data.oldPassword,
          src: 0
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == '0') {
            var tip = ''
            if (that.data.language != 'en') {
              tip = '修改成功'
            } else {
              tip = 'edit success'
            }
            wx.showToast({
              title: tip,
              icon: 'none',
              duration: 1000
            })
            wx.setStorageSync('password', that.data.newPassword)
            that.setData({
              ismask: false
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    switchRole() {
      var self = this
      wx.showModal({
        title: "提示",
        content: "确定要切换吗",
        success(res) {
          if (res.confirm) {
            self.triggerUnline()
            logoutim()
            wx.setStorageSync('role', 'purchaser')
            wx.setStorageSync('userInfo', '')
            setTimeout(() => {
              wx.redirectTo({
                url: '/packagePurchaser/pages/purchaser/authorize/authorize',
              })
            }, 500)
          }
        }
      })
    },
    //  触发下线
    triggerUnline() {
      var projectId = wx.getStorageSync('activityDetail').id
      var purchaserId = storage.getUserInfo().id
      ajax.get(`${API_URL_V2}/backend/v1/statistics/reduceSupplierNum/${projectId}/${purchaserId}`)
    },
    //注销
    logout() {
      var that = this
      var projectId = wx.getStorageSync('activityDetail').id
      var userId = wx.getStorageSync('userInfo').id
      wx.request({
        url: app.globalData.host + '/cg/user/' + projectId + '/match/' + userId + '/v1/toQuit/0',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == '0') {
            var tip = ''
            if (that.data.language != 'en') {
              tip = '退出成功'
            } else {
              tip = 'exit success'
            }
            wx.showToast({
              title: tip,
              icon: 'none',
              duration: 1000
            })
            wx.clearStorage()
            wx.reLaunch({
              url: '/pages/indexnew/indexnew'
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //go2exhibits 我的展品
    go2exhibits() {
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/displays/list/displaysList'
      })
    },
    // 我的预约
    go2reservation() {
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/me/myInvitation/index'
        // url: '/pages/appoint-schedule-plus/appoint-schedule-plus'
      })
    },
    go2reservation_richeng() {
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/me/myInvitation/index?richeng=richeng'
      })
    },
    //    我的消息
    go2mymessage() {
      wx.navigateTo({
        url: "/packageExhibitor/pages/zEdition1/me/msg/index",
      })
    },
    //    我的报名活动
    go2myactivityList() {
      wx.navigateTo({
        url: this.data.menus[event.currentTarget.dataset.idx].url,
      })
    },
    //    我的收藏
    go2myfavoir() {
      wx.navigateTo({
        url: this.data.menus[event.currentTarget.dataset.idx].url,
      })
    },
    //我的电话客服
    go2myphoneService() {
      wx.makePhoneCall({
        phoneNumber: this.data.hotline,
        success: function (res) {
          console.log(res)
        },
        fail: function (err) {
          console.log(err)
        }
      })
    },
    go2collectAndLikePage() {
      wx.navigateTo({
        url: `/packageExhibitor/pages/newedition/collectionPrise/collectionPrise`
      })
    },
    callTelephone() {
      wx.makePhoneCall({
        phoneNumber: wx.getStorageSync('activityDetail').hotLine, //此号码并非真实电话号码，仅用于测试
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    //发起直播
    toLive(){
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/index/hot-video/hot-video?id=${wx.getStorageSync('userInfo').id}`,
      })
    },
    go2activityList() {
      wx.navigateTo({
        // url: `/packageExhibitor/pages/zEdition1/activity/activity?ismyself=true`
        url:'/packageExhibitor/pages/zEdition1/ExhibitorsService/activity/index'
      })
    },
    zoomImage(e) {
      var imageurl = e.currentTarget.dataset.imageurl
      wx.previewImage({
        current: 0, // 当前显示图片的http链接
        urls: [imageurl] // 需要预览的图片http链接列表
      })
    },
    /**
     * 修改语言*/
    // 切换语言
    switchLanguage: function (event) {
      wx.showModal({
        title: "提示",
        content: "确定要切换语言吗？",
        success(res) {
          if (res.confirm) {
            console.log(event.currentTarget.dataset.name)
            wx.setStorageSync("lang", event.currentTarget.dataset.name);
            wx.reLaunch({url: `/${getCurrentPage1().route}`})
            return false
          }
          // this.initData()
        }
      })
    },
    initData() {
      this.setData({
        viewname: getString('exhibitors_index', 'app.mine.view'),
        repass: getString('exhibitors_index', 'app.mine.repass'),
        exit: getString('exhibitors_index', 'app.mine.exit'),
        menus: [
          {
            url: '/packageExhibitor/pages/zEdition1/me/myInvitation/index',
            title: getString('exhibitors_index', 'app.mine.menu1'),
            unreadNum: 0,
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/yuyue.png'
          }, {
            url: '/packageExhibitor/pages/zEdition1/me/myInvitation/index?richeng=richeng',
            title: getString('exhibitors_index', 'app.mine.menu2'),
            unreadNum: 0,
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/richeng.png'
          }, {
            url: '/packageExhibitor/pages/zEdition1/me/meInfo/index?product=product',
            title: getString('exhibitors_index', 'app.mine.menu3'),
            unreadNum: 0,
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/chanpin.png'
          }, {
            url: '/packageExhibitor/pages/zEdition1/me/msg/index',
            title: getString('exhibitors_index', 'app.mine.menu4'),
            unreadNum: 0,
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/xiaoxi.png'
          },
          // {
          // 	url: '/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/index',
          // 	title: getString('exhibitors_index', 'app.mine.menu5'),
          // 	unreadNum: 0,
          // imgsrc:'https://www.coolgua.net/match_img/img/zEdition1/zhibo.png'
          // },
          {
            url: '',
            title: getString('exhibitors_index', 'app.mine.menu6'),
            unreadNum: '',
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/kefu.png'
          }, {
            url: `/packageExhibitor/pages/zEdition1/activity/activity?role=0`,
            title: getString('exhibitors_index', 'app.mine.menu7'),
            unreadNum: '',
            imgsrc: 'https://www.coolgua.net/match_img/img/zEdition1/kefu.png'
          },
        ],
        ismask: false,
        oldpwd: getString('exhibitors_index', 'app.mine.oldpwd'),
        placoldpwd: getString('exhibitors_index', 'app.mine.placoldpwd'),
        newpwd: getString('exhibitors_index', 'app.mine.newpwd'),
        placnewpwd: getString('exhibitors_index', 'app.mine.placnewpwd'),
        confirmpwd: getString('exhibitors_index', 'app.mine.confirmpwd'),
        placconfirmpwd: getString('exhibitors_index', 'app.mine.placconfirmpwd'),
        submit: getString('exhibitors_index', 'app.mine.submit'),
        hallNumber: getString('wp', 'app.info.no'),
        boothNumber: getString('wp', 'app.info.sitno'),
        hotline: wx.getStorageSync('activityDetail').hotLine
      })
      // 判断语言类型
      var language = wx.getStorageSync('lang')
      this.setData({
        language: language,
        lang: language,
        langTranslate: i18n.langTranslate(),
      })
      this.getinfo();
      console.log(this.data.hotline)
    },
  // },
  // lifetimes: {
  //   // 组件所在页面的生命周期函数
  //   attached: function () {
  //     this.initData()
  //   },
  // },
})
