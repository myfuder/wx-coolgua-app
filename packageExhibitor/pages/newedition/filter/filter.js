// packageExhibitor/pages/newedition/filter/filter.js
// Component({
//   properties: {
//     isShowSearch:{
//       type:Boolean,//属性名
//     }
//   }
// })
import {filter_active} from "../../../../common/staticImageContants"
let api = require("../../../../utils/api"),i18n = require('../../../../i18n/i18n.js'), storage = require("../../../../utils/storage.js");
const app = getApp();
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    isShowSearch:{
      type:Boolean,
      value:false
    }
  },
  data: {
    filter_active,
    productTypeList:[],
    isEn: i18n.isEn()
  },
  /**
  * 页面加载完成执行
  */
  lifetimes:{
    ready(){
      this.getFilterData();
    }
  },
  methods:{
    getFilterData(){
      let _self = this;
      (0, api.getProductType)({
        data: {
          src: 1,
          projectId: storage.getActivityDetail().id
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == '0') {
            const list = []
            res.data.result.map(item => {
              item.id = item.parent.id
              _self.data.isEn ? item.name = item.parent.english : item.name = item.parent.chinese;
              item.isChecked = false;
              item.subclass.map(childItem => {
                childItem.isChecked = false;
                childItem.name = _self.data.isEn ?childItem.english:childItem.chinese;
              });
              item.childList = item.subclass;
            })
            _self.setData({
              productTypeList: res.data.result
            })
          }
        }
      });
    },
    //点击父级
    chooseTap:function(e){
      let index = e.currentTarget.dataset.index
      let arr = this.data.productTypeList
      arr[index].isChecked = !arr[index].isChecked;
      arr[index].childList.map(item => {
        item.isChecked=arr[index].isChecked
      })
      this.setData({
        productTypeList:arr
      })
    },
    //点击子项
    chooseChildTap:function(e){
      let {pindex,index} = e.currentTarget.dataset
      let arr = this.data.productTypeList
      arr[pindex].childList[index].isChecked = !arr[pindex].childList[index].isChecked;
      arr[pindex].isChecked = arr[pindex].childList.find(item => {
        return item.isChecked
      })
      this.setData({
        productTypeList:arr
      })
    },
    //重置
    resetFilterDialog:function(e){
      let arr = this.data.productTypeList;
      arr.map(item => {
        item.isChecked = false
        item.childList.map(child => {
          child.isChecked = false
        })
      })
      this.setData({
        productTypeList:arr
      })
    },
    close(){
      this.triggerEvent('close')

    },
    inbtn:function(e){    
    },
    //点击确认
    closeFilterDialog:function(e){
      let str = '';
      this.data.productTypeList.map(item => {
        item.childList.map(child => {
          if(child.isChecked){
            str += (child.id+',')
          }
        })
      })
      str = str?str.substring(0,str.length-1):''
      this.triggerEvent('comfire',str)
    },
    // close:function(e){
    //   this.triggerEvent('closeFilter','')
    // }
  }
  
})