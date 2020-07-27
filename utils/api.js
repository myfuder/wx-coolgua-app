import {setAgreePromiseTrue} from "./storage";

function e() {
  return wx.getStorageSync('token');
}

function code() {
  return wx.getStorageSync('code');
}

function buildHeaders(i) {
  if (!utils.isNullObj(i.header) && !utils.isNullStr(i.header['Content-Type'])) {
    return i.header;
  }
  ;
  let headers = {
    // "Content-Type": "application/x-www-form-urlencoded",
    "Content-Type": "application/json",
  };
  // const token = e();
  // if (token)
  // {
  //   headers["token"] = token;
  // }

  return {
    ...i.header,
    ...headers
  };
}

// data.isNullProjectId是判断是否给参数增加projectId数据
function buildQuery(i) {
  // if (utils.isNullObj(data)) {
  //   return data
  // }
  let data = i.data
  if (i.isNullToken === true) {
    return data
  }
  const token = storage.getToken();
  if (token) {
    data["token"] = token;
  }
  return data;
}

var t = require("./constant"),
  i18n = require("../i18n/i18n"),
  storage = require("./storage"),
  utils = require("./util"),
  apiURL = t.API_URL,
  apiUrlV1 = t.API_URL_V1,
  apiUrlV2 = t.API_URL_V2,
  n = function n(i, c) {
    // wx.showLoading({
    //     title: '正在加载中',
    // })
    wx.getNetworkType({
      success: function (e) {
        "none" === e.networkType && (wx.hideLoading(), wx.showModal({
          title: "提示",
          content: "当前无网络，请检查网络设置后重新加载",
          showCancel: !1
        }));
      }
    });
    var a = e(),
      p = getApp();
    i.router || (i.router = {}, i.router.to = "", i.router.type = 1, i.router.redirectToLogin = !1),
    i.data || (i.data = {}), i.method && "GET" !== i.method,
      wx.request({
        url: c,
        method: i.method || "GET",
        header: buildHeaders(i),
        responseType: i.responseType || 'text',
        data: buildQuery(i),
        success: function (e) {
          var o = e.statusCode;
          if (i.isSkipIntercept !== true) {
            // wx.showModal({
            //   title: "提示",
            //   content: "服务器开小差了，请稍后再试"
            // }))
            //   if (200 !== o && 404 !== o && (  wx.hideLoading(), ('0' !== e.data.code && 0 !== e.data.code && '1' !== e.data.code && 1 !== e.data.code)) return wx.hideLoading(), void wx.showModal({
            //       title: "提示",
            //       content: e.data.message,
            //       showCancel: !1
            //   });
          }
          i.success && i.success(e)
          // if (40001 === e.data.status) {
          // //if(a)
          //   wx.login({
          //     success: res => {
          //       wx.request({
          //         url: apiURL + "/api/weixin",
          //         method: "GET",
          //         data: {
          //           code: res.code
          //         },
          //         success: function (e) {
          //           wx.removeStorageSync(t.TOKEN), 200 === e.data.status ? (a = e.data.data, wx.setStorageSync(t.TOKEN, a),
          //             n(i, c), console.log("already refresh token")) : i.router.redirectToLogin ? wx.redirectTo({
          //               url: "../pages/login/login?page=" + i.router.to + "&type=" + i.router.type
          //             }) : wx.navigateTo({
          //               url: "../pages/login/login?page=" + i.router.to + "&type=" + i.router.type
          //             });
          //         }
          //       });
          //     }
          //   });
          // } else if (5001 == e.data.status || 5002 == e.data.status) {
          //   wx.redirectTo({
          //     url: "../login/login"
          //   });
          // } else if (5003 == e.data.status) {
          //   p.examming = !0;
          //   wx.reLaunch({
          //     url: "/pages/infoexam/infoexam"
          //   });
          // }
          // else i.success && i.success(e);
        },
        fail: function (e) {
          i.fail && i.fail(e);
        },
        complete: function (e) {
          wx.hideLoading()
          i.complete && i.complete(e);
        }
      });
  };

var ajax_ = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: params.method,
      url: params.url,
      params: params.params,
      data: params.params,
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        var data = res.data
        resolve(data)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
const ajax = {
  post(url, options) {
    var params = {}
    params.method = 'POST'
    params.url = url
    params.params = options
    return ajax_(params)
  },
  get(url, options) {
    var params = {}
    params.method = 'GET'
    params.url = url
    params.params = options
    return ajax_(params)
  }
}
module.exports = {
  apiURL,
  ajax,
  getProjectList: function (e) {
    n(e, apiURL + `/index/getProjects/${t.COMPANY_ID}`); // done
  },
  getProjectDetail: function (e) {
    n(e, apiURL + `/index/getProject/${e.query.id}`);
  },
  //同期活动列表
  getActivityList: function (e) {
    n(e, apiURL + `/column/getEvents/${e.query.projectId}/${e.query.activityId}`);
  },
  //已报名活动列表
  getSignList: function (e) {
    n(e, apiURL + `/column/getEvents/${e.query.projectId}/${e.query.activityId}?participant=${e.query.participant}&sponsor=${e.query.sponsor}`);
  },
  //同期活动详情
  getEventDetail: function (e) {
    n(e, apiURL + `/column/getEvent/${e.query.id}/${e.query.openId}/${e.query.userId}`);
  },
  getRotations: function (e) {
    // n(e, apiURL + `/index/getRotations/${t.ROLE_TYPE.INDEX}/${t.LANG_TYPE[`mobile_${i18n.getLanguage()}`]}/${storage.getActivityDetail().id}`);
    n(e, apiURL + `/index/getRotations/${t.ROLE_TYPE.INDEX}/1/${storage.getActivityDetail().id}`);
  },
  getRecommendExhibits: function (e) {
    n(e, apiURL + '/recommend/getExhibits');
  },
  getRecommendSuppliers: function (e) {
    n(e, apiURL + '/recommend/getSuppliers');
  },
  // 栏目列表
  getColumns: function (e) {
    n(e, apiURL + '/column/getColumns');
  },
  // 栏目详情
  getColumnById: function (e) {
    n(e, apiURL + `/column/getColumnById/${e.query.id}`);
  },
  // 采购需求
  getDemandList: function (e) {
    n(e, apiURL + '/demand/list');
  },
  // 采购商详情
  getPurchaserDetail: function (e) {
    n(e, apiURL + `/purchaser/detail/${e.query.id}`);
  },
  // 直播列表
  getLiveList: function (e) {
    n(e, apiURL + `/live/list/${e.query.id}`);
  },
  // 获取短信验证码
  getMobileCode: function (e) {
    n(e, apiUrlV1 + '/getMobileCode');
  },
  // 获取图形验证码
  getGifCode: function (e) {
    n(e, apiUrlV1 + '/getGifCode');
  },
  // 登录接口
  login: function (e) {
    n(e, apiUrlV1 + '/login/');
  },
  //统计概况
  getStatOverview: function (e) {
    n(e, apiURL + `/index/getStatOverview/${e.query.participant}/${e.query.sponsor}`);
  },
  // 观众-展品列表
  getPurchaserExhibits: function (e) {
    n(e, apiURL + '/exhibit/getPurchaserExhibits');
  },
  // 观众-展商列表
  getPurchaserSuppliers: function (e) {
    n(e, apiURL + `/supplier/getPurchaserSuppliers?pageNum=${e.query.pageNum}&pageSize=${e.query.pageSize}&key=${e.query.key}&projectId=${e.query.projectId}&filterType=${e.query.filterType}&tags=${e.query.tags}`);
  },
  // 观众-展商详情
  getSupplierDetail: function (e) {
    n(e, apiURL + `/supplier/detail/${e.query.id}`);
  },
  // 展商-展品列表
  getExhibitsById: function (e) {
    n(e, apiURL + `/exhibit/getExhibits/${e.query.id}`);
  },
  // 展品详情
  getExhibitsDetail: function (e) {
    n(e, apiURL + `/exhibit/detail/${e.query.id}`);
  },
  // 商贸配对详情列表
  getActivityPair: function (e) {
    n(e, apiURL + `/activitypair/inviteslistps/${storage.getUserInfo().id}/${e.query.id}`);
  },
  getActivityDetail: function (e) {
    n(e, apiURL + `/activitypair/${e.query.id}`);
  },
  // 商贸配对列表接口
  getActivityPairList: function (e) {
    n(e, apiURL + `/activitypair/list/${storage.getUserInfo().id}`);
  },
  // 发布需求
  publishDemand: function (e) {
    n(e, apiURL + '/demand');
  },
  // 获取参数类型
  getProductType: function (e) {
    n(e, apiURL + '/org/queryProductType/');
  },
  ajaxGetProductType(params) {
    return ajax.post(apiURL + '/org/queryProductType/', params)
  },
  // 获取需求详情
  getDemandDetail: function (e) {
    n(e, apiURL + `/demand/${e.query.id}`);
  },
  // 热门视频列表
  getVideoList: function (e) {
    n(e, apiURL + `/video/${e.query.id}`);
  },
  // 我收到的邀约列表
  getScheduleSuppliers: function (e) {
    n(e, apiURL + '/schedule/getScheduleSuppliers');
  },
  // 编辑接口
  updatePurchaser: function (e) {
    n(e, apiURL + `/purchaser/updatePurchaser/${e.query.id}`);
  },
  // 编辑展商个人资料接口
  updateSupplier: function (e) {
    n(e, apiURL + `/supplier/updateSupplier/${e.query.id}`);
  },
  // 国家数据
  getCountry: function (e) {
    n(e, apiUrlV2 + '/cg/area/country?fp=1');
  },
  // 省份数据
  getProvince: function (e) {
    n(e, apiUrlV2 + '/cg/area/province?fp=1');
  },
  // 城市数据
  getCity: function (e) {
    n(e, apiUrlV2 + '/cg/area/city?fp=1');
  },
  // 绑定小号
  createCallService: function (e) {
    n(e, apiURL + `/callservice/create/?purchaserId=${e.data.purchaserId}&supplierId=${e.data.supplierId}`)
  },
  // 腾讯实时音视频&即时通讯 签名
  getTrtcOrImSign(e) {
    n(e, apiURL + '/trtcorim/getUsgSign?UserId=' + e.data.id);
  },
  // 腾讯云直播 - 直播详情
  getLive(e) {
    n(e, apiURL + `/live/${e.query.id}`)
  },
  // 腾讯云直播 - 直播播放地址
  getLivePullUrl(e) {
    n(e, apiURL + `/live/getPullUrl/${e.query.id}/${e.query.type}/${e.query.userId}`)
  },
  // 我发起的邀约列表
  getScheduleSuppliers: function (e) {
    n(e, apiURL + '/schedule/getScheduleSuppliers');
  },
  // 我收到的邀约列表
  getPurchaserScheduleStat: function (e) {
    n(e, apiURL + `/schedule/getPurchaserScheduleStat/${e.query.purchaserId}`);
  },
  // // 日历面板
  // getPurchaserScheduleStat: function(e) {
  //   n(e, apiURL + `/schedule/purchaserSchedule/${e.query.purchaserId}`);
  // },
  // 编辑接口
  updatePurchaser: function (e) {
    n(e, apiURL + `/purchaser/updatePurchaser/${e.query.id}`);
  },
  // 国家数据
  getCountry: function (e) {
    n(e, apiUrlV2 + '/cg/area/country?fp=1');
  },
  // 省份数据
  getProvince: function (e) {
    n(e, apiUrlV2 + '/cg/area/province?fp=1');
  },
  // 城市数据
  getCity: function (e) {
    n(e, apiUrlV2 + `/cg/area/city?fp=1&name=${e.query.name}`);
  },
  // 取消邀约(我发起的)
  cancelSchedule: function (e) {
    n(e, apiURL + `/schedule/cancel/${e.query.id}`);
  },
  // 提醒邀约(我发起的)
  reminder: function (e) {
    return ajax.post(apiURL + `/schedule/appointmentreminder/${e.query.id}`, e.query)
    // n(e, ,{method:'POST'});
  },
  // 再次发起邀约(我发起的)
  readd: function (e) {
    n(e, apiURL + `/schedule/readd/${e.query.id}/${e.query.src}`);
  },
  // 拒绝邀约(我收到的)
  refuseSchedule: function (e) {
    n(e, apiURL + `/schedule/refuse/${e.query.id}`);
  },
  // 确认邀约(我收到的)
  confirmedSchedule: function (e) {
    n(e, apiURL + `/schedule/confirmed/${e.query.id}`);
  },
  // 我的日程
  getPurchaserSchedule: function (e) {
    n(e, apiURL + `/schedule/purchaserSchedule`);
  },
  // 登出
  logout: function (e) {
    n(e, apiUrlV2 + `/cg/user/${e.query.projectId}/match/${e.query.userId}/v1/toQuit/${e.query.src}`);
  },
  // 获取日历
  getPurchaserDaySchedule: function (e) {
    n(e, apiURL + `/schedule/purchaserDaySchedule`);
  },
  // 完成邀约
  getpurchaserFinish: function (e) {
    n(e, apiURL + `/schedule/purchaserFinish/${e.query.id}`);
  },
  // 获取消息
  getMessage: function (e) {
    n(e, apiURL + `/message/newmessage/list/${storage.getUserInfo().id}`);
  },
  // 已读消息
  readMessage: function (e) {
    n(e, apiURL + `/message/newmessage/hadread/${storage.getUserInfo().id}`);
  },
  // 视频详情
  getVideoDetail: function (e) {
    n(e, apiURL + `/video/detail/${e.query.id}`);
  },
  // 离线留言
  addPurchaserSchedule: function (e) {
    n(e, apiURL + `/schedule/addPurchaserSchedule`);
  },
  // 获取动态字段
  queryRegistration: function (e) {
    n(e, apiUrlV2 + `/cg/${storage.getActivityDetail().companyId}/match/${storage.getUserInfo().id}/v1/queryRegistration/`);
  },
  // 采购商加入会议(获取会议房间id
  getInterMeetingPurchaser: function (e) {
    n(e, apiURL + `/activitypair/intermeetingpurchaser/${e.query.meetingid}`)
  },
  // 直播详情
  getLiveDetail: function (e) {
    n(e, apiURL + `/live/${e.query.id}`)
  },
  // 发起视频时推送消息
  sendMsg: function (e) {
    n(e, apiURL + `/wx/sendMsg`)
  },
  //确定承诺书
  agreePromiseTrueApi: function (e) {
    n(e, apiURL + `/supplier/${e.query.userId}/agree`)
  },
  //点赞收藏
  addCollect: function (e) {
    n(e, apiURL + `/livecollect`);
  },
  //取消点赞收藏
  delCollect: function (e) {
    n(e, apiURL + `/livecollect/del/${e.query.id}`);
  },
  //点赞收藏列表
  collectList: function (e) {
    n(e, apiURL + `/livecollect/lis`);
  },
  //观众首页推荐展商
  recommendSuppliers: function (e) {
    n(e, apiURL + `/recommend/getSuppliers`);
  },
  //观众首页推荐展品
  recommendExhibits: function (e) {
    n(e, apiURL + `/recommend/getExhibits`);
  },
  //我的需求
  demandList: function (e) {
    console.log(e)
    n(e, apiURL + `/demand/${e.query.projectId}/${e.query.id}/list?pageNum=${e.query.pageNum}&pageSize=${e.query.pageSize}`);
  },
  //分类直播列表
  sponsorLiveList: function (e) {
    console.log(e)
    n(e, apiURL + `/sponsorLive/list`);
  },
  //分类直播详情
  sponsorLiveDetail:function(e){
    console.log(e)
    n(e, apiURL + `/sponsorLive/${e.query.liveId}`);
  },
  //推荐展商
  recommendLive:function(e){
    n(e, apiURL + `/live/${e.query.id}/recommendLive`);
  },
  suppliercontact:function(e){
    n(e, apiURL + `/suppliercontact/${e.query.supplierId}/getAllSupplierContact`);
  }
};