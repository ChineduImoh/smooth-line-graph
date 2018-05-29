import { DateTime } from 'luxon';

function timeTick(t0, t1, { start, measure, tickSize, numTicks, getMajor, label, extra }) {
    const theStart = start || DateTime.fromJSDate(new Date(t0 * 1000)).startOf(measure);

    const theNumTicks = numTicks || Math.ceil((t1 - t0) / tickSize) + 1;

    const getTickTime = typeof tickSize === 'function'
        ? index => tickSize(theStart, index)
        : index => theStart.plus({ seconds: index * tickSize });

    return new Array(theNumTicks).fill(0)
        .reduce((ticks, tick, index) => {
            const tickTime = getTickTime(index);
            const major = getMajor(tickTime);

            const mainTick = { time: tickTime.ts / 1000, major, label: label(tickTime, major) };

            if (extra) {
                const extraTick = extra(tickTime);
                if (extraTick) {
                    return ticks.concat([mainTick, extraTick]);
                }
            }

            return [...ticks, mainTick];

        }, []);
}

function timeTickMonthYear(t0, t1) {
    const t0Date = DateTime.fromJSDate(new Date(t0 * 1000));
    const { months: diff } = DateTime.fromJSDate(new Date(t1 * 1000)).diff(t0Date, 'months');
    const numTicks = Math.ceil(diff);

    return timeTick(t0, t1, {
        measure: 'month',
        start: t0Date.startOf('month'),
        tickSize: (start, index) => start.plus({ months: index }),
        getMajor: time => (((time.month - 1) % 6 === 0) >> 0) + (((time.month - 1) % 12 === 0) >> 0),
        numTicks,
        label: (time, major) => {
            if (!major) {
                return false;
            }
            if (time.month === 7) {
                return 'H2';
            }

            return time.toFormat('y');
        }
    });
}
function timeTickWeekMonth(t0, t1) {
    return timeTick(t0, t1, {
        measure: 'week',
        tickSize: 86400 * 7,
        getMajor: () => 0,
        label: time => {
            if (time.date === 1) {
                return false;
            }

            return time.toFormat('d LLL');
        },
        extra: time => {
            if (time.plus({ days: 7 }).hasSame(time, 'month')) {
                return null;
            }

            const endOfMonth = time.endOf('month').plus({ seconds: 1 });

            return { time: Math.round(endOfMonth.ts / 1000), major: 2, label: endOfMonth.toFormat('LLL') };
        }
    });
}

function timeTickDayWeek(t0, t1) {
    return timeTick(t0, t1, {
        measure: 'day',
        tickSize: 86400,
        getMajor: time => (time.weekday === 7) >> 0,
        label: (time, major) => {
            if (!major) {
                return time.toFormat('ccccc');
            }

            return time.toFormat('d LLL');
        }
    });
}
function timeTickHourDay(t0, t1, { width }) {
    const startTime = DateTime.fromJSDate(new Date(t0 * 1000));
    const hourOffset = startTime.hour % 3;
    const pixelsPerDay = width / (t1 - t0) * 86400;
    let hourTick = null;
    if (pixelsPerDay > 150) {
        hourTick = 3;
    }
    else if (pixelsPerDay > 50) {
        hourTick = 6;
    }

    const start = startTime.startOf('hour').plus({ hours: -hourOffset });

    return timeTick(t0, t1, {
        start,
        tickSize: 3600 * 3,
        getMajor: time => (time.hour === 0) >> 0,
        label: (time, major) => {
            if (major) {
                return time.toFormat('ccc');
            }
            if (hourTick && time.hour % hourTick === 0) {
                return time.toFormat('H');
            }

            return false;
        }
    });
}
function timeTickMinuteHour(t0, t1) {
    return timeTick(t0, t1, {
        measure: 'hour',
        tickSize: 1800,
        getMajor: time => ((time.minute === 0) >> 0) + ((time.hour === 0 && time.minute === 0) >> 0),
        label: (time, major) => {
            if (!major) {
                return false;
            }
            if (time.hour === 0) {
                return time.toFormat('ccc');
            }

            return time.toLocaleString(DateTime.TIME_24_SIMPLE);
        }
    });
}
function timeTickSecondMinute2(t0, t1) {
    return timeTick(t0, t1, {
        measure: 'minute',
        tickSize: 60,
        getMajor: time => (time.minute % 10 === 0) >> 0,
        label: (time, major) => {
            if (!major) {
                return false;
            }

            return time.toLocaleString(DateTime.TIME_24_SIMPLE);
        }
    });
}
function timeTickSecondMinute(t0, t1) {
    return timeTick(t0, t1, {
        measure: 'minute',
        tickSize: 30,
        getMajor: time => (time.second === 0) >> 0,
        label: (time, major) => {
            if (!major) {
                return false;
            }

            return time.toLocaleString(DateTime.TIME_24_SIMPLE);
        }
    });
}

export function timeSeriesTicks(t0, t1, options) {
    const range = t1 - t0;

    if (range < 600) {
        return timeTickSecondMinute(t0, t1, options);
    }
    if (range < 3600) {
        return timeTickSecondMinute2(t0, t1, options);
    }
    if (range < 86400 * 0.6) {
        return timeTickMinuteHour(t0, t1, options);
    }
    if (range < 86400 * 8) {
        return timeTickHourDay(t0, t1, options);
    }
    if (range < 86400 * 35) {
        return timeTickDayWeek(t0, t1, options);
    }
    if (range < 86400 * 35 * 12) {
        return timeTickWeekMonth(t0, t1, options);
    }

    return timeTickMonthYear(t0, t1, options);
}

export const getTimeScale = ({ minX, maxX, width, pixX }) => offset => {
    const options = { width };

    // divides the time axis (horizontal) into appropriate chunks
    const ticks = timeSeriesTicks(offset + minX, offset + maxX, options);

    if (ticks) {
        return ticks.map(({ major, time, label }) => ({
            major,
            pix: Math.floor(pixX(time - offset)) + 0.5,
            text: label || null
        }));
    }

    return [];
};

