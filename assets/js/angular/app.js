var angapp = angular.module('everestminds', ['angularMoment', 'vcRecaptcha', 'angularPromiseButtons', 'ngNotify', 'ui.bootstrap', 'ngIntlTelInput']);

angapp.config(['angularPromiseButtonsProvider', '$compileProvider', function (angularPromiseButtonsProvider, $compileProvider)
{
  angularPromiseButtonsProvider.extendConfig({
    spinnerTpl: '<span class="btn-spinner"></span>',
    disableBtn: true,
    btnLoadingClass: 'is-loading',
    addClassToCurrentBtnOnly: false,
    disableCurrentBtnOnly: false
  });

  // $compileProvider.debugInfoEnabled(false);
}]);

angapp.directive('ngLoading', ['$compile', function ($compile) {

  var loadingSpinner = '<div class="is-loading"><span style="border-color: #90959a;border-right-color: transparent" class="btn-spinner"></span></div>';

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var originalContent = element.html();
      element.html(loadingSpinner);
      scope.$watch(attrs.ngLoading, function (val) {
        if(val) {
          element.html(originalContent);
          $compile(element.contents())(scope);
        } else {
          element.html(loadingSpinner);
        }
      });
    }
  };
}]);

angapp.factory("UserService", ['$http', function($http) {

  return {
    getCountries: function (callback) {
      $http.get("/auth/getCountries/")
        .success(function (result) {
          callback(result);
        }).error(function (data) {
        callback(null);
        //window.location.reload();
      });
    },
    getCities: function (country, callback) {
      $http.post("/user/getCities/", {country: country}).success(function (response) {
          callback(response);
        })
        .error(function (response) {
          // $scope.showErrorMessage(response);
        });
    }
  };
}]);

//Http Intercpetor to check auth failures for xhr requests
angapp.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

  // Intercept http calls.
  $provide.factory('MyHttpInterceptor',['$q', '$injector', function ($q, $injector) {

    return {
      // On request success
      request: function (config) {
        // console.log(config); // Contains the data about the request before it is sent.
        config.headers['everestminds-frontend'] = true;
        // Return the config or wrap it in a promise if blank.
        return config || $q.when(config);
      },

      // On request failure
      requestError: function (rejection) {
        // console.log(rejection); // Contains the data about the error on the request.

        // Return the promise rejection.
        return $q.reject(rejection);
      },

      // On response success
      response: function (response) {
        console.log(response); // Contains the data from the response.
        if(response.data.redirect_url)
          window.location.href = response.data.redirect_url;

        var NotificationService = $injector.get('NotificationService');
        NotificationService.showSuccess(response);
        // Return the response or promise.
        return response || $q.when(response);
      },

      // On response failture
      responseError: function (rejection) {
        console.log(rejection); // Contains the data about the error.
        var NotificationService = $injector.get('NotificationService');
        NotificationService.showError(rejection);
        // Return the promise rejection.
        return $q.reject(rejection);
      }
    };
  }]);

  // Add the interceptor to the $httpProvider.
  $httpProvider.interceptors.push('MyHttpInterceptor');

}]);


angapp.service('fileUpload', ['$http', 'NotificationService', function ($http, NotificationService) {
    this.dataURItoBlob = function(dataURI) {
        var byteStr;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteStr = atob(dataURI.split(',')[1]);
        else byteStr = unescape(dataURI.split(',')[1]);
        var mimeStr = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var arr= new Uint8Array(byteStr.length);
        for (var i = 0; i < byteStr.length; i++) {
          arr[i] = byteStr.charCodeAt(i);
        }
        return new Blob([arr], {type:mimeStr});
      }

    this.uploadFileToUrl = function(file, uploadUrl, param, successCallback, errorCallback){

      var blob = this.dataURItoBlob(file);
      var fd = new FormData();
        fd.append(param, blob);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                successCallback(data);
            })
            .error(function(data){
                errorCallback(data);
            });
    }

    this.submitImageForm = function(avatar, uploadUrl, callback) {

      var file = avatar;
      console.log('file is ');
      console.dir(file);

      this.uploadFileToUrl(file, uploadUrl, 'avatar',function(data){
        callback(data);
      }, function(data){
        callback(null);
      });

    }

  this.checkFile = function (file) {
    if(file.size > 2000000) {
      NotificationService.showError('File size bigger than 2 MB');
      return false;
    }

    var type = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    switch(type){
      case 'gif': case 'jpg': case 'png':
      return true;
      break;
      default:
        NotificationService.showError('Please use one of the following types: gif, jpg or png');
        break;
    }
    return false;
  }
}]);

angapp.directive('fileModel', ['$parse', 'fileUpload', function ($parse, fileUpload) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        var file = element[0].files[0];
        if(!fileUpload.checkFile(file))
          return;
        var reader = new FileReader();
        reader.onload = function (evt) {
          scope.$apply(function($scope){
            modelSetter(scope, evt.target.result);
            scope.changePic();
          });
        };
        reader.readAsDataURL(file);

      });
    }
  };
}]);

angapp.service('NotificationService', ['ngNotify', function (ngNotify) {
  this.showSuccess = function(object){

    var msg = object;
    if (object && angular.isObject(object)) {
      if(object.data){
        if(angular.isObject(object.data))
          msg = object.data.msg;
        else if(!parseInt(object.data) && object.data.indexOf('<') == -1 && object.data.indexOf('http') == -1) msg = object.data;
        else msg = undefined;
      } else msg = undefined;

    }
    if(msg)
      ngNotify.set(msg, {
        type: 'success',
        position: 'top'
      });
  }

  this.showError = function(object){
    var msg = object;
    if (angular.isObject(object)) {
      if (object.error && !angular.isObject(object.error))
        msg = object.error;
      else if (object.data) {
        if(angular.isObject(object.data)){
          if(object.data.reason)
            msg = object.data.reason;
          else if(object.data.message)
            msg = object.data.message;
          else if(angular.isObject(object.data.error))
            msg = object.data.error.summary;
          else msg = object.data.error;
        } else msg = object.data;
      }
    }
    if (!msg || angular.isObject(msg)) return;

    ngNotify.set(msg, {
      type: 'error',
      position: 'top'
    });
  }
}]);

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

angapp.directive('getCountries', ['UserService',
  function (UserService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      // templateUrl: '/js/angular/partials/payment-method.html',
      link: function ($scope, $element, $attrs) {

        // $scope.show = false;
        if(!$scope.countries)
          UserService.getCountries(function (countries) {
            $scope.countries = countries;
          })

      }
    };
  }
]);

angapp.directive('getCities', ['UserService',
  function (UserService) {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      // templateUrl: '/js/angular/partials/payment-method.html',
      link: function ($scope, $element, $attrs) {

        // $scope.show = false;
        $scope.$watch("user.residency_country", function (newval, oldval, scope) {

          UserService.getCities(scope.user.residency_country, function (cities) {
            $scope.cities = cities;
          })

        });


      }
    };
  }
]);

angapp.filter('range', function () {

  return function (input, min, max) {
    min = parseInt(min);
    for (var i = min; i < max; i++)
      input.push(i);

    return input;
  };
});

angapp.filter('rangerev', function () {

  return function (input, min, max) {
    min = parseInt(min);
    for (var i = max; i > min; i--)
      input.push(i);

    return input;
  };
});

angapp.directive("compareTo", compareTo);

angapp.controller("MainController",MainController);
angapp.controller("VerifyMobileController",VerifyMobileController);
angapp.controller("SignupController",SignupController);
angapp.controller("AccountController",AccountController);
angapp.controller("PasswordController",PasswordController);




