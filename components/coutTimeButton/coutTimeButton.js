// components/coutTimeButton/coutTimeButton.js
import {dateStr4ios} from "../../utils/util";

const moment = require('../../common/moment.min')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time: {
      type: String,
      observer() {
        clearInterval(this.__setInterval)
        this.setCountTime()
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    difftime: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countTime(endDate) {
      let m1 = new Date()
      let m2 = moment(endDate)
      var du = moment.duration(m2 - m1, 'ms'),
        hours = du.get('hours'),
        mins = du.get('minutes'),
        ss = du.get('seconds');
      if (hours <= 0 && mins <= 0 && ss <= 0) {
        return "已超时"
      } else {
        return  `${hours}:${mins}:${ss}`
      }
    },
    setCountTime() {
      var self = this

    /*  var start = Date.parse(dateStr4ios(this.data.time))
      // 当前时间的时间戳
      var timestamp = Date.parse(new Date()) / 1000
      // console.log(timestamp)
      var intDiff = start - timestamp;//获取数据中的时间戳
      // console.log(intDiff)
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        intDiff--;
        var str = hour + ':' + minute + ':' + second
        // console.log(str)
      } else {
        var str = "已结束！";
      }*/
      var str=this.countTime(self.data.time)
      self.setData({
        difftime: str
      })
      this.__setInterval = setInterval(() => {
        var str=this.countTime(self.data.time)
        self.setData({
          difftime: str
        })
      }, 1000)
    }
  }
})
