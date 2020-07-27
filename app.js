//app.js

import {genTestUserSig} from 'debug/GenerateTestUserSig.js'
import util, {getCurrentPage1} from 'utils/util'
// import TIM from 'utils/tim-wx'
// import COS from 'utils/cos-wx-sdk-v5'
import TIM from 'tim-wx-sdk'
import COS from 'cos-wx-sdk-v5';

const constant = require('./utils/constant')
const storage = require('./utils/storage')

const {defaultUserImage,
  tab_image_home_default,
  tab_image_home_active,
  tab_image_audience_default,
  tab_image_audience_active,
  tab_image_business_default,
  tab_image_business_active,
  tab_image_myself_default,
  tab_image_myself_active} = require('./common/staticImageContants');
let options = {
  SDKAppID: constant.SDKAppID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
// 注册 COS SDK 插件
tim.registerPlugin({'cos-wx-sdk': COS});
wx.$app = tim
wx.$TIM = TIM

tim.on(TIM.EVENT.MESSAGE_RECEIVED, messageReceived, this); //监听SDK收到新消息
tim.on(TIM.EVENT.KICKED_OUT, kickOut, this) // 监听是否被踢下线
tim.on(TIM.EVENT.ERROR, onError, this) // 出错统一处理 收到 SDK 发生错误通知，可以获取错误码和错误信息

const api = require('./utils/api');

function kickOut(event) {
  // store.dispatch('resetStore')
  wx.showToast({
    title: '你已被踢下线',
    icon: 'none',
    duration: 1500
  })
  setTimeout(() => {
    wx.reLaunch({
      url: '../login/main'
    })
  }, 500)
}

function onError(event) {
  // 网络错误不弹toast && sdk未初始化完全报错
  if (event.data.message && event.data.code && event.data.code !== 2800 && event.data.code !== 2999) {
    // store.commit('showToast', {
    //     title: event.data.message,
    //     duration: 2000
    // })
  }
}


function messageReceived(event) {
  if (getApp().globalData.unreadCountChange) {
    getApp().globalData.unreadCountChange()
  }

  console.log('新消息', event);
  for (let i = 0; i < event.data.length; i++) {
    let item = event.data[i]
    console.log(item)
    console.log(item.type)
    // if (item.type === TYPES.MSG_GRP_TIP) {
    if (item.type === "TIMTextElem") {

    } else if (item.type === "TIMCustomElem") {
      const data = JSON.parse(item.payload.data);
      if (data.type === 'TRTC_EVENT_MEETING_INVITE') {
        const url = `/packageTencentCloud/pages/videoCall/videoCall?data=${item.payload.data}`
        wx.navigateTo({url})
      } else if (data.type === 'TRTC_EVENT_MEETING_REJECT') {
        wx.showToast({
          title: '对方拒绝了您的视频邀请',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({})
      }
    }
  }
}


let genUserSig = (_this) => {
  //对话消息
  var userid_ = '游客' + parseInt(Math.random() * 9999)
  const userid = wx.getStorageSync('userInfo').id || userid_ // 应使用实际的userId 刘明泰
  wx.request({
    url: _this.globalData.host + '/api3/trtcorim/getUsgSign',
    method: 'POST',
    data: {
      UserId: userid
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      if (res.data.code == '0') {
        // console.log(res.data.result)
        getApp().globalData.im_userid = userid;
        tim.login({
          userID: userid,
          userSig: res.data.result
        }).then(() => {
          console.log('im登录成功')
        }).catch((imError) => {
          console.waring('im登录失败')
        })
      }
    },
    fail: function (error) {
      console.log(error)
    }
  })
}


App({
  onLaunch: function () {
    // wx.navigateTo({
    //   url: '/packageExhibitor/pages/zEdition1/ExhibitorsService/activity/goIn/index',
    // })
    // wx.navigateTo({
    //   url: `/packageExhibitor/pages/zEdition1/me/index`,
    // });
    // wx.navigateTo({
    //   url: `/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index?scene=1534`,
    // });
    wx.getSystemInfo({
      success: (t) => {
        this.globalData.height = t.statusBarHeight;
      }
    });
    wx.getStorageSync("lang") || wx.setStorageSync("lang", "zh_CN");
    this.initFlow()
    this.loginim()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


  },
  loginim: function () {
    let _this = this
    let userInfo = wx.getStorageSync('userInfo')
    let onReadyStateUpdate = function ({name}) {
      const isSDKReady = (name === TIM.EVENT.SDK_READY)
      this.globalData.isSDKReady = isSDKReady
      if (isSDKReady) {
        console.log('im准备ok')
        let promise = tim.getMyProfile();
        promise.then(function (imResponse) {
          console.log(imResponse.data); // 个人资料 - Profile 实例
          _this.globalData.imProfile = imResponse.data
        }).catch(function (imError) {
          console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
        });
      }
      //进入跟新最新头像
      tim.updateMyProfile({
        nick: userInfo && userInfo.company || this.globalData.im_userid,
        avatar: userInfo && userInfo.portrait || defaultUserImage,
      })
    }
    tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this) // 监听是否进入 ready 状态
    tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate, this)// 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // im登录（可根据实际情况 移动到合适的地方 但在进入聊天之前）
    genUserSig(_this)
  },
  //第一种底部
  editTabBar: function () {
    //使用getCurrentPages可以获取当前加载中所有的页面对象的一个数组，数组最后一个就是当前页面。
    var curPageArr = getCurrentPages();    //获取加载的页面
    var curPage = curPageArr[curPageArr.length - 1];    //获取当前页面的对象
    var pagePath = curPage.route;    //当前页面url
    var activePagePath = '/' + pagePath;
    // var activePagePath = pagePath.split("/")[2];
    // console.log(pagePath)
    // if (pagePath.indexOf('/') != 0) {
    //   pagePath = '/' + pagePath;
    // }
    var tabBar = this.globalData.tabBar;
    tabBar.language = wx.getStorageSync('lang')
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      var active = tabBar.list[i].pagePath;
      // var active=tabBar.list[i].pagePath.split("/")[3];
      // console.log(tabBar.list[i].pagePath.split("/"))
      // if (active == activePagePath) {
      //   tabBar.list[i].active = true;    //根据页面地址设置当前页面状态
      // }

      if (activePagePath === active) {
        tabBar.list[i].active = true;
      }
    }

    //特例 如果现在的界面是 getCurrentPages()[0].route=="pages/index/index" 第一个active
    if (getCurrentPage1().route == 'pages/indexnew/index') {
      tabBar.list[0].active = true
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  //第二种底部，原理同上
  editTabBar1: function () {
    var curPageArr = getCurrentPages();
    var curPage = curPageArr[curPageArr.length - 1];
    var pagePath = curPage.route;
    var activePagePath = pagePath.split("/")[3] ||pagePath.split("/")[2];
    if (pagePath.indexOf('/') != 0) {
      pagePath = '/' + pagePath;
    }
    var tabBar = this.globalData.tabBar1;
    tabBar.language = wx.getStorageSync('lang')
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      var active = tabBar.list[i].pagePath.split("/")[4] || tabBar.list[i].pagePath.split("/")[3];
      if (active == activePagePath) {
        tabBar.list[i].active = true;
      }
    }
    curPage.setData({
      tabBar: tabBar
    });
  },
  //首次打开app
  initFlow() {
    //故意冗余
    this.getProjects()
  },
  getProjects() {
    var _self = this
    return new Promise(resolve => {
      (0, api.getProjectList)({
        success: function (res) {
          wx.setStorageSync('projectId', res.data.result[0].id);
          _self.getAcvitity(res.data.result[0].id).then(() => {
            resolve()
          });
        },
      });
    })
  },
  getAcvitity(id) {
    let that = this
    return new Promise(resolve => {
      (0, api.getProjectDetail)({
        query: {
          id: id,
        },
        success: function (res) {
          storage.setActivityDetail(res.data.result);
          wx.setNavigationBarTitle({
            title: res.data.result.name
          }) 
          resolve(res.data.result)
          if (that.checkLoginReadyCallback) {
            var curPageArr = getCurrentPages();
            var curPage = curPageArr[curPageArr.length - 1];
            that.checkLoginReadyCallback(curPage);
          }
        },
      });
    })
  },
  getCurrentPage1: getCurrentPage1,
  globalData: {
    height:'',
    isFirstLoadAPP:true,
    //第一种底部导航栏显示
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#ff0000",
      "backgroundColor": "#fff",
      "borderStyle": "#DDDFE1",
      "list": [
        {
          // "pagePath": "/packagePurchaser/pages/purchaser/tabbar/index/index",
          "pagePath": "/pages/indexnew/index",
          "textCn": "首页",
          "textEn": "Home page",
          // https://coolgua-cms.oss-cn-beijing.aliyuncs.com/yiwu_miniprogram_xgyz
          "iconPath": tab_image_home_default,
          "selectedIconPath": tab_image_home_active,
          "clas": "menu-item",
          "selectedColor": "#ff0000",
          "active": true
        },
        {
          "pagePath": "/packagePurchaser/pages/purchaser/tabbar/exhibits/exhibits",
          "textCn": "参展展品",
          "textEn": "Exhibits",
          "iconPath": tab_image_audience_default,
          "selectedIconPath": tab_image_audience_active,
          "selectedColor": "#ff0000",
          "clas": "menu-item",
          "active": false
        },
        {
          "pagePath": "/packagePurchaser/pages/purchaser/tabbar/exhibition/exhibition",
          "textCn": "展商名录",
          "textEn": "Exhibitors",
          "iconPath": tab_image_business_default,
          "selectedIconPath": tab_image_business_active,
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/packagePurchaser/pages/purchaser/tabbar/me/me",
          "textCn": "个人中心",
          "textEn": "Mine",
          "iconPath": tab_image_myself_default,
          "selectedIconPath": tab_image_myself_active,
          "selectedColor": "#ff0000",
          "clas": "menu-item",
          active: false
        }
      ],
      "language": wx.getStorageSync('lang'),
      "position": "bottom"
    },
    //第二种底部导航栏显示
    tabBar1: {
      "color": "#9E9E9E",
      "selectedColor": "#FF0000",
      "backgroundColor": "#fff",
      "borderStyle": "#DDDFE1",
      "list": [
        {
          "pagePath": "/pages/indexExhibitor/indexExhibitor",
          "textCn": "首页",
          "textEn": "Home page",
          "iconPath": "/common/image/tab1/home.png?x-oss-process=image/resize,m_lfit,h_24,w_24",
          "selectedIconPath": "/common/image/tab1/home_pre.png?x-oss-process=image/resize,m_lfit,h_23,w_22",
          "clas": "menu-item",
          "selectedColor": "#FF0000",
          "active": true
        },
        {
          "pagePath": "/packageExhibitor/pages/newedition/buyersList/buyersList",
          "textCn": "采购商",
          "textEn": "caigoushang",
          "iconPath": "/common/image/tab1/exhibits.png?x-oss-process=image/resize,m_lfit,h_24,w_24",
          "selectedIconPath": "/common/image/tab1/exhibits_pre.png?x-oss-process=image/resize,m_lfit,h_24,w_24",
          "selectedColor": "#FF0000",
          "clas": "menu-item",
          "active": false
        },
        {
          "pagePath": "/packageExhibitor/pages/newedition/demand/demand",
          "textCn": "采购需求",
          "textEn": "caigouxuqiu",
          "iconPath": "/common/image/tab1/exhibition.png?x-oss-process=image/resize,m_lfit,h_24,w_24",
          "selectedIconPath": "/common/image/tab1/exhibition_pre.png?x-oss-process=image/resize,m_lfit,h_23,w_19",
          "selectedColor": "#FF0000",
          "clas": "menu-item",
          active: false
        },
        {
          "pagePath": "/packageExhibitor/pages/zEdition1/me/index",
          "textCn": "个人中心",
          "textEn": "Mine",
          "iconPath": "/common/image/tab1/me.png?x-oss-process=image/resize,m_lfit,h_24,w_24",
          "selectedIconPath": "/common/image/tab1/me_pre.png?x-oss-process=image/resize,m_lfit,h_23,w_19",
          "selectedColor": "#FF0000",
          "clas": "menu-item",
          active: false
        }
      ],
      "language": wx.getStorageSync('lang'),
      "position": "bottom"
    },
    userInfo: null,
    host: constant.API_URL_V2,
    companyId: constant.COMPANY_ID,
    templateId: constant.templateId,
    appId: constant.appId,
    phone: '13436372908',
    weixinId: "123456789",
    openId: '',
    //TRTC
    headerHeight: 0,
    statusBarHeight: 0,
    //IM
    imProfile: '', //im我的信息
    isSDKReady: false, //im是否进入ready
    updateMyInfo: '',

    // 回调函数
    unreadCountChange: '',
    navigationBarTitle: storage.getActivityDetail().name,
    im_userid: "",//用户im登陆id
  }
})
