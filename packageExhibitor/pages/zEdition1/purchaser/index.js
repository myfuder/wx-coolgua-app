// packageExhibitor/pages/zEdition1/purchaser/index.js
import {getString} from "../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../utils/util";

const util = require('../../../../utils/util')
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  lifetimes: {
    attached() {
      this.value = {
        detail: {
          tags: '',
          key: ''
        }
      }
      var tag = wx.getStorageSync('userInfo').tags
      this.setData({
        isEn: wx.getStorageSync('lang') == 'en',
        str: {
          placeholder: getString('wp', 'app.search.placeholder'),
          filter: getString('wp', 'app.search.filter'),
        },
        loading: getString('exhibitors_index', 'app.home.loading'),
        tags: tag,
      })
      this.searchData();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    pages: 1,
    pageNumber: 1,
    list1: [],
    filterViewVisible: true,
    filterData: null,
    dialogShow: false,
    isProgressing: false,
    tags: "",
    isMore: true,
    key: "",
    height: wx.getSystemInfoSync().screenHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preClick() {
      if (this.data.pageNumber > 1) {
        this.loadData(-1)
      }
    },
    nextClick() {
      if (this.data.pageNumber < this.data.pages) {
        this.loadData(1)
      }
    },
    reachBottom(e) {
      this.searchData(e)
    },
    filterTagsTriggerData() {
      this.setData({
        list1: [],
        pageNumber: 1,
        isMore: true,
      }, () => {
        this.loadData()
      })
    },
    triggerSearch(e) {
      var tags = getCurrentPage1().data.tags || ""
      var key = getCurrentPage1().data.key || ''
      this.setData({
        tags,
        key,
        pageNumber: 1,
        isMore: true,
      }, () => {

        this.searchData()
      })

    },
    searchData() {
      this.loadData()
    },
    loadData(direction = 0) {
      var that = this;
      this.setData({
        isProgressing: true
      })
      var projectId = wx.getStorageSync('activityDetail').id
      var tags = util.getCurrentPage1().data.tags || ""
      var key = util.getCurrentPage1().data.key || ""
      if (tags && tags[0] == '[') {
        tags = tags.slice(1, tags.length - 1)
        tags = tags.split(',').map(item => item.trim())
        tags = tags.join(",")
      }
      let url = app.globalData.host + `/api3/purchaser/getSupplierPurchasers?pageNum=${this.data.pageNumber}&pageSize=${10}&projectId=${projectId}&tags=${tags}&key=${key}`

      if (!this.data.isMore) {
        return false
      }
      wx.showLoading({
        title: this.data.loading,
      })
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {

          console.log('banner:', res)
          if (res.data.code == '0') {
            // let ar = [...that.data.list1, ...res.data.result.data]
            let ar = res.data.result.data
            let num = that.data.pageNumber
            var isMore = true
            if (ar.length < 10) {
              isMore = false
            } else {
              num++
              isMore = true
            }
            var list1 = util.mergeArray(that.data.list1, ar)
            that.setData({
              list1,
              isMore,
              pages: res.data.result.pages,
              pageNumber: num,
            })
            getCurrentPage1().setData({
              list1,
              isMore,
              pages: res.data.result.pages,
              pageNumber: num,
            })
          } else {
            console.log(res.data.message)
          }
          that.setData({
            isProgressing: false
          })
          wx.hideLoading()
        },
        fail: function (error) {
          console.log(error)
          that.setData({
            isProgressing: false
          })
          wx.hideLoading()
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
  }
})
