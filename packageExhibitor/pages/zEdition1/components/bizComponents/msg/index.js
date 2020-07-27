// packageExhibitor/pages/zEdition1/components/bizComponents/demand/index.js
import {
  getString
} from "../../../../../../locals/lang.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: Object,
      observer(newVal) {
        console.log(newVal)
        let timeStr = this.fnTime(newVal.lastMessage.lastTime * 1000)
        let lastMsg;
        if (newVal.lastMessage.type === 'TIMImageElem') {
          lastMsg = '[图片]'
        } else if (newVal.lastMessage.type === 'TIMTextElem') {
          lastMsg = newVal.lastMessage.payload.text
        } else if (newVal.lastMessage.type === "TIMCustomElem") {
          lastMsg = '视频通话'
        } else if(newVal.lastMessage.type === "TIMFaceElem"){
          lastMsg = '[表情]'
        } else {
          lastMsg = '未知消息'
        }
        let isGroup = false
        if (newVal.type === 'GROUP') {
          isGroup = true
        }
        if (newVal.type == '@TIM#SYSTEM') {
          console.log('111')
          this.setData({
            time: timeStr,
            avatar: newVal.lastMessage.avatar,
            conversationName: newVal.lastMessage.fromAccount,
            lastSpeaker: newVal.lastMessage.fromAccount,
            lastMsg: newVal.lastMessage.messageForShow,
            unreadCount: newVal.unreadCount,
            isGroup
          })
        }else{
          this.setData({
            time: timeStr,
            avatar: newVal.type === 'GROUP' ? newVal.groupProfile.avatar : newVal.userProfile.avatar,
            conversationName: newVal.type === 'GROUP' ? (newVal.groupProfile.name || newVal.groupProfile.groupID) : (newVal.userProfile.nick || newVal.userProfile.userID),
            lastSpeaker: newVal.lastMessage.fromAccount,
            lastMsg,
            unreadCount: newVal.unreadCount,
            isGroup
          })
        }
      }
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        label: {
          productName: getString('wp', 'app.purchase.product.name'),
          num: getString('wp', 'app.purchase.product.num'),
          priceRang: getString('wp', 'app.purchase.product.priceRang'),
          properties: getString('wp', 'app.purchase.product.properties'),
          Industr: getString('wp', 'app.purchase.product.Industr'),
          detail: getString('wp', 'app.purchase.product.detail'),
          kind: getString('wp', 'app.company.kind'),
          intrest: getString('wp', 'app.intrest.kind'),
        }
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: '', // 最近一次聊天时间
    avatar: '', // 头像
    conversationName: '', // 会话名称 群：群名称  个人：昵称||id
    lastSpeaker: '', // 对方的名称
    lastMsg: '', // 最后一条消息
    unreadCount: '', // 未读数量
    isGroup: false // 是否群聊
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnTime(time) {
      let hour = new Date(time).getHours()
      let minutes = new Date(time).getMinutes()
      let timeStr = (hour < 9 ? '0' + hour : hour) + ':' + (minutes < 9 ? '0' + minutes : minutes)

      const twentyFourHours = 24 * 60 * 60 * 1000;
      const fortyEightHours = 24 * 60 * 60 * 1000 * 2;
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const today = `${year}-${month}-${day}`;
      const todayTime = new Date(today).getTime();
      const yesterdayTime = new Date(todayTime - twentyFourHours).getTime();
      const lastYesterdayTime = new Date(todayTime - fortyEightHours).getTime();

      if (time >= todayTime) {
        return '今天 ' + timeStr;
      } else if (time < todayTime && yesterdayTime <= time) {
        return '昨天 ' + timeStr;
      } else if (time < yesterdayTime && lastYesterdayTime <= time) {
        return '前天 ' + timeStr;
      } else {
        return today;
      }
    },
    detailClick: () => {

    }
  }
})