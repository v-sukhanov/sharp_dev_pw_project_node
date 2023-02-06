const {Router} = require("express");
const User = require("../models/User");


const router = Router()

router.get('/userInfo', async ({user}, res) =>{
    const {email, name, balance} = user;
    res.status(200).json({
        email,
        name,
        balance
    })
})

router.get('/userList', async ({user}, res) =>{
    const {id} = user;
    const users = await User.find({_id: {$ne: id}});
    res.status(200).json({
        users: users?.map(x => ({
            id: x.id,
            email: x.email,
            name: x.name
        })) ?? []
    })
})

module.exports = router;
