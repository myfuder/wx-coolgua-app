// packagePurchaser/pages/newpurchaser/index.js
const app = getApp()
let api = require("../../utils/api");
let i18n = require("../../i18n/i18n");
let storage = require("../../utils/storage.js");
import { ajax, getCurrentPage1, getCurrentPageAndParams, logoutim, loginim} from "../../utils/util";
import {
  hot_white,
  home_bar_live,home_bar_caigou,home_bar_looknav,home_bar_shenzhen,
  home_globalshow,
} from "../../common/staticImageContants";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    home_globalshow,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    headers: [{ text: 'one', display: i18n.langTranslate()['采购需求'], width: 500, text_align: "left" }, { text: 'two', display: i18n.langTranslate()['采购商'], width: 186}],
    demandList:[
    ],
    live_list:{
      "0":{pageSize:1,data:[]},
      "1": { pageSize: 1, data: [] },
      "zhanshang": { pageSize: 4, data: [] },
      "2": { pageSize: 2, data: [] },
    },
    bannerList: [],
    lang: wx.getStorageSync("lang"),
    hot_white,
    loadLoginPop:true,
    loadFinish:false,
    exhibitList:[],
    ppqy:[],
    tbmx:[],
  },
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  goDetailPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}&live_type=${e.target.dataset.live_type}`,
    })
  },
  closepop: function () {
    this.setData({
      loadLoginPop: !this.data.loadLoginPop
    })
  },
  toDemand() {
    wx.navigateTo({
      url: '/packageExhibitor/pages/newedition/demand/demand',
    })
  },
  getListData: function () {
    let _self = this;
    (0, api.getPurchaserSuppliers)({
      query: {
        pageNum: 1,
        pageSize: 4,
        key: '',
        filterType:'0',
        projectId: storage.getActivityDetail().id,
        // tags: list && list.join(',') || []
        tags: []
      },
      isNullToken: true,
      method: 'POST',
      success: function (res) {
        _self.setData({
          loadLoginPop: false,
          exhibitList: res.data.result.data
        },()=>{
          app.globalData.isFirstLoadAPP = false
        })
      },
      complete(){
        _self.setData({
          loadLoginPop: false
        })
      }
    });
  },
  goDetailPage2: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/exhibition/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.id && wx.getStorageSync('role') == 'exhibitor') {
      wx.redirectTo({
        url: '/pages/indexExhibitor/indexExhibitor'
      })
      return false
    } 
    if (app.checkLoginReadyCallback){
      app.checkLoginReadyCallback(this)
    }else{
      app.checkLoginReadyCallback = (self) => {
        if (app.globalData.isFirstLoadAPP) {
          self.getListData()
        }
        app.editTabBar();
        console.log(self.data)
        self.setData({
          lang: wx.getStorageSync("lang"),
          langTranslate: i18n.langTranslate(),
          isEn: i18n.isEn(),
          scene: options.scene,
          menus: [
            {
              name: i18n.langTranslate()["现场直播"],
              image: home_bar_live,
              toPage: '/packagePurchaser/pages/purchaser/index/hot-video/classification-video/index',
            },
            {
              name: i18n.langTranslate()["发布需求"],
              image: home_bar_caigou,
              toPage: '/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand',
            },
            {
              name: i18n.langTranslate()["参观指引"],
              image: home_bar_looknav,
              toPage: '/packageExhibitor/pages/newedition/lookNav/lookNav',
            },
            {
              name: i18n.langTranslate()["深圳展"],
              image: home_bar_shenzhen,
              toPage: '',
            }
          ],
        })
        wx.setNavigationBarTitle({
          title: self.data.isEn ? storage.getActivityDetail().nameEn : storage.getActivityDetail().name,
        });
        self.initData()
        loginim()
      }

    }
  },
  async initData(){
    let _self = this;
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 10,
        type:4,
        types: '',
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        console.log(res)
        res && res.data &&
          res.data.result &&
          res.data.result.data.map((item, index) => {
            if (item.link === "ppqytjh") {
              _self.setData({
                ppqy: item.detailList
              });
            } else if (item.link === "tbmxdhzzdw"){
              _self.setData({
                tbmx: item.detailList
              });
            }
          });
      },
    });
    (0, api.getDemandList)({
      data: {
        pageNum: 1,
        pageSize: 50,
        projectId: storage.getActivityDetail().id,
        status: 1,
      },
      success: function (res) {
        _self.setData({
          demandList: res.data.result.data.map((item)=>{
            let company = _self.data.isEn ? item.companyEn:item.company
            var s = company.substr(0, 1)
            var e = company.substr(item.company.length - 1, item.company.length)
            return {
              one: _self.data.isEn ? item.purchasedGoodsNameEn||'--':item.purchasedGoodsName,
              two: s+'***'+e
            }
          }).slice(0,8),
        });
      },
    });
    this.getBanners()
    let liveList = this.data.live_list
    for (let key in liveList) {
      if(key == "zhanshang"){
        let res = await new Promise((resolve)=>{
          (0, api.getLiveList)({
            query: {
              id: storage.getActivityDetail().id
            },
            data: {
              pageNum: 1,
              pageSize: liveList[key].pageSize
            },
            success: function (res) {
              resolve(res)
            }
          });
        })
        liveList[key].data = res.data.result.data
      }
      else{
        let res = await this.getLiveList(key, liveList[key].pageSize);
        console.log(res)
        liveList[key].data = res?res.data:[]
      }
    }
    this.setData({
      live_list: liveList,
      loadFinish:true
    })
    console.log(this.data.loadFinish)
  },
  getBanners(){
    let _self = this;
    (0, api.getRotations)({
      success: function (res) {
        var images = res.data.result
        if (images.length > 4) {
          images = images && images.splice(0, 4)
        }
        _self.setData({
          bannerList: images
        })
      }
    });
  },
  intentMore:function(e){
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/index/hot-video/classification-video/index?type=' + e.target.dataset.type,
    })
  },
  switchLanguage: function (event) {
    var self = this
    if (this.data.lang != event.currentTarget.dataset.lang) {
      wx.showModal({
        title: self.data.langTranslate["提示"],
        content: self.data.langTranslate["确定要切换语言吗"],
        confirmText: self.data.langTranslate["确定"],
        cancelText: self.data.langTranslate["取消"],
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
    }
  },
  getLiveList(type, pageSize) {
    let _self = this
    return new Promise((resolve, reject) => {
      api.sponsorLiveList({
        method: 'post',
        data: {
          projectId: storage.getActivityDetail().id,
          type: type,
          pageNum: 1,
          pageSize: pageSize
        },
        success(res) {
          console.log(res)
          resolve(res.data.result);
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: storage.getActivityDetail().name,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})