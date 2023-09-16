const compact_formatter = new Intl.NumberFormat('en', { notation: 'compact' })
const round_formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 10 })
const scientific_formatter = new Intl.NumberFormat('en', { notation: 'scientific' })


const formatDecimal = (value: string) => {
    const toFloat = parseFloat(value);
    if (toFloat === 0) return {
        short: '0',
        long: '0'
    }
    else if (toFloat < 0) {
        return {
            short: 0,
            long: 0
        }
    }
    else if (toFloat < 0.0001) {
        return {
            short: scientific_formatter.format(toFloat),
            long: round_formatter.format(toFloat)
        }
    }
    else {
        return {
            short: compact_formatter.format(toFloat),
            long: round_formatter.format(toFloat)
        }
    }
}


export default formatDecimal;