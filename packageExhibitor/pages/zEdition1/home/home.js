// packageExhibitor/pages/zEdition1/home/home.js
import {getString} from "../../../../locals/lang.js";
import {
  menu_001,
  menu_002,
  menu_003, menu_004, menu_005, menu_006, menu_007,
  menu_008,
  menu_1,
  menu_2,
  menu_3,
  menu_4
} from "../../../../common/staticImageContants";
import {ajax, getCurrentPage1} from "../../../../utils/util";
import {API_URL, API_URL_V2} from "../../../../utils/constant";

const storage = require('../../../../utils/storage')
const constant = require('../../../../utils/constant')
var app = getApp();
const i18n = require('../../../../i18n/i18n')
Component({
  lifetimes: {
    attached() {
      this.setData({
        menus: [
          {
            url: '/packageExhibitor/pages/zEdition1/me/meInfo/index',
            title: getString('exhibitors_index', 'app.home.menus1'),
            unreadNum: 0
          }, {
            url: '/packageExhibitor/pages/zEdition1/ExhibitorsService/index',
            title: getString('exhibitors_index', 'app.home.menus2'),
            unreadNum: 0
          }, {
            url: '/packageExhibitor/pages/zEdition1/ExhibitorsService/activity/index',
            title: getString('exhibitors_index', 'app.home.menus3'),
            unreadNum: 0
          },
          // {
          //   url: '/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/index',
          //   title: getString('exhibitors_index', 'app.home.menus4'),
          //   unreadNum: 0
          // },
          {
            url: '/packageExhibitor/pages/zEdition1/me/myInvitation/index',
            title: getString('exhibitors_index', 'app.home.menus5'),
            unreadNum: 0
          }, {
            url: '/packageExhibitor/pages/zEdition1/me/msg/index',
            title: getString('exhibitors_index', 'app.home.menus6'),
            unreadNum: 0
          },
        ],
        switchTabStr: [
          getString('exhibitors_index', 'app.home.switchMenu1'),
          getString('exhibitors_index', 'app.home.switchMenu2')
        ],
        viewmore: getString('exhibitors_index', 'app.home.viewmore')
      })
      this.loadBanner()
      this.loadTab1()
      this.loadTab2()
      this.activityList()
      this.triggerOnline()
      wx.setStorageSync('needLoadUnread', true)
      this.loadUnredThread = setInterval(() => {
        console.log('再循环间测：', wx.getStorageSync('needLoadUnread'))
        if (wx.getStorageSync('needLoadUnread')) {
          this.loadUnread()
          // wx.setStorageSync('needLoadUnread', false)
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(this.loadUnredThread)
      }, 60 * 1000)
      this.getActivityLists()
    },
    detached() {
      clearInterval(this.loadUnredThread)
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        langTranslate: i18n.langTranslate(),
        isEn: i18n.isEn(),
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    stadiumNavigation: {},
    staticImageUrl: constant.STATIC_IMAGE_URL,
    loadingPage: true,
    bannerList: [],
    list1: [],
    list2: [],
    tab1PageNum: 1,
    tab2PageNum: 1,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    currentTabIndex: 0,
    dialogShow: false,
    unreadInviteNum: 0,
    unreadMsgNum: 0,
    isProgress: false,
    concurrentEvents: [],
    menu_1,
    menu_2,
    menu_3,
    menu_4,
    columns: [],
    traffic: {},
    navigation: {},//场馆导航
    exhibitionIntroduce: {},//展会介绍
    height: wx.getSystemInfoSync().screenHeight,
    liveColumsItem: {},
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    menu_001,
    menu_002,
    menu_003,
    menu_004,
    menu_005,
    menu_006,
    menu_007,
    menu_008
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reachBottom() {

    },
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
    handleHide() {
      this.setData({
        dialogShow: false
      })
    },
    handleShow(param) {
      console.log('参数是：', param)
      this.setData({
        dialogShow: true,
        dialogParam: param.detail
      })
    },
    switchTabClick(event) {
      this.setData({
        currentTabIndex: event.currentTarget.dataset.idx
      })
      if (event.currentTarget.dataset.idx == 0) {
        wx.showLoading({duration: 5 * 1000})
        this.loadTab1()
        return false
      }
      if (event.currentTarget.dataset.idx == 1) {
        wx.showLoading({duration: 5 * 1000})
        this.loadTab2()
        return false
      }
    },
    menuClick(event) {
      // debugger
      if (event.currentTarget.dataset.idx == 1) {
        return
      }
      wx.navigateTo({
        url: this.data.menus[event.currentTarget.dataset.idx].url,
      })
    },
    viewMoreClick() {
      // if(this.data.isProgress) {
      //   return;
      // } else {
      //   this.setData({
      //     isProgress:true
      //   })
      // }
      switch (parseInt(this.data.currentTabIndex)) {
        case 0:
          wx.navigateTo({
            url: '/packageExhibitor/pages/zEdition1/purchaser/list/index',
          })
          // this.setData({
          //   tab1PageNum:this.data.tab1PageNum+1
          // })
          // this.loadTab1()
          break;
        case 1:
          // this.setData({
          //   tab2PageNum:this.data.tab2PageNum+1
          // })
          // this.loadTab2()
          wx.navigateTo({
            url: '/packageExhibitor/pages/zEdition1/demand/list/index',
          })
          break;
        default:
          break;
      }
    },
    loadBanner() {
      var clientType
      let lang = wx.getStorageSync('lang')
      if (lang == 'en') {
        clientType = 2
      } else {
        clientType = 1
      }
      // clientType 移动端中文（小程序、H5）1,移动端英文（小程序、H5）2,PC端中文3、PC端英文 4；；；
      var projectId = wx.getStorageSync('activityDetail').id
      // type 首页 1,参展商页面 2,采购商页面 3
      var type = 1
      let url = app.globalData.host + `/api3/index/getRotations/${type}/${clientType}/${projectId}`
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log('banner:', res)
          if (res.data.code == '0') {
            var images=res.data.result
            if(images.length>4){
              images=images&&images.splice(0,4)
            }
            that.setData({
              loadingPage: false,
              bannerList: images
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
    //同期活动列表
    activityList() {
      var projectId = wx.getStorageSync('activityDetail').companyId
      var activityId = wx.getStorageSync('activityDetail').id;
      var companyId =storage.getActivityDetail().companyId
      let url = app.globalData.host + `/api3/column/getEvents/${projectId}/${activityId}?companyId=${companyId}&pageNum=1&pageSize=1`
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var concurrentEvents = []
          if (!res.data.result) {
            console.error("活动列表为空")
            return false
          }
          var concurrentEvents = res && res.data && res.data.result && res.data.result.detailList;
          if(concurrentEvents[0]){
            that.setData({
              loadingPage: false,
              concurrentEvents:[concurrentEvents[0]],
            });
            getCurrentPage1().setData({
              loadingPage: false,
              concurrentEvents:[concurrentEvents[0]]
            })
          }
        },
        fail() {
        }
      });
    },
    loadTab1() {
      var projectId = wx.getStorageSync('activityDetail').id
      var tag = wx.getStorageSync('userInfo').tags
      let url = app.globalData.host + `/api3/purchaser/getSupplierPurchasers?pageNum=${this.data.tab1PageNum}&pageSize=${10}&projectId=${projectId}&tags=${tag}`
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          console.log('banner:', res)
          if (res.data.code == '0') {
            let ll = res.data.result.data
            that.setData({
              list1: ll
            })
            getCurrentPage1().setData({
              list1: ll
            })
          } else {
            console.log(res.data.message)
          }
          that.setData({
            isProgress: false
          })
        },
        fail: function (error) {
          console.log(error)
          that.setData({
            isProgress: false
          })
        }
      })
    },
    loadTab2() {
      var supplierId = wx.getStorageSync('userInfo').id
      let url = app.globalData.host + `/api3/demand/list?pageNum=${this.data.tab2PageNum}&pageSize=${10}&projectId=${wx.getStorageSync('activityDetail').id}`
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading()
          console.log('banner:', res)
          if (res.data.code == '0') {
            let ll = res.data.result.data
            that.setData({
              list2: ll
            })
            getCurrentPage1().setData({
              list2: ll
            })
          } else {
            console.log(res.data.message)
          }
          that.setData({
            isProgress: false
          })
        },
        fail: function (error) {
          console.log(error)
          that.setData({
            isProgress: false
          })
        }
      })
    },
    loadUnread() {
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
          console.log(res)
          if (res.data.code == '0') {
            that.data.menus[4].unreadNum = res.data.result.invite
            // that.data.menus[5].unreadNum = res.data.result.msg
            that.setData({
              menus: that.data.menus
            })
            //新消息数量添加
            if (app.globalData.isSDKReady) {
              wx.$app.getConversationList().then(res => {
                if (res.code == 0) {
                  console.log(res.data.conversationList)
                  var unreadCount = 0
                  for (var i = 0; i < res.data.conversationList.length; i++) {
                    unreadCount = unreadCount + res.data.conversationList[i].unreadCount
                    that.data.menus[5].unreadNum = unreadCount
                    that.setData({
                      menus: that.data.menus
                    })
                  }
                }
              }).catch(err => {
                console.log(err)
              })
            }

          } else {

          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    go2postDemond() {
      getCurrentPage1().setData({
        tabIndex: 2
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
    async getActivityLists() {
      var result = await ajax.get(API_URL + `/column/getColumns`, {
        pageNum: 1,
        pageSize: 100,
        type: '',
        types: '1,2,5',
        projectId: storage.getActivityDetail().id
      })
      if (result.code != 0) {
        return false
      }
      var columns = result && result.result && result.result.data
      var trafic = columns && columns.filter && (columns.filter(item => item.title == '交通指南'))[0]
      var navigation = columns && columns.filter && (columns.filter(item => item.title == '场馆导航'))[0]
      var exhibitionIntroduce = columns && columns.filter && (columns.filter(item => item.title == '展会介绍'))[0]
      var stadiumNavigation = columns && columns.filter(item => item.title == '云上地展')[0]
      var liveColumsItem = columns && columns.filter(item => item.title == '直播活动')[0]
      getCurrentPage1().setData({
        columns: result && result.result && result.result.data,
        trafic,
        liveColumsItem,
        navigation,
        exhibitionIntroduce,
        stadiumNavigation
      })
      this.setData({
        columns: result && result.result && result.result.data,
        trafic,
        navigation,
        liveColumsItem,
        exhibitionIntroduce,
        stadiumNavigation
      })

    },
    go2traffic(e) {
      var item = e.currentTarget.dataset.item
      var id = item.id
      var title = item.title
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/index/rich-text/rich-text?id=${id}&title=${title}`,
      });
    },
    //论坛活动
    go2activityList() {
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/activity/activity?ismyself=false`,
      });
    },
    //  触发登陆在线
    triggerOnline() {
      var projectId = wx.getStorageSync('activityDetail').id
      var supplierId = storage.getUserInfo().id
      ajax.get(`${API_URL}/backend/v1/statistics/addSupplierNum/${projectId}/${supplierId}`)
    },
    go2activityDetail(e) {
      var item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/activityDetail/activityDetail?id=${item.tid}`
      })

    }
  }
})
