/*
* 搜索+ 过滤
* */
import {getString} from "../../../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../../../utils/util";

var app = getApp();
let _self = null;
let api = require("../../../../../../utils/api");
let constant = require("../../../../../../utils/constant");
let i18n = require("../../../../../../i18n/i18n");
let storage = require("../../../../../../utils/storage");
let util = require("../../../../../../utils/util");

Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  lifetimes: {
    attached() {
      _self = this;
      this.setData({
        isEn: wx.getStorageSync('lang') == 'en',
        langTranslate: i18n.langTranslate(),
        str: {
          placeholder: getString('wp', 'app.search.placeholder'),
          filter: getString('wp', 'app.search.filter'),
        }
      })
      this.oldTagStr = '';
      this.oldSearchText = '';

      this.animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      })

      // this.loadFilter();
      // this.getProductType()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    filterViewVisible: false,
    filterData: null,
    staticImageUrl: constant.STATIC_IMAGE_URL,
    isShowSearch: false,
    productTypeList: [],
    tags: [],
    key: "",
    animationadd: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeKeyTap(e) {
      var key = e.detail.value;
      this.setData({
        key
      })
      getCurrentPage1().setData({
        key
      })
    },
    refreshTableData: function () {
      _self.setData({
        currentPage: 1
      });
      _self.loadFilter()
    },
    changetreevalues(e) {
      var values = e.detail
      this.setData({
        tags: values
      })
    },
    resetProductTypeList(productTypeList) {
      productTypeList.map((item, index) => {
        productTypeList[index].isChecked = false
        productTypeList[index].subclass.map((item2, index2) => {
          productTypeList[index] &&
          productTypeList[index].subclass &&
          (productTypeList[index].subclass[index2].isChecked = false)
        })
      })
      return productTypeList
    },
    getTagsStrForPost(array_) {
      var newArray = []
      var array_ = this.data && this.data.productTypeList
      array_.map(item => {
        if (item.parent.isChecked) {
          newArray.push(item.parent.id)
        }
        if (item && item.subclass) {
          item.subclass.map(item2 => {
            if (item2.isChecked) {
              newArray.push(item2.id)
            }
          })
        }
      })
      return newArray && newArray.join && newArray.join(",")
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
    submit() {
      this.setData({isShowSearch: false})
      this.animationOut()
      util.getCurrentPage1().setData({
        tags: this.data && this.data.tags
      }, () => {
        util.getCurrentPage1().filterTagsTriggerData && util.getCurrentPage1().filterTagsTriggerData()
      })
    },
    resetForm() {
      var compoment = this.selectComponent('#treeProductType')
      var productTypeList = compoment.data.productTypeList
      productTypeList = this.resetProductTypeList(productTypeList)
      compoment.setData({
        productTypeList: productTypeList
      })
      this.setData({
        tags: ""
      })
      getCurrentPage1().setData({
        tags: ""
      })
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
    getProductType() {
      (0, api.getProductType)({
        data: {
          src: 2,
          projectId: storage.getActivityDetail().id
        },
        method: 'POST',
        success: function (res) {
          const list = []
          res.data.result.map(item => {
            item.id = item.parent.id
            _self.data.isEn ? item.chinese = item.parent.english : item.chinese = item.parent.chinese;
            item.isChecked = false;
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
    showSearchTap() {
      _self.setData({
        isShowSearch: !_self.data.isShowSearch
      }, () => {
        if (_self.data.isShowSearch) {
          this.animationIn()
        } else {
          this.animationOut()
        }
        var productTypes = _self.selectComponent('#treeProductType').setValues4Tree(util.getCurrentPage1().data.tags)
        util.getCurrentPage1().setData({productTypes})
      })
    },
    loadFilter() {
      let url = app.globalData.host + `/api3/org/queryProductType`
      var that = this;
      let param = {
        src: '0', // 0 参展商,1采购商
        projectId: wx.getStorageSync('activityDetail').id
      }
      wx.request({
        data: param,
        url: url,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log('banner:', res)
          if (res.data.code == '0') {
            that.setData({
              filterData: res.data.result
            })
            console.log("过滤数据：", res.data)
          } else {
            console.log(res.data.message)
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    searchTextInput(e) {
      this.searchText = e.detail.value
      console.log("输入的值是：", this.searchText)
    },
    closeModal() {
      this.setData({isShowSearch: false},()=>{
        if (_self.data.isShowSearch) {
          this.animationIn()
        } else {
          this.animationOut()
        }
      })
    },
    bindconfirm() {
      /*var tags = [];
      for (let item of this.data.filterData) {
          for (let item2 of item.subclass) {
              if (item2.checked) {
                  tags.push(item2.id)
              }
          }
      }
      this.tagStr = tags.join(',')
      this.searchText = this.searchText || ''
      if (this.oldTagStr == this.tagStr && this.oldSearchText == this.searchText) {
      } else {
          this.triggerEvent('handleSearch', {
              key: this.searchText,
              tags: this.tagStr
          })
      }
      this.oldTagStr = this.tagStr
      this.oldSearchText = this.searchText*/
      util.getCurrentPage1().filterTagsTriggerData && util.getCurrentPage1().filterTagsTriggerData()
    },

    switchFilterView() {
      let flag = !this.data.filterViewVisible;
      this.setData({
        filterViewVisible: flag,
      })
      if (!flag) {
        this.bindconfirm()
      }
    },
    //全选与反全选
    selectall(e) {
      var arr = [];   //存放选中id的数组
      this.data.filterData[e.currentTarget.dataset.idx].parent.checked = e.detail.value.length > 0
      let arrr = this.data.filterData[e.currentTarget.dataset.idx].subclass
      for (let i = 0; i < arrr.length; i++) {
        arrr[i].checked = e.detail.value.length > 0
        if (arrr[i].checked == true) {
          // 全选获取选中的值
          arr = arr.concat(arrr[i].id.split(','));
        }
      }
      console.log('------:', arrr)
      this.setData({
        filterData: this.data.filterData,
        select_all: (!this.data.select_all),
        batchIds: arr
      })
      console.log("选中值为：", this.data.filterData)
    },
    selectItem(e) {
      console.log('woqu::', e)
      var child = this.data.filterData[e.currentTarget.dataset.idx].subclass;
      console.log(e.detail.value.length == child.length)
      var isSelectAll = e.detail.value.length == child.length
      this.data.filterData[e.currentTarget.dataset.idx].parent.checked = isSelectAll
      for (let i = 0; i < child.length; i++) {
        let flag = false;
        for (let j = 0; j < e.detail.value.length; j++) {
          if (child[i].id === e.detail.value[j]) {
            flag = true;
          }
        }
        child[i].checked = flag
      }
      this.setData({
        filterData: this.data.filterData
      })
    }
  }
})
