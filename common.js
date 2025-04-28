const nodeMailer = require('nodemailer');
const {emailInfo} = require("./config");


let sendEmail = async (subject, html) => {
    let {user, from, to, pass} = emailInfo;
    const transporter = nodeMailer.createTransport({service: '163', auth: {user, pass}});
    transporter.sendMail({from, to, subject, html}, (err) => {
        if (err) return console.log(`发送邮件失败：${err}`);
        console.log('发送邮件成功')
    })
}

exports.sendEmail = sendEmail