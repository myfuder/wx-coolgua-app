import {
  collect_button,
  collect_button_active,
  favirButtonImage, likeButton, likeButton_active,
  likeButtonImage,
  messageActiveButton, messageActiveButton_disbaled,
  phoneCallButtonImage,
  phoneCallButtonImage_disabled
} from "../../../common/staticImageContants";
const i18n = require('../../../i18n/i18n.js');
import {API_URL} from "../../../utils/constant";
import {ajax} from "../../../utils/api";
import {
  getCurrentPageAndParams,
  isInCollectList,
  isInLikeList, merrayLikeList,
  pushOneInCollectList,
  pushOneInLikeList, removeOneInCollectList,
  removeOneInLikeList
} from "../../../utils/util";

const storage = require('../../../utils/storage')
const api = require('../../../utils/api')

Component({
  properties: {
    online: {
      type: [Number, String]
    },
    type: {
      type: [Number, String]
    },
    src: {
      type: [Number, String]
    },
    userid: {
      type: [Number, String]
    },
    item: {
      type: Object,
      observer(item_) {
        var isLikedItem = isInLikeList(this.properties.type, this.properties.item.id)
        var isCollectedItem = isInCollectList(this.properties.type, this.properties.item.id)
        this.setData({
          isLikedItem: isLikedItem || {},
          isCollectedItem: isCollectedItem || {}
        })
      }
    },
    showLike: {
      type: Boolean,
      value: true
    },
    showCollect: {
      type: Boolean,
      value: true
    },
  },
  data: {
    isLikedItem: {},
    isCollectedItem: {},
    messageActiveButton,
    messageActiveButton_disbaled,
    likeButton,
    likeButton_active,
    collect_button_active,
    collect_button,
    phoneCallButtonImage,
    phoneCallButtonImage_disabled,
    likeButtonImage,
    favirButtonImage,
    likeId: "",
    contactList:[],
    popWindow:true
  },
  // attached: function () {
  //   this.gtesSuppliercontact()
  // },
  attached() {
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language,
      langIsEn: i18n.isEn(),
      langTranslate: i18n.langTranslate()
    })
  },
  methods: {
    gtesSuppliercontact(){
      var that = this;
      api.suppliercontact({
        query:{
          supplierId: that.properties.userid
        },
        success(res){
          if(res.data.code==0){
            that.setData({
              contactList:res.data.result.list,
              popWindow: false
            })
          }else{
            wx.showToast({
              title: res.data.message
            })
          }
        }
      })
    },
    closepop(){
      console.log("dasdadadadAd")
      this.setData({
        popWindow: true
      })
    },
    mesgClick() {
      var that = this;
      //如果没有登陆
      if (!storage.getUserInfo().id) {
        wx.showToast({title: "请先登陆", icon: "none", duration: 2000})
        setTimeout(() => {
          wx.navigateTo({
            url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
          })
        }, 500);
        return false
      }
      if (this.properties.item.online == 0) {
        wx.showToast({
          title: that.data.langTranslate['不在线'],
          icon: 'none'
        })
        return false
      }
      if(that.properties.type == 3){
        that.tomessage()
      }else{
        that.gtesSuppliercontact()
      }
      // that.setData({
      //   popWindow:false
      // })
    },
    tomessage(event){
      let data = {
        conversationID: 'C2C' + (event?event.currentTarget.dataset.id:this.properties.userId),
        type: 'C2C',
        toId: event?event.currentTarget.dataset.id:this.properties.userId,
        toName: this.properties.item.company,
        nick: this.properties.item.company
      }
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/im/chat/chat?data=' + JSON.stringify(data),
      })
    },
    async likeClick() {
      var self = this;
      let userInfo = wx.getStorageSync('userInfo')
      if (!userInfo || !userInfo.id) {
        wx.showToast({title: "请先登陆", icon: "none", duration: 2000})
        setTimeout(() => {
          wx.navigateTo({
            url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
          })
        }, 500);
        return false
      }
      let params = {
        userId: storage.getUserInfo().id,
        type: this.properties.type,
        src: this.properties.src,
        operation: 0,   //0 点赞 1 收藏,
        objectId: this.properties.item.id,
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
          var idIndex = list.findIndex(item => item.objectId == this.data.item.id)
          //查询到的list合并带localstage
          id = list[idIndex] && list[idIndex].id
          isLikedItem = list[idIndex]
          merrayLikeList(this.properties.type, list)
        }
        ajax.get(`${API_URL}/livecollect/del/${isLikedItem.id}`, params).then(res => {
          wx.hideLoading()
        })
        removeOneInLikeList(self.properties.type, this.data.isLikedItem.objectId)
        self.setData({
          isLikedItem: {}
        })
      } else {
        var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result.result)
        this.setData({
          isLikedItem: {
            id: id,
            objectId: self.properties.item.id,
          }
        })
        pushOneInLikeList(self.properties.type, {
          objectId: self.properties.item.id,
          id
        })
      }
    },
    async collectClick() {
      var self = this;
      let userInfo = wx.getStorageSync('userInfo')
      if (!userInfo || !userInfo.id) {
        wx.showToast({title: "请先登陆", icon: "none", duration: 2000})
        setTimeout(() => {
          wx.navigateTo({
            url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
          })
        }, 500);
        return false
      }
      var params = {
        userId: storage.getUserInfo().id,
        type: this.properties.type,
        src: this.properties.src,
        operation: 1,   //0 点赞 1 收藏,
        objectId: this.properties.item.id,
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
          var idIndex = list.findIndex(item => item.objectId == this.data.item.id)
          //查询到的list合并带localstage
          if (idIndex >= 0) {
            id = list[idIndex] && list[idIndex].id
            isCollectedItem = list[idIndex]
            merrayLikeList(this.properties.type, list)
          }
        }
        console.log("isCollectedItem.id",isCollectedItem,isCollectedItem.id)
        ajax.get(`${API_URL}/livecollect/del/${isCollectedItem.id}`, params)
        removeOneInCollectList(self.properties.type, self.properties.item.objectId)
        self.setData({
          isCollectedItem: {}
        })
      } else {
        var params = {
          userId: storage.getUserInfo().id,
          type: this.properties.type,
          src: this.properties.src,
          operation: 1,   //0 点赞 1 收藏,
          objectId: this.properties.item.id,
          projectId: storage.getActivityDetail().id
        }
        var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result.result)
        pushOneInCollectList(self.properties.type, {
          objectId: self.properties.item.id,
          id: id
        })
        console.log("收藏后return id", id)
        this.setData({
          isCollectedItem: {
            id: id,
            objectId: self.properties.item.id,
          }
        })
      }
    }
  },
});
