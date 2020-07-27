// packageExhibitor/pages/zEdition1/components/bizComponents/invitationDialog/index.js
import { getString } from "../../../../../../locals/lang.js";
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    param:{
      type: Object
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        label:{
          label1: getString('wp', 'app.invitaion.dialog.theme'),
          label2: getString('wp', 'app.invitaion.dialog.theme.placeholder'),
          label3: getString('wp', 'app.invitaion.dialog.date'),
          label4: getString('wp', 'app.invitaion.dialog.date.placeholder'),
          label5: getString('wp', 'app.invitaion.dialog.time.start'),
          label6: getString('wp', 'app.invitaion.dialog.time.placeholder'),
          label7: getString('wp', 'app.invitaion.dialog.time.end'),
          label8: getString('wp', 'app.invitaion.dialog.msg'),
          label9: getString('wp', 'app.invitaion.dialog.msg.placeholder'),
          label10: getString('wp', 'app.btn.cancel'),
          label11: getString('wp', 'app.btn.sure'),
        }
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    date:'',
    timeStart:'',
    timeEnd:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancleClick(){
      this.triggerEvent('handleHide', true)
    },
    inputChange(event){
      this.title = event.detail.value;
    },
    inputRemarkChange(event) {
      this.remark = event.detail.value;
    },
    validateInput(){
      if(!this.title) {
        this.toast("请填写标题")
        return false;
      } else if(!this.data.date) {
        this.toast("请填日期")
        return false
      } else if(!this.data.timeStart) {
        this.toast("请填写开始时间")
        return false
      } else if(!this.data.timeEnd) {
        this.toast("请填写结束时间")
        return false
      }
      return true
    },
    toast(str){
      wx.showToast({
        title: str,
        icon:'none'
      })
    },
    sureClick(){
      if(!this.validateInput()){
        return
      }
      var supplierId = wx.getStorageSync("userInfo").id
      console.log("传递过来得参数是：", this.data.param)
      let param = {
        activityEnd: this.data.timeEnd,
        activityStart: this.data.timeStart,
        activityTime: this.data.date,
        projectId: this.data.param.projectId,
        purchaserId: this.data.param.id,
        remark: this.remark||'',
        sponsor: '0', // 发起方(0:展商、1观众)',
        supplierId: supplierId,
        top:this.title,
      }
      wx.request({
        url: app.globalData.host + '/api3/schedule/addSupplierSchedule',
        data:  param,
        method: "post",
        success: (res)=> {
          if (res.data.code == '0') {
            this.triggerEvent('handleHide', true)
            wx.showToast({
              title: '预约成功',
            })
          } else {
            this.toast("请求失败")
          }
          console.log("结果是：", res)
        }
      })
     
    },
    bindDateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },
    bindTimeStartChange(e){
      this.setData({
        timeStart: e.detail.value
      })
    },
    bindTimeEndChange(e){
      this.setData({
        timeEnd: e.detail.value
      })
    }
  }
})
