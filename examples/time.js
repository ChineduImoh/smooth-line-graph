import { renderToString } from 'react-dom/server';
import React from 'react';
import TimeGraph from '../lib/TimeGraph';

export function LineGraphTime() {
    const series = [
        [1412117999, 488973],
        [1414799999, 420502],
        [1417391999, 394682],
        [1420070399, 416382],
        [1422748799, 419455],
        [1425167999, 339405],
        [1427842799, 367635],
        [1430434799, 351660],
        [1433113199, 332654],
        [1435705199, 247359],
        [1438383599, 208390],
        [1441061999, 156520],
        [1443653999, 839480],
        [1446335999, 641599],
        [1448927999, 543787],
        [1451606399, 556649],
        [1454284799, 649386],
        [1456790399, 570000],
        [1459465199, 572000],
        [1462057199, 733500],
        [1464735599, 654500],
        [1467327599, 529500],
        [1470005999, 462157],
        [1472684399, 434353],
        [1475276399, 1120000],
        [1477958399, 1080000],
        [1480550399, 1000000],
        [1483228799, 1047371],
        [1485907199, 1242000],
        [1488326399, 1234689],
        [1491001199, 1270413],
        [1493593199, 1475003],
        [1496271599, 1307301],
        [1498863599, 1080638],
        [1501541999, 953822],
        [1504220399, 1034252],
        [1506812399, 1062600],
        [1509494399, 1146432],
        [1512086399, 1225625],
        [1514764799, 1258291],
        [1517443199, 1272302],
        [1519862399, 1345000],
        [1522537199, 1440000],
        [1525129199, 1606566],
        [1527807599, 1673130],
        [1530399599, 1747424],
        [1533077999, 1791964],
        [1535756399, 1845292],
        [1538348399, 1904441],
        [1541030399, 1950882],
        [1543622399, 1993966],
        [1546300799, 2040936],
        [1548979199, 2088656],
        [1551398399, 2070119],
        [1554073199, 2044580]
    ];

    const props = {
        name: 'graph-time',
        width: 500,
        height: 300,
        startTime: 150000000,
        padding: [20, 0, 20, 0],
        lines: [
            {
                key: 'rwdata',
                data: series,
                smooth: true,
                color: ([valX]) => {
                    if (valX < 1527807600) {
                        return '#06c';
                    }

                    return '#c06';
                }
            }
        ]
    };

    return (
        <TimeGraph {...props} />
    );
}

function render() {
    return renderToString(<LineGraphTime />);
}

if (require.main === module) {
    const output = render();

    console.log(output);
}

