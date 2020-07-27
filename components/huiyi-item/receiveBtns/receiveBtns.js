/*我发起的按钮群*/
import {ajax, getCurrentPage1} from "../../../utils/util";

const moment = require('../../../common/moment.min');
var constant = require("../../../utils/constant");
var api = require("../../../utils/api");
const apiURL = constant.API_URL;
const storage = require("../../../utils/storage");
Component({
  properties: {
    item: {
      type: Object,
      observer(newVal, oldVal, changedPath) {
        var isBegin = false;
        var isEnd = false
        if (moment(newVal.activityTimeBegin).diff(new Date()) < 0) {
          isBegin = true
        } else {
          isBegin = false
        }

        //已经过期
        if (moment(newVal.activityTimeEnd).diff(new Date()) < 0) {
          isEnd = true
        } else {
          isEnd = false
        }

        // console.log("==newVal=====>", newVal)
        // console.log("=isBegin, isEnd======>", isBegin, isEnd)
        this.setData({
          isBegin, isEnd
        })
      }
    },
    //根据界面的status  不是后台  todo:后台的status有问题目前
    status: {
      type: [undefined, Boolean]
    }
  },
  data: {
    isBegin: false,
    dialogHide: true,
  },
  methods: {
    cancelSchechal() {
      var self = this;
      var id = this.properties.item.id;
      wx.showLoading();
      (0, api.cancelSchedule)({
        query: {
          id: id
        },
        isNullToken: true,
        success: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '取消成功',
          })
          setTimeout(() => {
            getCurrentPage1().loadData && getCurrentPage1().loadData()
          }, 500)
        }
      });
    },
    async rejectSchechal() {
      // + `/schedule/refuse/${e.query.id}`);
      wx.showLoading();
      await ajax.get(`/schedule/refuse/${this.properties.item.id}`)
      wx.hideLoading();
      wx.showToast({
        title: "拒绝成功"
      })
      setTimeout(() => {
        getCurrentPage1().loadData && getCurrentPage1().loadData()
      }, 1000)
    },
    go2video() {
      var that = this;
      var meetingid = this.properties.item.meetingId;
      var supplierid = this.properties.item.supplierId;
      var userType = storage.getRoleType();
      api.getInterMeetingPurchaser({
        method: 'GET',
        query: {
          meetingid: meetingid
        },
        success: (res) => {
          const nowTime = new Date()
          if (res.data.code == '0') {
            if (nowTime - this.tapTime < 1000) {
              return
            }
            const url = `/packageTencentCloud/pages/meeting/meeting?id=${res.data.result}&toID=${supplierid}`
            wx.navigateTo({
              url,
            })
          }
        }
      })
      return false
    },
    submitInvite() {
      var _self = this;
      const id = this.properties.item.id;
      wx.showLoading({});
      (0, api.confirmedSchedule)({
        query: {
          id: id
        },
        success: function (res) {
          wx.hideLoading({})
          wx.showToast({
            title: '操作成功',
          })
          setTimeout(() => {
            getCurrentPage1().loadData && getCurrentPage1().loadData()
          }, 1000)
        }
      });
    },
    repostInvite() {
      var item = this.properties.item;
      this.setData({
        dialogHide: false,
        Rreadd: item,
        topTheme: item.top,
        remark: item.remark,
        date: '',
        dayText: '',
        startTime: '',
        endTime: '',
        inviteSupplierId: item.supplierId,
      })
    },
    closeDialog() {
      this.setData({
        dialogHide: true,
      })
    },
    tixing() {
      const id = this.properties.item.id;
      wx.showLoading({duration: 1000});
      (0, api.reminder)({
        query: {
          id: id
        },
        isNullToken: true,
        success: function (res) {
          wx.hideLoading();

          setTimeout(() => {
            getCurrentPage1().loadData && getCurrentPage1().loadData()
          }, 1000)
        }
      });

      setTimeout(() => {
        wx.showToast({
          title: '提醒成功',
        })
      }, 1000)
    }

  }
});
