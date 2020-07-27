// packageExhibitor/pages/zEdition1/components/bizComponents/product/index.js
import { getString } from "../../../../../../locals/lang.js";
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		value: {
			type: Array
			// type: Object
		}
  },

  /**
   * 组件的初始数据
   */
  data: {
		isEn:false,
    
	language:''
  },
	lifetimes: {
	    // 组件所在页面的生命周期函数
	    attached: function () {
			   // 判断语言类型
			   var language = wx.getStorageSync('lang')
			   this.setData({
			   	language:language
			   })
			   let lang = wx.getStorageSync('lang')
			   this.setData({
					isEn: lang == 'en',
					str: {
						delete: getString('wp', 'app.btn.delete'),
						edit: getString('wp', 'app.btn.edit'),
						productType: getString('wp', 'app.meinfo.room.productType'),
					},
			   })
		  },
	  },
  /**
   * 组件的方法列表
   */
  methods: {
    gotoEdit:function(event){
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/product/edit/index?id='+event.currentTarget.dataset.id,
      })
    },
	delete1:function(event){
		var that =this
		console.log(event.currentTarget.dataset.id)
		 console.log(event.currentTarget.dataset.index)
		var url = app.globalData.host + '/api3/exhibit/del/'+event.currentTarget.dataset.id;
		wx.request({
		  url: url,
		  method: 'GET',
		  header: {
		    'Content-Type': 'application/json'
		  },
		  success: function (res) {
			  console.log(res)
		    if (res.data.code=='0') {
				var tip = ''
				if(that.data.language!='en'){
					tip = '删除成功'
				}else{
					tip = 'delete success'
				}
				wx.showToast({
					title: tip,
					icon: 'none',
					duration: 1000
				})
				var index =event.currentTarget.dataset.index;
				var arr= that.data.value;
				arr.splice(index,1)
				that.setData({
				  value: arr,
				})
		    } else {
		     
		    }
		  },
		  fail: function (error) {
		    console.log(error)
		  }
		})
	}
  }
})
