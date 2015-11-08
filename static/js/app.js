'use strict';
var myapp = angular.module('ngReactionsApp', ['ng-reactions']);

myapp.controller("reactionCtrl", ['$scope', function($scope) {

        $scope.reactionList = [{
            selected: 'none',
            minRating: 1,
            readOnly: false
        },{
            selected: 2,
            minRating: 1,
            readOnly: false
        },{
            selected: -1,
            minRating: 1,
            readOnly: true
        }];
        
        $scope.imageset = [
            {icon: 'static/lib/ngreactions/css/images/emo_laugh.PNG', rating: '3', name: 'Happy'},
            {icon: 'static/lib/ngreactions/css/images/love.png', rating: '1', name: 'OK'},
            {icon: 'static/lib/ngreactions/css/images/smile.png', rating: '2', name: 'Good'},
            {icon: 'static/lib/ngreactions/css/images/sad.png', rating: '0', name: 'Bad'},
            {icon: 'static/lib/ngreactions/css/images/angry.png', rating: '-2', name: 'Frustrated'},
			{icon: 'static/lib/ngreactions/css/images/intolerance.jpg', rating: '-1', name: 'Intolerance'}
        ]
        
        $scope.iconset = [
                {icon: 'ra-medium reaction-happy', rating: '3', name:'Happy'},
                {icon: 'ra-medium reaction-neutral', rating: '1',name:'OK'},
                {icon: 'ra-medium reaction-smile', rating: '2',name:'Good'},
                {icon: 'ra-medium reaction-sad', rating: '0',name:'Bad'},
                {icon: 'ra-medium reaction-frustrated', rating: '-1',name:'Frustrated'}
            ]


        $scope.ratingsCallback = function(reactionsObject,selected) {
            console.log('Selected rating is : '+JSON.stringify(selected));
            console.log('reactionsObject : '+JSON.stringify(reactionsObject));
        };


    }]);


 