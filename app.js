var app = angular.module('support', []);

app.controller('SupportController', function ($http) {
    var vm = this;

    vm.upDown = function (direction, order) {
        vm.request('/up-down', {
            direction: direction,
            order: order
        }, function() {
            document.location.reload();
        });
    };

    vm.request = function (url, data, success) {
        $http.post(url, data, {
            headers: {'Content-Type': 'application/json'},
            timeout: 2000
        })
            .then(success, vm.errorCallback);
    };

    vm.addUser = function () {
        $http.post('/add-user', {id: vm.newUserId}, {
            headers: {'Content-Type': 'application/json'},
            timeout: 2000
        })
            .then(function () {
                document.location.reload();
            }, vm.errorCallback);
    };

    vm.removeUser = function (userId) {
        $http.post('/remove-user', {id: userId}, {
            headers: {'Content-Type': 'application/json'},
            timeout: 2000
        })
            .then(function () {
                document.location.reload();
            }, vm.errorCallback);
    };

    vm.errorCallback = function () {
        bootbox.alert("La requête n'a pas pu être effectuée.");
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
