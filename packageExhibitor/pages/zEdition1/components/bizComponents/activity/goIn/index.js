// packageExhibitor/pages/zEdition1/components/bizComponents/bizComponents/personConnect/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
	dataList:[]
  },
	 onLoad: function (options) {
		var supplierId = wx.getStorageSync('userInfo').id
		var url = app.globalData.host
		wx.request({
			url: url + '/api3/activitypair/inviteslist/'+supplierId,
			method:"GET",
			data:{
				// supplierId:supplierId
			},
			success:res=>{
				console.log(res,'api3/activitypair/inviteslist')
				// if(res.data.code == '0'){
					this.setData({
						dataList:res.data.result
					})
				// }
			}
		})
		
	},
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
