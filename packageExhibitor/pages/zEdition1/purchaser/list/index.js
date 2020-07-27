// packageExhibitor/pages/zEdition1/purchaser/list/index.js
import {getString} from "../../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../../utils/util";

const util = require('../../../../../utils/util')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pages: 1,
        pageNumber: 1,
        list1: [],
        filterViewVisible: true,
        filterData: null,
        dialogShow: false,
        isProgressing: false,
        tags: "",
        isMore: true,
        key: "",
        height: wx.getSystemInfoSync().screenHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadData()
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
        wx.setNavigationBarTitle({
            title: getString('exhibitors_index', 'app.footer.menu2'),
        })
        // tab1: getString('exhibitors_index', 'app.footer.menu1'),
        //     tab2: ,
        //     tab3: getString('exhibitors_index', 'app.footer.menu3'),
        //     tab4: getString('exhibitors_index', 'app.footer.menu4')
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
        this.loadData()
    },
    filterTagsTriggerData() {
        this.setData({
            list1:[],
            isMore: true,
            pageNumber: 1,
        })
        this.loadData()
    },
    loadData(direction = 0) {
        this.setData({
            isProgressing: true
        })
        var projectId = wx.getStorageSync('activityDetail').id
        var tags = util.getCurrentPage1().data.tags || ""
        if (tags && tags[0] == '[') {
            tags = tags.slice(1, tags.length - 1)
            tags = tags.split(',').map(item => item.trim())
            tags = tags.join(",")
        }
        let url = app.globalData.host + `/api3/purchaser/getSupplierPurchasers?pageNum=${this.data.pageNumber}&pageSize=${10}&projectId=${projectId}&tags=${tags}&key=${this.data.key}`
        var that = this;
        if (!this.data.isMore) {
            return false
        }
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
                    // let ar = [...that.data.list1, ...res.data.result.data]
                    let ar = res.data.result.data
                    let num = that.data.pageNumber
                    var isMore = true
                    if (ar.length < 10) {
                        isMore = false
                    } else {
                        num++
                        isMore = true
                    }
                    var list1 = util.mergeArray(that.data.list1, ar)
                    that.setData({
                        list1,
                        isMore,
                        pages: res.data.result.pages,
                        pageNumber: num,
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})