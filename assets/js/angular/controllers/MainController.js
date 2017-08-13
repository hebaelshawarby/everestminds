function MainController($scope, $timeout, $http, $location, $uibModal, $window, $parse, UserService) {

    $scope.setLanguage = function (lang) {
        window.location.href = window.location.pathname + '?lang=' + lang;
    }

    $window.loginResponse = function(data) {

        if (data.loggedIn) {
            loggedIn = true;
            if ($scope.redirect_url != undefined)
                window.location.href = $scope.redirect_url;
            else if (data.redirect)
                window.location.href = data.redirect;

        }
    }

    $scope.socialLogin = function(social_network, redirect_url) {

            if (redirect_url == 'currUrl')
                $scope.redirect_url = window.location.href;

            $scope.loadingLogin = true;
            var url = '/auth/' + social_network + '/' + ($scope.invitationcode != undefined ? $scope.invitationcode : ''),
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, social_network + '_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);

        },
        $scope.submitResetForm = function(email) {

            // Set the loading state (i.e. show loading spinner)
            $scope.emailForm.loading = true;
            $scope.emailForm.resetsuccessful = false;

            // Submit request to Sails.
            $http.post('/user/resetpassreq', {
                    email: $scope.emailForm.email
                })
                .then(function onSuccess(sailsResponse) {
                    // Refresh the page now that we've been logged in.

                    $scope.emailForm.resetsuccessful = true;
                    //
                    //window.location.href = sailsResponse.data.redirect;
                })
                .catch(function onError(sailsResponse) {

                    // Handle known error type(s).
                    // Invalid username / password combination.
                    if (sailsResponse.status === 400 || 404) {
                        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
                        //
                        /*toastr.error('Invalid email/password combination.', 'Error', {
                         closeButton: true
                         });*/

                        $scope.resetfailed = true;
                        return;
                    }

                    /*toastr.error('An unexpected error occurred, please try again.', 'Error', {
                     closeButton: true
                     });*/
                    return;

                })
                .finally(function eitherWay() {
                    $scope.emailForm.loading = false;
                });
        },
        $scope.isLoggedin = function() {
            return $scope.user;
        }

    $scope.popup = function(template, onok, oncancel) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: template,
            controller: "popupController"
        });

        modalInstance.result.then(onok, oncancel);
    };

    $scope.assignScopeModel = function(the_string, value) {
        //var the_string = 'life.meaning';

        // Get the model
        var model = $parse(the_string);

        // Assigns a value to it
        model.assign($scope, value);

        // Apply it to the scope
        //$scope.$apply();
    };

    $scope.getScope = function(elemId) {
        var controllerElement = document.querySelector(elemId);
        if (controllerElement) {
            var controllerScope = angular.element(controllerElement).scope();
            return controllerScope;
        } else return undefined;
    }

}
MainController.$inject = ['$scope', '$timeout', '$http', '$location', '$uibModal', '$window', '$parse', 'UserService'];
