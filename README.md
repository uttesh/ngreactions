# ngreations <a href="http://uttesh.github.io/ngreactions/">demo</a>

Is an Angular directive for reactions like rating on services, which will allow customers to choose the reaction on the service like the latest facebook reactions, its fully customizable directive, can integrate any images instead of default.

Font icon not not customoizable only images.

## Quick start

```
bower install ng-reactions
```
or alternatively download and include `ngreactions.js` after `angular.min.js`.

Add the `ng-reactions` module as a dependency when creating your app, e.g.

```
var app = angular.module('myApp', ['ng-reactions']);`

Inject or use in controller

app.controller('reactionCtrl', function($scope) {
   
   //cerate the reaction object with following fields, below is the list of reactions
   
   $scope.reactionList = [{
            selected: 'none',
            minRating: 1,
            readOnly: false
        },{
            selected: 1,
            minRating: 1,
            readOnly: false
        },{
            selected: -1,
            minRating: 1,
            readOnly: true
        }];
		
		
		// below is the image list used for the reaction, these are default set it can be modified according to requirement
		
		        $scope.imageset = [
            {icon: 'static/images/emo_laugh.PNG', rating: '3', name: 'Happy'},
            {icon: 'static/images/love.png', rating: '1', name: 'OK'},
            {icon: 'static/images/smile.png', rating: '2', name: 'Good'},
            {icon: 'static/images/sad.png', rating: '0', name: 'Bad'},
            {icon: 'static/images/angry.png', rating: '-1', name: 'Frustrated'}
        ]
		
		// below is the icon list used for the reaction, these are default set. except icon other values can be modified.
		
		 $scope.iconset = [
                {icon: 'ra-medium reaction-happy', rating: '3', name:'Happy'},
                {icon: 'ra-medium reaction-neutral', rating: '1',name:'OK'},
                {icon: 'ra-medium reaction-smile', rating: '2',name:'Good'},
                {icon: 'ra-medium reaction-sad', rating: '0',name:'Bad'},
                {icon: 'ra-medium reaction-frustrated', rating: '-1',name:'Frustrated'}
            ]
			
		// this is the callback function called on selection of the reactions
		
		$scope.ratingsCallback = function(reactionsObject,selected) {
            console.log('Selected rating is : '+JSON.stringify(selected));
            console.log('reactionsObject : '+JSON.stringify(reactionsObject));
        };
    
}); 
```

## Rendering


```
 <h4> font reactions </h4>
        <div ng-controller="reactionCtrl">
                        <div ng-repeat="reaction in reactionList">
                            <ng-reactions 
                                action="ratingsCallback(reactionsObject,selected)" 
                                data='reaction' 
                                type="icon" 
                                itemset="iconset">
                            </ng-reactions>
                        </div>
        </div>
		
  <h4> Image reactions </h4>
	   <div   ng-controller="reactionCtrl">
						<div ng-repeat="reaction in reactionList">
							<ng-reactions 
								action="ratingsCallback(reactionsObject,selected)" 
								data='reaction' 
								type="image"  
								itemset="imageset">
							</ng-reactions>
						</div>
		</div>
```


## Contributions

For problems/suggestions please create an issue on Github.

## Contributors

* [@uttesh](https://twitter.com/uttesh)


