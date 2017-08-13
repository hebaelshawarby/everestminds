/* *
 * Created by ahmedhany on 1/3/16.
 */
function SignupController($scope, $http, $q, NotificationService) {
    //  set-up loading state
    /*$scope.signupForm = {
      loading: false
    }*/

    $scope.submitSignupForm = function() {
        var defer = $q.defer();
        //  Submit request to Sails.
        $http.post('/auth/signup', {
                first_name: $scope.signupForm.first_name,
                last_name: $scope.signupForm.last_name,
                email: $scope.signupForm.email,
                residency_country: $scope.signupForm.residency_country,
                password: $scope.signupForm.password,
                phone: '+' + $scope.signupForm.phone,
                captcha: $scope.signupForm.captcha
            })
            .then(function onSuccess(sailsResponse) {
                defer.resolve();
                window.location.href = $scope.redirect_url != undefined ? $scope.redirect_url : sailsResponse.data.redirect;
            })
            .catch(function onError(sailsResponse) {
                defer.reject();
                //  Handle known error type(s).
                //  If using sails-disk adpater -- Handle Duplicate Key
                var emailAddressAlreadyInUse = sailsResponse.status == 409;

                if (emailAddressAlreadyInUse) {
                    $scope.emailAddressAlreadyInUse = true;
                    return;
                } else {
                    // $scope.showErrorMessage(sailsResponse);
                }

            })
            .finally(function eitherWay() {
            })
        return defer.promise;
    }

    $scope.submitLoginForm = function() {

        var defer = $q.defer();
        //  Submit request to Sails.
        $http.post('/auth/process', {
                email: $scope.loginForm.email,
                password: $scope.loginForm.password
            })
            .then(function onSuccess(sailsResponse) {
                defer.resolve();
                //  Refresh the page now that we've been logged in.
                // $scope.setToken(sailsResponse.data.token);
                // console.log(sailsResponse);
                //
                window.location.href = sailsResponse.data.redirect;
            })
            .catch(function onError(sailsResponse) {
                defer.reject();
                //  Handle known error type(s).
                //  Invalid username / password combination.
                if (sailsResponse.status === 400 || 404) {
                    //  $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
                    //
                    /* toastr.error('Invalid email/password combination.', 'Error', {
                     closeButton: true
                     });*/
                    $scope.loginfailed = true;
                    return;
                } else NotificationService.showError(sailsResponse);

                return;

            })
            .finally(function eitherWay() {
            });
        return defer.promise;
    };
}

SignupController.$inject = ['$scope', '$http', '$q', 'NotificationService'];
