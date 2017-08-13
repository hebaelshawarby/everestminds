/**
 * Created by ahmedhany on 2/14/16.
 */
function VerifyMobileController ($scope, $http, $q, NotificationService, $uibModal) {
  $scope.phoneDisabled = $scope.user && $scope.user.phone ? true : false;

  $scope.sendMobileCode = function () {
    if (!$scope.phoneDisabled) {
      var defer = $q.defer();
      $http.post("/user/sendMobileCode/", {
        phone: '+' + ($scope.user ? $scope.user.phone : $scope.signupForm.phone)

      }).then(function (data) {
        defer.resolve();
        if($( ".modal.fade.in" ).length == 0){
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'verifyMobileModalContent.html',
            controller: 'codeInstanceCtrl',
            /* size: size,
             resolve: {
             items: function () {
             return $scope.items;
             }
             }*/
          });

          modalInstance.result.then(function (updated_user) {
            $scope.verifySuccess(updated_user);
          }, function () {
            console.log('User did not verify mobile')
          });
        } else {
          $scope.codeSent = true;
        }

      }).catch(function (data) {
        defer.reject();
        // $scope.showErrorMessage(data);
      }).finally(function (data) {
        $scope.sendingMobileCode = false;
      });
      return defer.promise;
    } else $scope.phoneDisabled = false;
  }

  $scope.verifyMobileCode = function (code) {
    $scope.invalidCode = false;
    var defer = $q.defer();
    $http.post("/user/verifyMobileCode/", {
      code: code

    }).then(function (updated_user) {
      defer.resolve();

      $scope.verifySuccess(updated_user);

    }).catch(function (data) {
      defer.reject();
      $scope.invalidCode = true;
      // $scope.showErrorMessage(data);
    }).finally(function (data) {
      $scope.verifyingMobileCode = false;

    });
    // }
    return defer.promise;
  }

  $scope.verifySuccess = function(updated_user){
    if($scope.user){
      $scope.user.phone = updated_user.data.phone;
      $scope.phoneDisabled = true;

      NotificationService.showSuccess("Mobile number saved successfully");
    } else {

    }

    $scope.$parent.phone_verified = true;
    if($scope.user)
      $scope.user.phone_verified = true;

    if($scope.mobile)
      $scope.mobile.verified = true;

    $scope.codeSent = false;

    if($scope.redirect_url)
      window.location.href = $scope.redirect_url
  }

}

VerifyMobileController.$inject = ['$scope', '$http', '$q', 'NotificationService', '$uibModal'];

function codeInstanceCtrl($scope, $uibModalInstance, $q, $http) {

  $scope.verifyMobileCode = function (code) {
    $scope.invalidCode = false;
    var defer = $q.defer();
    $http.post("/user/verifyMobileCode/", {
      code: code

    }).then(function (updated_user) {
      defer.resolve();

      $uibModalInstance.close(updated_user);

    }).catch(function (data) {
      defer.reject();
      $scope.invalidCode = true;
      // $scope.showErrorMessage(data);
    }).finally(function (data) {
      $scope.verifyingMobileCode = false;

    });
    // }
    return defer.promise;
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

codeInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$q', '$http'];
