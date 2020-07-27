//index.js
//获取应用实例
const app = getApp();
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitList: [],
    exhibits: [],
    demand:{},
    userInfo: {},
    id: null,
    purchasedGoodsName: '',
    purchasedCount: '',
    purchasedPrice: '',
    material: '',
    images: ['','','','',''],
    staticImageUrl: constant.staticImageUrl,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    // 发布需求是否正在提交
    submitting: false,
    productImage:[]
  },
  // 初始化数据
  initData: function(){
    _self.getDetailInfo()
  },
  goDetailPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail',
    })
  },
  returnPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  getDetailInfo: function() {
    (0, api.getDemandDetail)({
      query: {
        id: _self.data.id
      },
      success: function (res) {
        var detail=res.data.result
        const isEn = _self.data.isEn
        if (detail.status === '0') {
          isEn ? detail.statusStr = 'audit' : detail.statusStr = '待审核'
        } else if (detail.status === '1') {
          isEn ? detail.statusStr = 'approved' : detail.statusStr = '审核通过'
        } else if(detail.status === '2'){
          isEn ? detail.statusStr = 'stop' : detail.statusStr = '已停止'
        }else{
          isEn ? detail.statusStr = 'fail' : detail.statusStr = '审核失败'
        }
        var productImage=[]
        productImage.push(detail.image1,detail.image2,detail.image3,detail.image4)
        // const data = res.data.result, typeIds = data.types.split(','), allTypeIds = _self.data.exhibitList;
        // allTypeIds.map(item => {
        //   let isAllChecked = true
        //   item.childList.map(childItem => {
        //     typeIds.indexOf(childItem.id) !== -1 ? childItem.isChecked = true : ''
        //     if (childItem.isChecked === false) {
        //       isAllChecked = false
        //     }
        //   })
        //   item.isChecked = isAllChecked
        // })
        _self.setData({
          demand: detail,
          productImage:productImage
        })
      }
    });
  },  
  editTap: function(e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand?id=${e.currentTarget.dataset.id}`,
    })
  },
  stopDemand:function(e){
    (0, api.publishDemand)({
      data: {
        id: e.currentTarget.dataset.id,
        publish: '0'
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '停止发布成功'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      complete: function(res) {
        
      }
    })
  },
  //点赞收藏
  collect:function(event){
    var userId=storage.getUserInfo().id
    if(userId==null||userId==undefined||userId==''){
      wx.navigateTo({
        url: "/packagePurchaser/pages/purchaser/authorize/authorize",
      });
    }else{
      if(this.properties.exhItemType=='exhibition'){
        var type='0'
      }else if(this.properties.exhItemType=='exhibits'){
        var type='2'
      }
      if(event.currentTarget.dataset.online=='0'){
        (0, api.addCollect)({
          method: "POST",
          data: {
            userId: storage.getUserInfo().id,
            type: type,
            src:'1',
            operation: event.currentTarget.dataset.role,
            objectId: event.currentTarget.dataset.id,
            projectId: storage.getActivityDetail().id
          },
          header: {
            'cookie': storage.getSessionId()
          },
          success: function (e) {
            if(event.currentTarget.dataset.role=='0'){
              wx.showToast({
                title: '点赞成功',
                icon: 'none'
              })
            }else{
              wx.showToast({
                title: '收藏成功',
                icon: 'none'
              })
            }
            _self.getDetailInfo()
          }
        });
      }else{
        var params = {
          id: event.currentTarget.dataset.id
        };
        (0, api.delCollect)({
          method: "GET",
          header: {
            'cookie': storage.getSessionId()
          },
          query: params,
          success: function (e) {
            if(event.currentTarget.dataset.role=='0'){
              wx.showToast({
                title: '取消点赞成功',
                icon: 'none'
              })
            }else{
              wx.showToast({
                title: '取消收藏成功',
                icon: 'none'
              })
            }
            _self.getDetailInfo()
          }
        });
      }
    }
  },
  onLoad: function (options) {
    _self = this
    const id = options.id
    if (!util.isNullStr(id)) {
      _self.setData({
        id: id
      });
      // _self.getDetailInfo()
    }
    _self.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
    _self.initData()
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
