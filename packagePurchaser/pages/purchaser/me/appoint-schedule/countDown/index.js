// packagePurchaser/pages/purchaser/me/appoint-schedule/countDown/index.js
let i18n = require('../../../../../../i18n/i18n.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idx:{type:Number},
    countDown:{
      type:String,
      observer(avg) {
        clearInterval(this.countTimer)
        this.countTimer = null
        if (avg!=null){
          this.setCountTime()
        }
      }
    }
  },
  attached (){
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
  },
  detached (){

  },
  /**
   * 组件的初始数据
   */
  data: {
    currTime:'',
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
  },
  countTimer:null,
  /**
   * 组件的方法列表
   */
  methods: {
    setCountTime(){
      let self = this
      this.countTimer = setInterval(()=>{
        self.data.countDown--
        self.setData({
          currTime: self.nowTime2(self.properties.countDown)
        })
      },1000)
    },
    tixing(event) {
      if (!this.countTimer){
        let self = this
        var url = app.globalData.host
        wx.request({
          url: url + '/api3/schedule/appointmentreminder/' + self.data.idx,
          method: 'POST',
          data: {},
          success: res => {
            if (res.data.code == '0') {
              self.setData({
                countDown: self.nowTime2(res.data.result)
              }, () => { self.setCountTime()})
            }
          }
        })
      }
    },
    // 指定时间的倒计时
    nowTime2(time) {//时间函数 
      if (time) {
        var intDiff = time//获取数据中的时间戳 
        var day = 0, hour = 0, minute = 0, second = 0;
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        intDiff--;
        var str = hour + ':' + minute + ':' + second;
        return str
      }
      else {
        return null
      }

    },
  }
})
