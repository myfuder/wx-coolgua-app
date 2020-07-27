import {API_URL} from "./constant";
import TIM from "tim-wx-sdk";
import {reg_email, reg_mobile} from "./regs";

const storage = require('./storage');
const {defaultUserImage} = require('../common/staticImageContants');
const constant = require('./constant');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() - 1

  return [year, month, day].map(formatNumber).join('-')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatDateH = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var timeY = [year, month, day].map(formatNumber).join('-')
  var timeH = [hour, minute, second].map(formatNumber).join(':')
  var time = timeY + ' ' + timeH
  console.log(time)
  return time
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}

function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
  dateObj.week = show_day[day];
  return dateObj;
}

// module.exports = {
//   formatTime: formatTime
// }
function getRankDate(a) {
  var date1 = new Date(),
    time1 = date1.getFullYear() + "-" + formatNumber(date1.getMonth() + 1) + "-" + formatNumber(date1.getDate());
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + a);
  var time2 = date2.getFullYear() + "-" + formatNumber(date2.getMonth() + 1) + "-" + formatNumber(date2.getDate());
  return time2;
}

function goPage(url, param) {
  var option = ''
  if (param) {
    option = '?openId=' + param.openId
  }
  wx.redirectTo({
    url: url + option
  })
}

function getCurrentPage() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  return currentPage
}

function getPageOpenId() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var options = currentPage.options
  return options.openId
}

function Base64() {

  // private property
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }

  // public method for decoding
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding
  var _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding
  var _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

function getChairLength(str) {
  return str.replace(/[^\u0000-\u00ff]/g, "aa").length
}

//判断手机号是否授权
function verifyAuthorization(that, app) {
  var url = app.globalData.host + '/assist/autoLogin';
  var urls = app.globalData.host + '/assist/getEventsByPhone';
  var openId = wx.getStorageSync('openId');
  var phone = wx.getStorageSync('managePhone');
  var eventId = wx.getStorageSync('eventId');
  wx.request({
    url: url,
    data: {"phone": phone, "openId": openId},
    success: function (res) {
      if (res.data.success) {
        wx.request({
          url: urls,
          data: {"phone": phone},
          success: function (res) {
            if (res.data.events.length > 0) {
              var eventList = [];
              for (var i = 0; i < res.data.events.length; i++) {
                eventList.push(res.data.events[i]["id"]);
              }
              if (eventList.length > 0) {
                if (eventList.indexOf(eventId) < 0) {
                  wx.redirectTo({
                    url: '../list/list'
                  })
                }
              } else {
                wx.redirectTo({
                  url: '../index/index'
                })
              }
            }
          },
          fail: function (error) {
            console.log(error)
          }
        })
      } else {
        wx.redirectTo({
          url: '../index/index'
        })
      }
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function getChairIndex(str, chair) {
  var put = []
  var html = '';
  var len = ''
  var num = 0
  for (let i = 0; i < str.length; i++) {
    num += getChairLength(str[i])
    if (num <= chair) {
      html += str[i]
    } else {
      len += str[i]
    }
  }
  put.push(html)
  put.push(len)
  return put
}

function numberFormat(value) {
  var v = parseInt(value)//强转Int，毕竟有可能返回是String类型的数字
  return v.toFixed(2)
}

/** *
 * 判断是否为空对象
 * @param obj
 * @returns {boolean}
 */
function isNullObj(obj) {
  for (const i in obj) { // 如果不为空，则会执行到这一步，返回false
    return false
  }
  return true // 如果为空,返回true
}

// 空字符串
function isNullStr(str) {
  if (str === null || str === undefined || str === '' || str === '' || str === 'undefined') {
    return true
  }
  return false
}

// 检验是否是手机号
function checkMobile(t) {
  var e = t;
  return !!/^1[0-9]\d{9}$/.test(e);
}

/** *
 * 空字符串返回初始值
 */
function defaultNullStr(data, defaultStr, unit) {
  if (isNullStr(data)) {
    return isNullStr(defaultStr) ? '无' : defaultStr
  }
  if (isNullStr(unit)) {
    return data
  }
  return data + unit
}

/**
 * 如果有一些是空的不显示
 * */
export function filterNullInStr(str) {
  str = str.replace(/\r\n/g, ",")
  if (str[0] == '[') {
    str = str.substr(1, str.lenbits - 1)
    return str.split(',').filter(item1 => item1.trim() != '').join(',')
  }
  return str.split(',').filter(item1 => item1.trim() != '').join(',')
}

// 月份或日期不足10补0
function formatDateStr(val) {
  if (val < 10) {
    return '0' + val
  }
  return val
}

/**
 * 格式化时间
 * @param number 时间戳
 * @param format 格式
 * return boolean
 */
function formatNumberTime(number, format) {
  if (number === null || number === undefined || number === '') {
    return ''
  }
  const formateArr = ['Y', 'm', 'd', 'H', 'i', 's']
  const returnArr = []

  // var date = new Date(number * 1000);
  const date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }

  return format
}

function setDayText(dayNum) {
  let dayText = ''
  if (dayNum === 0) {
    dayText = '周日'
  } else if (dayNum === 1) {
    dayText = '周一'
  } else if (dayNum === 2) {
    dayText = '周二'
  } else if (dayNum === 3) {
    dayText = '周三'
  } else if (dayNum === 4) {
    dayText = '周四'
  } else if (dayNum === 5) {
    dayText = '周五'
  } else if (dayNum === 6) {
    dayText = '周六'
  }
  return dayText
}

/** *
 * 判断是否空数组
 */
function isNullArray(data) {
  if (data === null || data === undefined || data.length === 0) {
    return true
  }
  return false
}

export function getCurrentPage1() {
  let pages = getCurrentPages(); //当前页面栈
  return pages[pages.length - 1]
}

function getSecondPage() {
  let pages = getCurrentPages(); //当前页面栈
  return pages[pages.length - 2]
}

/**
 * @desc  上传图片
 * @return promise （{path:xxxx}）
 * **/
function uploadImage() {
  const app = getApp()
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        wx.showLoading({duration: 1000 * 5})
        for (let i = 0; i < res.tempFiles.length; i++) {
          wx.uploadFile({
            url: app.globalData.host + '/api3/file/upload',
            files: res.tempFiles[i],
            filePath: res.tempFilePaths[i],
            fileType: 'image',
            name: 'file',
            success: (res) => {
              wx.hideLoading()
              if (JSON.parse(res.data).code == '0') {
                var path = JSON.parse(res.data).result
                /*  this.setData({
                      imageSrc: path
                  });*/
                resolve(path)
                return path
              } else {
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                  duration: 1000
                })
              }

            },
            fail: (err) => {
              reject(err)
              console.log('uploadImage fail', err);
              wx.showModal({
                content: err.errMsg,
                showCancel: false
              });
            }
          });
        }
      },
      fail: (err) => {
        reject(err)
        console.log('chooseImage fail', err)
      },
      cancel() {
        reject(err)
      }
    })
  })

}

/**
 * @desc  上传视频
 * @return promise （{path:xxxx}）
 * **/
function uploadVideo() {
  const app = getApp()
  return new Promise((resolve, reject) => {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        wx.showLoading({duration: 1000 * 5})

        wx.uploadFile({
          url: app.globalData.host + '/api3/file/upload',
          files: res.tempFilePath,
          filePath: res.tempFilePath,
          fileType: 'video',
          name: 'file',
          success: (res) => {
            wx.hideLoading()
            console.log(JSON.parse(res.data).code)
            if (JSON.parse(res.data).code == '0') {
              var path = app.globalData.host + '/' + JSON.parse(res.data).result
              /*  this.setData({
                    imageSrc: path
                });*/
              resolve(path)
              return path
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1000
              })
            }

          },
          fail: (err) => {
            reject(err)
            console.log('uploadImage fail', err);
            wx.showModal({
              content: err.errMsg,
              showCancel: false
            });
          }
        });
      },
      fail: (err) => {
        reject(err)
        console.log('chooseImage fail', err)
      },
    })
  })

}

var ajax_ = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: params.method,
      url: params.url,
      data: params.data || params.params,
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
export const ajax = {
  post(url, options) {
    var params = {}
    params.method = 'POST'
    params.url = url
    params.data = options
    return ajax_(params)
  },
  get(url, options) {
    var params = {}
    params.method = 'GET'
    params.url = url
    params.data = options
    return ajax_(params)
  }
}

var index = 1;

export function setSort4Array(array) {
  return array.map(item => {
    if (!item._sort) {
      item._sort = index;
      index++;
    }
    return item;
  });
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}

function mergeArray(a1, a2 = [], key) {
  var a1 = setSort4Array(a1);
  var _key = key || "id";
  var finshArray = a1;
  a2.map(item2 => {
    var isExit = false;
    a1.map(item1 => {
      if (item1[_key] == item2[_key]) {
        isExit = true;
      }
    });
    if (!isExit) {
      finshArray.push(item2);
    }
  });

  var newList = finshArray.sort(compare("_sort"));
  return newList;
}


//获取 点赞列表
async function getLikeList(type, pageNum) {
  var params = {
    "projectId": wx.getStorageSync('activityDetail').id,
    "type": type,
    "passive": 0,
    "operation": 0,
    "userId": wx.getStorageSync('userInfo').id,
    "pageNum": pageNum,
    "pageSize": 998
  }
  var result = await ajax.get(`${API_URL}/livecollect/list`, params)
  if (result.code != 0) return []
  return result.result && result.result.data || []
}

async function getCollectList(type, pageNum) {
  var params = {
    "projectId": wx.getStorageSync('activityDetail').id,
    "type": type,
    "passive": 0,
    "operation": 1,
    "userId": wx.getStorageSync('userInfo').id,
    "pageNum": pageNum,
    "pageSize": 998
  }
  var result = await ajax.get(`${API_URL}/livecollect/list`, params)
  if (result.code != 0) return []
  return result.result && result.result.data || []
}


var pageNum_zan = wx.getStorageSync("pageNum_zan") || 1

async function getLikeListAll() {
  var old_zs_like_list = wx.getStorageSync("zs_like_list") || []
  var old_gz_like_list = wx.getStorageSync("gz_like_list") || []
  var old_cp_like_list = wx.getStorageSync("cp_like_list") || []
  var old_xq_like_list = wx.getStorageSync("xq_like_list") || []


  old_zs_like_list = old_zs_like_list && old_zs_like_list.filter(item => item.id)
  old_gz_like_list = old_gz_like_list && old_gz_like_list.filter(item => item.id)
  old_cp_like_list = old_cp_like_list && old_cp_like_list.filter(item => item.id)
  old_xq_like_list = old_xq_like_list && old_xq_like_list.filter(item => item.id)


  if (!old_zs_like_list || old_zs_like_list && old_zs_like_list.length == 0) {
    old_zs_like_list = await getLikeList(0, pageNum_zan)
  }
  if (!old_gz_like_list || old_gz_like_list && old_gz_like_list.length == 0) {
    old_gz_like_list = await getLikeList(1, pageNum_zan)
  }
  if (!old_cp_like_list || old_cp_like_list && old_cp_like_list.length == 0) {
    old_cp_like_list = await getLikeList(2, pageNum_zan)
  }
  if (!old_xq_like_list || old_xq_like_list && old_xq_like_list.length == 0) {
    old_xq_like_list = await getLikeList(3, pageNum_zan)
  }
  /*  wx.setStorageSync("zs_like_list", mergeArray(old_zs_like_list, zs_like_list, 'objectId'))
    wx.setStorageSync("gz_like_list", mergeArray(old_gz_like_list, gz_like_list, 'objectId'))
    wx.setStorageSync("cp_like_list", mergeArray(old_cp_like_list, cp_like_list, 'objectId'))
    wx.setStorageSync("xq_like_list", mergeArray(old_xq_like_list, xq_like_list, 'objectId'))*/
  wx.setStorageSync("zs_like_list", old_zs_like_list)
  wx.setStorageSync("gz_like_list", old_gz_like_list)
  wx.setStorageSync("cp_like_list", old_cp_like_list)
  wx.setStorageSync("xq_like_list", old_xq_like_list)
  // pageNum_zan++
  // wx.setStorageSync("pageNum_zan", pageNum_zan)
}


var pageNum_collect = wx.getStorageSync("pageNum_collect") || 1

async function getCollectListAll() {
  var old_zs_like_list = wx.getStorageSync("zs_collect_list") || []
  var old_gz_like_list = wx.getStorageSync("gz_collect_list") || []
  var old_cp_like_list = wx.getStorageSync("cp_collect_list") || []
  var old_xq_like_list = wx.getStorageSync("xq_collect_list") || []

  old_zs_like_list = old_zs_like_list && old_zs_like_list.filter(item => item.id)
  old_gz_like_list = old_gz_like_list && old_gz_like_list.filter(item => item.id)
  old_cp_like_list = old_cp_like_list && old_cp_like_list.filter(item => item.id)
  old_xq_like_list = old_xq_like_list && old_xq_like_list.filter(item => item.id)


  if (!old_zs_like_list || old_zs_like_list && old_zs_like_list.length == 0) {
    old_zs_like_list = await getCollectList(0, pageNum_collect)
  }
  if (!old_gz_like_list || old_gz_like_list && old_gz_like_list.length == 0) {
    old_gz_like_list = await getCollectList(1, pageNum_collect)
  }
  if (!old_cp_like_list || old_cp_like_list && old_cp_like_list.length == 0) {
    old_cp_like_list = await getCollectList(2, pageNum_collect)
  }
  if (!old_xq_like_list || old_xq_like_list && old_xq_like_list.length == 0) {
    old_xq_like_list = await getCollectList(3, pageNum_collect)
  }
  // wx.setStorageSync("zs_collect_list", mergeArray(old_zs_like_list, zs_like_list, 'objectId'))
  // wx.setStorageSync("gz_collect_list", mergeArray(old_gz_like_list, gz_like_list, 'objectId'))
  // wx.setStorageSync("cp_collect_list", mergeArray(old_cp_like_list, cp_like_list, 'objectId'))
  // wx.setStorageSync("xq_collect_list", mergeArray(old_xq_like_list, xq_like_list, 'objectId'))
  wx.setStorageSync("zs_collect_list", old_zs_like_list)
  wx.setStorageSync("gz_collect_list", old_gz_like_list)
  wx.setStorageSync("cp_collect_list", old_cp_like_list)
  wx.setStorageSync("xq_collect_list", old_xq_like_list)
  // pageNum_zan++
  // wx.setStorageSync("pageNum_collect", pageNum_zan)
}

/**
 * 合并新的列表
 * **/
function merrayLikeList(type, newList) {
  var oldList = []
  var old_zs_like_list = wx.getStorageSync("zs_collect_list") || []
  var old_gz_like_list = wx.getStorageSync("gz_collect_list") || []
  var old_cp_like_list = wx.getStorageSync("cp_collect_list") || []
  var old_xq_like_list = wx.getStorageSync("xq_collect_list") || []
  if (type == 0) {
    oldList = old_zs_like_list
  }
  if (type == 1) {
    oldList = old_gz_like_list
  }
  if (type == 2) {
    oldList = old_cp_like_list
  }
  if (type == 3) {
    oldList = old_xq_like_list
  }
  var list2 = mergeArray(oldList, newList, 'objectId')
  if (type == 0) {
    wx.setStorageSync("zs_collect_list", list2)
  }
  if (type == 1) {
    wx.setStorageSync("gs_collect_list", list2)
  }
  if (type == 2) {
    wx.setStorageSync("cp_collect_list", list2)
  }
  if (type == 3) {
    wx.setStorageSync("xq_collect_list", list2)
  }
}

/**
 *
 *  @desc 判断是不是再点赞列表中
 * @params type类型  // '0:展商 1:观众 2:展品 3:需求
 * @params objectid 类型id
 * */
function isInLikeList(type, objectid) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_like_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_like_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_like_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_like_list")
  }
  return list && (list.filter(item => item.objectId == objectid)[0])
}

function isInCollectList(type, objectid) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_collect_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_collect_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_collect_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_collect_list")
  }
  return list && (list.filter(item => item.objectId == objectid)[0])
}

function pushOneInCollectList(type, _options) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_collect_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_collect_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_collect_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_collect_list")
  }
  var index = list && list.findIndex(item => item.objectId == _options.objectId)
  if (index < 0) {
    list.push({objectId: _options.objectId, id: _options.id})
  }
  if (type == 0) {
    wx.setStorageSync("zs_collect_list", list)
  }
  if (type == 1) {
    wx.setStorageSync("gz_collect_list", list)
  }
  if (type == 2) {
    wx.setStorageSync("cp_collect_list", list)
  }
  if (type == 3) {
    wx.setStorageSync("xq_collect_list", list)
  }
}


function pushOneInLikeList(type, _options) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_like_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_like_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_like_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_like_list")
  }
  var index = list && list.findIndex(item => item.objectId == _options.objectId)
  if (index < 0) {
    list.push({objectId: _options.objectId, id: _options.id})
  }
  if (type == 0) {
    wx.setStorageSync("zs_like_list", list)
  }
  if (type == 1) {
    wx.setStorageSync("gz_like_list", list)
  }
  if (type == 2) {
    wx.setStorageSync("cp_like_list", list)
  }
  if (type == 3) {
    wx.setStorageSync("xq_like_list", list)
  }
}


function removeOneInLikeList(type, objectid) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_like_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_like_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_like_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_like_list")
  }
  var index = list && list.findIndex(item => item.objectId == objectid)
  list && list.splice && list.splice(index, 1);
  if (type == 0) {
    wx.setStorageSync("zs_like_list", list)
  }
  if (type == 1) {
    wx.setStorageSync("gz_like_list", list)
  }
  if (type == 2) {
    wx.setStorageSync("cp_like_list", list)
  }
  if (type == 3) {
    wx.setStorageSync("xq_like_list", list)
  }
}

function removeOneInCollectList(type, objectid) {
  var list = []
  if (type == 0) {
    list = wx.getStorageSync("zs_collect_list")
  }
  if (type == 1) {
    list = wx.getStorageSync("gz_collect_list")
  }
  if (type == 2) {
    list = wx.getStorageSync("cp_collect_list")
  }
  if (type == 3) {
    list = wx.getStorageSync("xq_collect_list")
  }
  var index = list && list.findIndex(item => item.objectId == objectid)
  list && list.splice && list.splice(index, 1);
  if (type == 0) {
    wx.setStorageSync("zs_collect_list", list)
  }
  if (type == 1) {
    wx.setStorageSync("gz_collect_list", list)
  }
  if (type == 2) {
    wx.setStorageSync("cp_collect_list", list)
  }
  if (type == 3) {
    wx.setStorageSync("xq_collect_list", list)
  }
}


/**
 * @desc ios的字符串兼容问题
 * */
function dateStr4ios(str) {
  if (str) {
    str = str.replace(/-/g, '/')
  }
  return str
}

let genUserSig = (_this) => {
  //对话消息
  const userid = wx.getStorageSync('userInfo').id // 应使用实际的userId 刘明泰
  wx.request({
    url: getApp().globalData.host + '/api3/trtcorim/getUsgSign',
    method: 'POST',
    data: {
      UserId: userid
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      if (res.data.code == '0') {
        // console.log(res.data.result)
        wx.$app.login({
          userID: userid,
          userSig: res.data.result
        }).then(() => {
          console.log('im登录成功')
        }).catch((imError) => {
          console.log('im登录失败')
        })
      }
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

/*登陆im*/
function loginim() {
  let _this = this
  let userInfo = wx.getStorageSync('userInfo')
  if (!userInfo.id) {
    return false
  }
  if (getApp().globalData.isSDKReady) {
    return false
  }
  let onReadyStateUpdate = function ({name}) {
    const isSDKReady = (name === wx.$TIM.EVENT.SDK_READY)
    getApp().globalData.isSDKReady = isSDKReady
    if (isSDKReady) {
      console.log('im准备ok')
      let promise = wx.$app.getMyProfile();
      promise.then(function (imResponse) {
        console.log(imResponse.data); // 个人资料 - Profile 实例
        getApp().globalData.imProfile = imResponse.data
      }).catch(function (imError) {
        console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
      });
    }
    //进入跟新最新头像
    wx.$app.updateMyProfile({
      nick: userInfo && userInfo.company || getApp().globalData.im_userid,
      avatar: userInfo && userInfo.portrait || defaultUserImage,
    })
  }
  wx.$app.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this) // 监听是否进入 ready 状态
  wx.$app.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate, this)// 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
  // im登录（可根据实际情况 移动到合适的地方 但在进入聊天之前）
  genUserSig(_this)
}

function logoutim() {
  wx.$app.logout()
}


function uploadProfileIm_exhibitor() {
  let userInfo = wx.getStorageSync('userInfo')
  wx.$app.updateMyProfile({
    nick: userInfo && userInfo.company || userInfo.companyEn || getApp().globalData.im_userid,
    avatar: userInfo && userInfo.portrait || 'https://www.coolgua.net/match_img/img/avatar.png',
  })
}

function uploadProfileIm_guanz() {
  let userInfo = wx.getStorageSync('userInfo')
  wx.$app.updateMyProfile({
    nick: userInfo && userInfo.contact || userInfo.contactEn || getApp().globalData.im_userid,
    avatar: userInfo && userInfo.portrait || 'https://www.coolgua.net/match_img/img/avatar.png',
  })
}


/**
 * 获取授权手机号
 *
 *  <button open-type="getUserInfo" class="button immediately" bindgetuserinfo="userLogin">授权成为观众</button>
 *
 *
 *    <button class="button" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">授权手机号码</button>
 *       <view class="wx-popup" hidden="{{dialogShow}}">
 <view class='popup-container'>
 <view class="wx-popup-title">
 <text>为了校验您的观众身份\n请授权手机号</text>
 </view>
 <view class="wx-popup-con">
 <button class="cancal" bindtap="cancel">取消</button>
 <button class="button" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber">授权</button>
 </view>
 </view>
 </view>
 </view>
 *
 * */

//事件处理函数
function wxUserLogin(e, cb) {
  var that = this;
  //检查用户是否授权
  if (!e.detail.userInfo) {
    return
  }
  getApp().globalData.userInfo = e.detail.userInfo;
  if (getApp().globalData.userInfo) {
    getCurrentPage1().setData({
      userInfo: getApp().globalData.userInfo,
      hasUserInfo: true,
    })
    wx.setStorageSync('authorization', true)
    code2Session(cb)
  } else if (that.data.canIUse) {
    wx.showLoading({title: "授权中"})
    app.userInfoReadyCallback = res => {
      that.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('authorization', true)
      code2Session(cb)
    }
  }
}

function code2Session(cb) {
  var that = this
  wx.showLoading({title: "授权中"})
  wx.login({
    success: res => {
      var url = getApp().globalData.host + '/api3/wx/code2Session/' + getApp().globalData.companyId + '/' + res.code;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading({title: "授权中"})
          console.log(res)
          wx.setStorageSync('user', {
            openId: res.data.result.openid,
            session_key: res.data.result.session_key
          })
          getCurrentPage1().setData({
            openId: res.data.result.openid,
            session_key: res.data.result.session_key,
            dialogShow: false
          })
          cb && cb()
        },
        fail(res) {
          wx.hideLoading({title: "授权中"})
        }
      })
    }
  })
}

function getPhoneNumber(e, cb) {
  var that = this;
  if (e.detail.errMsg == "getPhoneNumber:ok") {
    var data = {}
    wx.request({
      url: getApp().globalData.host + '/api3/wx/decryptData',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: getCurrentPage1().data.session_key
      },
      method: "post",
      success: function (res) {
        /*getCurrentPage1().setData({
          dialogShow: true
        })*/
        wx.setStorageSync('phoneNumber', res.data.result.phoneNumber)
        wx.setStorageSync('phone', true)
        cb(res.data.result.phoneNumber)
      }
    })
  } else {
    that.setData({
      dialogShow: true
    })
  }
}

function myMapObject(obj, func) {
  var keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i]
    func.call(obj, obj[key], key)
  }
  return
}

function createParamsUrl(params) {
  var url = ""
  if (!params) return ""
  myMapObject(params, (value, key) => {
    url += `${key}=${value}&`
  })
  if (url) {
    url = url.substr(0, url.length - 1)
  }
  return url
}


function getCurrentPageAndParams() {
  var path = getCurrentPage1().route;
  var params = getCurrentPage1().options;
  var paramsUrl = createParamsUrl(params)
  return "/" + path + "?" + paramsUrl
}

//判断是不是展商
function isExhibitor() {
  var roleType = storage.getRoleType();
  return constant.ROLE_TYPE.EXHIBITOR == roleType;
}

//用户是不是已经登陆
function isLogin() {
  var userInfo = storage.getUserInfo();
  return userInfo && userInfo.id;
}

//跳转授权界面(默认观众)
function go2authPage() {
  var redirect = encodeURIComponent(getCurrentPageAndParams());
  wx.redirectTo({
    url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${redirect}`,
  });
  return false
}

//跳转展商授权界面
function go2authPageExhibitor() {
  var redirect = encodeURIComponent(getCurrentPageAndParams());
  wx.redirectTo({
    url: `/packageExhibitor/pages/zEdition1/authorize/authorize?redirect=${redirect}`,
  });
  return false
}

function safeBecomeArray(str) {
  if (!str) return []
  if (str && str.constructor == Array) return str
  if (str && str.constructor == String && str[0] == '[') {
    str = str.replace(/\[/g, '')
    str = str.replace(/\]/g, '')
    str = str.replace(/ /g, '')
    return str.split(',')
  }
  if (str && str.constructor == String) {
    str = str.replace(/\[/g, '')
    str = str.replace(/\]/g, '')
    str = str.replace(/ /g, '')
    return str.split(',')
  }
}


function isNullField(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "" ||
    value === "undefined"
  ) {
    return true;
  }
  if (value.constructor == Array && value.length == 0) {
    return true;
  }
  return false;
}

function setArray2Str4Post(params) {
  var params_ = {};
  myMapObject(params, (value, key) => {
    params_[key] = value;
    if (value && value.constructor == Array) {
      params_[key] = value.join(",");
    }
  });
  return params_;
}

function validateMobile(str) {
  return reg_mobile.test(str)
}

function validateEmail(str) {
  return reg_email.test(str)
}

function isDisplay(displayStr) {
  if (!displayStr) return false
  var lang = 'zh'
  if (!wx.getStorageSync('lang')) {
    lang = 'zh'
  } else {
    lang = wx.getStorageSync('lang') == 'zh_CN' ? 'zh' : 'en'
  }
  return displayStr.indexOf('mini') >= 0
}

function isDisplayInFields(nameKey, fields) {
  var one = findInFields(nameKey, fields)
  return isDisplay(one.display)
}

function findInFields(nameKey, fields) {
  var index = fields.findIndex(item => item.nameKey == nameKey)
  return fields[index]
}


module.exports = {
  isDisplayInFields,
  findInFields,
  validateMobile,
  validateEmail,
  setArray2Str4Post,
  isNullField,
  safeBecomeArray,
  go2authPageExhibitor,
  go2authPage,
  isExhibitor,
  isLogin,
  myMapObject,
  createParamsUrl,
  getCurrentPageAndParams,
  wxUserLogin,
  getPhoneNumber,
  merrayLikeList,
  uploadProfileIm_guanz,
  uploadProfileIm_exhibitor,
  loginim,
  logoutim,
  dateStr4ios,
  /*begin collect*/
  removeOneInCollectList,
  pushOneInCollectList,
  isInCollectList,
  getCollectList,
  getCollectListAll,
  /*end collect*/


  /*begin like*/
  removeOneInLikeList,
  pushOneInLikeList,
  isInLikeList,
  getLikeList,
  getLikeListAll,
  /*end end*/
  uploadVideo,
  mergeArray,
  uploadImage,
  getSecondPage,
  getCurrentPage1,
  formatDate: formatDate,
  getDates: getDates,
  formatTime: formatTime,
  formatNumber,
  goPage,
  getPageOpenId,
  getCurrentPage,
  Base64,
  getChairLength,
  getChairIndex,
  verifyAuthorization,
  numberFormat,
  getRankDate,
  isNullObj,
  isNullStr,
  checkMobile,
  defaultNullStr,
  formatDateStr,
  formatNumberTime,
  setDayText,
  isNullArray,
  formatDateH,
  ajax,
  filterNullInStr,
}