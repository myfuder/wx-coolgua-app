import {ajax} from "../../utils/util";

const constant = require("../../utils/constant");
const api = require('../../utils/api')
const {dateStr4ios} = require("../../utils/util");
const storage = require('../../utils/storage');
const {API_URL} = require("../../utils/constant");

Page({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    query: "",
    height: wx.getSystemInfoSync().screenHeight,
    loadingData: false,
    status: 1,
    lists: [],
    type: 1,//1我发起 0我收到
  },
  onLoad: function (options) {
    var _self = this;
    this.setData({
      type: options.type, //我发起 我收到
      status: options.status,
    }, () => {
      this.loadData();
      this.settile()
    })
  },
  settile() {
    var title = ""
    var type = this.data.type == 0 ? '我收到' : '我发起'
    if (this.data.status == 0) {
      title = type + '已确认预约列表'
    }
    if (this.data.status == 2) {
      title = type + '待确认预约列表'
    }
    if (this.data.status == 5) {
      title = type + '被拒绝预约列表'
    }
    if (this.data.status == 6) {
      title = type + '已取消预约列表'
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },
  loadData() {
    var _self = this;
    if (this.data.type == '1') {
      _self.getSendTap()
      return this;
    }

    if (this.data.type == '0') {
      _self.getReceiveTap()
      return this;
    }
  },
  /*修改*/
  changeKeyTap(e) {
    this.setData({
      query: e.detail && e.detail.value && e.detail.value.trim()
    })
  },
  //我发起的
  getSendTap: async function () {
    var _self = this;
    // 我发起的邀约
    _self.setData({
      loadingData: true
    });
    var user = storage.getUserInfo();
    var roleType = storage.getRoleType();
    // EXHIBITOR: 2,
    //   PURCHASER: 3,
    if (roleType == constant.ROLE_TYPE.EXHIBITOR) {
      var result = await ajax.get(`${API_URL}/schedule/getSchedulePurchasers`, {
        pageNum: 1,
        pageSize: 200,
        supplierId: storage.getUserInfo().id,
        status: this.data.status,
        sponsor: 0
      })
      _self.setData({
        loadingData: false,
        lists: result.result.data
      })
    } else {
      var result = await ajax.get(`${API_URL}/schedule/getScheduleSuppliers`, {
        pageNum: 1,
        pageSize: 200,
        purchaserId: storage.getUserInfo().id,
        status: this.data.status,
        sponsor: 1
      })
      _self.setData({
        loadingData1: false,
        lists: result.result.data
      })

    }

  },
  //我收到的
  getReceiveTap: async function () {
    var _self = this;
    // 我收到的邀约
    _self.setData({loadingData1: true});
    var user = storage.getUserInfo();
    var roleType = storage.getRoleType();
    if (roleType == constant.ROLE_TYPE.EXHIBITOR) {
      // /api3/schedule/getSchedulePurchasers
      var result = await ajax.get(`${API_URL}/schedule/getSchedulePurchasers`, {
        pageNum: 1,
        pageSize: 200,
        supplierId: storage.getUserInfo().id,
        status: this.data.status,
        sponsor: 1
      })
      _self.setData({
        loadingData: false,
        lists: result.result.data
      })
    } else {
      var result = await ajax.get(`${API_URL}/schedule/getScheduleSuppliers`, {
        pageNum: 1,
        pageSize: 200,
        purchaserId: storage.getUserInfo().id,
        status: this.data.status,
        sponsor: 0
      })
      _self.setData({
        loadingData1: false,
        lists: result.result.data
      })
    }

  },
});