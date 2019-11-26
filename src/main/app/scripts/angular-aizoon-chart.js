/*
 * Questo file ha un insieme di chart e grafi realizzati con la libreria d3,
 * essi sono registrati come direttive angular, ognuna delle direttive si aspetta un array di dati e un oggetto options che ne configura il comportamento.
 * 
 * I dati sono in formato chiave : valore , la chiave è specificata in un campo options
 * 
 * L'oggetto options ha queste configurazioni
 * 
 * {
        title: {
          left: "titleLeft",
          center: "titleCenter",
          right: "titleRight"
        },
        axis: {
            x: {
                key:'date',
                title: 'attrs.xaxisName',
                pos:"center", //Possibili valori, left right center
                domain:[new Date(2012, 0, 1), new Date(2012, 1, 1)],//Dominio iniziale, potrebbe none ssere specificato e ricalcolato ad ogni nuovo dato immesso
                domainSelect: [new Date(2012, 0, 1,3), new Date(2012, 0, 2,6)],//selezione iniziale del brush, opzionale
                tick:0,
                interval: 0
            },
            y: {
                key:'frequency',
                title: 'attrs.yaxisName',
                pos:"center",
                format:".2f", //Usa le specifiche introdotte da python https://docs.python.org/release/3.1.3/library/string.html#formatspec, esempi numerosenza formattazione:"", numero con 5 cifre dopo la virgola ".5f", formattazione percentuale:"%", formattazione percentuale con segno positivo/negativo "+,%" 
                domain:null //Come il dominio x
                tick:0
            }
        },
        margin: {
            top : 20,
            right : 0,
            bottom : 30,
            left : 40
        },
        event:{//Queste funzioni vengono richiamate quando si scatena l'evento corrispondente
                onBrushMove:funzionedaspecificare,
                onBrushEnd:funzionedaspecificare,
                onMouseOver:funzionedaspecificare
        },
        render:{
            groupTip:funzione per il tip
        }
}

 * 
 * */

(function () {
    angular.module("ngAizoonChart", []);
    angular.module("ngAizoonChart").directive("barsChart", barsChart);
    barsChart.$inject = ["$window"];

    function barsChart($window) {

        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            template: "<div class='ngAizoonChart' style='height: 100%;'>" +
                "<div class='title'style='float: left!important;' ng-if='options.title.left'>" +
                "{{options.title.left}}" +
                "</div>" +
                "<div style='position: relative;'>" +
                "<a ng-click='reset();' class='' style='padding-left: 1em;font-size: smaller;color: #ccc;cursor: pointer;' >reset</a>" +
                "</div>" +
                "<div class='title'style='padding-left: 45%;position: absolute;' ng-if='options.title.center'>" +
                "{{options.title.center}}" +
                "</div>" +
                "<div class='title'style='float: right!important;' ng-if='options.title.right'>" +
                "{{options.title.right}}" +
                "</div>" +
                "</div>",
            scope: {
                data: '=',
                options: '='
            },
            link: function (scope, element, attrs) {

                element[0].style.position = "relative"
                var chart = new BarGraph(scope.options, element[0]);
                scope.reset = function () {
                    chart.reset();
                }
                scope.$watch('data', function (newVal, oldVal) {
                    chart.draw(scope.data);
                }, true);

                angular.element($window).bind('resize', function () {
                    chart = new BarGraph(scope.options, element[0]);
                    chart.draw(scope.data);
                });
                return;
            } //End link
        }; //End directiveDefinitionObject

        //Implementazione grafica e logica della barchart
        var BarGraph = function (o, e) {

            var margin, width, height, x, y;
            var xAxis, yAxis, domainX, domainY, barWidth;
            var svg, tips, brush, zoom, key, domainSelect;
            var options = o,
                element = e,
                data;
            initGraph();
            this.draw = draw;
            this.reset = reset;

            function initGraph() {
                margin = options.margin || {
                    top: 20,
                    right: 0,
                    bottom: 30,
                    left: 40
                };
                width = element.offsetWidth - margin.left - margin.right;
                height = element.offsetHeight - margin.top - margin.bottom;

                //Creo logicamente le scale, ovvero la corrispondenza tra un elemento e il valore di width/height
                var padding = 0;
                x = d3.time.scale().range([0 + 20, width - 20]);
                y = d3.scale.linear().range([height - padding, padding]);

                //Creo gli assi, solo logicamente, dò un formato solo alle y
                xAxis = d3.svg.axis().scale(x).orient("bottom");
                //options.axis.x.format && xAxis.tickFormat(d3.format(options.axis.x.format));

                if (typeof options.axis.x.tick != "undefined" && options.axis.x.tick != null) {
                    xAxis.ticks(options.axis.x.tick);
                } else {
                    //xAxis.ticks(Math.max(width/50, 2));
                }

                yAxis = d3.svg.axis().scale(y).orient("left");
                options.axis.y.format && yAxis.tickFormat(d3.format(options.axis.y.format));

                if (typeof options.axis.y.tick != "undefined" && options.axis.y.tick != null) {
                    yAxis.ticks(options.axis.y.tick);
                } else {
                    yAxis.ticks(Math.max(height / 50, 2));
                }

                zoom = d3.behavior.zoom().on("zoom", zoomed);

                //Resetto l'svg
                svg = d3.select(element).select("svg");
                svg && svg.remove();

                svg = d3.select(element).append("svg")
                    .attr("width", "100%").attr("height", "100%")
                    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //Logiche di utils
                key = {
                    x: options.axis.x.key,
                    y: options.axis.y.key
                };
                domainSelect = options.axis.x.domainSelect;

                tips = d3.select(element).select(".aizoon-chart-tooltip");
                tips && tips.remove();
                tips = d3.select(element).append("div").attr("class", "aizoon-chart-tooltip").style("opacity", 0);
                brush = d3.svg.brush().x(x);

                //Clip path per non far uscire le barre dal chart
                svg.append("clipPath") // define a clip path
                    .attr("id", "chart-clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                svg.append("g").attr("class", "barG").attr("clip-path", "url(#chart-clip)");

                //Disegno gli assi, ma solo se sono stati preimpostati in options
                if (options.axis.x.domain) {
                    x.domain(options.axis.x.domain);
                    domainX = options.axis.x.domain;
                    if (options.axis.x.interval) {
                        barWidth = x(+x.invert(0) + options.axis.x.interval) * 0.70;
                    }
                    createAxisX();
                }
                if (options.axis.y.domain) {
                    y.domain(options.axis.y.domain);
                    domainY = options.axis.y.domain;
                    createAxisY();
                }

                //Registro gli eventi una sola volta
                brush.on("brush.chart", brushmove).on("brushend.chart", brushend);
                svg.on("mousemove", mousemove).on("mouseout", function (d) {
                    tips.transition().duration(500).style("opacity", 0);
                });

                createBrush();
                arrowNavigation();
            }

            function arrowNavigation() {
                var navigationSx = svg.append("g").attr("class", "navigation sx").attr("transform", "translate(0,0)").style("fill", "rgba(128, 128, 128, 0.13)");

                navigationSx.append("rect").attr("width", 15).attr("height", height);

                navigationSx.append("image")
                    .attr("xlink:href", "http://simpleicon.com/wp-content/uploads/arrow-18.png")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 15)
                    .attr("height", height).style("opacity", 0.4).style("cursor", "pointer");

                var navigationDx = svg.append("g").attr("class", "navigation dx").attr("transform", "translate(" + width + ",0)").style("fill", "rgba(128, 128, 128, 0.13)");
                navigationDx.append("rect")
                    .attr("width", 15).attr("height", height);


                navigationDx.append("image")
                    .attr("xlink:href", "https://image.flaticon.com/icons/svg/60/60758.svg")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 15)
                    .attr("height", height)
                    .style("opacity", 0.4).style("cursor", "pointer");
            }

            function createAxisX() {

                //Creo il gruppo asse X, manca il dominio, quindi non verranno disegnate le coordinate, ma solo scritto il titolo
                //L'asse ha la logica per creare il rect di zoom
                svg.selectAll(".x.axis").remove();
                var axisNode = svg.append("g").attr("class", "x axis").attr("font-family", "sans-serif").attr("font-size", "10px").attr("transform", "translate(0," + height + ")")
                    .call(zoom)
                    .call(xAxis);
                axisNode.append("rect").attr("width", width).attr("height", height).style("fill", "transparent").style("cursor", "w-resize")
                var textNode = axisNode.append("text").attr("y", margin.bottom).text(options.axis.x.title).style("font-size", "9pt").style("font-weight", "bold");

                switch (options.axis.x.pos) {
                    case 'left':
                        textNode.attr("x", 0).style("text-anchor", "start");
                        break;
                    case 'right':
                        textNode.attr("x", width).style("text-anchor", "end");
                        break;
                    case 'center':
                    default:
                        textNode.attr("x", width / 2).style("text-anchor", "center");
                }

                zoom.x(x);
            }

            function valuateDomainX(data) {

                //trovo il dominio x e y, in modo da completare la corrispondenza elemento posizione nel grafico
                if (!options.axis.x.domain) {

                    //Se non ho un dominio per le x, lo calcolo e ridisegno l'asse
                    var tempXdomain = [d3.min(data, function (d) {
                        return d[key.x];
                    }), d3.max(data, function (d) {
                        return d[key.x];
                    })];
                    x.domain(tempXdomain);

                    if (!options.axis.x.interval) {
                        //TODO potente, ma da migliorare, si crea una scala di dominio posizionale, 
                        //in modo da avere il rangeBand per il width, che viene calcolato in base a quanti dati ci sono
                        var ordinalXScale = d3.scale.ordinal().domain(data.map(function (d, i) {
                            return d[key.x];
                        })).rangeBands([0, width], 0.3, 0);
                        barWidth = Math.min(ordinalXScale && ordinalXScale.rangeBand() || 10, 30);
                        //Inoltre devo capire quanto è grande uan barretta ed espandere il dominio, poi ricalcolare il dominio
                        var timeInvert = +(x.invert(barWidth) - x.invert(0));
                        tempXdomain[1] = new Date(+tempXdomain[1] + timeInvert);
                        x.domain(tempXdomain);
                        barWidth = x(+x.invert(0) + timeInvert);
                    }
                    domainX = tempXdomain;
                    createAxisX();
                    svg.selectAll(".bar").attr("x", function (d) {
                        return x(d[key.x]);
                    }).attr("width", barWidth);
                } else {

                    var tempXdomain = options.axis.x.domain;
                    x.domain(tempXdomain);

                    if (options.axis.x.interval) {
                        barWidth = x(+x.invert(0) + options.axis.x.interval) * 0.70;
                    } else if (!options.axis.x.interval) {
                        //TODO potente, ma da migliorare, si crea una scala di dominio posizionale, 
                        //in modo da avere il rangeBand per il width, che viene calcolato in base a quanti dati ci sono
                        var ordinalXScale = d3.scale.ordinal().domain(data.map(function (d, i) {
                            return d[key.x];
                        })).rangeBands([0, width], 0.3, 0);
                        barWidth = Math.min(ordinalXScale && ordinalXScale.rangeBand() || 10, 30);

                    }

                    var timeInvert = +(x.invert(barWidth) - x.invert(0));


                    var minData = d3.min(data, function (d) {
                        return d[key.x];
                    });
                    var maxData = new Date(+d3.max(data, function (d) {
                        return d[key.x];
                    }) + timeInvert);
                    var minDomain = options.axis.x.domain[0];
                    var maxDomain = options.axis.x.domain[1];

                    if (minData < minDomain) {
                        tempXdomain[0] = minData;
                    }

                    if (maxData > maxDomain) {
                        tempXdomain[1] = maxData;
                    }

                    domainX = tempXdomain;
                    x.domain(tempXdomain);
                    createAxisX();
                    svg.selectAll(".bar").attr("x", function (d) {
                        return x(d[key.x]);
                    }).attr("width", barWidth);
                }

            }

            function createAxisY() {

                //Creo il gruppo asse X, manca il dominio, quindi non verranno disegnate le coordinate, ma solo scritto il titolo
                svg.selectAll(".y.axis").remove();
                var axisNode = svg.append("g").attr("class", "y axis").attr("font-family", "sans-serif").attr("font-size", "10px")
                    .call(yAxis);
                var textNode = axisNode.append("text").attr("y", -margin.left + 10).attr("dy", "0.5em").text(options.axis.y.title).attr("transform", "rotate(-90)").style("font-size", "9pt").style("font-weight", "bold");
                //Vergognoso switch per la posizione :(
                switch (options.axis.y.pos) {
                    case 'left':
                        textNode.attr("x", -height).style("text-anchor", "start");
                        break;
                    case 'right':
                        textNode.attr("x", 0).style("text-anchor", "end");
                        break;
                    case 'center':
                    default:
                        textNode.attr("x", -height / 2).style("text-anchor", "center");
                }

            }

            function valuateDomainY(data) {
                if (!options.axis.y.domain) {
                    //Se non ho un dominio per le x, lo calcolo e ridisegno l'asse
                    var tempYdomain = [0, d3.max(data, function (d) {
                        return d[key.y];
                    })];
                    y.domain(tempYdomain);
                    domainY = tempYdomain;
                    createAxisY();
                    svg.selectAll(".bar").attr("y", function (d) {
                        return y(d[key.y]);
                    }).attr("height", function (d) {
                        return height - y(d[key.y]);
                    });
                } else {
                    y.domain(options.axis.y.domain);
                    domainY = options.axis.y.domain;
                    createAxisY();
                    svg.selectAll(".bar").attr("y", function (d) {
                        return y(d[key.y]);
                    }).attr("height", function (d) {
                        return height - y(d[key.y]);
                    });
                }
            }

            function createBrush() {

                //Creo il gruppo asse X, manca il dominio, quindi non verranno disegnate le coordinate, ma solo scritto il titolo
                svg.selectAll(".brush").remove();
                brushg = svg.append("g").attr("class", "brush");
                if (domainSelect) {
                    brush.extent(domainSelect);
                }
                brushg.call(brush);
                //brushg.selectAll(".resize").append("path").attr("transform", "translate(0," +  0 + ")").attr("d", resizePath);
                brushg.selectAll("rect").attr("height", height);

            }

            function draw(d) {
                data = d;

                if (data == null) return;

                valuateDomainY(data);
                valuateDomainX(data);

                //disegno finalmente le barre
                svg.selectAll(".barG").selectAll(".bar").data(data).exit().remove();
                svg.selectAll(".barG").selectAll(".bar").data(data).enter()
                    .append("rect").attr("class", "bar")
                    .attr("x", function (d) {
                        return x(d[key.x]);
                    }).attr("width", barWidth)
                    .attr("y", function (d) {
                        return y(d[key.y]);
                    }).attr("height", function (d) {
                        return height - y(d[key.y]);
                    })
                    .style("fill", "#1f77b4");

                //Disegno il brush se valido
                !brush.empty() && brush.event(d3.select(".brush"));
            } //End draw

            function reset() {

                x.domain(domainX);

                createAxisX();
                svg.selectAll(".bar").attr("x", function (d) {
                    return x(d[key.x]);
                }).attr("width", barWidth);

                d3.selectAll(".brush").call(brush.clear());
                brush.clear().event(d3.select(".brush"));

            } //End reset
            // RENDER
            var groupTip = options.render && options.render.groupTip || defaultGroupTip;

            function defaultGroupTip(d) {

                params = d;
                var html = options.event.onMouseOver && options.event.onMouseOver(d);
                //Renderizza un oggetto chiave: valore
                var table = "";
                var text = "";

                for (p in params) {

                    text = "" + p;
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                    table += text;

                    table += " : ";
                    if (p == "date") {
                        text = "" + new Date(params[p]);
                    } else {
                        text = "" + params[p];

                    }
                    text = text.charAt(0).toUpperCase() + text.slice(1);
                    table += text;

                    table += "<br/>";

                }

                return html || table;
            }

            function resizePath(d) {
                var e = +(d == "e"),
                    x = e ? 1 : -1,
                    y = height / 3;
                return "M" + (.5 * x) + "," + y +
                    "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) +
                    "V" + (2 * y - 6) +
                    "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) +
                    "Z" +
                    "M" + (2.5 * x) + "," + (y + 8)
                    //+ "V" + (2 * y - 8)
                    +
                    "M" + (4.5 * x) + "," + (y + 8)
                //+ "V" + (2 * y - 8);
            }

            // EVENT

            function zoomed() {
                svg.select(".x.axis").call(xAxis);
                svg.select(".y.axis").call(yAxis);

                svg.selectAll(".bar").attr("x", function (d) {
                    return x(d[key.x]);
                });

                brush.event(d3.select(".brush"));

            }

            function mousemove(d) {
                var bar = null;
                var x = d3.mouse(this)[0];
                d3.selectAll("rect.bar").each(function (d, i) {
                    if ((this.getAttribute("x") * 1) <= x && (this.getAttribute("x") * 1 + this.getAttribute("width") * 1) > x) {
                        bar = this;
                        bar.d = d;
                    }
                });
                if (bar) {
                    tips.transition().duration(200).style("opacity", .9);
                    tips.html(groupTip(bar.d)).style("left", (bar.getAttribute("x")) + "px").style("top", (bar.getAttribute("y")) + "px");
                } else {
                    tips.transition().duration(200).style("opacity", 0);
                }
            }

            function brushmove() {
                domainSelect = brush.extent();

                d3.selectAll("rect.bar").style("fill", function (d, i) {
                    return +d[key.x] >= domainSelect[0] && +d[key.x] + (x.invert(barWidth) - x.invert(0)) <= domainSelect[1] || brush.empty() ? "#1f77b4" : "#aec7e8";
                });

                options.event.onBrushMove && options.event.onBrushMove(brush.extent());
            }

            function brushend() {
                options.event.onBrushEnd && options.event.onBrushEnd(brush.empty() ? x.domain() : brush.extent());
            }

        } // End BarGraph

        return directiveDefinitionObject;
    } //#end:barsChart directive

})();