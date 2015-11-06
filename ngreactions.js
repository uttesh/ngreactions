/**
 * NG Reactions is directive for AngularJS apps
 * @version v3.0.0 - 2015-10-30 * @link https://github.com/uttesh/ngreactions
 * @author Uttesh Kumar T.H. <uttesh@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    var nra = angular.module('ng-reactions', []);

    nra.constant('constants', {
        ORDER_BY: 'orderBy',
        RATING_FIELD: 'rating',
        SELECTED_ELEMENT: 'ra-selected',
        ICON_TYPE: 'icon',
        IMAGE_TYPE: 'image',
        NONE: 'none'

    });

    nra.directive('ngReactions', function($compile, $filter, constants) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                reactionObj: '=data',
                itemset: '=itemset',
                callback: '&action'
            },
            link: function(scope, element, attrs) {
                configValidate(attrs);
                scope.selectedrating = (scope.reactionObj.selected === constants.NONE) ? scope.reactionObj.minRating : scope.reactionObj.selected;
                scope.readOnly = scope.reactionObj.readOnly || false;
                scope.sortedItems = $filter(constants.ORDER_BY)(scope.itemset, constants.RATING_FIELD);
                scope.reactionslide = function(parentid) {
                    var currentEle = angular.element.find('#' + parentid);
                    var myElements = currentEle[0].children;
                    angular.forEach(myElements, function(value, key) {
                        angular.element(value).removeClass(constants.SELECTED_ELEMENT);
                        if (angular.element(value)[0].attributes[constants.RATING_FIELD]) {
                            var rating = angular.element(value)[0].attributes[constants.RATING_FIELD].value;
                            if (rating === scope.reactionrange) {
                                var matchedEle = angular.element(value)[0];
                                swapSelectedIcon(angular.element(matchedEle));
                                scope.callback(rating);
                            }
                        }
                    });
                };
                scope.ratingsClicked = function($event, val, name) {
                    console.log('ratingsClicked :' + angular.element($event.currentTarget) + " element name :" + name);
                    updateReactionText(angular.element($event.currentTarget).parent(), name);
                    resetOtherIcons(angular.element($event.currentTarget).parent());
                    if (attrs.type === constants.ICON_TYPE) {
                        swapSelectedIcon(angular.element($event.target));
                    }
                    if (attrs.type === constants.IMAGE_TYPE) {
                        zoomSelectedItem(angular.element($event.target));
                    }
                    scope.callback({reactionsObject: scope.reactionObj, selected: val});
                };
                if (attrs.type === constants.ICON_TYPE) {
                    var compiledTemplate = $compile(populateIcons(scope.sortedItems, scope.selectedrating, scope.readOnly, constants))(scope);
                    element.replaceWith(compiledTemplate);
                }
                if (attrs.type === constants.IMAGE_TYPE) {
                    var compiledTemplate = $compile(populateImages(scope.sortedItems, scope.selectedrating, scope.readOnly))(scope);
                    element.replaceWith(compiledTemplate);
                }
            }
        };
    });

    function populateImages(sortedItems, selectedrating, readOnly) {
        var milliseconds = new Date().getTime();
        var parent = angular.element("<div></div>");
        var iconsList = angular.element("<div></div>")
                .attr({
                    "class": 'ra-image-div drop-shadow',
                    "id": milliseconds
                });
        var reactionText = 'select reaction';
        angular.forEach(sortedItems, function(value, key) {
            var classStr = '';
            if (selectedrating != 'none' && selectedrating == value.rating) {
                classStr = 'ra-selected ra-image-selected-size';
                reactionText = value.name;
            } else {
                classStr = 'ra-image-default-size ';
            }
            var parentSpan = angular.element("<span></span>")
                    .attr({
                        'data-tooltip': value.name
                    });
            var span = angular.element('<img></img>')
                    .attr({
                        'class': classStr,
                        'src': value.icon,
                        'rating': value.rating,
                        'ng-click': readOnly == false ? 'ratingsClicked($event,' + value.rating + ',"' + value.name + '")' : '',
                    });
            if (readOnly == false) {
                parentSpan.append(span);
                iconsList.append(parentSpan);
            }else{
                iconsList.append(span);
            }
        });
        iconsList.append(angular.element('<div><span class="help-text">' + reactionText + '</span></div>'));
        parent.append(iconsList).html();
        var _cleanText = parent.html();
        return _cleanText;
    }
    function  populateIcons(itemset, selectedrating, readOnly, constants) {
        console.log(constants.RATING_FIELD);
        var milliseconds = new Date().getTime();
        var parent = angular.element("<div></div>");
        var iconsList = angular.element("<div></div>")
                .attr({
                    "class": 'ra-icon-div drop-shadow lifted '+(readOnly == false ? '' : 'read-only'),
                    "id": milliseconds
                });
        var reactionText = 'select reaction';
        angular.forEach(itemset, function(value, key) {
            var span = angular.element('<span></span>')
                    .attr({
                        'class': 'ripple ' + value.icon,
						'style': readOnly == false ? 'cursor: pointer;' : 'cursor:default;',
                        'rating': value.rating,
                        'ng-click': readOnly == false ? 'ratingsClicked($event,' + value.rating + ',"' + value.name + '")' : '',
                    });
            if (selectedrating != 'none' && selectedrating == value.rating) {
                reactionText = value.name;
                iconsList.append(swapSelectedIcon(angular.element(span)));
            } else {
                iconsList.append(span);
            }
        });

        // TODO : slider functionality, implementation is finished need to work on smooth slider
        //iconsList.append(populateSlider(itemset));
        iconsList.append(angular.element('<div><span class="help-text">' + reactionText + '</span></div>'));
        parent.append(iconsList).html();
        var _cleanText = parent.html();
        return _cleanText;
    }

    function populateSlider(sortedItems) {
        var milliseconds = new Date().getTime();
        var length = sortedItems.length;
        var range_min_value = sortedItems[0].rating;
        var range_max_value = sortedItems[length - 1].rating;
        var reaction_slider_div = angular.element("<div></div>")
                .attr({
                    "class": "range-slider"
                });
        var reaction_slider = angular.element("<input />")
                .attr({
                    "class": "input-range",
                    "type": "range",
                    "value": 0,
                    "min": range_min_value,
                    "max": range_max_value,
                    "ng-model": "reactionrange",
                    "ng-change": 'reactionslide(' + milliseconds + ')',
                    'list': 'reactionscale'
                });
        reaction_slider_div.append(reaction_slider);
        reaction_slider_div.append(populateDataList(sortedItems));
        return reaction_slider_div;
    }

    function populateDataList(itemset) {
        var datalist = angular.element("<datalist></datalist>")
                .attr({
                    "id": 'reactionscale'
                });
        angular.forEach(itemset, function(value, key) {
            var option = angular.element('<option>' + value.rating + '</option>');
            datalist.append(option);
        });

        return datalist[0];
    }

    function  swapSelectedIcon(element) {
        var _class = element.attr('class');
        if (_class.indexOf("reaction-happy") > -1) {
            element.removeClass("reaction-happy");
            element.addClass("reaction-happy2 ra-selected ra-happy-color");
        }
        if (_class.indexOf("reaction-neutral") > -1) {
            element.removeClass("reaction-neutral");
            element.addClass("reaction-neutral2 ra-selected ra-neutral-color");
        }
        if (_class.indexOf("reaction-smile") > -1) {
            element.removeClass("reaction-smile");
            element.addClass("reaction-smile2 ra-selected ra-smile-color");
        }
        if (_class.indexOf("reaction-sad") > -1) {
            element.removeClass("reaction-sad");
            element.addClass("reaction-sad2 ra-selected ra-angry-color");
        }
        if (_class.indexOf("reaction-shocked") > -1) {
            element.removeClass("reaction-shocked");
            element.addClass("reaction-shocked2 ra-selected");
        }
        if (_class.indexOf("reaction-frustrated") > -1) {
            element.removeClass("reaction-frustrated");
            element.addClass("reaction-frustrated2 ra-selected ra-frustrated-color");
        }
        return element;
    }
    ;

    function  zoomSelectedItem(element) {
        var _class = element.attr('class');
        element.removeClass("ra-image-default-size");
        element.addClass("ra-selected ra-image-selected-size");
        return element;
    }

    function updateReactionText(element, name) {
        var spanHelpTextElement = angular.element(element).parent().find('.help-text');
        angular.element(spanHelpTextElement[0]).text(name);
    }

    function resetOtherIcons(element) {
        var myElements = angular.element(element).parent().find('.ra-selected');
        angular.forEach(myElements, function(value, key) {
            angular.element(value).removeClass("ra-selected");
            angular.element(value).addClass("ra-no-color");
            angular.element(value).removeClass("ra-image-selected-size");
            angular.element(value).addClass("ra-image-default-size");
        });
    }


    function configValidate(attrs) {
        if (!attrs.action) {
            console.log('Missing action attribute, its required attribute');
            return -1;
        }
        if (!attrs.itemset) {
            console.log('Missing itemset attribute, its required attribute');
            return -1;
        }
        if (!attrs.data) {
            console.log('Missing data attribute, its required attribute');
            return -1;
        }
    }
})();
