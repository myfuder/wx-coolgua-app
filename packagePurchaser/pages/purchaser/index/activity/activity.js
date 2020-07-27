//activity.js
//获取应用实例
import {ajax} from "../../../../../utils/util";
import {API_URL} from "../../../../../utils/constant";

const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
let TIME = 60
Page({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    concurrentEvents: [
      {id:1,tid:1,title:'采购商洽谈会议',time:'2020/03/24 14:00-15:00',count:20,talkTime:5,countdown:'16:45:46'},
      {id:2,tid:2,title:'采购商洽谈会议',time:'2020/03/24 14:00-15:00',count:20,talkTime:5,countdown:'16:45:46'}
    ],
    ismyself:false,
    isMore:true,
    pagination:{
      pageNum:1,
      pageSize:20,
    }
  },
  onLoad: function (options) {
    app.editTabBar();
    _self = this
    _self.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
      ismyself:options.ismyself,
    })
    if (options.role == 0 || options.role == '0') {
      wx.setNavigationBarTitle({
        title: '已报名的活动列表',
      });
    } else {
      wx.setNavigationBarTitle({
        title: '同期活动',
      });
    }
  },
  onShow: function () {
    _self.initData()
  },
  //同期活动列表 观众
  initData: async function (id) {
    if(this.data.ismyself=='true'){
      this.getMyselfList()
      return false
    }else{
      this.loadMoreEventList()
    }
    /* if (id == 0 || id == '0') {
       (0, api.getSignList)({
         query: {
           projectId: storage.getActivityDetail().companyId,
           activityId: storage.getActivityDetail().id,
           participant: storage.getUserInfo().id,
           sponsor: '1'
         },
         success: function (res) {
           var concurrentEvents = res.data && res.data.result && res.data.result.detailList
           _self.setData({
             concurrentEvents: concurrentEvents,
           });
           return false
         },
       });
     } else {
       (0, api.getActivityList)({
         query: {
           projectId: storage.getActivityDetail().companyId,
           activityId: storage.getActivityDetail().id
         },
         success: function (res) {
           var concurrentEvents = res.data && res.data.result && res.data.result.detailList
           _self.setData({
             concurrentEvents: concurrentEvents,
           });
           return false
         },
       });
     }*/
  },
  //获取自己报名的活动列表
  async getMyselfList(){
    var result = await ajax.post(`${API_URL}/column/getMyEvent`, {
      "participant": storage.getUserInfo().id,
      // "contactId": "",
      "sponsor": 1,
      // "eventId": "",
      // "openId": "",
      // "name": "",
      // "cellphone": "",
      "company": storage.getActivityDetail().companyId,
      // "position": "",
      // "country": "",
      // "province": "",
      // "city": ""
    })
    var concurrentEvents1 = result&&result.result&&result.result
    var concurrentEvents=concurrentEvents1.map(item=>item.data)
    concurrentEvents=concurrentEvents.map(item=>{
      // item.banner=item.images
      item.tid=item.id
      return  item
    })
    this.setData({
      concurrentEvents
    })
  },

  loadMoreEventList(){
    var self=this;
    (0, api.getActivityList)({
      query: {
        projectId: storage.getActivityDetail().companyId,
        activityId: storage.getActivityDetail().id,
        pagination:{
          pageNum:self.data.pageNum,
          pageSize:self.data.pageSize,
        },
      },
      success: function (res) {
        var concurrentEvents = res.data && res.data.result && res.data.result.detailList;
        let isMore=self.data.isMore
        let pageNum=self.data.pagination.pageNum
        if(concurrentEvents.length<self.data.pagination.pageSize){
          isMore=false
          self.data.pagination.pageNum=pageNum
        }else{
          isMore=true
          self.data.pagination.pageNum=pageNum+1
        }
        _self.setData({
          isMore,
          concurrentEvents: concurrentEvents,
          pagination:  self.data.pagination,
        });
        return false
      },
    });
  },
  goOverview: function (event) {
    var tid = event.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '../activityDetail/activityDetail?id=' + tid
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
