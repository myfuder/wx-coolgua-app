import {getCurrentPageAndParams} from "../../utils/util";

let api = require("../../utils/api"), constant = require("../../utils/constant"), i18n = require('../../i18n/i18n.js'),
  storage = require("../../utils/storage.js"), util = require("../../utils/util");
var app = getApp()
import phone from '../../utils/phone'

Component({
  pageLifetimes: {
    show() {
      const pages = getCurrentPages()
      const route = pages[pages.length - 1].route
    }
  },

  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    activityList: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changePath) {
        if (!util.isNullArray(newVal)) {
          this.setData({
            langIsEn: i18n.isEn(),
            langTranslate: i18n.langTranslate()
          })
        }
      }
    },
    // 是展商还是展品，exhibition/exhibits
    source: {
      type: String,
      value: '',
    },
  },
  data: {
    // 这里是一些组件内部数据
    staticImageUrl: constant.STATIC_IMAGE_URL,
    staticDefaultImg: constant.STATIC_DEFAULT_IMAGE_NAME,
    currentRole: 1,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
  },
  methods: {
    //查看同期活动更多
    moreActivity: function () {
      var user = storage.getUserInfo();
      if (!user.id) {
        var redirect = encodeURIComponent(getCurrentPageAndParams());
        wx.redirectTo({
          url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${redirect}`,
        });
        // wx.showToast({title:"请先登陆",icon:"none"})
        return false
      }
      if (storage.getRoleType() === constant.ROLE_TYPE.EXHIBITOR) {
        wx.navigateTo({
          url: '/packageExhibitor/pages/zEdition1/activity/activity?ismyself=false',
        })
      } else if (storage.getRoleType() === constant.ROLE_TYPE.PURCHASER) {
        wx.navigateTo({
          url: '/packagePurchaser/pages/purchaser/index/activity/activity?ismyself=false',
        })
      } else {
        wx.navigateTo({
          url: "/pages/role/role",
        });
      }
    },
    goOverview: function (e) {
      var userInfo = storage.getUserInfo();
      if (!userInfo.id) {
        var redirect = encodeURIComponent(getCurrentPageAndParams());
        wx.redirectTo({
          url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${redirect}`,
        });
        // wx.showToast({title:"请先登陆",icon:"none"})
        return false
      }
      var authorization = wx.getStorageSync('authorization')
      var phone = wx.getStorageSync('phone')
      var tid = e.currentTarget.dataset.tid || e.currentTarget.dataset.id
      if (phone && authorization) {
        if (storage.getRoleType() === constant.ROLE_TYPE.EXHIBITOR) {
          wx.navigateTo({
            url: `/packageExhibitor/pages/zEdition1/activityDetail/activityDetail?tid=${tid}`,
          })
        } else if (storage.getRoleType() === constant.ROLE_TYPE.PURCHASER) {
          wx.navigateTo({
            url: `/packagePurchaser/pages/purchaser/index/activityDetail/activityDetail?tid=${tid}`,
          })
        }
      } else {
        wx.navigateTo({
          url: "/pages/role/role",
        });
      }
    },
  }
})