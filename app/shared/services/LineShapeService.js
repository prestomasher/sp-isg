/**
 * Draws svg lines to a canvas using d3.js
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
    angular.module('MyApp').
        service('LineShapeService', [

            function(floorModel){
                // These factors are the result of ImgWidth / realWidthInFeet Example: factorX = (600 / 185.58)
                var factorX = 3.233107016,
                    factorY = 2.866688221;

                var pixels2SVGCanvas = function(factor, pixels) {
                    return factor * pixels;
                };

                var drawShapes = function(config) {

                    //The data for our line
                    var lineData = config.dataset;

                    //This is the accessor function we talked about above
                    var lineFunction = d3.svg.line()
                        .x(function(d) { return pixels2SVGCanvas(factorX, d.latitude); })
                        .y(function(d) { return pixels2SVGCanvas(factorY, d.longitude); })
                        .interpolate("linear");

                    //The line SVG Path we draw
                    var lineGraph = config.svgParent.append("path")
                        .attr("d", lineFunction(lineData))
                        .attr("stroke", "#e53400")
                        .style("stroke-dasharray", ("5, 3"))
                        .attr("stroke-width", 2)
                        .attr("fill", "none");
                        
                };

                return {
                    drawShapes: drawShapes
                };
            }]);
        
})(angular);