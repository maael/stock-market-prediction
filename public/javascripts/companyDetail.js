/**
 * Gets company information and details via the API
 * @requires module:clientAPI
 */
get(window.location.origin + '/api/company?symbol=' + encodeURIComponent(document.body.dataset.symbol), function(response) {
    var historicalData = JSON.parse(response)[0].historicalData;
    var columns = [];
    for(var i = 0; i < historicalData.length; i++) {
        var propertyIndex = 0;
        for(var property in historicalData[i]) {
            if(historicalData[i].hasOwnProperty(property)) {
                if(property !== '_id') {
                    if(i === 0) {columns[propertyIndex] = [property]; }
                    columns[propertyIndex].push(historicalData[i][property]);
                    propertyIndex++;
                }
            }
        }
    }
    var chart = c3.generate({
        bindto: '#chart',
        data: {
            axes: {
                'volume': 'y2'
            },
            x: 'date',
            columns: columns,
            type: 'line'
        },
        axis: {
            x: {
                show: true,
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                show: true
            },
            y2: {
                label: 'Volume',
                show: true
            }
        },
        subchart: {
            show: true
        }
    });
});