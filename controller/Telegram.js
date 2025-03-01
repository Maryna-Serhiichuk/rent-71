const { helpMessage } = require("./helpMessage");
const { setOrUpdateMeters } = require("./setOrUpdateMeters");
const { identifier } = require('./meterFormat');
const { shapePaymentMessage } = require("./shapePaymentMessage")
const { sendMessageToChat: sendMessage } = require('./sendMessageToChat')

function parseInteger(str) {
    const parsed = parseInt(str, 10);

    if (isNaN(parsed)) return false
    if (parseFloat(str) !== parsed) return false

    return parsed
}

async function handleMessage(messageObj) {
    const messageText = messageObj.text || ""
    const chatId = messageObj.chat.id

    if(messageText.charAt(0) === '/'){
        const command = messageText.substr(1)

        switch (command) {
            case 'start':
                return sendMessage(chatId, "Внось кожен показник почергово. Лише цифри.")
            case 'help':
                return sendMessage(chatId, helpMessage('9999'))
            case 'result':
                return sendMessage(chatId, await shapePaymentMessage())
            default:
                return sendMessage(chatId, "Don't understand you")
        }
    } else {
        let message = "Щось не дуже зрозуміло\n\nСпробуй вносити, лише, цифри"
        let value = messageText
        let meterType = undefined

        if(messageText.charAt(0) === identifier) {
            const command = messageText.substr(1)
            const parsedCommand = command.split('/')
            meterType = parsedCommand[0]
            value = parsedCommand[1]
        }

        const parsedValue = parseInteger(value)
        if(parsedValue) {
            const result = await setOrUpdateMeters(parsedValue, meterType)
            message = result.message
        }

        return sendMessage(chatId, message)
    }
}

module.exports = { handleMessage }