const express = require('express')


const PORT = process.env.PORT || 3000

const app = express();
app.use('/auth', require('./routes/auth.routes'))

const start = async () => {
    try {
        // mongoose.set("strictQuery", false);
        //
        // await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
        app.listen(PORT, () => {
            console.log('server has been started')
        })
    } catch (e) {
        console.log(e)
    }
}

start()