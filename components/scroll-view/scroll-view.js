let api = require("../../utils/api"), constant = require("../../utils/constant"), i18n = require('../../i18n/i18n.js'), storage = require("../../utils/storage.js"), util = require("../../utils/util");
import phone from '../../utils/phone'
let _self = null
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    demandList: {
      type: Array,
      value: [],
      observer (newVal, oldVal, changePath) {
        if (!util.isNullArray(newVal)) {
          this.initDemandInterval()
        }
      }
    },
    supplierList: {
      type: Array,
      value: [],
      observer (newVal, oldVal, changePath) {
        if (!util.isNullArray(newVal)) {
          this.setData({
            langIsEn: i18n.isEn(),
            defaultExhibitorImg: constant.STATIC_DEFAULT_IMAGE_NAME.exhibitor
          })
          // this.initSupplierInterval()
        }
      }
    },
    scrollType: {
      type: Number,
      value: 1
    }
  },
  data: {
    // 这里是一些组件内部数据
    oneHeight: 0,
    allDemandHeight: 0,
    demandScrollTop: 0,
    supplierScrollTop: 0,
    demandInterval: null,
    supplierInterval: null,
    langIsEn: null,
    defaultExhibitorImg: constant.STATIC_DEFAULT_IMAGE_NAME.exhibitor
  },
  lifetimes: {
    // 组件所在页面的生命周期函数
    created: function () {
    },
  },
  methods: {
    initDemandInterval: function(e) {
      const _self = this
      if (!util.isNullObj(_self.data)) {
        const scrollNum = _self.data.demandScrollTop, oneHeight = 135 / 750 * wx.getSystemInfoSync().windowWidth, demandList = _self.data.demandList, allDemandHeight = oneHeight * (demandList.length - 6);
        if (scrollNum === allDemandHeight || scrollNum > allDemandHeight) {
          _self.setData({
            demandScrollTop: 0
          })
        } else {
          _self.setData({
            demandScrollTop: _self.data.demandScrollTop + 8
          })
        }
      }
      // setTimeout(_self.initDemandInterval.bind(this), 100)
    },
    goDetailPage: function(e) {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/exhibition/detail/detail?id=${e.currentTarget.dataset.id}`,
      })
    },
    initSupplierInterval: function(e) {
      const _self = this
      const scrollNum = _self.data.supplierScrollTop, oneHeight = 135 / 750 * wx.getSystemInfoSync().windowWidth, supplierList = _self.data.supplierList, allHeight = oneHeight * (supplierList.length - 6);
        if (scrollNum === allHeight || scrollNum > allHeight) {
          _self.setData({
            supplierScrollTop: 0
          })
        } else {
          _self.setData({
            supplierScrollTop: _self.data.supplierScrollTop + 10
          })
        }
        // setTimeout(_self.initSupplierInterval.bind(this), 1000)
    },
  }
})