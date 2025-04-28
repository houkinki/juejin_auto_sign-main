const got = require('got')

const {autoGame} = require('./autoGame')
const {sendEmail} = require("./common")
const {cookie, aid, uuid, _signature, uid,spider,msToken,a_bogus} = require('./config')

const BASEURL = 'https://api.juejin.cn/growth_api/v1/check_in' // 掘金签到api

const URL = `${BASEURL}?aid=${aid}&uuid=${uuid}&_signature=${_signature}&spider=${spider}&msToken=${msToken}&a_bogus=${a_bogus}`
const DRAW_URL = `https://api.juejin.cn/growth_api/v1/lottery/draw?aid=${aid}&uuid=${uuid}&_signature=${_signature}`
const DRAW_CHECK_URL = `https://api.juejin.cn/growth_api/v1/lottery_config/get?aid=${aid}&uuid=${uuid}`

const G1G = [
    `https://juejin.cn/`,
    `https://juejin.cn/user/center/signin?avatar_menu`,
    `https://juejin.cn/post/7152706764919144455`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
    `https://juejin.cn/post/7153068250794835982`,
];

const HEADERS = {
    cookie,
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
}

// 签到
async function signIn() {
    //去其他页面浏览
    G1G.map(function (item) {
        takeALook(item)
    })
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
    const drawData = await got.get(DRAW_CHECK_URL, {
        hooks: {
            beforeRequest: [
                options => {
                    Object.assign(options.headers, HEADERS)
                }
            ]
        }
    })

    let drawR;
    if (JSON.parse(drawData.body).data.free_count > 0) drawR = await draw(); // 免费次数大于0时再抽

    if (!uid) return;
    // autoGame(); //游戏

    if (typeof res.body == "string")
        res.body = JSON.parse(res.body)
    let signInMsg = res.body.err_no == 0 ? `成功，获得${res.body.data.incr_point}个矿石，矿石总数：${res.body.data.sum_point}个。` : "失败，" + res.body.err_msg

    let drawMsg = "今日已免费抽过奖";
    if (typeof drawR == "string") {
        drawR = JSON.parse(drawR)
        drawMsg = drawR.err_no == 0 ? `成功,抽中：${drawR.data.lottery_name} , 总幸运值：${drawR.data.total_lucky_value}` : `失败${drawR}`
    }



    await sendEmail("掘金自动化", `<p><h4 style="color: cadetblue">签到</h4>${signInMsg}</p><p><h4 style="color: cadetblue">抽奖</h4>${drawMsg}</p>`)

}

/**
 * 去其他页面逛一逛
 * @param url
 * @returns {Promise<string>}
 */
async function takeALook(url) {

    const res = await got.get(url, {
        hooks: {
            beforeRequest: [
                options => {
                    Object.assign(options.headers, HEADERS)
                }
            ]
        }
    })
    return res.body;

}

/**
 * 抽奖
 * @returns {Promise<string>}
 */
async function draw() {
    const res = await got.post(DRAW_URL, {
        hooks: {
            beforeRequest: [
                options => {
                    Object.assign(options.headers, HEADERS)
                }
            ]
        }
    })
    return res.body;
}

signIn()

