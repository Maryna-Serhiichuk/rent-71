const MeterReading = require('../models/MeterReadings')
const PaymentSummary = require('../models/PaymentSummary')
const MineralUsage = require('../models/MineralUsage')
const { prices } = require('./mineralPrices')
const emoji = require('../source/month-emoji.json')

const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, '../source/message.txt'), 'utf-8');

async function shapePaymentMessage() {
    const [lastReading, prevPeriod] = await MeterReading.find({}).sort({ createdAt: -1 }).limit(2)
    const paymentInvoice = await PaymentSummary.findOne({}).sort({ createdAt: -1 })
    const used = await MineralUsage.findOne({}).sort({ createdAt: -1 })

    const variables = {
        emoji: emoji[paymentInvoice.period],
        month: getMonthName(paymentInvoice.period),
        lastControl: formatDate(prevPeriod.createdAt),
        currentControl: formatDate(lastReading.createdAt),
        
        lastDay: prevPeriod.day,
        currentDay: lastReading.day,
        usedDay: used.day,
        priceDay: prices.electricity.day,

        lastNight: prevPeriod.night,
        currentNight: lastReading.night,
        usedNight: used.night,
        priceNight: prices.electricity.night,

        lastGas: prevPeriod.gas,
        currentGas: lastReading.gas,
        usedGas: used.gas,
        priceGas: prices.gas,

        lastWater: prevPeriod.water,
        currentWater: lastReading.water,
        usedWater: used.water,
        priceWater: prices.water,

        costDay: paymentInvoice.day,
        costNight: paymentInvoice.night,
        costGas: paymentInvoice.gas,
        costWater: paymentInvoice.water,

        sum: paymentInvoice.sum,
    }

    const formattedMessage = fillTemplate(template, variables);
    return formattedMessage
}

const fillTemplate = (template, variables) => {
    return Object.keys(variables).reduce((acc, key) => {
        const regex = new RegExp(`\\$\\{${key}\\}`, 'g')
        return acc.replace(regex, variables[key])
    }, template);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(date);
}

const getMonthName = (monthNumber) => {
    return new Intl.DateTimeFormat("uk-UA", { month: "long" })
        .format(new Date(2000, monthNumber))
        .replace(/^./, (c) => c.toUpperCase())
}


module.exports = { shapePaymentMessage }