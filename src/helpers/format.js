function round(number, sigFigs) {
    const exp = 10 ** sigFigs;

    if (number > exp) {
        return number.toFixed();
    }

    return String(Math.round(number * exp) / exp);
}

export const defaultFormatValue = (value, log = false) => round(value, (log >> 0) * 10);

