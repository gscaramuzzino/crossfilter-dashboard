<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="CrossfilterDashboard">
  <meta name="author" content="Giuseppe Scaramuzzino">
  <title>Crossfilter Dashboard</title>
  <link rel="icon" href="images/favicon.ico">
  <!-- build:css scripts/vendor.css -->
  <link href="../../../bower_components/bootstrap/dist/css/bootstrap.min.css">
  <link href="../../../bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
  <link href="../../../bower_components/font-awesome/css/font-awesome.min.css">
  <link href="../../../bower_components/c3/c3.min.css">
  <!-- endbuild -->
  <!-- build:css1 styles/styles.css -->
  <link href="styles/app.styles.css">
  <link href="styles/angular-aizoon-chart.css">
  <link href="styles/app.chart.css">
  <!-- endbuild -->
</head>

<body ng-app="AppModule">
  <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li>
            <a href="#/dashboard"> <i class="fa fa-users" aria-hidden="true"></i> Dashboard 1</a>
          </li>
        </ul>
      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container -->
  </nav>
  <div class="container">
    <ng-view />
  </div>
  <div class="overlay" style="display: none">
    <i class="fa fa-spinner fa-5x fa-spin"></i>
  </div>
  <!-- build:js_vendor scripts/vendor.js -->
  <script src="../../../bower_components/jquery/dist/jquery.min.js"></script>
  <script src="../../../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="../../../bower_components/d3/d3.min.js"></script>
  <script src="../../../bower_components/c3/c3.min.js"></script>
  <script src="../../../bower_components/angular/angular.min.js"></script>
  <script src="../../../bower_components/angular-route/angular-route.min.js"></script>
  <script src="../../../bower_components/crossfilter/crossfilter.min.js"></script>
  <!-- endbuild -->
  <!-- build:js_scripts scripts/scripts.js -->
  <script src="scripts/angular-aizoon-chart.js"></script>
  <script src="scripts/ui-bootstrap-custom-tpls-2.4.0.js"></script>
  <script src="scripts/app.js"></script>
  <script src="scripts/app.route.js"></script>
  <script src="scripts/app.config.js"></script>
  <script src="scripts/app.factory.js"></script>
  <script src="scripts/app.directive.js"></script>
  <script src="components/pagination/pagination.component.js"></script>
  <script src="view/dashboard/DashboardService.js"></script>
  <script src="view/dashboard/DashboardController.js"></script>
  <!-- endbuild -->
</body>

</html>