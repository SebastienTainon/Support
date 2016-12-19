var app = angular.module('support', []);

app.controller('SupportController', function($http, $scope, $timeout) {
    var vm = this;

    vm.upDown = function (direction, order) {
        console.log(direction, order);
        vm.request('/up-down', {
            direction: direction,
            order: order
        }, function() {
            document.location.reload();
        });
    };

    vm.request = function(url, data, success) {
        $http.post(url, data, {
            headers: {'Content-Type': 'application/json'},
            timeout: 2000
        })
            .then(success, function errorCallback() {
                bootbox.alert("La requête n'a pas pu être effectuée.");
            });
    };
});

bootbox.setDefaults({
    locale: "fr",
    show: true,
    backdrop: true,
    closeButton: true,
    animate: true,
    className: "my-modal"
});
