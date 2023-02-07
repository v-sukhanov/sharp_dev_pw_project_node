const {Router} = require("express");

const router = Router()

router.get('/info', async ({user}, res) =>{
    const {email, name, balance} = user;
    res.status(200).json({
        email,
        name,
        balance
    })
})

module.exports = router;
