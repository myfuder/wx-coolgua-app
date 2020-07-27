// packageExhibitor/pages/zEdition1/purchaser/list/index.js
import {getString} from "../../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../../utils/util";

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pages: 1,
        pageNumber: 1,
        list2: [],
        dialogShow: false,
        isProgressing: false,
        tags: "",
        key: "",
        isMore: true,
        height: wx.getSystemInfoSync().screenHeight
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: getString('exhibitors_index', 'app.footer.menu3'),
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
        var child1 = this.selectComponent('#mychild1')
        if (child1) {
            child1.reachBottom();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    filterTagsTriggerData() {
        this.setData({
            list2:[],
            pageNumber: 1,
            isMore: true,
        })
        this.loadData()
    },
    loadData(direction = 0) {
        if (this.data.isProgressing) {
            return;
        }
        this.setData({
            isProgressing: true
        })
        var projectId = wx.getStorageSync('activityDetail').id
        let num = this.data.pageNumber
        var tags=getCurrentPage1().data.tags||""
        var key=getCurrentPage1().data.key||""
        /*  if (direction == -1) {
              num--
          } else if (direction == 1) {
              num = num + 1
          }*/
        if(!this.data.isMore)return false
        var l = `/api3/demand/list?pageNum=${num}&pageSize=${10}&projectId=${projectId}&demandType=${tags}&demandName=${key}`
        let url = app.globalData.host + l
        var that = this;
        wx.showLoading({
            title: this.data.loading,
        })
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log('banner:', res)
                if (res.data.code == '0') {
                    that.setData({
                        list2: []
                    })
                    // let ar = [...that.data.list2, ...res.data.result.data]
                    let ar = res.data.result.data
                    let pageNumber=that.data.num
                    var isMore=true
                    if(ar.length<10){
                        pageNumber=pageNumber
                        isMore=false
                    }else{
                        pageNumber=pageNumber+1
                        isMore=true
                    }
                    that.setData({
                        list2: ar,
                        pages: res.data.result.pages,
                        pageNumber,
                        isMore
                    })
                } else {
                    console.log(res.data.message)
                }
                that.setData({
                    isProgressing: false
                })
                wx.hideLoading()
            },
            fail: function (error) {
                console.log(error)
                that.setData({
                    isProgressing: false
                })
                wx.hideLoading()
            }
        })
    },
})