var Peanut;
(function (Peanut) {
    var multiSelectComponent = (function () {
        function multiSelectComponent(params) {
            var _this = this;
            this.errorMessage = ko.observable('');
            this.selectedItem = ko.observable(null);
            this.available = ko.observableArray([]);
            this.label = ko.observable('');
            this.caption = ko.observable('Please select...');
            this.removeText = ko.observable('Remove');
            this.itemSubscription = null;
            this.selectionsSubscription = null;
            this.controlId = ko.observable('multi-select-field');
            this.sortValue = 'name';
            this.filterAvailable = function () {
                var me = _this;
                var test = me.available();
                var selected = me.selected();
                var items = me.lookupItems();
                var result = me.lo.filter(items, function (item) {
                    var existing = me.lo.find(selected, function (selectItem) {
                        return selectItem.id == item.id;
                    });
                    return (!existing);
                });
                me.available(result);
            };
            this.addItem = function (item) {
                if (item) {
                    _this.moveSelectedItem(item, _this.available, _this.selected);
                }
            };
            this.removeItem = function (item) {
                _this.moveSelectedItem(item, _this.selected, _this.available);
            };
            this.moveSelectedItem = function (item, source, target) {
                var me = _this;
                me.suspendSubscriptions();
                var remaining = me.lo.filter(source(), function (sourceItem) {
                    return sourceItem.id != item.id;
                });
                remaining = me.lo.sortBy(remaining, me.sortValue);
                target.push(item);
                var targetItems = me.lo.sortBy(target(), me.sortValue);
                source(remaining);
                target(targetItems);
                me.activateSubscriptions();
            };
            this.suspendSubscriptions = function () {
                if (_this.itemSubscription !== null) {
                    _this.itemSubscription.dispose();
                    _this.itemSubscription = null;
                }
                if (_this.selectionsSubscription !== null) {
                    _this.selectionsSubscription.dispose();
                    _this.selectionsSubscription = null;
                }
            };
            this.activateSubscriptions = function () {
                _this.selectedItem(null);
                _this.itemSubscription = _this.selectedItem.subscribe(_this.addItem);
                _this.selectionsSubscription = _this.selected.subscribe(_this.filterAvailable);
            };
            var me = this;
            me.errorMessage('Cannot load multi-select');
            if (!params) {
                console.error('multiSelectComponent: Params not defined in multi-select');
                return;
            }
            var valid = true;
            if (!params.items) {
                console.error('multiSelectComponent: Parameter "items" is required');
                valid = false;
            }
            if (!params.selected) {
                console.error('multiSelectComponent: Parameter "selected" is required');
                valid = false;
            }
            if (!valid) {
                return;
            }
            me.errorMessage('');
            if (params.translator) {
                var translator = params.translator();
                me.removeText(translator.translate('label-remove', 'Remove'));
                if (params.label) {
                    me.label(translator.translate(params.label));
                }
                if (params.caption) {
                    me.caption(translator.translate(params.caption));
                }
            }
            if (params.sort) {
                me.sortValue = params.sort;
            }
            me.lookupItems = params.items;
            me.selected = params.selected;
            if (!multiSelectComponent.lo) {
                multiSelectComponent.lo = _.noConflict();
            }
            me.lo = multiSelectComponent.lo;
            me.filterAvailable();
            me.activateSubscriptions();
        }
        return multiSelectComponent;
    }());
    Peanut.multiSelectComponent = multiSelectComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=multiSelectComponent.js.map