const { Router } = require('express')
const router = Router()


router.post('/signup', (req, res) => {
    console.log(req.body)
    res.status(201).json({})
})

router.post('/signup', (req, res) => {
    console.log(req.body)
    res.status(201).json({})
})

module.exports = router;
