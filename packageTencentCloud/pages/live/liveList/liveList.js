import {API_URL, API_URL_V1, API_URL_V2, LIVE_STATUS_TEXT} from "../../../../utils/constant";
import {mergeArray} from "../../../utils/util";
import {ajax} from "../../../../utils/util";

Page({
    data: {
        height: wx.getSystemInfoSync().screenHeight,
        isMore: true,
        liveList: [],
        pagination: {
            pageNum: 1,
            pageSize: 20,
            total: 0,
        }
    },
    onLoad: function (options) {
        wx.showLoading({title: "加载数据.."})
        this.getLiveList().finally(res => {
            wx.hideLoading({title: "加载数据.."})
        })
    },
    onUnload() {
        this.setData({
            isMore: true
        })
    },
    onReachBottom() {
        this.getLiveList()
    },

    async getLiveList() {
        var {pagination, isMore} = this.data
        if (!isMore) {
            return false
        }
        // API_URL API_URL_V1
        var result = await ajax.get(API_URL + `/live/miniprogram/liveinfo?pageSize=${pagination.pageSize}&pageNum=${pagination.pageNum}`)
        if (result.code != 0) {
            this.setData({
                liveList: []
            })
            return false
        }
        if (!result.result) {
            this.setData({isMore: false})
            return false
        }
        var data = result.result.data
        if (data.length < pagination.size) {
            isMore = false
            pagination.pageNum = pagination.pageNum
        } else {
            isMore = true
            pagination.pageNum = pagination.pageNum + 1
        }

        if (!data) {
            isMore = false
            pagination.pageNum = pagination.pageNum
        }

        data.map(item => {
            item.coverImg = API_URL_V2 + "/" + item.coverImg
            item.liveStatusText = LIVE_STATUS_TEXT[item.liveStatus]
            return item
        })
        var list = mergeArray(data, this.data.liveList, "roomid")
        this.setData({
            liveList: list,
            isMore,
            pagination: pagination
        })
    },
    go2livePage(e) {
        var item = e.currentTarget.dataset.item
        var roomId = item.roomid
        wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
        });
    },
});