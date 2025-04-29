const got = require('got')

const {autoGame} = require('./autoGame')
const {sendEmail} = require("./common")
const {cookie, aid, uuid, _signature, uid,spider,msToken,a_bogus} = require('./config')

const BASEURL = 'https://api.juejin.cn/growth_api/v1/check_in' // 掘金签到api

const URL = `${BASEURL}?aid=${aid}&uuid=${uuid}&spider=${spider}&msToken=${msToken}&a_bogus=${a_bogus}`

const HEADERS = {
    cookie,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
}

// 签到
async function signIn() {
    //签到
    const res = await got.post(URL, {
        hooks: {
            beforeRequest: [
                options => {
                    Object.assign(options.headers, HEADERS)
                }
            ]
        }
    })


    if (!uid) return;
    // autoGame(); //游戏
    if (typeof res.body == "string")
        console.log(res.body)
        res.body = JSON.parse(res.body)
    let signInMsg = res.body.err_no == 0 ? `成功，获得${res.body.data.incr_point}个矿石，矿石总数：${res.body.data.sum_point}个。` : "失败，" + res.body.err_msg


    await sendEmail("掘金自动化", `<p><h4 style="color: cadetblue">签到</h4>${signInMsg}</p><p></p>`)

}


signIn()

