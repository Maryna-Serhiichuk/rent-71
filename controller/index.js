const { handleMessage } = require('./Telegram')

async function handler(req, method) {
    const { body } = req
    if(body) {
        if(body.message) {
            const messageObj = body.message
            await handleMessage(messageObj)
        } else {
            //channel_post
            return
        }
        
    }
    return
}

module.exports = { handler }