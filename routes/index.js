const router = require('express').Router()


router.use("/", require('./products'));
router.use("/admin", require('./admin'));
router.use("/auth", require('./auth'));

module.exports = router