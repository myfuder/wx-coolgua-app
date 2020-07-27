//index.js
//获取应用实例
import {
  ajax,
  getCollectListAll,
  getCurrentPage1,
  getLikeListAll,
  uploadProfileIm_guanz
} from "../../../../../utils/util";
import {API_URL, API_URL_V2} from "../../../../../utils/constant";
import {
  defaultUserImage,
  menu_001,
  menu_002,
  menu_006,
  menu_007,
  menu_008
} from "../../../../../common/staticImageContants";

const app = getApp()
let TIME = 60
let _self = null
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util")

Page({
  data: {
    loadingPage: true,
    openId: '',
    activityId: '',
    concurrentEvents: [],
    scrollHeight: 0,
    scrollTop: 0,
    pageNum: 1,
    pageSize: '10',
    columns: [],
    purchasersList: [],
    supplierId: '',
    language: '',
    currentType: 1,
    exhibitList: [],
    livingList: [],
    dialogHide: true,
    // 顶部轮播图
    bannerList: [],
    // 展商列表
    staticImageUrl: constant.STATIC_IMAGE_URL,
    date: '',
    dayText: '',
    startTime: '',
    endTime: '',
    inviteSupplierId: null,
    remark: '',
    topTheme: '',
    // 语言切换
    langTranslate: {},
    isEn: false,
    miniLinkShow: false,
    isWrong: false,
    menu_001,
    menu_002,
    menu_006,
    menu_007,
    menu_008,
    stadiumNavigation: {},
    //视频直播
    liveColumsItem: {},
    productTypeList: [],
    exhibitionIntroduce: {}
  },
  onLoad: function () {
    app.editTabBar();    //显示自定义的底部导航
    var that = this
    that.setData({
      language: wx.getStorageSync('language'),
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
    wx.setNavigationBarTitle({
      title: i18n.langTranslate()[storage.getActivityDetail().name],
    });

    this.getProductTypes()
    //修改登陆信息
    uploadProfileIm_guanz()
    this.triggerOnline()
    getLikeListAll()
    getCollectListAll()
  },
  getLikeList() {
  },
  onShow: function () {
    _self = this
    _self.initData()
    _self.activityList()
    // const currentDate = new Date()
    // let year = currentDate.getFullYear(), month = currentDate.getMonth() + 1, date = currentDate.getDate(), dayNum = currentDate.getDay();
    // this.setData({
    //   staticImageUrl: constant.STATIC_IMAGE_URL,
    //   date: year + '-' + util.formatDateStr(month) + '-' + util.formatDateStr(date),
    //   dayText: this.setDayText(dayNum)
    // })
    //  每次刷新都去判断有没有登录im 没有就登陆
    util.loginim()
  },
  // 初始化数据
  initData: function () {
    //banner图
    (0, api.getRotations)({
      success: function (res) {
        _self.setData({
          bannerList: res.data.result
        })
      }
    });

    //地展信息
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 10,
        types: constant.COLUMN_TYPE.SUPPORTING_ACTIVITY,
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        res.data.result.data.map((item, index) => {
          if (item.link === "dzxx") {
            _self.setData({
              stadiumNavigation: item,
              miniLinkShow: true
            });
          }
        });
      },
    });
    //8个按钮
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 100,
        type: '',
        types: '1,2,5',
        projectId: storage.getActivityDetail().id
      },
      success: function (res) {
        var lists = res.data.result.data
        var liveColumsItem = lists && lists.filter(item => item.title == '直播活动')[0]
        var exhibitionIntroduce = lists && lists.filter(item => item.title == '展会介绍')[0]
        var stadiumNavigation = lists && lists.filter(item => item.title == '地展活动')[0]
        _self.setData({
          columns: res.data.result.data,
          liveColumsItem,
          stadiumNavigation,
          exhibitionIntroduce,
        })
        getCurrentPage1().setData({
          columns: res.data.result.data,
          liveColumsItem,
          stadiumNavigation,
          exhibitionIntroduce,
        })
      }
    });
    console.log(_self.data.columns)
    this.initExhibits()
  },
  //同期活动列表
  goMini: function () {
    wx.navigateToMiniProgram({
      appId: _self.data.stadiumNavigation.detailList[0].link,
      path: _self.data.stadiumNavigation.detailList[0].linkMini,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        console.log("跳转成功")
      },
      fail: function (error) {
        console.error(error)
        wx.showToast({
          title: '请确定链接地址是否正确',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  activityList: function () {
    (0, api.getActivityList)({
      query: {
        projectId: storage.getActivityDetail().companyId,
        activityId: storage.getActivityDetail().id
      },
      success: function (res) {
        var concurrentEvents = res.data && res.data.result && res.data.result
        if (concurrentEvents && concurrentEvents.constructor == Array) {

        }
        if (concurrentEvents && concurrentEvents.constructor == Object) {
          concurrentEvents = [concurrentEvents]
        }
        concurrentEvents = concurrentEvents.map(item => {
          item.banner = item.banner ? item.banner : defaultUserImage
          return item
        })
        _self.setData({
          concurrentEvents
        })
        getCurrentPage1().setData({
          concurrentEvents
        })
      },
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const date = e.detail.value.replace('-', '/')
    this.setData({
      date: e.detail.value,
      dayText: _self.setDayText(new Date(date).getDay())
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
  changeTopTheme: function (e) {
    this.setData({
      topTheme: e.detail.value
    })
  },
  getVideoList: function () {
    (0, api.getVideoList)({
      data: {
        pageNum: 1,
        pageSize: 9 - _self.data.liveList.length
      },
      query: {
        id: storage.getActivityDetail().id
      },
      success: function (res) {
        _self.setData({
          videoList: res.data.result.data
        })
      }
    });
  },
  submitTap: function () {
    (0, api.addPurchaserSchedule)({
      data: {
        activityEnd: _self.data.endTime,
        activityStart: _self.data.startTime,
        activityTime: _self.data.date,
        projectId: storage.getActivityDetail().id,
        sponsor: 1,
        supplierId: _self.data.inviteSupplierId,
        remark: _self.data.remark,
        purchaserId: storage.getUserInfo().id,
        top: _self.data.topTheme
      },
      method: 'POST',
      success: function () {
        wx.showToast({
          title: '邀约成功',
        })
        _self.setData({
          dialogHide: true,
          endTime: '',
          startTime: '',
          remark: '',
          topTheme: ''
        })
      }
    })
  },
  goDetailPage: function (e) {
    const id = e.currentTarget.dataset.id, type = _self.data.currentType
    if (type === 1) {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/exhibition/detail/detail?id=${id}`,
      })
    } else {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/exhibits/detail/detail?id=${id}`,
      })
    }

  },
  // 加载展商或展品
  initExhibits: function () {
    const currentType = this.data.currentType
    if (storage.getUserInfo().id == '' || storage.getUserInfo().id == null || storage.getUserInfo().id == undefined) {
      var currentUserId = ''
    } else {
      var currentUserId = storage.getUserInfo().id
    }
    var query = {
      currentUserId: currentUserId,
      pageNum: 1,
      pageSize: 5,
      projectId: storage.getActivityDetail().id,
    }
    if (currentType === 1) {
      (0, api.recommendSuppliers)({
        method: "GET",
        data: query,
        success: function (res) {
          console.log(res.data.result.data, 'yue')
          res.data.result.data.map(item => {
            item.name = item.company
            item.hallNumber = util.filterNullInStr(util.defaultNullStr(item.hallNumber))
            item.boothNumber = util.defaultNullStr(item.boothNumber)
            item.coverImage = item.portrait
          })
          _self.setData({
            loadingPage: false,
            exhibitList: res.data.result.data
          })
        }
      });
    } else {
      (0, api.recommendExhibits)({
        method: "GET",
        data: query,
        success: function (res) {
          res.data.result.data.map(item => {
            item.hallNumber = util.defaultNullStr(item.hallNumber)
            item.popular = item.hot
          })
          _self.setData({
            loadingPage: false,
            exhibitList: res.data.result.data
          })
        }
      });
    }
  },
  changeTypeTap: function (e) {
    console.log(e)
    _self.setData({
      currentType: parseInt(e.currentTarget.dataset.type)
    })
    _self.initExhibits()
  },
  cancelPopupTap: function () {
    _self.setData({
      dialogHide: true
    })
  },
  showPopupTap: function (e) {
    _self.setData({
      dialogHide: false,
      inviteSupplierId: e.currentTarget.dataset.id
    })
  },
  goPage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/my-appoint/my-appoint',
    })
  },
  goWebViewPage: function (e) {
    console.log(e)
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/web-view/web-view?src=${e.currentTarget.dataset.src}`
    })
  },
  goVideoPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=2&id=${e.currentTarget.dataset.id}`,
    })
  },
  goLivePage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=1&id=${e.currentTarget.dataset.id}`,
    })
  },
  goMePage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/${e.currentTarget.dataset.page}/${e.currentTarget.dataset.page}`,
    })
  },
  goMorePage: function () {
    if (this.data.currentType === 1) {
      wx.reLaunch({
        url: '/packagePurchaser/pages/purchaser/tabbar/exhibition/exhibition',
      })
    } else {
      wx.reLaunch({
        url: '/packagePurchaser/pages/purchaser/tabbar/exhibits/exhibits',
      })
    }

  },
  goVideoMorePage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/index/hot-video/hot-video',
    })
  },
  setDayText: function (dayNum) {
    let dayText = ''
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
    return dayText
  },
  cascades: function () {
    var that = this
    var supplierLayout = null
    try {
      supplierLayout = JSON.parse(wx.getStorageSync('activityDetail').purchaserLayout)
    } catch (e) {
      that.setData({isWrong: false})
    }
    for (var index in supplierLayout) {
      if (supplierLayout[index].nameKey == 'industry' || supplierLayout[index].nameKey == 'nature') {
        supplierLayout[index].pcadesJson = []
        for (var f in supplierLayout[index].pcades) {
          var pcades = {}
          pcades.name = supplierLayout[index].pcades[f]
          pcades.active = false
          supplierLayout[index].pcadesJson.push(pcades)
        }
      }
      that.setData({
        supplierLayout: supplierLayout
      })
    }
    console.log(that.data.supplierLayout, 222222)
  },
  // 推荐观众
  getPurchasers() {
    var that = this
    var supplierId = that.data.supplierId
    var pageNum = that.data.pageNum
    var pageSize = that.data.pageSize
    var purchasersList = that.data.purchasersList
    var url = app.globalData.host + '/api3/recommend/getPurchasers?pageNum=' + pageNum + '&pageSize=' + pageSize + '&supplierId=' + supplierId
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          var purchasers = res.data.result
          for (var index in purchasers) {
            if (purchasers[index].tags != null && purchasers[index].tags != null && purchasers[index].tags != undefined) {
              purchasers[index].tags = purchasers[index].tags.split(',')
            }
            if (purchasers[index].nature != null && purchasers[index].nature != null && purchasers[index].nature != undefined) {
              purchasers[index].nature = purchasers[index].nature.split(',')
            }
            if (purchasers[index].goal != null && purchasers[index].goal != null && purchasers[index].goal != undefined) {
              purchasers[index].goal = purchasers[index].goal.split(',')
            }
          }
          that.setData({
            pageNum: pageNum + 1,
            pageSize: 10,
            purchasersList: purchasersList.concat(purchasers)
          })
          console.log(that.data.purchasersList, 222)
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  changePageCollect: function (e) {
    _self.getPurchasers()
  },
  exhibitorInvite: function (event) {
    var audience = event.currentTarget.dataset.item
    wx.setStorageSync('audienceDetail', audience)
    wx.navigateTo({
      url: '../../audience/invitation/invitation?status=' + '0'
    })
  },
  moreActivity: function () {
    wx.navigateTo({
      url: '../activity/activity'
    })
  },
  goOverview: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../activityDetail/activityDetail?id=' + id
    })
  },
  goVenue: function (event) {
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../website/website?id=' + id + '&title=' + title
    })
  },
  goTraffic: function () {
    let plugin = requirePlugin('routePlan');
    let key = 'ZHGBZ-TDVLW-HZQRP-O5OBQ-4HPBT-6DBLQ';  //使用在腾讯位置服务申请的key
    let referer = storage.getActivityDetail().name;   //调用插件的小程序的名称
    let startPoint = JSON.stringify({  //起点
      'name': '',
      'latitude': '',
      'longitude': ''
    });
    let endPoint = JSON.stringify({  //终点
      'name': '中国西部国际博览城',
      'latitude': 30,
      'longitude': 104
    });
    wx.navigateTo({
      url: 'plugin://routePlan/route-plan?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  /**
   *go2直播列表
   * **/
  go2LiveList11(e) {
    var appId = e.currentTarget.dataset.appid
    var linkmini = e.currentTarget.dataset.linkmini
    // appId="wx92d650b253f8f2e3"
    // linkmini="/pages/auction/index?tpid=1503020956"
    wx.navigateToMiniProgram({
      appId: appId,
      path: linkmini,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        console.log("跳转成功")
      },
      fail: function (error) {
        console.error(error)
        // wx.showToast({
        //   title: '请确定链接地址是否正确',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //  触发登陆在线
  triggerOnline() {
    var projectId = wx.getStorageSync('activityDetail').id
    var purchaserId = storage.getUserInfo().id
    ajax.get(`${API_URL}/backend/v1/statistics/addAudienceNum/${projectId}/${purchaserId}`)
  },
  //打开客服
  go2service() {
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
  //打开我的资料
  go2myself() {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/tabbar/me/me`
    })
  },
  go2miniWeb(e) {
    let id = null;
    util.isNullStr(e.currentTarget.dataset.id)
      ? (id = "")
      : (id = e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/rich-text/rich-text?id=${id}&title=${e.currentTarget.dataset.title}`,
    });
    // packagePurchaser/pages/purchaser/index/rich-text/rich-text
  },
  go2ExhibitorList() {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/tabbar/exhibition/exhibition`
    })
  },
  go2ProductList() {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/tabbar/exhibits/exhibits`
    })
  },
  go2StadiumNavigation(e) {
    var appId = e.currentTarget.dataset.appid
    var linkmini = e.currentTarget.dataset.linkmini
    wx.navigateToMiniProgram({
      appId: appId,
      path: linkmini,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        console.log("跳转成功")
      },
      fail: function (error) {
        console.error(error)
      }
    })
  },
  go2exhibitionIntroduce(e) {
    let id = null;
    util.isNullStr(e.currentTarget.dataset.id)
      ? (id = "")
      : (id = e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/rich-text/rich-text?id=${id}&title=${e.currentTarget.dataset.title}`,
    });
  },
  go2newList() {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/tabbar/exhibits/exhibits?tags=${this.data.newTag && this.data.newTag.id}`
    })
  },
  go2userRegister() {
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/register/register"
    })
  },
  go2postDemond() {
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand"
    })
  },
  filterNewTags() {
    var newTag = (this.data.productTypeList.filter(item => {
      return item.chinese == '新品试用'
    }))[0]
    this.setData({
      newTag
    })
    getCurrentPage1().setData({
      newTag
    })
  },
  getProductTypes() {
    (0, api.getProductType)({
      data: {
        src: 1,
        projectId: storage.getActivityDetail().id
      },
      method: 'POST',
      success: function (res) {
        const list = []
        res.data.result && res.data.result.map(item => {
          item.id = item.parent.id
          _self.data.isEn ? item.chinese = item.parent.english : item.chinese = item.parent.chinese;
          item.isChecked = false;
          item.english = item.parent.english
          item.subclass.map(childItem => {
            childItem.isChecked = false;
          });
          item.childList = item.subclass;
        })
        _self.setData({
          productTypeList: res.data.result
        })
        getCurrentPage1().setData({
          productTypeList: res.data.result
        })
        /*找到新品tag*/
        _self.filterNewTags()
      }
    });
  }
})
