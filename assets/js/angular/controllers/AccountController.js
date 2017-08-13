/**
 * Created by ahmedhany on 4/13/16.
 */
function AccountController ($scope, $http, $q, fileUpload, UserService, NotificationService) {

  $scope.months = [
    {'id': 1,'name': 'January'},
    {'id': 2,'name': 'February'},
    {'id': 3,'name': 'March'},
    {'id': 4,'name': 'April'},
    {'id': 5,'name': 'May'},
    {'id': 6,'name': 'June'},
    {'id': 7,'name': 'July'},
    {'id': 8,'name': 'August'},
    {'id': 9,'name': 'September'},
    {'id': 10,'name': 'October'},
    {'id': 11,'name': 'November'},
    {'id': 12,'name': 'December'}];

  $scope.areas = ['6th of October', 'Abbassiya', 'Agouza', 'Al Rehab City', 'Alexandria Desert Road', 'Dokki',
    'Downtown, El Azhar', 'El Sadat City', 'El Salam City', 'El Sayeda Zeinab', 'El Shorouk City', 'El Tagammoa Elkhames',
    'Faisal', 'Garden City', 'Gesr El Suez', 'Giza', 'Hadayek El Kobba', 'Haram', 'Heliopolis', 'Helwan', 'Imbaba',
    'Katameya', 'Maadi', 'Manial', 'Masaken Sheraton', 'Mohandessin', 'Mokattam', 'Nasr City', 'New Cairo', 'Obour',
    'Sheikh Zayed', 'Shoubra', 'Smart Village', 'Zamalek'];

  $scope.updateBirthdate = function () {
    $scope.user.birthdate = new Date($scope.user.birth_year, $scope.user.birth_month - 1, $scope.user.birth_day);
  }

  $scope.$watch("user", function (newval) {
    if (newval && $scope.user.birthdate) {
      $scope.user.birthdate = new Date($scope.user.birthdate);
      $scope.user.birth_day = $scope.user.birthdate.getDate();
      $scope.user.birth_month = $scope.user.birthdate.getMonth() + 1;
      $scope.user.birth_year = $scope.user.birthdate.getFullYear();
    }
  });

  $scope.updateAccount = function () {
    var defer = $q.defer();

    $scope.updateBirthdate();

    $http.post('/user/updateProfileinfo/', {
      user: {
        first_name: $scope.user.first_name,
        last_name: $scope.user.last_name,
        email: $scope.user.email,
        work_email: $scope.user.work_email,
        nationality: $scope.user.nationality,
        residency_country: $scope.user.residency_country,
        birthdate: $scope.user.birthdate,
        address: $scope.user.address,
        city: $scope.user.city,
        area: $scope.user.area
      }
    })
      .success(function(response){
        NotificationService.showSuccess('Profile updated successfully');
        defer.resolve();
      }).error(function(response){
      defer.reject();
    });

    return defer.promise;
  }

  $scope.updatePassword = function () {
    var defer = $q.defer();
    $http.post('/user/updatePassword/', $scope.password_attrs)
      .success(function(response){
        defer.resolve();
      }).error(function(response){
      defer.reject();
    });

    return defer.promise;
  }

  $scope.changePic = function (){
    $scope.loadingProfileImg = true;
    fileUpload.submitImageForm($scope.avatar, '/user/uploadAvatar', function (data){
      $scope.loadingProfileImg = false;
      if(data){
        $scope.user.profile_pic = data + '?_ts=' + new Date().getTime();
        NotificationService.showSuccess('Profile image changed successfully');
      }
    })
  }
}
AccountController.$inject = ['$scope', '$http', '$q', 'fileUpload', 'UserService', 'NotificationService'];
