var Peanut;
(function (Peanut) {
    var selectListObservable = (function () {
        function selectListObservable(selectHandler, optionsList, defaultValue) {
            if (optionsList === void 0) { optionsList = []; }
            if (defaultValue === void 0) { defaultValue = null; }
            this.options = ko.observableArray();
            this.selected = ko.observable();
            var me = this;
            me.options(optionsList);
            me.defaultValue = defaultValue;
            me.setValue(defaultValue);
            me.selectHandler = selectHandler;
        }
        selectListObservable.prototype.setOptions = function (optionsList, defaultValue) {
            if (optionsList === void 0) { optionsList = []; }
            if (defaultValue === void 0) { defaultValue = null; }
            var me = this;
            me.options(optionsList);
            me.setValue(defaultValue);
        };
        selectListObservable.prototype.hasOption = function (value) {
            var me = this;
            var options = me.options();
            var option = _.find(options, function (item) {
                return item.Value == value;
            });
            return (!!option);
        };
        selectListObservable.prototype.setValue = function (value) {
            var me = this;
            var options = me.options();
            var option = _.find(options, function (item) {
                return item.Value == value;
            });
            me.selected(option);
        };
        selectListObservable.prototype.getOptions = function () {
            var me = this;
            return me.options();
        };
        selectListObservable.prototype.setDefaultValue = function () {
            var me = this;
            me.setValue(me.defaultValue);
        };
        selectListObservable.prototype.getValue = function (defaultValue) {
            if (defaultValue === void 0) { defaultValue = ''; }
            var me = this;
            var selection = me.selected();
            return selection ? selection.Value : defaultValue;
        };
        selectListObservable.prototype.getName = function (defaultName) {
            if (defaultName === void 0) { defaultName = ''; }
            var me = this;
            var selection = me.selected();
            return selection ? selection.Name : defaultName;
        };
        selectListObservable.prototype.restoreDefault = function () {
            var me = this;
            me.setValue(me.defaultValue);
        };
        selectListObservable.prototype.unsubscribe = function () {
            var me = this;
            if (me.subscription) {
                me.subscription.dispose();
            }
        };
        selectListObservable.prototype.subscribe = function () {
            var me = this;
            me.subscription = me.selected.subscribe(me.selectHandler);
        };
        return selectListObservable;
    }());
    Peanut.selectListObservable = selectListObservable;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=selectListObservable.js.map