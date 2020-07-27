import {
  collect_button,
  collect_button_active,
  favirButtonImage, likeButton, likeButton_active,
  likeButtonImage,
  messageActiveButton, messageActiveButton_disbaled,
  phoneCallButtonImage,
  phoneCallButtonImage_disabled
} from "../../../../../common/staticImageContants";
import {API_URL} from "../../../../../utils/constant";
import {
  ajax,
  isInCollectList,
  isInLikeList, merrayLikeList, pushOneInCollectList,
  pushOneInLikeList,
  removeOneInCollectList,
  removeOneInLikeList
} from "../../../../../utils/util";

const storage = require('../../../../../utils/storage')
const api = require('../../../../../utils/api');
const i18n = require('../../../../../i18n/i18n')
Component({
  attached() {
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
  },
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
    }
  },
  data: {
    isLikedItem: false,
    isCollectedItem: false,
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
  },
  methods: {
    mesgClick() {
      if (this.properties.item.online == 0) {
        wx.showToast({
          title: '不在线',
          icon: 'none'
        })
      } else {
        var that = this
        let data = {
          conversationID: 'C2C' + that.properties.userid,
          type: 'C2C',
          toId: that.properties.userid,
          toName: that.properties.item.company,
          nick: that.properties.item.company
        }
        wx.navigateTo({
          url: '/packageExhibitor/pages/zEdition1/im/chat/chat?data=' + JSON.stringify(data),
        })
      }
    },
    async likeClick() {
      var self = this;
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
        ajax.get(`${API_URL}/livecollect/del/${isLikedItem.id}`, params)
        removeOneInLikeList(self.properties.type, isLikedItem.objectId)
        self.setData({
          isLikedItem: {}
        })
      } else {
        var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => {
          return res.result
        })
        pushOneInLikeList(self.properties.type, {
          objectId: self.properties.item.id,
          id
        })
        self.setData({
          isLikedItem: {
            objectId: self.properties.item.id,
            id: id
          }
        })
      }
    },
    async collectClick() {
      var self = this;
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
        ajax.get(`${API_URL}/livecollect/del/${isCollectedItem.id}`, params)
        removeOneInCollectList(self.properties.type, self.data.isCollectedItem && self.data.isCollectedItem.id || self.properties.item.objectId)
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
        self.setData({
          isCollectedItem: {objectId: self.properties.item.id}
        })
        var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result)
        console.log("collect return id",id)
        pushOneInCollectList(self.properties.type, {
          objectId: id || self.properties.item.id,
          id: id
        })
        self.setData({
          isCollectedItem: {
            objectId: id || self.properties.item.id,
            id: id
          }
        })
      }
    }
  }
});
