<div class="row">
  <div class="col-xs-12">
    <ol class="breadcrumb pull-right">
      <li><a href="#/patients">Our Patients</a></li>
      <li class="active">Patient summary</li>
    </ol>
    <h3 class="page-header"><i class="fa fa-heartbeat" aria-hidden="true"></i> Patients summary</h3>
  </div>
</div>
<div class="row" ng-if="patSumCtrl.patientActivity">
  <div class="col-xs-12 space-col">
    <a ng-click="patSumCtrl.actionOnActivityDefinition()">
      {{ patSumCtrl.showActivityDefintion ? 'Close Activity Defiinition':'Open Activity Defiinition'}}
    </a>
  </div>
</div>
<div class="row" ng-if="patSumCtrl.showActivityDefintion">
  <div class="col-sm-6">
    <div class="panel panel-default text-left">
      <div class="panel-heading">Activity Definition
      </div>
      <div class="panel-body">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Activity</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="item in patSumCtrl.definitionActivity">
              <th scope="row">{{$index + 1}}</th>
              <td>{{item.activity}}</td>
              <td>{{item.intensity}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-xs-12">
    <div class="panel panel-default text-left">
      <div class="panel-heading">
        <div class="row">
          <div class="col-sm-6 text-center box-patient" style="margin-top:20px;" ng-show="patSumCtrl.patientActivity">
            <img class="img-circle img-responsive img-center img-patients " ng-src=" {{::patSumCtrl.getPatientImage(patSumCtrl.patient)}}" alt="patient image">
            <h3>{{ patSumCtrl.patient.name }}
              <small>{{ patSumCtrl.patient.birthDate | date }} </small>
            </h3>
            <p>
              Height: {{ patSumCtrl.patient.heightCm }} cm - Weight: {{ patSumCtrl.patient.weightKg }} kg - B.M.I.: {{ patSumCtrl.patient.bmi }}
            </p>

          </div>
          <div class="col-sm-6">
            <div id="chartDonut"></div>
          </div>
        </div>
      </div>

      <div class="panel-body"  ng-show="patSumCtrl.patientActivity">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Activity</th>
              <th>Minutes</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="item in patSumCtrl.patientActivity">
              <th scope="row">{{$index + 1}}</th>
              <td>{{item.activity}}</td>
              <td>{{ patSumCtrl.convertActivity(item.minutes) }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<blockquote ng-if="!patSumCtrl.patientActivity">
  <p>No activity found.</p>
  <footer><a href="#/patients"> Select patient </a></footer>
</blockquote>
