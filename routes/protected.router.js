const {Router} = require("express");


const router = Router()

router.get('/userInfo', async (req, res) =>{
    res.status(200).json({})
})

module.exports = router;
