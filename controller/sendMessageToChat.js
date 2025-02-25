const { axiosInstance } = require("./axios");

function sendMessageToChat(chatId, messageText) {
    return axiosInstance.get('sendMessage', {
        chat_id: chatId,
        text: messageText,
        parse_mode: "HTML"
    })
}

module.exports = { sendMessageToChat }