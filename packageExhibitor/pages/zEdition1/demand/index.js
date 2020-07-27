// packageExhibitor/pages/zEdition1/demand/index.js
import {getString} from "../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../utils/util";

let self = this
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  lifetimes: {
    attached() {
      self = this
      this.value = {
        detail: {
          tags: '',
          key: ''
        }
      }
      this.setData({
        str: {
          placeholder: getString('wp', 'app.search.placeholder'),
          filter: getString('wp', 'app.search.filter'),
        },
        loading: getString('exhibitors_index', 'app.home.loading')
      })
      var tag = wx.getStorageSync('userInfo').tags
      this.searchData({
        detail: {
          tags: tag,
          key: ''
        }
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    pages: 1,
    pageNumber: 1,
    list2: [],
    dialogShow: false,
    isProgressing: false,
    tags: "",
    key: "",
    isMore: true,
    height: wx.getSystemInfoSync().screenHeight
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
    reachBottom() {
      // if(this.pageNumber<= this.pages) {
      //   this.pageNumber++
      //   this.loadData()
      //   console.log("到达了底部");
      // }
      this.setData({
        tags: getCurrentPage1().data.tags || "",
        key: getCurrentPage1().data.key || "",
      }, () => {
        this.loadData()
      })
    },
    filterTagsTriggerData() {
      self.setData({
        list2: [],
        pageNumber: 1,
        isMore: true,
      },()=>  self.loadData())

    },
    searchData(value) {
      this.setData({
        list2: []
      })
      this.value = value
      this.setData({
        pageNumber: 1
      })
      this.loadData()

    },
    loadData(direction = 0) {
      var projectId = wx.getStorageSync('activityDetail').id
      let num = this.data.pageNumber
      var tags = getCurrentPage1().data.tags || ""
      var key = getCurrentPage1().data.key || ""
      /*  if (direction == -1) {
            num--
        } else if (direction == 1) {
            num = num + 1
        }*/
      if (!this.data.isMore) {
        console.log("=====需求 我也是有底线的===>",)
        return false
      }
      var l = `/api3/demand/list?pageNum=${num}&pageSize=${10}&projectId=${projectId}&demandType=${tags}&demandName=${key}`
      let url = app.globalData.host + l
      var that = this;
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
            that.setData({
              list2: []
            })
            // let ar = [...that.data.list2, ...res.data.result.data]
            let ar = res.data.result.data
            let pageNumber = that.data.num
            var isMore = true
            if (ar.length < 10) {
              pageNumber = pageNumber
              isMore = false
            } else {
              pageNumber = pageNumber + 1
              isMore = true
            }
            console.log("===isMore=====>", isMore)
            that.setData({
              list2: ar,
              pages: res.data.result.pages,
              pageNumber,
              isMore
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
