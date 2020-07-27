import { genTestUserSig } from '../../../../../debug/GenerateTestUserSig.js'
Page({
    data: {
        password: '',
        userIDList: new Array(30).fill().map((item, idx) => ('user' + idx)),
        selectedIndex: 1,
        loading: false
    },
    // 页面加载
    onLoad: function() {
        // this.loading = false
        console.log('time', Math.floor(Math.random() * 50 + 50));
    },
    onshow: function() {
        // handleLogin();

    },
    // 点击登录进行初始化
    handleLogin() {
        // const userID = this.userIDList[this.selectedIndex]
        const userID = (Math.floor(Math.random() * 50 + 50) + 10000000).toString()
        console.log('userID->', userID)
            // case1: 要登录的用户是当前已登录的用户，则直接跳转即可::TODO,整合的时候需要处理
            // if (this.myInfo.userID && userID === this.myInfo.userID) {
            //     wx.switchTab({ url: '../index/main' })
            //     return
            // }

        // this.loading = true
        // case2: 当前已经登录了用户，但是和即将登录的用户不一致，则先登出当前登录的用户，再登录
        // if (this.myInfo.userID) {
        //     // this.$store.dispatch('resetStore')
        //     wx.$app.logout()
        //         .then(() => {
        //             this.login(userID)
        //         })
        //     return
        // }
        // case3: 正常登录流程
        // this.login(userID)
        wx.$app.logout()
        this.login(userID)
    },
    login(userID) {
		userID = '10002'
        console.log('userID->', userID)
        wx.$app.login({
            userID:userID,
            userSig: genTestUserSig(userID).userSig
        }).then(() => {
            wx.redirectTo({
                    url: '../list/list'
                })
                // wx.switchTab({ url: '../index/main' })
        }).catch(() => {
            this.loading = false
        })
    },
    choose(event) {
        this.selectedIndex = Number(event.mp.detail.value)
    }
})