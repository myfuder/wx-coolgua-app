// packageExhibitor/pages/zEdition1/components/bizComponents/demand/index.js
import { getString } from "../../../../../../locals/lang.js";
import phone from "../../../../../../utils/phone.js"
let util = require("../../../../../../utils/util")
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Object
    },
	detail: {
	  type: String,
	  default:'no'
	},
	list: {
	  type: String,
	  default:''
	},
	itemType: {
		type: String,
		value: ''
	},
  },
  lifetimes: {
    attached() {
      let lang = wx.getStorageSync('lang')
      this.setData({
        isEn: lang == 'en',
        label: {
          invitaionSoon: getString('wp', 'app.connect.label.invitaionSoon'),
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
	  var that = this
	  this.setData({
	  		roomID: that.getroomid(),
	  })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isEn:false,
	roomID: '',
	template : '1v1',
	debugMode: false,
	cloudenv : 'PRO',
	evnArray : [
		{ value: 'PRO', title: 'PRO' },
		{ value: 'CCC', title: 'CCC' },
		{ value: 'DEV', title: 'DEV' },
		{ value: 'UAT', title: 'UAT' },
	],
	headerHeight   : app.globalData.headerHeight,
	statusBarHeight: app.globalData.statusBarHeight,
	userID:'',
	uhide: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
	   //点击切换隐藏和显示
	   openMore: function (event) { 
		var that = this;
		var toggleBtnVal = that.data.uhide;
		var itemId = event.currentTarget.dataset.id; 
		if (toggleBtnVal == itemId) {
		  that.setData({
			uhide: 0
		  })
		} else {
		  that.setData({
			uhide: itemId
		  })
		} 
	  },
		gotoPurchaserId(){
			if(this.data.list!=''){
				let item = this.data.value
							wx.navigateTo({
				  url: `/packageExhibitor/pages/zEdition1/demand/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
				})
							console.log("点击了需求详情")
			}
			
		},
    phoneCall(){
			console.log("")
			let purchaserId = wx.getStorageSync('userInfo').id
			let supplierId = this.data.value.purchaserId
      phone.call(supplierId, purchaserId)
    },
    detailClick(){
      console.log("this:", this)
      let item = this.data.value
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
      })
    },
    immediateAppointment(){
      this.triggerEvent('handleShow', this.data.value)
    },
    mesgClick(){
      if(this.data.value.online == 0) {
        wx.showToast({
          title: '不在线',
          icon: 'none'
        })
      }else{
		  var that = this
		  let data = {
		  	conversationID: 'C2C'+that.data.value.purchaserId,
		  	type: 'C2C',
		  			toId:that.data.value.purchaserId,
		  			toName:that.data.value.company,
		  			nick:that.data.value.company
		  }
		  console.log(data)
		  wx.navigateTo({
		  	url: '/packageExhibitor/pages/zEdition1/im/chat/chat?data=' + JSON.stringify(data),
		  })
	  }
    },
	getroomid(){
		var len = 9;
		var chars = '0123456789';
		var maxPos = chars.length;
		var pwd = '';
		for (var i = 0; i < len; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd
	},
    videoClick(){
      if(this.data.value.online == 0) {
        wx.showToast({
          title: '不在线',
          icon: 'none'
        })
      }else{
				// 统计需求
				var wxUrl = app.globalData.host
				var projectId = wx.getStorageSync('activityDetail').id
				wx.request({
					url:wxUrl + '/api3/backend/v1/statistics/addInstantMessageNum/'+ projectId + '?type=video',
					method:"GET",
					data:{},
					header: {
					  'Content-Type': 'application/json'
					},
					success:res=>{
						console.log(res,'api3/backend/v1/statistics/addInstantMessageNum')
					}
				})
				
				
		  const roomID  = this.data.roomID
		  console.log(this.data.roomID)
		  const nowTime = new Date()
		  if (nowTime - this.tapTime < 1000) {
		  			  return
		  }
		  if (!roomID) {
		  			  wx.showToast({
		  				  title   : '请输入房间号',
		  				  icon    : 'none',
		  				  duration: 2000,
		  			  })
		  			  return
		  }
		  if (/^\d*$/.test(roomID) === false) {
		  			  wx.showToast({
		  				  title   : '房间号只能为数字',
		  				  icon    : 'none',
		  				  duration: 2000,
		  			  })
		  			  return
		  }
		  if (roomID > 4294967295 || roomID < 1) {
		  			  wx.showToast({
		  				  title   : '房间号取值范围为 1~4294967295',
		  				  icon    : 'none',
		  				  duration: 2000,
		  			  })
		  			  return
		  }
		  //需求发送视频请求
		  const _this = this 
		  var template=[]
			template.push(app.globalData.templateId)
			wx.requestSubscribeMessage({
			tmplIds: template,
			success (res) {
				console.log(res,'yue')
				if(res[app.globalData.templateId]=='accept'){
					wx.login({
					success (data) {
						if (data.code) {
							if(util.getChairLength(_this.data.value.company)>20){
								var company= _this.data.value.company.substring(0,20)
							}else{
								var company=_this.data.value.company
							}	
							wx.request({
								method: "POST",
									url: app.globalData.host + '/api3/wx/sendMsg',
									data: {
									page: '/packageTencentCloud/pages/meeting/meeting?id='+_this.data.roomID+'&toID='+_this.data.value.id,
									applyTime: util.formatDateH(new Date()),
									sponsor: wx.getStorageSync('userInfo').contact,
									company: company,
									code: data.code,
									templateId: app.globalData.templateId,
									miniprogramState:'formal'
								},
								success: function () {
								
								}
							});
						} else {
						console.log('登录失败！' + res)
						}
					}
					})
				}
			}
		})
		 console.log(_this.data.value)
		 const url = `/packageTencentCloud/pages/meeting/meeting?id=${_this.data.roomID}&toID=${_this.data.value.purchaserId}`
		 wx.navigateTo({
			url: url,
		 })
		 // this.setData({ 'tapTime': nowTime })
	
	  }
    },
	enterRoomID: function(event) {
		  // console.log('index enterRoomID', event)
		  this.setData({
			  roomID: event.detail.value,
		  })
	},
	selectTemplate: function(event) {
		  console.log('index selectTemplate', event)
		  this.setData({
			  template: event.detail.value,
		  })
	},
	switchDebugMode: function(event) {
		  console.log('index switchDebugMode', event)
		  this.setData({
			  debugMode: event.detail.value,
		  })
	},
	selectEnv: function(event) {
		  console.log('index switchDebugMode', event)
		  this.setData({
			  cloudenv: event.detail.value,
		  })
	},
	//点击图片查看大图
	wxParseImgTap:function(event) {
		var that = this;
		//点击详情页图片查看大图，列表页跳转详情页
		if(that.data.itemType=='detail'){
			var nowImgUrl = event.target.dataset.src;
			var imageUrls=[]
			imageUrls.push(nowImgUrl)
			var tagFrom = event.target.dataset.from;
			console.log(nowImgUrl,imageUrls)
			if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
				wx.previewImage({
					current: nowImgUrl, // 当前显示图片的http链接
					urls: imageUrls // 需要预览的图片http链接列表
				})
			}
		}else{
			let item = this.data.value
			wx.navigateTo({
        		url: `/packageExhibitor/pages/zEdition1/demand/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
      		})
			// let item = this.data.value
			// wx.navigateTo({
			// 	// url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
			// 	url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?purchaserId=${item.id}&projectId=${item.projectId}`,
			// })
		}
		console.log(that.data.itemType)
	},
  }
})

