//#region:AramisMagicQuadrant
(function () {
  function AramisMagicQuadrant($window, $timeout, $filter) {
    return {
      restrict: 'EA',
      replace: true,
      template: [
        '<div class="row magicQuadrantChart">',
        '<div style="height:250px" class="containerChart" ng-show="showChart">',
        '<div id="{{idChart}}"></div>',
        '</div>',
        '</div>'
      ].join(''),
      scope: {
        data: '=',
        options: '=',
        legend: '='
      },
      link: linkAramisMagicQuadrant
    };

    function linkAramisMagicQuadrant(scope, element, attrs) {
      scope.idChart = "_" + globalGUID();
      scope.showChart = true;
      var magicQuadrantChart = null;
      var mapIdElement = [];
      var idElementToNotView = [];

      scope.$watch('data', function () {
        if (typeof scope.data != "undefined" && scope.data) {
          if (scope.data && scope.data.length > 0) {
            originalData = scope.data;
            $timeout(function () {
              scope.showChart = true;
              scope.$apply();
              if (!magicQuadrantChart) {
                magicQuadrantChart = new MagicQuadrant(element);
                scope.options.id_chart = "#" + scope.idChart;
                mapIdElement = magicQuadrantChart.create(scope.options, scope.data);
              } else {
                idElementToNotView = [];
                console.log(scope.data.length);
                mapIdElement = magicQuadrantChart.update(scope.options, scope.data);
              }
            });
          } else {
            scope.showChart = false;
          }
        }
      });
    } //linkAramisMagicQuadrant

    function MagicQuadrant(element) {
      // variables
      var data = null,
        element = element,
        width = 100;
      height = 100;
      margin = {
          "left": 75,
          "bottom": 40,
          "right": 20,
          "top": 20
        },
        label_x = "x",
        label_y = "y",
        label_quadrant_1 = "1",
        label_quadrant_2 = "2",
        label_quadrant_3 = "3",
        label_quadrant_4 = "4",
        key_x = "x"
      key_y = "y",
        key_r = "r",
        key_id = "id",
        key_color = "color",
        id_chart = "chart",
        max_x = 100,
        min_x = 1;
      max_y = 1.0;
      r_max = 1 / 20,
        median_y = max_x / 2,
        median_x = max_y / 2,
        max_sup = 10,
        alpha_inf = 1 / 5,
        alpha_sup = 4 / 5,
        domain_x = [0, (max_x + r_max)],
        domain_y = [0, 1 + (r_max / max_x)],
        range_x = [0, width],
        range_y = [height, 0],
        x_label_1 = (median_x / 2),
        y_label_1 = (median_y / 2),
        x_label_2 = (median_x + max_x) / 2,
        y_label_2 = (median_y / 2),
        x_label_3 = (median_x + max_x) / 2,
        y_label_3 = (median_y + 1) / 2,
        x_label_4 = (median_x / 2),
        y_label_4 = (median_y + 1) / 2,
        tooltip_content = null,
        context_menu = null,
        xScale = null, yScale = null, svg = null, xAxis = null, yAxis = null,
        quadrant_group = null, quadrant_border = null, x2Line = 0, y1Line = 0, y2Line = 1,
        listAllId = [];

      function setOpacityToZoom(item, value) {
        var opacity = 1;
        if (!isNaN(item)) {
          if (item < value) {
            opacity = 0;
          } else if (item > width - margin.left - margin.right - value) {
            opacity = 0;
          }
        }
        return opacity;
      } //setOpacityToZoom

      var zoomBeh = d3.behavior.zoom()
        .scaleExtent([0, 1000])
        .on("zoom", function () {
          svg.select(".x.axis").call(xAxis);

          var x1 = xScale(median_x);
          var opacity = setOpacityToZoom(x1, 10);

          if (!isNaN(x1)) {
            svg.select(".xDivider")
              .attr("x1", x1)
              .attr("y1", 0)
              .attr("x2", x1)
              .attr("y2", yScale(0) * y2Line)
              .style("opacity", opacity);
          }

          x1 = xScale(x_label_1);
          if (!isNaN(x1)) {
            opacity = setOpacityToZoom(x1, 60);
            quadrant_group.select(".quad-label_1")
              .attr("transform", "translate(" + x1 + "," + yScale(y_label_1) + ")")
              .style("opacity", opacity);
          }

          x1 = xScale(x_label_3);
          if (!isNaN(x1)) {
            opacity = setOpacityToZoom(x1, 60);

            quadrant_group.select(".quad-label_3")
              .attr("transform", "translate(" + x1 + "," + yScale(y_label_3) + ")")
              .style("opacity", opacity);
          }

          x1 = xScale(x_label_2);
          if (!isNaN(x1)) {
            opacity = setOpacityToZoom(x1, 60);

            quadrant_group.select(".quad-label_2")
              .attr("transform", "translate(" + x1 + "," + yScale(y_label_2) + ")")
              .style("opacity", opacity);
          }

          x1 = xScale(x_label_4);
          if (!isNaN(x1)) {
            opacity = setOpacityToZoom(x1, 60);

            quadrant_group.select(".quad-label_4")
              .attr("transform", "translate(" + xScale(x_label_4) + "," + yScale(y_label_4) + ")")
              .style("opacity", opacity);

            svg.selectAll("circle").attr("cx", function (d) {
                var value = xScale(d[key_x]);
                if (value < 10 || value > width - margin.left - margin.right - 10) {
                  value = -1000;
                }
                return value;
              })
              .attr("cy", function (d) {
                return yScale(d[key_y]);
              });
          }
        });

      this.create = function (chart, data) {
        angular.element(".overlay").show();
        setVariables(chart, data);
        addAxises();
        addSvg();
        addQuadrants();
        addCircles(true);
        var clusterIdElement = [];
        for (var i in listAllId) {
          var id = listAllId[i];
          clusterIdElement[id] = d3.selectAll(".item._" + id).data();
        }
        angular.element(".overlay").hide();
        return clusterIdElement;
      } //create


      this.updateElement = function (chart, dataChart) {
        d3.select(id_chart).selectAll("circle").remove();
        data = dataChart;
        addCircles(false);
      } //updateElement

      this.update = function (chart, data) {
        d3.select(id_chart).selectAll("*").remove();
        return this.create(chart, data);
      } //update

      function setVariables(chart, dataToChart) {
        var median_x_inf = 0;
        var median_x_sup = 0;

        if (typeof chart != "undefined" && chart) {
          data = dataToChart;
          max_x = d3.max(data, function (d) {
            return d.count;
          });
          min_x = d3.min(data, function (d) {
            return d.count;
          });
          key_x = chart.x;
          key_y = chart.y;
          key_r = chart.r;
          id_chart = chart.id_chart;
          scale = chart.scale;
          width = $($($(id_chart).get(0)).parent().get(0)).width();
          height = "250";
          range_x = [0, width - margin.left - margin.right];
          range_y = [height - margin.bottom, 0];

          if (scale == "log") {

            if (max_x < max_sup) {
              max_x = max_sup;
            }

            if (min_x == max_x) {
              min_x = max_x / 2;
              max_x = 1.2 * max_x;
              median_x = Math.sqrt(min_x * max_x);
            }

            median_x_inf = Math.pow(max_x, alpha_inf) * Math.pow(min_x, alpha_sup);
            median_x_sup = Math.pow(max_x, alpha_sup) * Math.pow(min_x, alpha_inf);

            if (median_x < median_x_inf) {
              median_x = median_x_inf;
            }
            if (median_x > median_x_sup) {
              median_x = median_x_sup;
            }
            if (median_y < alpha_inf) {
              median_y = alpha_inf;
            }
            if (median_y > alpha_sup) {
              median_y = alpha_sup;
            }

            domain_x = [Math.pow(min_x, 1.025) / Math.pow(max_x, 0.025), Math.pow(max_x, 1.025) / Math.pow(min_x, 0.025)];
            domain_y = [-0.025, 1.025];

            x_label_1 = Math.sqrt(median_x * min_x);
            y_label_1 = (median_y / 2);

            x_label_2 = Math.sqrt(max_x * median_x);
            y_label_2 = (median_y / 2);

            x_label_3 = Math.sqrt(max_x * median_x);
            y_label_3 = (median_y + 1) / 2;

            x_label_4 = Math.sqrt(median_x * min_x);
            y_label_4 = (median_y + 1) / 2;
            x2Line = Math.pow(max_x, 1.025) / Math.pow(min_x, 0.025);
            y2Line = 1.025;
          }
        }
      } //setVariables

      function addAxises() {

        if (!scale || scale == "linear") {
          // x scale
          xScale = d3.scale.linear()
            .domain(domain_x)
            .range(range_x);
          //x axis
          xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(4);

        } else if (scale == "log") {
          // x scale
          xScale = d3.scale.log()
            .domain(domain_x)
            .range(range_x);

          //x axis
          xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10, ",.1s")
            .tickSize(6, 0);
        }

        // y scale
        yScale = d3.scale.linear()
          .domain(domain_y)
          .range(range_y);

        //y axis
        yAxis = d3.svg.axis()
          .scale(yScale)
          .ticks(4)
          .tickFormat(function (d) {
            return (d * 100) + " %";
          })
          .orient("left");

        zoomBeh.x(xScale);

      } //drawAxises

      function addSvg() {
        // creating the main svg
        svg = d3.select(id_chart)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "svg")
          .style("cursor", "w-resize")
          .call(zoomBeh);

        // axis and axis description
        svg.append("g")
          .attr("class", "axis")
          .classed("x", true)
           .attr("transform", "translate(75," + (height - 35) + ")")
          .call(xAxis);

        //y label
        svg.append("g")
          .attr("class", "axis")
          .classed("y", true)
          .attr("transform", "translate(70, 5)")
          .call(yAxis);

        svg.append("text")
          .attr("class", "label_axis")
          .attr("transform", "rotate(-90)")
          .attr("y", 0)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(label_y);

        //x label
        svg.append("text")
          .attr("class", "label_axis")
          .attr("transform", "translate(" + ((width / 2) + margin.left - 30) + " ," + (height - 2) + ")")
          .style("text-anchor", "middle")
          .text(label_x);
      } //drawSvg

      function addQuadrants() {
        // wcm quadrant
        quadrant_group = svg.append("g")
          .attr("transform", "translate(" + margin.left + ",0)");

        quadrant_border = quadrant_group.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.bottom)
          .attr("rx", 20)
          .attr("ry", 20)
          .attr("class", "quadrant_border");

        // creating quadrant descriptions
        quadrant_group.append("text")
          .attr("transform", "translate(" + xScale(x_label_1) + "," + yScale(y_label_1) + ")")
          .attr("text-anchor", "middle")
          .attr("class", "quad-label quad-label_1")
          .text(label_quadrant_1);

        quadrant_group.append("text")
           .attr("transform", "translate(" + xScale(x_label_3) + "," + yScale(y_label_3) + ")")
          .attr("text-anchor", "middle")
          .attr("class", "quad-label quad-label_3")
          .text(label_quadrant_3);

        quadrant_group.append("text")
              .attr("transform", "translate(" + xScale(x_label_2) + "," + yScale(y_label_2) + ")")
          .attr("text-anchor", "middle")
          .attr("class", "quad-label quad-label_2")
          .text(label_quadrant_2);

        quadrant_group.append("text")
           .attr("transform", "translate(" + xScale(x_label_4) + "," + yScale(y_label_4) + ")")
          .attr("text-anchor", "middle")
          .attr("class", "quad-label quad-label_4")
          .text(label_quadrant_4);

        // creating the dividers
        quadrant_group.append("line")
          .attr("class", "divider")
          .attr("x1", 0)
          .attr("y1", yScale(median_y))
          .attr("x2", xScale(x2Line))
          .attr("y2", yScale(median_y));

        quadrant_group.append("line")
          .attr("class", "divider")
          .classed("xDivider", true)
          .attr("x1", xScale(median_x))
          .attr("y1", 0)
          .attr("x2", xScale(median_x))
          .attr("y2", yScale(0) * y2Line);
      } //drawQuadrants

      function addCircles(animation) {
        if (data != null) {

          var circles = quadrant_group.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
              return xScale(d[key_x]);
            })
            .attr("cy", function (d) {
              return yScale(d[key_y]);
            })
            .classed("chart-element-selected", true)
            .on("mouseover", function (d) {})
            .on("click", function (d) {})
            .on("mouseout", function (d) {});

    
          circles.attr("r", function (d) {
            var tmpR = key_r,
              r = 10;
            if (angular.isFunction(tmpR)) {
              r = tmpR(d);
            } else if (angular.isObject(tmpR)) {
              r = d[tmpR];
            }
            return r * r_max * range_x[1];
          });
        }
      } //drawCircles
    } //magicQuadrant
  } //AramisMagicQuadrant

  AramisMagicQuadrant.$inject = ["$window", "$timeout", "$filter"];
  angular.module("AppModule").directive("aramisMagicQuadrant", AramisMagicQuadrant);
})();
//#end:AramisMagicQuadrant


function globalGUID() {

  function s4() {

    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
} // globalGUIDs