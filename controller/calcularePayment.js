const PaymentSummary = require('./../models/PaymentSummary')
const MineralUsage = require('./../models/MineralUsage')
const { prices } = require('./mineralPrices')

function coltrolFloat(number) {
    return parseFloat(number.toFixed(2))
}

async function calculatePayment() {
    const used = await MineralUsage.findOne({}).sort({ createdAt: -1 })

    const cost = {
        water: coltrolFloat(used.water * prices.water),
        gas: coltrolFloat(used.gas * prices.gas),
        day: coltrolFloat(used.day * prices.electricity.day),
        night: coltrolFloat(used.night * prices.electricity.night)
    }

    const sum = Object.values(cost).reduce((acc, value) => acc + value, 0);

    const payment = new PaymentSummary({ ...cost, sum, period: used.period })
    await payment.save()
}

module.exports = { calculatePayment }