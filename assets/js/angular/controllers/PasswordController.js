/**
 * Created by ahmedhany on 2/15/16.
 */
function PasswordController ($scope, $http, $timeout, $q, NotificationService) {
  $scope.savePassword = function (passwordForm) {
    $scope.loginfailed = false;

    var defer = $q.defer();
    $http.post("/user/updatePassword/", {
      currPassword: passwordForm.currPassword,
      newPassword: passwordForm.password,
      user_id: $scope.user_id,
      reset_token: $scope.reset_token
    }).success(function (updated) {
      defer.resolve();
      NotificationService.showSuccess("Your password has been updated!" + (window.location.pathname != "/user/account" ? " Redirecting to login page" : ""));
      if ($scope.redirect_url) {
        $timeout(function () {
          window.location.href = $scope.redirect_url;
        }, 2000);
      }

    }).error(function (data) {
      defer.reject();
      // $scope.showErrorMessage(data);
      // window.location.reload();
      $scope.loginfailed = true;
    });
    return defer.promise;
  }

  $scope.changeToPasswordMode = function () {
    $scope.changePasswordMode = true;
  }

}

PasswordController.$inject = ['$scope', '$http', '$timeout', '$q', 'NotificationService'];
