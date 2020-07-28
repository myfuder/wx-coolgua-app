//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
import {
  getCurrentPageAndParams,
  isInCollectList,
  isInLikeList, merrayLikeList,
  pushOneInCollectList,
  pushOneInLikeList, removeOneInCollectList,
  removeOneInLikeList
} from "../../../../../utils/util";
import {
  live_clean,
  live_clean_cancle,
  myself_left,
  likeButton,
  likeButton_active,
  collect_button,
  collect_button_active,
  share,
  hot
} from "../../../../../common/staticImageContants";
import { API_URL } from "../../../../../utils/constant";
import { ajax } from "../../../../../utils/api";
Page({
  data: { 
    id: '',
    exhibitList: [],
    exhibits: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    id: null,
    // 1直播/2视频
    type: null,
    // 展商id
    supplierId: null,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    open_detail_up: false,
    open_detail_lr: false,
    live_clean,
    live_clean_cancle,
    myself_left,
    likeButton,
    likeButton_active,
    collect_button,
    collect_button_active,
    share,
    hot,
    animation: '',
    animation2: '',
    ani: '',
    ani2: '',
    showMask: true,
    height: app.globalData.height,
    live_type: '',
    loadLoginPop:false,
    sponsorSupplierList:[],
    isLikedItem: {},
    isCollectedItem: {},
    liveDetail:{}
  },
  backpage: function () {
    wx.navigateBack()
  },
  onToggleControl() {
    this.setData({
      showMask: !this.data.showMask
    }, () => {
    })
  },
  onTaggleODUP: function () {
    this.setData({
      open_detail_up: !this.data.open_detail_up
    })
  },
  onTaggleODLR: function () {
    if (!this.data.animation) {
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      });
      this.setData({
        animation
      })
    }
    if (!this.data.animation2) {
      let animation2 = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      });
      this.setData({
        animation2
      })
    }
    if (this.data.open_detail_lr) {
      this.data.animation.translate(0, 0).step()
      this.data.animation2.opacity(1).step()
    } else {
      this.data.animation.translate(80, 0).step()
      this.data.animation2.opacity(0).step()
    }
    this.setData({
      ani: this.data.animation.export(),
      ani2: this.data.animation2.export(),
      open_detail_lr: !this.data.open_detail_lr
    })
  },
  // 初始化数据
  initData: function(){
    const exhibits = []
    for(let i = 0; i < 5;i++) {
      exhibits.push({
        id: i
      })
    };
    if (this.data.type === -1) {
      (0, api.getVideoDetail)({
        query: {
          id: _self.data.id
        },
        success: function (res) {
          _self.setData({
            detailInfo: res.data.result,
          })
        }
      }); 
    } else {
      if (this.data.live_type=="zhuban"){
        api.sponsorLiveDetail({
          query: {
            liveId: _self.data.id
          },
          data: { userId: storage.getUserInfo().id},
          success(response){
            console.log(response);
            var isLikedItem = isInLikeList(0, response.data.result.supplierId)
            var isCollectedItem = isInCollectList(0, response.data.result.supplierId)
            _self.setData({
              liveDetail: response.data.result,
              sponsorSupplierList: (response.data.result.sponsorSupplierList || []).map((item)=>{
                return { ...item, liked: item.likeCollectVO.likeId, collect: item.likeCollectVO.collectId}
              }),
              isLikedItem: isLikedItem || {},
              isCollectedItem: isCollectedItem || {}
            });
            
          }
        })
      }else{
        api.getLiveDetail({
          query: {
            id: _self.data.id
          },
          success: function (response) {
            _self.setData({
              liveDetail: response.data.result
            });
            (0, api.getSupplierDetail)({
              query: {
                id: response.data.result.supplierId,
              },
              method: 'GET',
              success: function (res) {
                const data = {
                  ...res.data.result,
                  hot: res.data.resultEx.hot,
                  name: res.data.result.company,
                  coverImage: res.data.result.portrait
                };
                _self.setData({
                  detailInfo: data,
                  exhibitList: [data],
                  supplierId: response.data.result.supplierId
                })
                _self.getExhibitsById()
              }
            });
          }
        })
      }
      
    }
    // _self.setData({
    //   exhibits: exhibits
    // })
  },
//   var list = await ajax.get(`${API_URL}/livecollect/list`, params).then(res => {
//     return res && res.result && res.result.data
//   })
//         var idIndex = list.findIndex(item => item.objectId == self.data.supplierId)
//         //查询到的list合并带localstage
//         id = list[idIndex] && list[idIndex].id
//         isLikedItem = list[idIndex]
//         merrayLikeList(0, list)
// }
//       ajax.get(`${API_URL}/livecollect/del/${isLikedItem.id}`, params).then(res => {
//     wx.hideLoading()
//   })
  sponsorSupplierList(e){
    // 
    let { id, isactive, operation, likecollectid} = e.currentTarget.dataset
    let params = {
      userId: storage.getUserInfo().id,
      type: 0,
      src: wx.getStorageSync('role') == 'exhibitor' ? 0 : 1,
      operation: operation,   //0 点赞 1 收藏,
      objectId: id,
      projectId: storage.getActivityDetail().id,
      pageNum: 0,
      pageSize: 998,
    }
    if (isactive && likecollectid){
      ajax.get(`${API_URL}/livecollect/del/${likecollectid}`, {}).then((res)=>{
        if(res.code==0){ 
          _self.data.sponsorSupplierList.map((item) => {
            if (item.supplierId == id) {
              operation == 0 ? (item.liked = false) : (item.collect = false)
            }
          })
          _self.setData({
            sponsorSupplierList :_self.data.sponsorSupplierList
          })
        }
      })

    }else{
      ajax.post(`${API_URL}/livecollect`, params).then((res) => {
        console.log(res)
        if (res.code == 0) {
          _self.data.sponsorSupplierList.map((item) => {
            if (item.supplierId == id) {
              operation == 0 ? (item.liked = true) : (item.collect = true)
              operation == 0 ? item.likeCollectVO.likeId = res.result : item.likeCollectVO.collectId = res.result
            }
          })
          _self.setData({
            sponsorSupplierList : _self.data.sponsorSupplierList
          })
        }
      })
    }
  },
  onStartEvent:function(){
    _self.setData({
      loadLoginPop: false,
    })
  },
  onFinishEvent:function(){
    (0, api.recommendLive)({
      query: {
        id: _self.data.supplierId
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        _self.setData({
          exhibitshot: res.data.result,
          loadLoginPop:true,
        })
      }
    })
  },
  getExhibitsById: function () {
    (0, api.getExhibitsById)({
      query: {
        id: _self.data.supplierId
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        _self.setData({
          exhibits: res.data.result.slice(0,4)
        })
      }
    })
  },
  closepop:function(){
    this.setData({
      loadLoginPop: !this.data.loadLoginPop
    })
  },
  goDetailPage: function(e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/exhibits/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  refreshLive(e){
    let { dataset } = e.currentTarget;
    this.setData({
      loadLoginPop: false
    })
    this.onLoad(dataset)
  },
  onLoad: function (e) {
    const id = e.id    
    const type = e.type
    _self = this
    this.setData({
      live_type: e.live_type ||"exhibitor",
      staticImageUrl: constant.STATIC_IMAGE_URL,
      type: parseInt(type),
      id: id,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    }, () => {
      console.log(this.data.live_type)
      _self.initData()
    })
  },
  
  async likeClick() {
    var self = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.id) {
      wx.showToast({ title: "请先登陆", icon: "none", duration: 2000 })
      setTimeout(() => {
        wx.navigateTo({
          url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
        })
      }, 500);
      return false
    }
    let params = {
      userId: storage.getUserInfo().id,
      type: 0,
      src: wx.getStorageSync('role') == 'exhibitor'?0:1,
      operation: 0,   //0 点赞 1 收藏,
      objectId: this.data.supplierId,
      projectId: storage.getActivityDetail().id,
      pageNum: 0,
      pageSize: 998,
      passive: 0,
    }
    if (this.data.isLikedItem.objectId) {
      var id = this.data.isLikedItem.id
      var isLikedItem = this.data.isLikedItem
      if (!id) {
        // 先获取id在删除
        var list = await ajax.get(`${API_URL}/livecollect/list`, params).then(res => {
          return res && res.result && res.result.data
        })
        var idIndex = list.findIndex(item => item.objectId == self.data.supplierId)
        //查询到的list合并带localstage
        id = list[idIndex] && list[idIndex].id
        isLikedItem = list[idIndex]
        merrayLikeList(0, list)
      }
      ajax.get(`${API_URL}/livecollect/del/${isLikedItem.id}`, params).then(res => {
        wx.hideLoading()
      })
      removeOneInLikeList(0, this.data.isLikedItem.objectId)
      self.setData({
        isLikedItem: {}
      })
    } else {
      var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result.result)
      this.setData({
        isLikedItem: {
          id: id,
          objectId: self.data.supplierId,
        }
      })
      pushOneInLikeList(0, {
        objectId: self.data.supplierId,
        id
      })
    }
  },
  async collectClick() {
    var self = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.id) {
      wx.showToast({ title: "请先登陆", icon: "none", duration: 2000 })
      setTimeout(() => {
        wx.navigateTo({
          url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
        })
      }, 500);
      return false
    }
    var params = {
      userId: storage.getUserInfo().id,
      type: 0,
      src: wx.getStorageSync('role') == 'exhibitor' ? 0 : 1,
      operation: 0,   //0 点赞 1 收藏,
      objectId: this.data.supplierId,
      projectId: storage.getActivityDetail().id,
      pageNum: 0,
      pageSize: 998,
      passive: 0,
    }
    if (this.data.isCollectedItem.objectId) {
      var id = this.data.isCollectedItem.id
      var isCollectedItem = this.data.isCollectedItem
      if (!id) {
        // 先获取id在删除
        var list = await ajax.get(`${API_URL}/livecollect/list`, params).then(res => {
          return res && res.result && res.result.data
        })
        var idIndex = list.findIndex(item => item.objectId == this.data.supplierId)
        //查询到的list合并带localstage
        if (idIndex >= 0) {
          id = list[idIndex] && list[idIndex].id
          isCollectedItem = list[idIndex]
          merrayLikeList(0, list)
        }
      }
      console.log("isCollectedItem.id", isCollectedItem, isCollectedItem.id)
      ajax.get(`${API_URL}/livecollect/del/${isCollectedItem.id}`, params)
      removeOneInCollectList(0, self.data.supplierId)
      self.setData({
        isCollectedItem: {}
      })
    } else {
      var params = {
        userId: storage.getUserInfo().id,
        type: 0,
        src: wx.getStorageSync('role') == 'exhibitor' ? 0 : 1,
        operation: 1,   //0 点赞 1 收藏,
        objectId: self.data.supplierId,
        projectId: storage.getActivityDetail().id
      }
      var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result.result)
      pushOneInCollectList(self.properties.type, {
        objectId: self.data.supplierId,
        id: id
      })
      console.log("收藏后return id", id)
      this.setData({
        isCollectedItem: {
          id: id,
          objectId: self.data.supplierId,
        }
      })
    }
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
