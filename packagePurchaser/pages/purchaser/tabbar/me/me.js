//index.js
//获取应用实例
import {ajax, getCurrentPage1, getCurrentPageAndParams, logoutim} from "../../../../../utils/util";
import {API_URL_V2} from "../../../../../utils/constant";
import {defaultUserImage, myself_xx,personalCenter} from "../../../../../common/staticImageContants";

const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {
    currentType: 1,
    personalCenter:'https://live.signchinashow.com/icon/bbb123.png',
    exhibitList: [],
    livingList: [],
    dialogHide: true,
    userInfo: {},
    statOverview: {},
    staticImageUrl: constant.STATIC_IMAGE_URL,
    staticDefaultImg: constant.STATIC_DEFAULT_IMAGE_NAME,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    defaultUserImage,
    isLogin: false,
    lang: wx.getStorageSync("lang"),
    height: wx.getSystemInfoSync().screenHeight
  },
  onLoad: function () {
    app.editTabBar();    //显示自定义的底部导航
    /*如果没有登陆就跳转注册授权登陆*/
    var mobilePhone = storage.getUserInfo().mobilePhone
    /* if (mobilePhone == null || mobilePhone == undefined || mobilePhone == '') {
       wx.redirectTo({
         url: "/packagePurchaser/pages/purchaser/authorize/authorize",
       });
       return false
     }*/
  },
  go2auth() {
    var redirect = encodeURIComponent(getCurrentPageAndParams());
    wx.redirectTo({
      url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${redirect}`,
    });
    return false
  },
  onShow: function () {
    _self = this
    var mobilePhone = storage.getUserInfo().mobilePhone
    this.setData({
      isLogin: mobilePhone
    })
    _self.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
    getCurrentPage1().setData({
      lang: wx.getStorageSync("lang")
    })
    if (mobilePhone) {
      this.initData()
    }
  },
  // 初始化数据
  initData: function () {
    (0, api.getStatOverview)({
      query: {
        participant: storage.getUserInfo().id,
        sponsor: 1
      },
      success: function (res) {
        _self.setData({
          statOverview: res.data.result,
        })
      }
    });
    (0, api.getPurchaserDetail)({
      query: {
        id: storage.getUserInfo().id
      },
      success: function (res) {
        if (res.data.result) {
          _self.setData({
            userInfo: {
              ...res.data.result,
              portrait: util.isNullStr(res.data && res.data.result && res.data.result.portrait) ? defaultUserImage : res.data.result.portrait
            }
          })
        }
      }
    });
  },
  // 切换语言
  switchLanguage: function (event) {
    var self = this
    console.log(event.currentTarget.dataset.name)
    wx.showModal({
      title: "提示",
      content: "确定要切换语言吗？",
      success(res) {
        if (res.confirm) {
          var lang = self.data.lang
          var reyult = (lang == 'en' ? 'zh_CN' : 'en');

          self.setData({
            lang: reyult
          })
          wx.setStorageSync("lang", reyult);
          wx.reLaunch({
            url: `/${getCurrentPage1().route}`
          })
        }
      }
    })

    // _self.initData();
  },
  changeTypeTap: function (e) {
    console.log(e)
    _self.setData({
      currentType: parseInt(e.currentTarget.dataset.type)
    })
  },
  cancelPopupTap: function () {
    _self.setData({
      dialogHide: true
    })
  },
  showPopupTap: function () {
    _self.setData({
      dialogHide: false
    })
  },
  logoutTap: function () {
    (0, api.logout)({
      query: {
        projectId: storage.getActivityDetail().id,
        userId: storage.getUserInfo().id,
        src: 1
      },
      isSkipIntercept: true,
      method: 'POST',
      success: function (res) {
        wx.clearStorage()
        wx.reLaunch({
          url: '/pages/indexExhibitor/indexExhibitor',
        })
      }
    })
  },
  switchRole: function () {
    var self = this
    //退出观众 进入展商
    wx.showModal({
      title: '登陆状态将会注销',
      content: '确定切换身份吗?',
      success: function (sm) {
        if (sm.confirm) {
          self.triggerUnline()
          wx.setStorageSync('userInfo', '')
          wx.setStorageSync('role', 'exhibitor');
          logoutim()
          setTimeout(() => {
            wx.redirectTo({
              url: '/packageExhibitor/pages/zEdition1/authorize/authorize',
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
    ajax.get(`${API_URL_V2}/backend/v1/statistics/reduceAudienceNum/${projectId}/${purchaserId}`)
  },
  activityTap() {
    var user = storage.getUserInfo();
    if (!user.id) {
      this.go2auth();
      return false
    }
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/my-appoint/my-appoint',
    })
  },
  toCollectionPraise(){
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/collectionPrise/collectionPrise`,
    })

  },
  goPage: function (e) {
    var user = storage.getUserInfo();
    if (!user.id) {
      this.go2auth();
      return false
    }
    const param = e.currentTarget.dataset.param
    if (param !== undefined && param !== null) {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/me/${e.currentTarget.dataset.page}/${e.currentTarget.dataset.page}?type=${param}`,
      })
    } else {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/me/${e.currentTarget.dataset.page}/${e.currentTarget.dataset.page}`,
      })
    }

  },
  contactTap: function () {
    var user = storage.getUserInfo();
    if (!user.id) {
      this.go2auth();
      return false
    }

    if (util.isNullStr(storage.getActivityDetail().hotLine)) {
      wx.showToast({
        title: '暂无客服电话',
        icon: 'none'
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: storage.getActivityDetail().hotLine
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  go2exhibitionCertificate() {

  },
  go2scheduleList(e) {
    var user = storage.getUserInfo();
    if (!user.id) {
      this.go2auth();
      return false
    }
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url,
    })
  },
})
