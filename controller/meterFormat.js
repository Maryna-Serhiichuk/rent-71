const identifier = '+'

function meterFormat(meter, target) {
    return identifier + meter + '/' + target

}

module.exports = {
    identifier,
    meterFormat
}