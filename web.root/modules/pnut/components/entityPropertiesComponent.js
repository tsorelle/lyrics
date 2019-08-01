var Peanut;
(function (Peanut) {
    var entityPropertiesController = (function () {
        function entityPropertiesController(properties, lookups, selectText, clearValues) {
            if (selectText === void 0) { selectText = 'Select'; }
            if (clearValues === void 0) { clearValues = false; }
            var _this = this;
            this.controls = [];
            this.defaults = [];
            this.clearValues = function () {
                _this.setAssociatedValues(_this.defaults);
            };
            this.getValue = function (key) {
                var item = _this.controls[key];
                var value = item.selected();
                return value || null;
            };
            var me = this;
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                var lookup = lookups[property.lookup];
                var defaultItem = me.getLookupValue(property.defaultValue, lookup);
                me.controls[property.key] = {
                    lookup: lookup,
                    selected: ko.observable(defaultItem),
                    label: property.label,
                    caption: ((property.required && property.defaultValue) && !clearValues) ? null : selectText,
                    displayText: defaultItem ? defaultItem.name : ''
                };
                me.defaults[property.key] = property.defaultValue;
            }
        }
        entityPropertiesController.prototype.getLookupValue = function (value, lookupList) {
            for (var i = 0; i < lookupList.length; i++) {
                var lookupItem = lookupList[i];
                if (lookupItem.id == value) {
                    return lookupItem;
                }
            }
            return null;
        };
        entityPropertiesController.prototype.setValue = function (key, value) {
            var me = this;
            var control = me.controls[key];
            var item = me.getLookupValue(value, control.lookup);
            me.controls[key].displayText = item ? item.name : '';
            me.controls[key].selected(item);
        };
        entityPropertiesController.prototype.setAssociatedValues = function (values) {
            var me = this;
            for (var key in values) {
                me.setValue(key, values[key]);
            }
        };
        entityPropertiesController.prototype.setValues = function (values) {
            var me = this;
            for (var i = 0; i < values.length; i++) {
                me.setValue(values[i].Key, values[i].Value);
            }
        };
        entityPropertiesController.prototype.getValues = function () {
            var me = this;
            var result = [];
            for (var key in me.controls) {
                var item = me.controls[key];
                var value = item.selected();
                if (value) {
                    result.push({
                        Key: key,
                        Value: value.id
                    });
                }
            }
            return result;
        };
        return entityPropertiesController;
    }());
    Peanut.entityPropertiesController = entityPropertiesController;
    var entityPropertiesComponent = (function () {
        function entityPropertiesComponent(params) {
            this.propertyRows = ko.observableArray([]);
            this.readOnly = ko.observable(false);
            var me = this;
            if (!params) {
                console.error('entityPropertiesComponent: Params not defined in entityPropertiesComponent');
                return;
            }
            if (!params.controller) {
                console.error('entityPropertiesComponent: Parameter "controller" is required');
                return;
            }
            me.readOnly(params.readOnly == 1);
            var test = me.readOnly();
            var clearValues = params.clearValues;
            var columnCount = 3;
            var columnWidth = 'md';
            if (params.columns) {
                columnCount = params.columns;
            }
            if (params.colwidth) {
                columnWidth = params.colwidth;
            }
            var columnClass = 'col-' + columnWidth + '-' + (Math.floor(12 / columnCount));
            var rows = [];
            var controls = [];
            var i = 0;
            for (var key in params.controller.controls) {
                var control = params.controller.controls[key];
                var lookup = ko.observableArray(control.lookup);
                controls.push({
                    label: control.label,
                    lookup: lookup,
                    selected: control.selected,
                    caption: control.caption,
                    cssColumn: columnClass,
                    displayText: control.displayText
                });
                if (++i === columnCount) {
                    rows.push(ko.observableArray(controls));
                    controls = [];
                }
            }
            if (controls.length > 0) {
                rows.push(ko.observableArray(controls));
            }
            me.propertyRows(rows);
        }
        return entityPropertiesComponent;
    }());
    Peanut.entityPropertiesComponent = entityPropertiesComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=entityPropertiesComponent.js.map