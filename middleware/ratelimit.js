// it is use for user to login in limit for limmited time
const limit = require("express-rate-limit");

module.exports = limit({
    windowMs: 15*60*1000,
    max: 5,
    message: "Too many login attempts try again later"
})