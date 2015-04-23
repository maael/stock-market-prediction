/**
 * Gets company information and details via the API
 * @requires module:clientAPI
 */
get(window.location.origin + '/api/company?symbol=' + encodeURIComponent(document.body.dataset.symbol), function(response) {
    var companyJSON = JSON.parse(response)[0];
    console.log(companyJSON);
    drawGraph(companyJSON.historicalData);
    updateCurrentInfo(companyJSON.quotes);
    updatePreviousInfo(companyJSON.quotes);
    function updateCurrentInfo(quotes) {
        var recentQuote = quotes[quotes.length - 1];
        document.getElementById('currentTime').innerHTML = moment(recentQuote.Timestamp).format('DD/MM/YY HH:mm').toString();
        document.getElementById('currentHigh').innerHTML = recentQuote.High.toString();
        document.getElementById('currentLow').innerHTML = recentQuote.Low.toString();
        document.getElementById('currentOpen').innerHTML = recentQuote.Open.toString();
        document.getElementById('currentLast').innerHTML = recentQuote.LastPrice.toString();
        document.getElementById('currentVolume').innerHTML = recentQuote.Volume.toString();
        document.getElementById('currentChange').innerHTML = recentQuote.Change.toFixed(2).toString() + " (" + recentQuote.ChangePercent.toFixed(2).toString() + "%)";
    }
    function updatePreviousInfo(quotes) {
        var previousQuote = quotes[quotes.length - 2];
        document.getElementById('previousTime').innerHTML = moment(previousQuote.Timestamp).format('DD/MM/YY HH:mm').toString();
        document.getElementById('previousHigh').innerHTML = previousQuote.High.toString();
        document.getElementById('previousLow').innerHTML = previousQuote.Low.toString();
        document.getElementById('previousOpen').innerHTML = previousQuote.Open.toString();
        document.getElementById('previousLast').innerHTML = previousQuote.LastPrice.toString();
        document.getElementById('previousVolume').innerHTML = previousQuote.Volume.toString();
        document.getElementById('previousChange').innerHTML = previousQuote.Change.toFixed(2).toString() + " (" + previousQuote.ChangePercent.toFixed(2).toString() + "%)";
    }
    function drawGraph(historicalData) {
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
            },
            oninit: function() {
               document.getElementsByTagName('body')[0].className = 'graphLoaded'; 
            }
        });
    }
});