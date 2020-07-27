//index.js
//获取应用实例
const app = getApp()
let _self = null;
import {ajax} from "../../../../../utils/util";
import {getString} from "../../../../../locals/lang.js";
import {API_URL} from "../../../../../utils/constant";
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitList: [],
    isShowSearch: false,
    totalPage: 1,
    currentPage: 1,
    key: '',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    productTypeList: [],
    langTranslate: {},
    isEn: false,
    currentRole: 1,
    totaltype:"",
    tags:""
  },
  // 初始化数据
  initData: function(role,type,passive,operation){
    this.refreshTableData(role,type,passive,operation);
    (0, api.getProductType)({
      data: {
        src: 1,
        projectId: storage.getActivityDetail().id
      },
      method: 'POST',
      success: function (res) {
        const list = []
        res.data.result.map(item => {
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
      }
    });
  },
  refreshTableData: function(role,type,passive,operation) {
    _self.setData({
      currentPage: 1
    });
    // _self.getListData(role,type,passive,operation)
    _self.getGuanZhong_total(this.data.totaltype)
  },
  /*我点赞的观众*/
  async getGuanZhong_total(totaltype) {
    var zan = {
      "projectId": storage.getActivityDetail().id,
      "type": 1, //1观众
      "passive": 0,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collect = {
      "projectId": storage.getActivityDetail().id,
      "type": 1, //1观众
      "passive": 0,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var zaned = {
      "projectId": storage.getActivityDetail().id,
      "type": 1, //1观众
      "passive": 1,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var zanExhibit = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 0,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collectExhibit = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 0,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var zanedExhibit = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 1,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    let params = {
      zan,collect,zaned,zanExhibit,collectExhibit,zanedExhibit
    }
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, params[totaltype]);
    _self.setData({
      exhibitList: result1.result.data,
      totalPage: result1.result.pages
    })
  },
  async getListData(role,type,passive,operation) {
    const productTypeList = this.data.productTypeList, list = [];
    productTypeList.map(item => {
      item.childList.map(childItem => {
        childItem.isChecked ? list.push(childItem.id) : ''
      })
    });
    var params = {
      projectId:storage.getActivityDetail().id,
      type:type,
      passive:passive,
      operation:operation,
      userId:storage.getUserInfo().id,
      pageNum: _self.data.currentPage,
      pageSize: 10,
    };
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, params);
    console.log(result1,"eeeeeeeeeeeeeeeeeeeee");
    _self.setData({
      exhibitList: result1.result.data,
      totalPage: result1.result.pages
    })
    // (0, api.collectList)({
    //   method: "GET",
    //   header: {
    //     'cookie': storage.getSessionId()
    //   },
    //   data: params,
    //   success: function (res) {
    //     console.log(res,"hhhhhhhhhhhhhh");
    //     _self.setData({
    //       exhibitList: res.data.result.data,
    //       totalPage: res.data.result.pages
    //     })
    //   }
    // });
  },
  //确认筛选
  comfire:function(tags){
    this.setData({
      isShowSearch:false,
      tags:tags.detail
    })
    // this.filterTagsTriggerData();

  },
  //关闭筛选
  close:function(tags){
    this.setData({
      isShowSearch:false,
    })
  },
  changeKeyTap: function(e) {
    _self.setData({
      key: e.detail.value,
      currentPage: 1
    })
    _self.refreshTableData()
  },
  changePageTap: function(e) {
    console.log(e)
    _self.setData({
      currentPage: e.detail
    });
    // _self.getListData()
    _self.getGuanZhong_total(_self.data.totaltype)
  },
  chooseTap: function(e) {
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
  chooseChildTap: function(e) {
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
  showSearchTap: function() {
    _self.setData({
      isShowSearch: !_self.data.isShowSearch
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.myinformation'),
    })
    // app.editTabBar();    //显示自定义的底部导航
    _self = this;
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
      totaltype: options.totaltype
    })
    _self.initData(options.totaltype,options.role,options.type,options.passive,options.operation);
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
