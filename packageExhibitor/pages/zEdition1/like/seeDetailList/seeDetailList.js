import storage from "../../../../../utils/storage";
import {ajax, mergeArray} from "../../../../../utils/util";
import {API_URL} from "../../../../../utils/constant";

Page({
  data: {
    type: "1",//1,3 1观众 3需求
    operation: 0,//0 点赞 1 收藏 3被点赞
    pagination: {
      pageNum: 1,
      pageSize: 5,
    },
    lists: [],
    isMore: true,
    height: wx.getSystemInfoSync().screenHeight
  },
  onLoad: function (options) {
    this.setData({
      type: options.type,
      operation: options.operation,
    }, () => {
      if (options.type == 1) {
        this.getGuanZhongList()
      }
      if (options.type == 3) {
        this.getDemondList()
      }
    })
  },
  onReachBottom() {
    if (this.data.type == 1) {
      this.getGuanZhongList()
    }
    if (this.data.type == 3) {
      this.getDemondList()
    }
  },
  async getGuanZhongList() {
    if (this.data.operation == 0) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 1, //1观众
        "passive": 0,
        "operation": 0,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    if (this.data.operation == 1) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 1, //1观众
        "passive": 0,
        "operation": 1,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    if (this.data.operation == 3) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 1, //1观众
        "passive": 1,
        "operation": 0,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    wx.showLoading()
    var result = await ajax.get(`${API_URL}/livecollect/list`, params)
    wx.hideLoading()
    var list = result.result.data || []
    var newList = []
    // 根据列表再去获取具体的信息
    for (let i = 0; i < list.length; i++) {
      var one = await ajax.get(`${API_URL}/purchaser/detail/${list[i].objectId}`).then(res => res.result)
      if (one) {
        newList.push({...list[i], ...one})
      }
    }

    console.log("===newList=====>", newList)
    if (list.length < this.data.pagination.pageSize) {
      var isMore = false
      this.data.pagination.pageSize = this.data.pagination.pageSize
    } else {
      var isMore = true
      this.data.pagination.pageSize = this.data.pagination.pageSize + 1
    }
    this.setData({
      isMore,
      lists: mergeArray(newList, this.data.lists),
      pagination: this.data.pagination
    })

  },
  async getDemondList() {
    if (this.data.operation == 0) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 3, //1观众
        "passive": 0,
        "operation": 0,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    if (this.data.operation == 1) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 3, //1观众
        "passive": 0,
        "operation": 1,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    if (this.data.operation == 3) {
      var params = {
        "projectId": storage.getActivityDetail().id,
        "type": 3, //1观众
        "passive": 1,
        "operation": 0,
        "userId": storage.getUserInfo().id,
        "pageNum": this.data.pagination.pageNum,
        "pageSize": this.data.pagination.pageSize,
      }
    }
    var result = await ajax.get(`${API_URL}/livecollect/list`, params)
    var list = result.result.data || []
    var newList = []
    for (let i = 0; i < list.length; i++) {
      var one = await ajax.get(`${API_URL}/demand/${list[i].objectId}`).then(res => res.result)
      if (one) {
        one.portrait = one.image1 || one.image2 || one.image3
        newList.push({...list[i], ...one})
      }
    }
    if (list.length < this.data.pagination.pageSize) {
      var isMore = false
      this.data.pagination.pageSize = this.data.pagination.pageSize
    } else {
      var isMore = true
      this.data.pagination.pageSize = this.data.pagination.pageSize + 1
    }

    this.setData({
      isMore,
      lists: mergeArray(newList, this.data.lists),
      pagination: this.data.pagination
    })

  },
});