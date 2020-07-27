import storage from "../../../../../../utils/storage";
import {ajax, mergeArray} from "../../../../../../utils/util";
import {API_URL} from "../../../../../../utils/constant";

Page({
  data: {
    type: "0",//0,2 1观众 3需求
    operation: 0,//0 点赞 1 收藏 3被点赞
    passive: 0,
    pagination: {
      pageNum: 1,
      pageSize: 5,
    },
    lists: [],
    isMore: true,
    height: wx.getSystemInfoSync().screenHeight
  },
  onLoad: function (options) {
    wx.showLoading({title: "加载中"})
    this.setData({
      passive:options.passive,
      type: options.type,
      operation: options.operation,
    }, () => {
      if (options.type == 0) {
        this.getGuanZhongList()
      }
      if (options.type == 2) {
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
    var params = {
      "projectId": storage.getActivityDetail().id,
      "type": this.data.type,
      "passive": this.data.passive,
      "operation":  this.data.operation,
      "userId": storage.getUserInfo().id,
      "pageNum": this.data.pagination.pageNum,
      "pageSize": this.data.pagination.pageSize,
    }
    var result = await ajax.get(`${API_URL}/livecollect/list`, params)

    var list = result.result.data || []
    var newList = []
    // 根据列表再去获取具体的信息
    for (let i = 0; i < list.length; i++) {
      // supplier/detail/001c8ab968324aa1bd699455a5607348
      var one = await ajax.get(`${API_URL}/supplier/detail/${list[i].objectId}`).then(res => res.result).then(item => {
        if (item) {
          item.coverImage = item && item.portrait
        }
        return item
      })
      if (one) {
        newList.push({...list[i], ...one})
      }
    }
    wx.hideLoading({title: "加载中"})
    // console.log("===newList=====>", newList)
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
    var params = {
      "projectId": storage.getActivityDetail().id,
      "type": this.data.type,
      "passive": this.data.passive,
      "operation":  this.data.operation,
      "userId": storage.getUserInfo().id,
      "pageNum": this.data.pagination.pageNum,
      "pageSize": this.data.pagination.pageSize,
    }
    var result = await ajax.get(`${API_URL}/livecollect/list`, params)

    var list = result.result.data || []
    var newList = []
    for (let i = 0; i < list.length; i++) {
      // exhibit/detail/865
      var one = await ajax.get(`${API_URL}/exhibit/detail/${list[i].objectId}`).then(res => res.result).then(item => {
        if(item){
          item.coverImage = item&&item.cover_image || item&&item.product_image1 || item&&item.product_image2
          return item
        }
      })
      if (one) {
        newList.push({...list[i], ...one})
      }
    }
    wx.hideLoading({title: "加载中"})
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