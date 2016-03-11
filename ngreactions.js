/**
 * NG Reactions is directive for AngularJS apps
 * @version v3.0.0 - 2015-10-30 * @link https://github.com/uttesh/ngreactions
 * @author Uttesh Kumar T.H. <uttesh@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    var nra = angular.module('ng-reactions', []);
    // Constants used in the directive functions to avoid the hardcoded values
    nra.constant('constants', {
        ORDER_BY: 'orderBy',
        RATING_FIELD: 'value',
        SELECTED_ELEMENT: 'ra-selected',
        ICON_TYPE: 'icon',
        IMAGE_TYPE: 'image',
        NONE: 'none'

    });
    /**
     * directive which will create the reactions dynamically according to give reactions objects.
     *
     * @reactionObj: which be populated with @attribute data values.
     * @itemset: which is binded with @attribte itemset, itemset will be having the reactions object set along with the values.
     * @callback: on user click event action will return to user callback function along with slected value and passed object
     */
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
                scope.selectedValue = (scope.reactionObj.selected === constants.NONE) ? scope.reactionObj.minRating : scope.reactionObj.selected;
                scope.readOnly = scope.reactionObj.readOnly || false;
                scope.sortedItems = $filter(constants.ORDER_BY)(scope.itemset, constants.RATING_FIELD);
                /**
                 * TODO: Its in the todos, functionality is to selected the reactions on slide instead of clicking on each reactions.
                 * @param {type} parentid
                 * @returns
                 */
                scope.reactionslide = function(parentid) {
                    var currentEle = angular.element.find('#' + parentid);
                    var myElements = currentEle[0].children;
                    angular.forEach(myElements, function(item, key) {
                        angular.element(item).removeClass(constants.SELECTED_ELEMENT);
                        if (angular.element(item)[0].attributes[constants.RATING_FIELD]) {
                            var value = angular.element(value)[0].attributes[constants.RATING_FIELD].value;
                            if (value === scope.reactionrange) {
                                var matchedEle = angular.element(item)[0];
                                swapSelectedIcon(angular.element(matchedEle));
                                scope.callback(value);
                            }
                        }
                    });
                };
                /**
                 * On usr click even on the icon/image this function will be called,
                 * here we will process the event make the current event object to zoom and other icon/image to normal size i.e. to hightlight the selected item.
                 * @param {type} $event
                 * @param {type} val
                 * @param {type} name
                 * @returns {undefined}
                 */
                scope.ratingsClicked = function($event, val, name) {
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
                    var compiledTemplate = $compile(populateIcons(scope.sortedItems, scope.selectedValue, scope.readOnly, constants))(scope);
                    element.replaceWith(compiledTemplate);
                }
                if (attrs.type === constants.IMAGE_TYPE) {
                    var compiledTemplate = $compile(populateImages(scope.sortedItems, scope.selectedValue, scope.readOnly))(scope);
                    element.replaceWith(compiledTemplate);
                }
            }
        };
    });

    /**
     * this function will be used to populate the itemset of images for the directive
     *
     * If seleted flag is set in the object that image will be selected by default along with the help text value.
     * @param {type} sortedItems
     * @param {type} selectedValue
     * @param {type} readOnly
     * @returns {unresolved}
     */
    function populateImages(sortedItems, selectedValue, readOnly) {
        var milliseconds = new Date().getTime();
        var parent = angular.element("<div></div>");
        var iconsList = angular.element("<div></div>")
          .attr({
              "class": 'ra-image-div drop-shadow',
              "id": milliseconds
          });
        var reactionText = 'select reaction';
        angular.forEach(sortedItems, function(item, key) {
            var classStr = '';
            if (selectedValue !== 'none' && selectedValue === item.value) {
                classStr = 'ra-selected ra-image-selected-size';
                reactionText = item.name;
            } else {
                classStr = 'ra-image-default-size ';
            }
            var parentSpan = angular.element("<span></span>")
              .attr({
                  'data-tooltip': item.name
              });
            var span = angular.element('<img></img>')
              .attr({
                  'class': classStr,
                  'src': item.icon,
                  'value': item.value,
                  'ng-click': readOnly === false ? 'ratingsClicked($event,' + item.value + ',"' + item.name + '")' : ''
              });
            if (readOnly === false) {
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

    /**
     *  This function will called by the link function if the type is set to "icon"
     *
     *  This function will load the default icon set present in the reactions fonts. this fonts set is con not be modified
     *  because this function is tightly coupled with link function.
     * @param {type} itemset
     * @param {type} selectedValue
     * @param {type} readOnly
     * @param {type} constants
     * @returns {unresolved}
     */
    function  populateIcons(itemset, selectedValue, readOnly, constants) {
        var milliseconds = new Date().getTime();
        var parent = angular.element("<div></div>");
        var iconsList = angular.element("<div></div>")
          .attr({
              "class": 'ra-icon-div drop-shadow lifted '+(readOnly == false ? '' : 'read-only'),
              "id": milliseconds
          });
        var reactionText = 'select reaction';
        angular.forEach(itemset, function(item, key) {
            var span = angular.element('<span></span>')
              .attr({
                  'class': 'ripple ' + item.icon,
                  'style': readOnly == false ? 'cursor: pointer;' : 'cursor:default;',
                  'value': item.value,
                  'ng-click': readOnly == false ? 'ratingsClicked($event,' + item.value + ',"' + item.name + '")' : '',
              });
            if (selectedValue !== 'none' && selectedValue === item.value) {
                reactionText = item.name;
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
    /**
     * TODOS:
     * This function will populate the slider acording to the given iconset value and create the slider points
     * @param {type} sortedItems
     * @returns {unresolved}
     */
    function populateSlider(sortedItems) {
        var milliseconds = new Date().getTime();
        var length = sortedItems.length;
        var range_min_value = sortedItems[0].value;
        var range_max_value = sortedItems[length - 1].value;
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
    /**
     * This function is internally used for the slider function
     * @param {type} itemset
     * @returns {_L8.populateDataList.datalist}
     */
    function populateDataList(itemset) {
        var datalist = angular.element("<datalist></datalist>")
          .attr({
              "id": 'reactionscale'
          });
        angular.forEach(itemset, function(item, key) {
            var option = angular.element('<option>' + item.value + '</option>');
            datalist.append(option);
        });

        return datalist[0];
    }
    /**
     * TODOs: need to work on this to make generic in future
     * This function is used for the icon change on use event, due to this hardcoded icon values here we can not modify the iconset.
     * @param {type} element
     * @returns {unresolved}
     */
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

    /**
     * this function will used to zoom the seleted image.
     * @param {type} element
     * @returns {unresolved}
     */
    function  zoomSelectedItem(element) {
        var _class = element.attr('class');
        element.removeClass("ra-image-default-size");
        element.addClass("ra-selected ra-image-selected-size");
        return element;
    }
    /**
     *
     * this function will updated the help text values according to selected reaction
     *
     * @param {type} element
     * @param {type} name
     * @returns {undefined}
     */
    function updateReactionText(element, name) {
        var spanHelpTextElement = angular.element(element).parent().find('.help-text');
        angular.element(spanHelpTextElement[0]).text(name);
    }

    /**
     * This function will reset other icons on selection of icon
     *
     * @param {type} element
     * @returns {undefined}
     */
    function resetOtherIcons(element) {
        var myElements = angular.element(element).parent().find('.ra-selected');
        angular.forEach(myElements, function(item, key) {
            angular.element(item).removeClass("ra-selected");
            angular.element(item).addClass("ra-no-color");
            angular.element(item).removeClass("ra-image-selected-size");
            angular.element(item).addClass("ra-image-default-size");
        });
    }

    /**
     * Validate the required attribute are set or not
     * @param {type} attrs
     * @returns {Number}
     */

    function configValidate(attrs) {
        if (!attrs.action) {
            throw new Error('ngReactions: Missing action attribute, its required attribute');
        }
        if (!attrs.itemset) {
            throw new Error('ngReactions: Missing itemset attribute, its required attribute');
        }
        if (!attrs.data) {
            throw new Error('ngReactions: Missing data attribute, its required attribute');
        }
    }
})();
