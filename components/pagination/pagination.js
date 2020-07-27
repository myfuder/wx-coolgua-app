let api = require("../../utils/api"), constant = require("../../utils/constant"), i18n = require('../../i18n/i18n.js'), storage = require("../../utils/storage.js"), util = require("../../utils/util");
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    },
    currentPage: {
      type: Number,
      value: 0,
      observer (newVal, oldVal, changePath) {
        console.log(newVal, oldVal, changePath)
        this.setData({
          tableCurrentPage: newVal,
          langTranslate: i18n.langTranslate()
        })
      }
    },
    totalPage: {
      type: Number,
      value: 0,
      observer (newVal, oldVal, changePath) {
        console.log(newVal, oldVal, changePath)
        this.setData({
          tableTotalPage: newVal,
          langTranslate: i18n.langTranslate()
        })
      }
    }
  },
  observers: {
    'currentPage': function(currentPage) {
      // 在 currentPage 或者 totalPage 被设置时，执行这个函数
      console.log(currentPage)
    }
  },
  lifetimes: {
    // 组件所在页面的生命周期函数
    created: function () {
      // this.setData({
      //   langTranslate: i18n.langTranslate()
      // })
    },
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    tableCurrentPage: 1,
    tableTotalPage: 0,
    langTranslate: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { },
    lastPageTap: function() {
      const tableCurrentPage = this.data.tableCurrentPage - 1
      if (tableCurrentPage > 0) {
        this.setData({
          tableCurrentPage: tableCurrentPage
        })
        this.triggerEvent('changePage', tableCurrentPage)
      }
    },
    nextPageTap: function() {
      const tableCurrentPage = this.data.tableCurrentPage + 1
      if (tableCurrentPage < this.data.totalPage || tableCurrentPage === this.data.totalPage) {
        this.setData({
          tableCurrentPage: tableCurrentPage
        })
        this.triggerEvent('changePage', tableCurrentPage)
      }
    }
  }
})