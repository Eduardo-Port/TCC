const nodemailer = require("nodemailer")

const { service, user, pass } = require("../config/mail.json")
const transport = nodemailer.createTransport({
    service,
    auth: { 
        user,
        pass
    }
});

module.exports = transport