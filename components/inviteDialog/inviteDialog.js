import {getCurrentPage1} from "../../utils/util";

const i18n = require("../../i18n/i18n");
const constant = require("../../utils/constant");
const api = require("../../utils/api");
const moment = require('../../common/moment.min')
Component({
  properties: {
    item: {
      type: Object,
      observer(newVal, oldVal, changedPath) {
        console.log("==  properties: {\n" +
          "    item: =====>", newVal)
        var date = moment(newVal.activityTimeBegin).format('YYYY-MM-DD')
        var startTime = moment(newVal.activityTimeBegin).format('HH:mm')
        var endTime = moment(newVal.activityTimeEnd).format('HH:mm')
        this.setData({
          date: moment(new Date()).format('YYYY-MM-DD'),
          // dayText: moment(new Date()).format('YYYY-MM-DD'),
          startTime: startTime,
          endTime: endTime,
          topTheme: newVal.top,
          remark: newVal.remark,
        })
      }
    }
  },
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    date: "",
    dayText: "",
    startTime: "",
    endTime: "",
    topTheme: "",
    remark: "",
  },
  methods: {
    cancelPopupTap() {
      this.setData({
        dialogHide: true
      })
      getCurrentPage1().setData({
        dialogHide: true
      })
      this.triggerEvent("closeDialog")
    },
    sureClick() {
      var _self = this;
      if (!this.validateInput()) {
        return
      }
      const id = this.properties.item.id;
      wx.showLoading();
      (0, api.readd)({
        query: {
          id: id,
          src: '1'
        },
        data: {
          activityTime: this.data.date,
          activityStart: this.data.startTime + ':00',
          activityEnd: this.data.endTime + ':00',
          remark: this.data.remark,
          top: this.data.topTheme
        },
        method: 'GET',
        isNullToken: true,
        success: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '邀约成功',
          })
          setTimeout(() => {
            _self.setData({
              dialogHide: true
            })
            getCurrentPage1().setData({
              dialogHide: true
            })
            getCurrentPage1().loadData && getCurrentPage1().loadData();
            _self.triggerEvent("closeDialog")
          }, 1000)
        }
      });
    },
    validateInput() {
      if (!this.data.topTheme) {
        this.toast("请填写主题")
        return false;
      } else if (!this.data.date) {
        this.toast("请填日期")
        return false
      } else if (!this.data.startTime) {
        this.toast("请填写开始时间")
        return false
      } else if (!this.data.endTime) {
        this.toast("请填写结束时间")
        return false
      }
      return true
    },
    toast(str) {
      wx.showToast({
        title: str,
        icon: 'none'
      })
    },
    changeRemark(e) {
      this.setData({
        remark: e.detail.value
      })
    },
    bindEndChange(e) {
      this.setData({
        endTime: e.detail.value
      })
      console.log("==  endTime: e.detail.value=====>",e.detail.value)
    },
    bindTimeChange(e) {
      this.setData({
        startTime: e.detail.value
      })
      console.log("=== startTime: e.detail.value====>", e.detail.value)
    },
    bindDateChange(e) {
      const date = e.detail.value.replace('-', '/')
      this.setData({
        date: e.detail.value,
      })
      console.log("== bindDateChange(e) {=====>", e.detail.value,)
    },
    changeTopTheme(e) {
      this.setData({
        topTheme: e.detail.value
      })
    },

  }
});
