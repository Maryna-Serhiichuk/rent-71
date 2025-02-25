const MeterReading = require('./../models/MeterReadings')
const MineralUsage = require('./../models/MineralUsage')

async function calculateDifference() {
    const [lastReading, prevPeriod] = await MeterReading.find({}).sort({ createdAt: -1 }).limit(2)

    const mineralUsage = {
        gas: lastReading.gas - prevPeriod.gas,
        water: lastReading.water - prevPeriod.water,
        day: lastReading.day - prevPeriod.day,
        night: lastReading.night - prevPeriod.night
    }

    const used = new MineralUsage({ ...mineralUsage, period: lastReading.period })
    await used.save()
}

module.exports = { calculateDifference }