"use strict";

angular.module("AppModule").controller("DashboardController", DashboardController);

DashboardController.$inject = ["DashboardService", "AppDataModel", "dataR3", "$scope", '$timeout'];

function DashboardController(service, AppDataModel, dataR3, $scope, $timeout) {

  var cfData = null,
    tsDimension = null,
    tsGroup = null,
    tsMachineDimension = null,
    tsMachineGroup = null,
    maxSize = dataR3.data.length,
    chart = null;

  var vm = this;
  vm.myData = [];
  cfData = crossfilter(dataR3.data);
  tsDimension = cfData.dimension(function (d) {
    return new Date((d.ts - d.ts % (60 * 60 * 24)) * 1000);
  });
  tsGroup = tsDimension.group();
  //vm.myData = tsGroup.all();

  tsGroupLastWeek = tsDimension.filterRange([new Date(1485175268 * 1000), new Date(1485787268 * 1000)]).group();
  vm.myData= tsGroupLastWeek.all();
  tsDimension.filterAll();

  vm.r3Data = AppDataModel.getInstance();
  vm.r3Data.setData(vm.myData);
  vm.r3Data.setPredicate("value");
  vm.r3Data.setElementPerPage(10);
  vm.r3Data.createDataToView();
  vm.r3Data.setFields([{
    "key": "key",
    "value": "KEY"
  }, {
    "key": "value",
    "value": "VALUE"
  }]);

  function onBrushEnd(event) {
    tsDimension.filterRange([event[0].getTime(), event[1].getTime()]);
    $timeout(function () {
      $scope.$apply();
    });
    vm.r3DataTs = AppDataModel.getInstance();
    vm.r3DataTs.setMaxSize(10);
    vm.r3DataTs.setData((tsDimension.top(maxSize)));
    vm.r3DataTs.setPredicate("ts");
    vm.r3DataTs.setElementPerPage(10);
    vm.r3DataTs.createDataToView();
    vm.r3DataTs.setFields([{
      "key": "count",
      "value": "COUNT"
    }, {
      "key": "direction",
      "value": "DIRECTION"
    }, , {
      "key": "id_orig_h",
      "value": "ID_ORIG_H"
    }, {
      "key": "id_resp_p",
      "value": "ID_RESP_P"
    }, {
      "key": "orig_ip_bytes",
      "value": "ORIG_IP_BYTES"
    }, {
      "key": "prob_anomaly",
      "value": "PROB_ANOMALY"
    }, {
      "key": "ts",
      "value": "TS"
    }]);

    cfData2 = crossfilter(tsDimension.top(maxSize));
    var tsMachine = cfData2.dimension(function (d) {
      return d.ts + "-" + d.machineSrc + "-" + d.direction;
    });
    var tsMachineGroup = tsMachine.group();
    /* Equivalente SELECT sql
      select ts, machineSrc, count(*), sum(count), sum(orig_ip_bytes)
      group by ts, machineSrc
    */

    function reduceAdd(p, v) {
      p.ts = v.ts;
      p.machineSrc = v.machineSrc;
      p.direction = v.direction;

      p.numOfElements++;
      p.count += v.count;
      p.orig_ip_bytes += v.orig_ip_bytes;

      var aChild = {
        direction: v.direction,
        id_orig_h: v.id_orig_h,
        id_resp_p: v.id_resp_p
      }
      p.child.push(aChild);

      if (p.prob_anomaly < v.prob_anomaly) {
        p.prob_anomaly = v.prob_anomaly;
      }

      return p;
    }

    function reduceRemove(p, v) {
      return p;
    }

    function reduceInitial() {
      var v = {
        ts: null,
        machineSrc: null,
        numOfElements: 0,
        count: 0,
        child: [],
        orig_ip_bytes: 0,
        prob_anomaly: 0.0
      };

      return v;
    }

    function orderValue(p) {
      return p.numOfElements;
    }


    var reduceTsMachine = tsMachineGroup.reduce(reduceAdd, reduceRemove, reduceInitial).top(maxSize);
    vm.r3DataTsMachineDirection = AppDataModel.getInstance();
    vm.r3DataTsMachineDirection.setPredicate("numOfElements");

    vm.r3DataTsMachineDirection.setFields([{
      "key": "count",
      "value": "COUNT"
    }, {
      "key": "numOfElements",
      "value": "NUMBER"
    }, {
      "key": "machineSrc",
      "value": "MACHINE_SRC"
    }, {
      "key": "direction",
      "value": "DIRECTION"
    }, {
      "key": "orig_ip_bytes",
      "value": "ORIG_IP_BYTES"
    }, {
      "key": "prob_anomaly",
      "value": "PROB_ANOMALY"
    }, {
      "key": "ts",
      "value": "TS"
    }]);
    tsDimension.filterAll();

    vm.r3DataMagicQuadrant = [];
    for (d in reduceTsMachine) {
      vm.r3DataMagicQuadrant.push(reduceTsMachine[d].value);
      vm.r3DataTsMachineDirection.add(reduceTsMachine[d].value);
    }
    if (chart == null) {
      chart = c3.generate({
        bindto: '#chartLine',
        data: {
          json: [],
          keys: {
            x: 'prob_anomaly',
            value: ['count']
          }
        }
      });

      chart.load({
        json: vm.r3DataMagicQuadrant,
        keys: {
          x: 'prob_anomaly',
          value: ['count']
        }
      });

    } else {
      chart.unload();
      setTimeout(function () {
        chart.load({
          json: vm.r3DataMagicQuadrant,
          keys: {
            x: 'prob_anomaly',
            value: ['count']
          }
        });
        //alert("load");
      }, 8);
    }
    vm.r3DataTsMachineDirection.createDataToView();


  }; //onBrushEnd

  vm.myOptions = {
    title: {
      left: "Titolo Left",
      center: "Titolo Center",
      right: "Titolo Right",
    },
    axis: {
      x: {
        key: 'key',
        title: 'attrs.xaxisName',
        pos: "right",
        format: ".0",
        // domain: [new Date(2012, 0, 1), new Date(2012, 1, 1)],
        // domainSelectt: [new Date(2012, 0, 2, 3), new Date(2012, 0, 15, 6)],
        //tick:22
      },
      y: {
        key: 'value',
        title: 'attrs.yaxisName',
        pos: "center",
        format: ".2f",
        domain: null,
        tick: 5
      }
    },
    margin: {
      top: 40,
      right: 40,
      bottom: 50,
      left: 50
    },
    event: {
      onBrushMove: null,
      onBrushEnd: onBrushEnd,
      onMouseOver: null
    }
  };

  vm.chartOptions = {
    x: "count",
    y: "prob_anomaly",
    scale: "log",
    r: function (d) {
      return globalScale(d.orig_ip_bytes);
    },
    data: null
  };

  function globalScale(valueIn) {
    var baseMin = 1000; // 1kB
    var baseMax = 1000000000; // 1 GB
    var aa = 6.907755; // log(baseMin)
    var denominator = 13.81551; // log(baseMax/baseMin)
    var rangeOutMin = 0.15;
    var rangeOutMax = 1;
    var retVal = 0.0;

    if (valueIn < baseMin) {
      retVal = rangeOutMin;
    } else if (valueIn > baseMax) {
      retVal = rangeOutMax;
    } else {
      retVal = (rangeOutMax - rangeOutMin) * (Math.log(valueIn) - aa) / denominator + rangeOutMin;
    }

    return retVal;
  } //globalScale
}; //DashboardController