var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Peanut;
(function (Peanut) {
    var TestPropertyFormViewModel = (function (_super) {
        __extends(TestPropertyFormViewModel, _super);
        function TestPropertyFormViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.valuesView = ko.observableArray();
            _this.getValues = function () {
                var values = _this.propertiesController.getValues();
                _this.valuesView([]);
                for (var key in values) {
                    _this.valuesView.push({ key: key, value: values[key] });
                }
            };
            _this.setValues = function () {
                var values = [];
                values['item1'] = 1;
                values['item2'] = 2;
                values['item3'] = null;
                values['item4'] = 1;
                values['item5'] = 2;
                _this.propertiesController.setValues(values);
            };
            _this.clearValues = function () {
                _this.propertiesController.clearValues();
            };
            return _this;
        }
        TestPropertyFormViewModel.prototype.init = function (successFunction) {
            var _this = this;
            var me = this;
            console.log('TestPropertyForm Init');
            var lookups = [];
            lookups['one'] = [
                {
                    code: 'first',
                    description: 'first one',
                    id: 1,
                    name: 'First of one'
                },
                {
                    code: 'second',
                    description: 'second one',
                    id: 2,
                    name: 'Second of one'
                },
            ];
            lookups['two'] = [
                {
                    code: 'first',
                    description: 'one of two',
                    id: 1,
                    name: 'First of two'
                },
                {
                    code: 'second',
                    description: 'two of two',
                    id: 2,
                    name: 'Second of two'
                },
            ];
            var defs = [
                {
                    lookup: 'one',
                    defaultValue: null,
                    key: 'item1',
                    label: 'Test one:',
                    required: false
                },
                {
                    lookup: 'two',
                    defaultValue: null,
                    key: 'item2',
                    label: 'Test two:',
                    required: false
                },
                {
                    lookup: 'one',
                    defaultValue: null,
                    key: 'item3',
                    label: 'Test three:',
                    required: false
                },
                {
                    lookup: 'two',
                    defaultValue: null,
                    key: 'item4',
                    label: 'Test four:',
                    required: false
                },
                {
                    lookup: 'two',
                    defaultValue: null,
                    key: 'item5',
                    label: 'Test five:',
                    required: false
                },
            ];
            me.application.registerComponents('@pnut/entity-properties', function () {
                _this.propertiesController = new Peanut.entityPropertiesController(defs, lookups, '(any)');
                me.bindDefaultSection();
                successFunction();
            });
        };
        return TestPropertyFormViewModel;
    }(Peanut.ViewModelBase));
    Peanut.TestPropertyFormViewModel = TestPropertyFormViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=TestPropertyFormViewModel.js.map