const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const router = Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.post('/signup',
    [
        check('name', 'The name must contain at least 1 character').isLength({min: 1}),
        check('email', 'The email is incorrect').isEmail(),
        check('password', 'The name must contain at least 6 characters').isLength({min: 6}),
        check('password', 'The name must contain only alpha or numeric characters').isAlphanumeric(),
        check('confirm_password', 'The passwords doesn\'t equal').custom((value, {req}) => (value === req.body.password) && value)
    ]
    , async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array().map(x => x.msg)})
        }
        const {name, email, password} = req.body
        try {
            const user = await User.findOne({email})
            if (user) {
                return res.status(400).json({errors: ['User already exists']})
            }
            const newUser = new User({
                email,
                name,
                password
            })
            await newUser.save();
            res.status(201).json({})
        } catch (e) {
            console.log(e)
            return res.status(400).json({errors: ['Bad request']})
        }

    })

router.post('/signin',
    [
        check('email', 'The email is incorrect').isEmail(),
        check('password', 'The password is empty').isLength({min: 1}),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array().map(x => x.msg)})
        }
        const {email, password} = req.body
        try {
            const user = await User.findOne({email})
            if (!user || !user.checkPassword(password)) {
                return res.status(400).json({errors: ['The email or password is incorrect']})
            }
            const token = jwt.sign(
                {user_id: user.id,},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            res.status(200).json({
                token
            })
        } catch (e) {
            console.log(e)
            return res.status(400).json({errors: ['Bad request']})
        }

    })

module.exports = router;
