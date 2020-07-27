import {getString} from "../../../../../locals/lang.js";
import {API_URL} from "../../../../../utils/constant";
import {ajaxGetProductType} from "../../../../../utils/api";
import {default_checkbox_checked, default_checkbox_no_chekced} from "../../../../../common/staticImageContants";

var app = getApp();
let _self = null;
let api = require("../../../../../utils/api");
let constant = require("../../../../../utils/constant");
let i18n = require("../../../../../i18n/i18n");
let storage = require("../../../../../utils/storage");
let util = require("../../../../../utils/util");
Component({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    productTypeList: [],
    default_checkbox_checked,
    default_checkbox_no_chekced,
    loading:true,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
  },
  methods: {
    setValues4Tree(values) {
      if (!values) {
        values = util.getCurrentPage1().data.tags
      }
      if (values && values.constructor == String) {
        values = values && values.split && values.split(",")
      }

      for (let i = 0; i < this.data.productTypeList.length; i++) {
        var parent = this.data.productTypeList[i]
        if (values && values.findIndex && values.findIndex(_item => _item == parent.id) >= 0) {
          this.data.productTypeList[i].isChecked = true
        }
        for (let j = 0; j < this.data.productTypeList[i].subclass.length; j++) {
          var child = this.data.productTypeList[i].subclass[j]
          if (values && values.findIndex && values.findIndex(_item => _item == child.id) >= 0) {
            this.data.productTypeList[i].subclass[j].isChecked = true
          }
        }
      }
      this.setData({
        productTypeList: this.data.productTypeList
      })
      return this.data.productTypeList
    },
    judgeIsChecked(item) {
      return this.properties &&
        this.properties.value &&
        this.properties.value.filter(item_ => item_ == item)[0]
    },
    walkProductType() {
      for (let i = 0; i < this.data.productTypeList.length; i++) {
        var parent = this.data.productTypeList[i]
        if (this.judgeIsChecked(parent)) {
          this.data.productTypeList[i].isChecked = true
        }
        for (let j = 0; j < this.data.productTypeList[i].subclass.length; j++) {
          var child = this.data.productTypeList[i].subclass[j]
          if (this.judgeIsChecked(child)) {
            this.data.productTypeList[i].subclass[j].isChecked = true
          }
        }
      }
      return this.data.productTypeList
    },
    walkProductTypeGetTags() {
      var tags = []
      for (let i = 0; i < this.data.productTypeList.length; i++) {
        var parent = this.data.productTypeList[i]
        if (this.judgeIsChecked(parent.id)) {
          tags.push(this.data.productTypeList[i].parent.id)
        }
        for (let j = 0; j < this.data.productTypeList[i].subclass.length; j++) {
          var child = this.data.productTypeList[i].subclass[j]
          if (this.judgeIsChecked(child.id)) {
            tags.push(this.data.productTypeList[i].subclass[j].id)
          }
        }
      }
      return tags
    },
    walkProductTypeGetTags2() {
      var tags = []
      for (let i = 0; i < this.data.productTypeList.length; i++) {
        var parent = this.data.productTypeList[i]
        if (parent && parent.isChecked) {
          tags.push(this.data.productTypeList[i].parent.id)
        }
        for (let j = 0; j < this.data.productTypeList[i].subclass.length; j++) {
          var child = this.data.productTypeList[i].subclass[j]
          if (child && child.isChecked) {
            tags.push(this.data.productTypeList[i].subclass[j].id)
          }
        }
      }
      return tags
    },
    getTags4post() {
      return this.becomeStr4post(this.walkProductTypeGetTags2())
    },
    async getProductType() {
      this.setData({
        loading:true
      })
      const res = await ajaxGetProductType({
        src: 2,
        projectId: storage.getActivityDetail().id
      })
      _self.setData({
        loading:false
      });
      res.result.map(item => {

        item.id = item.parent.id;
        _self.data.isEn ? item.chinese = item.parent.english : item.chinese = item.parent.chinese;
        item.isChecked = false;
        item.subclass.map(childItem => {
          childItem.isChecked = false;
        });
        item.childList = item.subclass;
        return item
      })
      _self.setData({
        productTypeList: res.result
      })
    },
    becomeStr4post(array_) {
      if (array_ && array_.constructor === Array) {
        return array_.join(',')
      }
      return ""
    },
    chooseTap: function (e) {
      let list = _self.data.productTypeList
      let item = list[e.currentTarget.dataset.index]
      item.isChecked = !item.isChecked
      item.childList.map(childItem => {
        childItem.isChecked = item.isChecked
      })

      _self.setData({
        productTypeList: list
      })
      _self.triggerEvent("changevalues", _self.becomeStr4post(
        _self.walkProductTypeGetTags2(list)
      ))
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
      _self.triggerEvent("changevalues", _self.becomeStr4post(
        _self.walkProductTypeGetTags2(list)
      ))
      _self.setData({
        productTypeList: list
      })
    },
  },
  pageLifetimes: {
    show() {

    }
  },
  lifetimes: {
    ready() {
      _self = this
      if (_self.data && _self.data.productTypeList.length <= 0) {
        _self.getProductType().then(res => {
          _self.setData({
            productTypeList: _self.setValues4Tree()
          })
          util.getCurrentPage1().setData({
            productTypeList: _self.setValues4Tree()
          })
        })
      } else {
        _self.setData({
          productTypeList: _self.setValues4Tree()
        })
        util.getCurrentPage1().setData({
          productTypeList: _self.setValues4Tree()
        })
      }
    },
  },
});
