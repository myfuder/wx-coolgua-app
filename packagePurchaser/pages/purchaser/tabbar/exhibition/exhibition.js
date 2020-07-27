//index.js
//获取应用实例
import {
  default_checkbox_checked,
  default_checkbox_no_chekced,
  myself_filtrate_down,
  myself_filtrate_up
} from "../../../../../common/staticImageContants";

const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");

Page({
  data: {
    demo_data: [],
    demo_index: 0,
    demo_item:{},
    role:'0',
    default_checkbox_no_chekced,
    default_checkbox_checked,
    exhibitList: [],
    isShowSearch: false,
    totalPage: 1,
    currentPage: 1,
    key: '',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    productTypeList: [],
    langTranslate: {},
    isEn: false,
    tabbarShow: false,
    currentRole: 1,
    loadingPage: true,
    myself_filtrate_up,
    myself_filtrate_down,
    winheight: wx.getSystemInfoSync().screenHeight,
    animationadd: {},
  },
  toggle: function (e) {
    this.setData({
      demo_index: e.target.dataset.index,
      demo_item: e.target.dataset.item
    },()=>{
      _self.refreshTableData()
    })
  },
  toggleactive(e){
    console.log(e)
    this.setData({
      role: e.target.dataset.role
    }, () => {
      _self.refreshTableData()
    })
  },
  // 初始化数据
  initData: function () {
    this.refreshTableData();
    (0, api.getProductType)({
      data: {
        src: 1,
        projectId: storage.getActivityDetail().id
      },
      method: 'POST',
      success: function (res) {
        const list = []
        let data = res.data.result.map(item => {
          return {
            chinese: item.parent.chinese,
            english: item.parent.english,
            subclass: item.subclass.map(item => { return item.id })
          }
        })
        _self.setData({
          demo_data: [''].concat(data)
        })
        console.log(_self.data.demo_data)
      }
    });
  },
  refreshTableData: function () {
    _self.setData({
      currentPage: 1
    });
    _self.getListData()
  },
  getListData: function () {
    // const productTypeList = this.data.productTypeList, list = [];
    // productTypeList.map(item => {
    //   item.isChecked ? list.push(item.id) : ''
    //   item.childList.map(childItem => {
    //     childItem.isChecked ? list.push(childItem.id) : ''
    //   })
    // });
    let list = _self.data.demo_item;
    (0, api.getPurchaserSuppliers)({
      query: {
        pageNum: _self.data.currentPage,
        pageSize: 10,
        key: _self.data.key,
        projectId: storage.getActivityDetail().id,
        filterType: _self.data.role,
        tags: list.subclass && list.subclass.join(',') || []
      },
      isNullToken: true,
      method: 'POST',
      success: function (res) {
        res.data.result.data.map(item => {
          item.coverImage = item.portrait;
          item.name = item.company
        });
        _self.setData({
          loadingPage: false,
          exhibitList: res.data.result.data,
          totalPage: res.data.result.pages
        })
      }
    });
  },

  changeKeyTap: function (e) {
    _self.setData({
      key: e.detail.value,
      currentPage: 1
    })
    // _self.refreshTableData()
  },
  changePageCollect: function (e) {
    _self.getListData()
  },
  changePageTap: function (e) {
    console.log(e)
    _self.setData({
      currentPage: e.detail
    });
    _self.getListData();
    wx.pageScrollTo({scrollTop: 0})
  },
  chooseTap: function (e) {
    console.log(e)
    let list = _self.data.productTypeList
    let item = list[e.currentTarget.dataset.index]
    item.isChecked = !item.isChecked
    item.childList.map(childItem => {
      childItem.isChecked = item.isChecked
    })
    _self.setData({
      productTypeList: list
    })
    _self.refreshTableData()
  },
  chooseChildTap: function (e) {
    let list = _self.data.productTypeList
    let item = list[e.currentTarget.dataset.pindex]
    let childItem = item.childList[e.currentTarget.dataset.index]
    let isAllChecked = true
    childItem.isChecked = !childItem.isChecked
    item.childList.map(cItem => {
      if (!cItem.isChecked) {
        isAllChecked = false
      }
    })
    item.isChecked = isAllChecked
    _self.setData({
      productTypeList: list
    })
    _self.refreshTableData()
  },
  showSearchTap: function () {
    _self.setData({
      isShowSearch: !_self.data.isShowSearch
    }, () => {
      if (_self.data.isShowSearch) {
        this.animationIn()
      } else {
        this.animationOut()
      }
      this.getListData()
    })
  },
  onLoad: function () {
    
    app.editTabBar();    //显示自定义的底部导航
    _self = this;
    _self.initData();
    var userId = storage.getUserInfo().id
    if (userId == null || userId == undefined || userId == '') {
      this.setData({
        tabbarShow: false,
      })
    } else {
      this.setData({
        tabbarShow: true,
      })
    }
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    },()=>{
      wx.setNavigationBarTitle({
        title: this.data.langTranslate['展商列表'],
      });
    });

    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
  },
  onShow: function () {
    this.setData({
      winheight: wx.getSystemInfoSync().screenHeight
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 过滤弹出框
  closeFilterDialog() {
    this.setData({isShowSearch: false}, () => {
      if (_self.data.isShowSearch) {
        this.animationIn()
      } else {
        this.animationOut()
      }
    })
  },
  animationOut() {
    //先隐藏内容
    this.animation.translateX(300).step()
    this.setData({
      animationadd: this.animation.export()
    })
  },
  animationIn() {
    this.animation.translateX(0).step()
    this.setData({
      animationadd: this.animation.export()
    })
  },
})
