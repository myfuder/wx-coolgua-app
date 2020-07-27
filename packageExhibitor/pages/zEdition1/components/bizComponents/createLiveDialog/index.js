// packageExhibitor/pages/zEdition1/components/bizComponents/createLiveDialog/index.js
import { getString } from "../../../../../../locals/lang.js";
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visibleDialog: {
      type:Boolean
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        label: {
          Live_video_theme: getString('wp', 'app.live.theme'),
          placeHolder: getString('wp', 'app.live.theme.placeholder'),
          posterImg: getString('wp', 'app.live.poster'),
          start:getString('wp', 'app.live.btn.start'),
        }
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imageSrc: '',
    inputTheme: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
      this.triggerEvent('handleDialog', false)
      this.setData({
        imageSrc:'',
        inputTheme: ''
      })
      this.liveTheme = ''
    },
    getInputValue(e) {
      this.liveTheme = e.detail.value
      console.log(e.detail.value)
    },
    submit(){
      if(!this.liveTheme) {
        wx.showToast({
          title: '请输入主题',
          icon: 'none'
        })
        return
      } else if (!this.data.imageSrc) {
        wx.showToast({
          title: '请问添加封面图片',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('handleDialog', false)
      this.startLive(this.liveTheme, this.data.imageSrc)
      this.setData({
        imageSrc:'',
        inputTheme: ''
      })
      this.liveTheme = ''
      
    },
    startLive(theme, imageSrc) {
      let param = {
        "projectId": wx.getStorageSync('activityDetail').id,
        "supplierId": wx.getStorageSync('userInfo').id,
        "companyId": wx.getStorageSync('activityDetail').companyId,
        "theme": theme,
        "coverImage": imageSrc
      };
      let url = app.globalData.host + `/api3/live/getPushUrl`
      wx.request({
        url: url,
        data: param,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == '0') {
            let liveUrl = res.data.result.pushUrl
            let liveId = res.data.result.liveId
            let param = {liveUrl, liveId}
            param = JSON.stringify(param)
            param = encodeURIComponent(param)
            wx.navigateTo({
              url: `/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index?param=${param}`,
            })
          } else {
            wx.showToast({
              title: '暂时无法开始直播',
              icon: 'none'
            })
          }
        },
        fail: function (error) {
          wx.showToast({
            title: '暂时无法开始直播',
            icon: 'none'
          })
        }
      })
    },
    uploadImage() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          for (let i = 0; i < res.tempFiles.length; i++) {
            wx.uploadFile({
              url: app.globalData.host + '/api3/file/upload',
              files:res.tempFiles[i],
              filePath: res.tempFilePaths[i],
              fileType: 'image',
              name: 'file',
              success: (res) => {
                console.log(JSON.parse(res.data).code)
                if (JSON.parse(res.data).code=='0') {
                  var path= app.globalData.host+'/' +JSON.parse(res.data).result
                  this.setData({
                    imageSrc: path
                  });
                } else{
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              },
              fail: (err) => {
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
          console.log('chooseImage fail', err)
        }
      })
    }
  }
})
