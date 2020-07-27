import {icon_zp, icon_zs, myself_right, myself_yy} from "../../../../../common/staticImageContants";
import {API_URL} from "../../../../../utils/constant";
import storage from "../../../../../utils/storage";
import {ajax} from "../../../../../utils/util";

Page({
  data: {
    height: 0.01,
    myself_yy,
    myself_right,
    icon_zs,
    icon_zp,
    getGuanZhong_total: {
      zan: 0,
      collect: 0,
      zaned: 0,
    },
    getDemand_total: {
      zan: 0,
      collect: 0,
      zaned: 0,
    },
    userInfo:{},
  },
  onLoad: function (options) {
    this.setData({
      height: wx.getSystemInfoSync().screenHeight,
    })
    // this.getGuanZhong_total()
    // this.getDemand_total()
  },
  onShow(){
    this.getCount()
  },
  /*我点赞的观众*/
  async getGuanZhong_total() {
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
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, zan)
    this.data.getGuanZhong_total.zan = result1.result.total;
    var result2 = await ajax.get(`${API_URL}/livecollect/list`, collect)
    this.data.getGuanZhong_total.collect = result2.result.total;
    var result3 = await ajax.get(`${API_URL}/livecollect/list`, zaned)
    this.data.getGuanZhong_total.zaned = result3.result.total;
    this.setData({
      getGuanZhong_total: this.data.getGuanZhong_total
    })

  },
  async getDemand_total() {
    var zan = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 0,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collect = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 0,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var zaned = {
      "projectId": storage.getActivityDetail().id,
      "type": 3, //1观众
      "passive": 1,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, zan)
    this.data.getDemand_total.zan = result1.result.total;
    var result2 = await ajax.get(`${API_URL}/livecollect/list`, collect)
    this.data.getDemand_total.collect = result2.result.total;
    var result3 = await ajax.get(`${API_URL}/livecollect/list`, zaned)
    this.data.getDemand_total.zaned = result3.result.total;
    this.setData({
      getDemand_total: this.data.getDemand_total
    })
  },
  async getCount() {
    var userInfo = storage.getUserInfo()
    // ywmatch.coolgua.com:9998/api3/supplier/detail/001c8ab968324aa1bd699455a5607348
    var result = await ajax.get(`${API_URL}/supplier/detail/${userInfo.id}`)
    var result1 = result.result
    this.setData({
      userInfo: result1
    })

  }
});