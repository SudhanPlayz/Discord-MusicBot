export function isNumber(v: any): v is number {
    return typeof v === 'number';
}

export function pad2digit(d: number) {
    if (d < 10) {
        return `0${d}`;
    }

    return `${d}`;
}

export function formatDuration(dur: number) {
    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;

    const hour = Math.floor(dur / hourMs);
    const minute = Math.floor(dur / minuteMs);
    const second = Math.round((dur % minuteMs) / 1000);

    return (
        (hour > 0 ? `${pad2digit(hour)}:` : '') +
        `${pad2digit(minute)}:${pad2digit(second)}`
    );
}
