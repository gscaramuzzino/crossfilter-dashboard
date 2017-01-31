<div class="row">
  <div class="col-xs-12" style="height: 250px; margin-bottom: 10%">
    <bars-chart data="dashCtrl.myData" options="dashCtrl.myOptions"></bars-chart>
  </div>
</div>
<div class="row">
  <div class="col-xs-12" style="height: 250px; margin-bottom: 10%">
    <bars-chart data="dashCtrl.myDataLastWeek" options="dashCtrl.myOptions"></bars-chart>
  </div>
</div>
<div class="row">
  <div class="col-xs-6" style="height: 250px; margin-bottom: 10%">
    <pre>{{ dashCtrl.r3DataMagicQuadrant.length }}</pre>
    <div id="chartLine"></div>
  </div>
  <div class="col-xs-6" style="height: 250px; margin-bottom: 10%">
    <pre>{{ dashCtrl.r3DataMagicQuadrant.length }}</pre>
    <aramis-magic-quadrant options="dashCtrl.chartOptions" data="dashCtrl.r3DataMagicQuadrant"></aramis-magic-quadrant>
  </div>
</div>
<div class="row">
  <div class="col-xs-6">
    <div class="panel panel-default">
      <div class="panel-heading">Ts - machineSrc - direction</div>
      <div class="panel-body">
        <table class="table">
          <thead>
            <tr>
              <th ng-repeat="item in dashCtrl.r3DataTsMachineDirection.getFields()">{{item.value}}</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="item in dashCtrl.r3DataTsMachineDirection.getDataToView()">
              <td ng-repeat="field in dashCtrl.r3DataTsMachineDirection.getFields()"> {{item[field.key]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel-footer">
        <pagination-component model="dashCtrl.r3DataTsMachineDirection"></pagination-component>
      </div>
    </div>
  </div>
  <div class="col-xs-6">
    <div class="panel panel-default">
      <div class="panel-heading">Data filtered</div>
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th ng-repeat="item in dashCtrl.r3DataTs.getFields()">{{item.value}}</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="item in dashCtrl.r3DataTs.getDataToView()">
                <td ng-repeat="field in dashCtrl.r3DataTs.getFields()"> {{item[field.key]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel-footer">
        <pagination-component model="dashCtrl.r3DataTs"></pagination-component>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-xs-6">
    <div class="panel panel-default">
      <div class="panel-heading">Timeline data</div>
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th ng-repeat="item in dashCtrl.r3Data.getFields()">{{item.value}}</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-repeat="item in dashCtrl.r3Data.getDataToView()">
                <td ng-repeat="field in dashCtrl.r3Data.getFields()"> {{ item[field.key]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel-footer">
        <pagination-component model="dashCtrl.r3Data"></pagination-component>
      </div>
    </div>
  </div>
</div>