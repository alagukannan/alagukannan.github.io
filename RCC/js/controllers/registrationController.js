app.controller("registrationController", function($scope, $http, $location, $routeParams, $filter, $anchorScroll) {

    $scope.params = $routeParams;
    $scope.isEventDataAvailable = false;
    var RCC_API_URI = "https://redlandscricketclub-developer-edition.na34.force.com/services/apexrest/alagukannan/registrations/v2";

    //get data from rcc-api
    $http.get(RCC_API_URI, {
        params: {
            "token": $scope.params.token
        }
    }).then(function(response) {
        $scope.participant = response.data.participant;
        $scope.event = response.data.event;
        //setup status enum
        angular.forEach($scope.event.participants, function(value, key) {
            $scope.setStatusEnum(value);
        });
        $scope.isEventDataAvailable = true;
        var _participant = $filter('filter')($scope.event.participants, {
            Id: $scope.participant.Id
        });
    });

    //process form
    $scope.registerParticipant = function() {
        var postParams = angular.copy($scope.participant);
        postParams.token = $scope.params.token;
        postParams.fullname = undefined;

        $http.post(RCC_API_URI, postParams).then(function(response) {
            //update the participant records
            var _participants = $filter('filter')($scope.event.participants, {
                Id: postParams.Id
            });
            if (_participants.length > 0) {
                var updatedParticipant = _participants[0];
                updatedParticipant.status = postParams.status;
                updatedParticipant.comments = postParams.comments;
                updatedParticipant.guests = postParams.guests;
                $scope.setStatusEnum(updatedParticipant);
            }
            //success handler
            $scope.formResponse = response;
            $scope.formResponse.isSuccess = true;
        }, function(response) {
            //error handler
            $scope.formResponse = response;
            $scope.formResponse.isSuccess = false;
        });
    };


    $scope.gotoAnchor = function(divname, event) {
        event.preventDefault();
        event.stopPropagation();
        $location.hash(divname);
        $anchorScroll();
    };

    $scope.getGuestCounts = function() {
        var _counts = 0;
        if ($scope.event) {
            angular.forEach($scope.event.participants, function(value, key) {
                if (angular.isNumber(value.guests))
                    _counts = _counts + value.guests;
            });
        }
        return _counts;
    };

    $scope.setStatusEnum = function(participant) {
        var _status = 0;
        switch (participant.status) {
            case "Yes":
                _status = 3;
                break;
            case "Maybe":
                _status = 2;
                break
            case "No":
                _status = 1;
                break;
        }
        participant._status = _status;
    };
});