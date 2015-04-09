/**
 * Highcharts sparkline chart
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
    angular.module('MyApp').
        service('SparklineChart', [

            'APP_CONFIG',
            function(APP_CONFIG){

                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                var drawChart = function( config ) { 
                    $( config.chartContainer ).highcharts({
                        chart: {
                            type: config.chartType,
                            animation: Highcharts.svg, // don't animate in old IE
                            marginRight: config.marginRight,
                            marginTop: config.marginTop,
                            marginBottom: config.marginBottom,
                            width: config.width,
                            height: config.height,
                            backgroundColor: config.backgroundColor,    //no background for chart which same as transparent
                            events: {
                                load: function () {
                                    // set up the updating of the chart each second
                                    var series = this.series[0];
                                    setInterval(function () {
                                        var x = (new Date()).getTime(), // current time
                                            y = Math.floor(Math.random() * ( config.max - config.min + 1 ) + config.min);
                                        series.addPoint([x, y], true, true);
                                    }, 1000);
                                }
                            }
                        },
                        title: { text: '' },
                        xAxis:{ lineWidth: 0, minorTickLength: 0, tickLength: 0, labels: { enabled: false }, title: { text: null } },
                        yAxis: { gridLineWidth: 0, labels: { enabled: false }, title: { text: null } },
                        plotOptions: { area: { fillOpacity: 0.5 }, series: { marker: { enabled: false } } },
                        credits: { enabled: false },
                        tooltip: { formatter: function () { return this.y; } },
                        legend: { enabled: false },
                        exporting: { enabled: false },
                        series: [{
                            name: config.seriesTitle,
                            color: config.seriesColor,
                            data: (function () {
                                var data = [], time = (new Date()).getTime(), i;
                                for (i = -19; i <= 0; i += 1) {
                                    data.push({ x: time + i * 1000, y: Math.floor(Math.random() * ( config.max - config.min + 1 ) + config.min) });
                                }
                                return data;
                            }())
                        }]
                    });
                };

                return {
                    drawChart: drawChart
                };
            }]);
        
})(angular);