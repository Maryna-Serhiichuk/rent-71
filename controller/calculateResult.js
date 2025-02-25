const { calculatePayment } = require("./calcularePayment")
const { calculateDifference } = require("./calculateDifference")
const { shapePaymentMessage } = require("./shapePaymentMessage")
const { sendPaymentMessageToGroup } = require('./sendPaymentMessageToGroup')

async function calculateResult() {
    await calculateDifference()
    await calculatePayment()
    const message = await shapePaymentMessage()
    await sendPaymentMessageToGroup(message)
}

module.exports = { calculateResult }