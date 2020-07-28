// packageExhibitor/pages/newedition/collectionPrise/collectionPrise.js
import {myself_exhibits,myself_commodities,myself_prise,myself_right_arrow} from "../../../../common/staticImageContants";
import {API_URL} from "../../../../utils/constant";
import storage from "../../../../utils/storage";
import {ajax} from "../../../../utils/util";
let i18n = require("../../../../i18n/i18n");
import {getString} from "../../../../locals/lang.js";
let langTranslate = i18n.langTranslate();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalData:[
      {id:1,title:langTranslate['我的收藏'],imgUrl:myself_right_arrow,
        children: [{ passive:"0",operation:"1",typerole:1,type:"collect",id: 1, title: langTranslate['观众'],count: "0" ,imgUrl:myself_commodities,link:'collectPurchaser'}, 
        { passive:"0",operation:"1",typerole:3,type:"collectExhibit",link:'collectDemand',id: 2, title: langTranslate['商机'], count: "0" ,imgUrl:myself_exhibits},]
      },
      {
        id: 1, title: langTranslate['我的点赞'],imgUrl:myself_right_arrow,
        children: [{ passive:"0",operation:"0",typerole:1,type:"zan",id: 1, title: langTranslate['观众'], count: "0" ,imgUrl:myself_commodities,link:'likesPurchaser'}, 
        { passive:"0",operation:"0",typerole:3,type:"zanExhibit",id: 2, link:'likesDemand',title: langTranslate['商机'], count: "0" ,imgUrl:myself_exhibits},]
      },
      {
        id: 1, title: langTranslate['关注我的展商'],imgUrl:myself_right_arrow,
        children: [{ passive:"1",operation:"0",typerole:0,type:"zanedExhibit",id: 2,link:'be_likes', title: langTranslate['点赞的展商'], count: "0" ,imgUrl:myself_prise},
          { passive:"1",operation:"1",typerole:0,type:"zaned",id: 1, title: langTranslate['收藏的展商'], count: "0" ,imgUrl:myself_exhibits,link:'beCollect'},]
      }, 
    ],
    getGuanZhong_total: {
      zan: 0,
      collect: 0,
      zaned: 0,
    },
    getDemand_total: {
      zan: 0,
      collect: 0,
      zaned: 0,
    },
    height:"",
    userInfo:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.myinformation'),
    })
    this.setData({
      height: wx.getSystemInfoSync().screenHeight,
    })
    this.getCount()
    // this.getDemand_total();

  },
  onShow(){
  },
  goPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/collectList/collectList?typerole=${e.currentTarget.dataset.typerole}&totaltype=${e.currentTarget.dataset.totaltype}&role=${e.currentTarget.dataset.page}&type=${e.currentTarget.dataset.type}&operation=${e.currentTarget.dataset.operation}&passive=${e.currentTarget.dataset.passive}`,
    })
  },
  async getCount() {
    var userInfo = storage.getUserInfo()
    // ywmatch.coolgua.com:9998/api3/supplier/detail/001c8ab968324aa1bd699455a5607348
    var result = await ajax.get(`${API_URL}/supplier/detail/${userInfo.id}`)
    if(result.code == 0){
      var result1 = result.result
      let arr = this.data.totalData
      arr.map(item => {
        item.children.map(child => {
          if(result1.hasOwnProperty(child.link)){
            child.count = result1[child.link] || 0;
          }
        })
      })
      this.setData({
        totalData: arr
      })
    }

  },
  
  toOtherPage:function(e){

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})