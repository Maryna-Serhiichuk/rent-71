const { ObjectId } = require('mongodb')

const MeterReading = require('./../models/MeterReadings')
const { meterFormat } = require('./meterFormat')
const { meterLabel } = require('./meterLabel')
const { callHelpMessage } = require('./helpMessage')
const { calculateResult } = require("./calculateResult")

function findClosestValue(maters, target) {
    const neededMeters =  {
        gas: maters.gas,
        water: maters.water,
        day: maters.day,
        night: maters.night
    }

    const formatedMeters = Object.entries(neededMeters).filter(it => it[1])

    let closest = formatedMeters[0]
    let minDifference = Math.abs(target - closest[1])
  
    for (let i = 1; i < formatedMeters.length; i++) {
      const difference = Math.abs(target - formatedMeters[i][1])
      if (difference < minDifference) {
        closest = formatedMeters[i]
        minDifference = difference
      }
    }

    const isOk = () => {
        const dif = target - closest[1]
        switch (closest[0]) {
            case 'water':
                return dif > 10
            case 'gas':
                return dif > 150
            case 'day':
                return dif > 200
            case 'night':
                return dif > 150
        }
    }

    const state = target < closest[1] ? 'less' : isOk() ? 'more' : 'ok'

    const response = {
        target,
        state,
        type: closest[0],
    }

    let message = returnUnvaliableMessage({ ...response, target })
    if(message) {
        message = message + callHelpMessage(target)
    }

    return {
        ...response,
        message
    }
}

function returnUnvaliableMessage(result) {
    if(result.state === 'more') {
        return `Це сильно велика різниця за ${meterLabel[result.type]}.\n`+
            `Якщо це дійсно показник за ${meterLabel[result.type]}, то напиши показник у такому форматі ${meterFormat(result.type, result.target)}`
    } else if (result.state === 'less') {
        return `Схоже, ти намагаєшся передати показник лічильника за ${meterLabel[result.type]} менший, ніж минулого місяця`
    }
    return false
}

function checkLeftovers(object) {
    const leftOvers = {
        gas: object.gas ?? null,
        water: object.water ?? null,
        day: object.day ?? null,
        night: object.night ?? null,
    }

    if(!leftOvers?.gas || !leftOvers?.water || !leftOvers?.day || !leftOvers?.night ) {
        return '\n\n' + 'Залишилось внести за:\n' + Object.entries(leftOvers).filter(val => !val[1]).map(val => '- ' + meterLabel[val[0]]).join(',\n')
    } else {
        calculateResult() // повідомлення має відправлятись в чат
        return '\n\nРезультат буде надісланий в звичайну групу\nЗа змогою, не забудь додати фоторафії\nДякую!'
    }
}

async function setOrUpdateMeters(parsedValue, meterType) {
    const [lastReading, prevPeriod] = await MeterReading.find({}).sort({ createdAt: -1 }).limit(2)
    let date = new Date()
    if (date.getDate() <= 5) {
        date.setMonth(date.getMonth() === 0 ? 12 : date.getMonth() - 1)
    }

    let message = ''
    let additionMessage
    let savedMeterReadings
    let type = meterType

    const currentMonth = date.getMonth();
    const referenceReading = lastReading.period === currentMonth ? prevPeriod : lastReading;

    if(!type) {
        const result = findClosestValue(referenceReading, parsedValue)
        type = result.type
    
        if(result.message) return { message: result.message }
    }

    if(meterType) {
        if(referenceReading[type] > parsedValue) {
            return { message: returnUnvaliableMessage({ state: 'less', type: meterType }) }
        }
    }

    if(lastReading.period === currentMonth) {
        savedMeterReadings = await MeterReading.findByIdAndUpdate(
            new ObjectId(lastReading._id), 
            { $set: { [type]: parsedValue } }, 
            { new: true }
        )

        message = 'Внесено за ' + meterLabel[type]

    } else {
        if(!lastReading.gas || !lastReading.water || !lastReading.day || !lastReading.night) return { message: 'Це погано, що ти не внесла значення за минулий місяць. Напиши Марині' } // TODO: need to handle it

        const meter = new MeterReading({ [type]: parsedValue, period: currentMonth })
        savedMeterReadings = await meter.save()

        const now = date;
        const monthName = new Intl.DateTimeFormat('uk-UA', { month: 'long' }).format(now);

        message = 'Вітаю тебе, дякую що вносиш показники лічильників за ' + monthName.toUpperCase() + ' період\n\nЦе було значення за ' + meterLabel[type].toUpperCase() + '\nНе зупиняйся!'
    }

    additionMessage = checkLeftovers(savedMeterReadings)
    message = message + additionMessage
    message = message + callHelpMessage(parsedValue)

    return {
        message
    }
}

module.exports = { setOrUpdateMeters }