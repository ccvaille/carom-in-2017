const splitBoundary = 80;
export const weeklyNameMap = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
};

export function genSeriesDot(color) {
    return `
        <span
            style="
                display: inline-block;
                border-radius: 40%;
                width: 10px;
                height: 10px;
                padding-right: 5px;
                background-color: ${color};
            "
        ></span>
    `;
}

export function genValue(value, isPercent = false) {
    if (value === 0 || value) {
        if (isPercent) {
            return `${value}%`;
        }

        return value;
    }

    return '-';
}

export function genTooltipLine(param, isPercent = false) {
    const value = genValue(param.value, isPercent);
    const dot = genSeriesDot(param.color);

    return `${dot}${param.seriesName}： ${value}`;
}

export function genChartTipHtml(param) {
    let percent = param.percentage;
    if (/\d+/.test(percent)) {
        percent += '%';
    }
    const dot = genSeriesDot(param.color);
    let splitName = param.name;

    if (splitName.length > splitBoundary) {
        let start = 0;
        let end = 0;
        const splitNameList = [];
        const times = Math.floor(param.name.length / splitBoundary);
        for (let i = 0; i <= times; i++) {
            start = i + end;
            end = splitBoundary * (i + 1);
            splitNameList.push(param.name.substr(start, end));
        }

        splitName = splitNameList.join('<br>');
    }

    return `
        ${splitName}<br>
        ${dot}${param.seriesName}: ${param.value} (${percent})
    `;
}

export function getComparePercent(current, last) {
    if (current === last) {
        return '--';
    } else if (last === 0) {
        // 上期为0，特殊处理
        return '--';
    }

    return Math.round(((current - last) / last) * 100);
}

export function filterParams(params, isExport = false) {
    const paramsCopy = JSON.parse(JSON.stringify(params));
    delete paramsCopy.pickerStart;
    delete paramsCopy.pickerEnd;
    if (
        ('dateType' in paramsCopy && paramsCopy.dateType !== 4) ||
        ('date' in paramsCopy && paramsCopy.date !== 4)
    ) {
        delete paramsCopy.startDate;
        delete paramsCopy.endDate;
    }

    if (isExport) {
        paramsCopy.out = 1;
    }

    return paramsCopy;
}

export function sortRemoteData(key) {
    return (a, b) => b[key] - a[key];
}

export function mergeEveryTwo(data, key) {
    if (!data.length) return [];

    const result = [];
    for (let i = 0; i < data.length; i += 2) {
        if (data[i + 1]) {
            result.push(data[i][key] + data[i + 1][key]);
        }
    }

    return result;
}

export function mergeEveryTwoSplit(data, key) {
    if (!data.length) return [];

    const result = [];
    for (let i = 0; i < data.length; i += 2) {
        if (data[i + 1]) {
            result.push((data[i][key] + data[i + 1][key]) / 2);
        }
    }

    return result;
}

export const timesNameMap = {
    firstTimeName: '00:00-01:59',
    secondTimeName: '02:00-03:59',
    thirdTimeName: '04:00-05:59',
    fourthTimeName: '06:00-07:59',
    fifthTimeName: '08:00-09:59',
    sixthTimeName: '10:00-11:59',
    seventhTimeName: '12:00-13:59',
    eighthTimeName: '14:00-15:59',
    ninthTimeName: '16:00-17:59',
    tenthTimeName: '18:00-19:59',
    eleventhTimeName: '20:00-21:59',
    twelfthTimeName: '22:00-23:59',
};
