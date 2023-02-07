const {Router} = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const {check, validationResult} = require("express-validator");

const router = Router()

router.get('/userList', async ({user}, res) => {
    const {id} = user;
    try {
        const users = await User.find({_id: {$ne: id}});
        res.status(200).json({
            users: users?.map(x => ({
                id: x.id,
                email: x.email,
                name: x.name
            })) ?? []
        })
    } catch (e) {
        console.log(e)
        return res.status(400).json({errors: ['Bad request']})
    }

})

router.post('/create',
    [
        check('userId', 'User id can\'t be null').exists(),
        check('amount', 'Amount can\'t be null').exists(),
    ]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array().map(x => x.msg)})
        }
        const {id} = req.user;
        let {userId, amount} = req.body;
        try {
            amount = parseFloat(amount);
            const user = await User.findOne({_id: id});
            const recipientUser = await User.findOne({_id: userId});
            if (!user || !recipientUser) {
                return res.status(400).json({errors: ['User can\'t be found']})
            }
            if (user.id === recipientUser.id) {
                return res.status(400).json({errors: ['User can\'t send pw to yourself']})
            }
            if (amount <= 0) {
                return res.status(400).json({errors: ['Incorrect amount']})
            }
            if (amount > user.balance) {
                return res.status(400).json({errors: ['Amount is greater then balance']})
            }
            user.balance -= amount;
            recipientUser.balance += amount;
            const newTransaction = new Transaction({
                senderUser: user,
                recipientUser,
                amount
            })
            await newTransaction.save();
            await user.save();
            await recipientUser.save();
            res.status(200).json({})
        } catch (e) {
            console.log(e)
            return res.status(400).json({errors: ['Bad request']})
        }

    })

router.get('/list', async ({user, body}, res) => {
    const {id} = user;
    try {
        const transactions = await Transaction
            .find({$or: [{senderUser: {$eq: id}}, {recipientUser: {$eq: id}}]} )
            .populate('senderUser recipientUser')
            .sort({created: -1})
        res.status(200).json({
            transactions: transactions.map(x => {
                return {
                    id: x._id,
                    created: x.created,
                    amount: x.amount,
                    senderUser: {
                        id: x.senderUser.id,
                        name: x.senderUser.name,
                        email: x.senderUser.email,
                    },
                    recipientUser: {
                        id: x.recipientUser.id,
                        name: x.recipientUser.name,
                        email: x.recipientUser.email,
                    },
                }
            })
        })
    } catch (e) {
        console.log(e)
        return res.status(400).json({errors: ['Bad request']})
    }

})

module.exports = router;
