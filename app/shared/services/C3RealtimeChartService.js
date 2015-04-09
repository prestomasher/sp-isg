/**
 * C3 sparkline chart
 * c3 is a D3-based reusable chart library that enables deeper integration of charts into web applications.
 * Follow the link for more information: http://c3js.org
 *
 * License: MIT
 *
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
    angular.module('MyApp').
    service('C3RealtimeChartService', [

        'APP_CONFIG',
        function(APP_CONFIG) {
            var drawChart = function(config) {
                var chart = c3.generate({
                    bindto: config.chartContainer,
                    size: {
                        width:  config.width,
                        height: config.height
                    },
                    data: config.dataConfig,
                    color: {
                        pattern: [APP_CONFIG.SUCCESS_COLOR]
                    },
                    axis: {
                        y: {
                            show: false
                        },
                        x: {
                            show: false
                        },
                    },
                    legend: {
                        show: false
                    },
                    tooltip: {
                        contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
                            return "<div class='chart-tooltip'>" + d[0].name + ":" + d[0].value + "</div>";
                        }
                    },
                    point: {
                        show: false
                    }
                });

                return chart;
            };

            return {
                drawChart: drawChart
            };
        }
    ]);

})(angular);
