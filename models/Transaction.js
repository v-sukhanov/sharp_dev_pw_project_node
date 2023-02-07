const {Schema, model} = require('mongoose');

const Transaction = new Schema({
    senderUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipientUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = model('Transaction', Transaction);
