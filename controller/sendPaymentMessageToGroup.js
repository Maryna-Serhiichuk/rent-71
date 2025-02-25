const { sendMessageToChat } = require('./sendMessageToChat');

async function sendPaymentMessageToGroup(message) {
    await sendMessageToChat(process.env.CHAT_ID, message)
}

module.exports = { sendPaymentMessageToGroup }