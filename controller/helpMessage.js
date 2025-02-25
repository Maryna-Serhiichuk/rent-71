const { meterLabel } = require("./meterLabel")
const { meterFormat, identifier } = require('./meterFormat')

function helpMessage(target) {
    const metersTypes = Object.entries(meterLabel)
    return `\n\nЯкщо це показник за інший лічильник, то внеси відповідний формат, де:\n` +
        metersTypes.map(it => `${meterFormat(it[0], target)} - як показник за ${it[1].toUpperCase()}`).join('\n') +
        `\n\nЗначення обов'язково має починатись із ідентифікатора "${identifier}"`
}

function callHelpMessage(){
    return `\n\nЯкщо тип лічильника був невірно визначений, дізнайся тут - /help як виправити значення. Дотримуйся іструкції`
}

module.exports = { helpMessage, callHelpMessage }