//index.js
//获取应用实例
const app = getApp();
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitList: [{
      id: 1
    }],
    exhibits: [],
    demandList: [],
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    staticImageUrl:constant.STATIC_IMAGE_URL
  },
  // 初始化数据
  initData: function(){
    const exhibits = [];
    (0, api.demandList)({
      method: "GET",
      query: {
        pageNum: 1,
        pageSize: 50,
        projectId: storage.getActivityDetail().id,
        id: storage.getUserInfo().id
      },
      success: function (res) {

        console.log(res,'1010101010')
        const isEn = _self.data.isEn
        res.data.result.data.map(item => {
          // if(isEn){
          //   if(item.tagNames!=null||item.tagNames!=undefined){
          //     isEn ? item.tagName = item.tagEnglishNames.join(',') : item.tagName = item.tagNames.join(',');
          //   }
          // }else{
          //   if(item.tagEnglishNames!=null||item.tagEnglishNames!=undefined){
          //     isEn ? item.tagName = item.tagEnglishNames.join(',') : item.tagName = item.tagNames.join(',');
          //   }
          // }
          if (item.status === '0') {
            isEn ? item.statusStr = 'audit' : item.statusStr = '待审核'
          } else if (item.status === '1') {
            isEn ? item.statusStr = 'approved' : item.statusStr = '审核通过'
          } else if(item.status === '2'){
            isEn ? item.statusStr = 'stop' : item.statusStr = '已停止'
          }else{
            isEn ? item.statusStr = 'fail' : item.statusStr = '审核失败'
          }
        })
        _self.setData({
          demandList: res.data.result.data,
          langTranslate: i18n.langTranslate(),
          isEn: i18n.isEn()
        })
      }
    });
    // for(let i = 0; i < 5;i++) {
    //   exhibits.push({
    //     id: i
    //   })
    // }
    // _self.setData({
    //   exhibits: exhibits
    // })

  },
  goDetailPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail',
    })
  },
  goPublishPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand',
    })
  },
  editTap: function(e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand?id=${e.currentTarget.dataset.id}`,
    })
  },
  onLoad: function () {
  },
  onShow:function(){
    _self = this
    _self.initData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
