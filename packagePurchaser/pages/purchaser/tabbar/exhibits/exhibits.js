//index.js
//获取应用实例
import {getCurrentPage1} from "../../../../../utils/util";
import {
  default_checkbox_checked,
  default_checkbox_no_chekced,
  myself_filtrate_down,
  myself_filtrate_up
} from "../../../../../common/staticImageContants";

const app = getApp();
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {

    demo_data:[
    ],
    demo_index:0,
    demo_item:{},
    exhibitList: [],
    isShowSearch: false,
    totalPage: 1,
    currentPage: 1,
    key: '',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    productTypeList: [],
    langTranslate: {},
    isEn: false,
    loadingPage: false,
    sceneTags: '', //路径过来的tags
    myself_filtrate_up,
    myself_filtrate_down,
    default_checkbox_no_chekced,
    default_checkbox_checked,
    winheight: wx.getSystemInfoSync().screenHeight - 200,
    animationadd: {},
  },
  toggle:function(e){
    this.setData({
      demo_index: e.target.dataset.index,
      demo_item: e.target.dataset.item
    }, () => {
      _self.refreshTableData()
    })
  },
  // 初始化数据
  initData: function () {
    var self = this;
    this.wackProductType2setValues(this.data.sceneTags);
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
      }
    });
  },
  isInArray(id, array) {
    if (array && array.constructor == String) {
      array = array.split(',')
    }
    return array && array.findIndex(item => item == id) >= 0
  },
  wackProductType2setValues(tags) {
    for (let i = 0; i < this.data.productTypeList.length; i++) {
      var item1 = this.data.productTypeList[i]
      this.data.productTypeList[i].isChecked = this.isInArray(item1.id, this.data.sceneTags)
      for (let j = 0; j < this.data.productTypeList[i].subclass.length; j++) {
        var item2 = this.data.productTypeList[i].subclass[j]
        this.data.productTypeList[i].subclass[j].isChecked = this.isInArray(item2.id, this.data.sceneTags)
      }
    }
    this.setData({
      productTypeList: this.data.productTypeList
    })
    getCurrentPage1().setData({
      productTypeList: this.data.productTypeList
    })
    return this.data.productTypeList
  },
  refreshTableData: function () {
    _self.setData({
      currentPage: 1
    });
    _self.getListData()
  },
  getListData: function (e) {
    // let productTypeList = this.data.productTypeList, list = [];
    // productTypeList.map(item => {
    //   item.isChecked ? list.push(item.id) : ''
    //   item.childList.map(childItem => {
    //     childItem.isChecked ? list.push(childItem.id) : ''
    //   })
    // });
    // if (productTypeList.length == 0) {
    //   list = this.data.sceneTags && this.data.sceneTags.split(',')
    // }
    // console.log("   tags: list && list.join(',')", list, list && list.join(','));
    let list = _self.data.demo_item;
    (0, api.getPurchaserExhibits)({
      data: {
        pageNum: _self.data.currentPage,
        pageSize: 10,
        key: _self.data.key,
        projectId: storage.getActivityDetail().id,
        tags: list.subclass && list.subclass.join(',') || []
      },
      success: function (res) {
        _self.setData({
          loadingPage: false,
          exhibitList: res.data.result.data,
          totalPage: res.data.result.pages
        })
      }
    });
  },
  changePageCollect: function (e) {
    _self.getListData()
  },
  changeKeyTap: function (e) {
    _self.setData({
      key: e.detail.value,
      currentPage: 1
    });
    // _self.refreshTableData();

  },
  changePageTap: function (e) {
    console.log(e)
    _self.setData({
      currentPage: e.detail
    });
    _self.getListData();
    wx.pageScrollTo({scrollTop: 0});
  },
  chooseTap: function (e) {
    console.log(e)
    let list = _self.data.productTypeList
    let item = list[e.currentTarget.dataset.index]
    item.isChecked = !item.isChecked
    item.childList.map(childItem => {
      childItem.isChecked = item.isChecked
    });
    _self.setData({
      productTypeList: list
    });
    _self.refreshTableData();
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
    })
    this.getListData()
  },
  onLoad: function (options) {
    this.setData({
      loadingPage: true,
      sceneTags: options.tags
    })
    app.editTabBar();    //显示自定义的底部导航
    _self = this;
    _self.initData();
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    },()=>{
      wx.setNavigationBarTitle({
        title: this.data.langTranslate['展品列表'],
      });
    })

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
