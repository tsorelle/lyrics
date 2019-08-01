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
    var HomeViewModel = (function (_super) {
        __extends(HomeViewModel, _super);
        function HomeViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.executingService = ko.observable(false);
            _this.verses = ko.observableArray();
            _this.set = ko.observable('Default');
            _this.sets = ko.observableArray();
            _this.songs = ko.observableArray();
            _this.allsongs = ko.observableArray();
            _this.textSize = ko.observable(2);
            _this.title = ko.observable('');
            _this.reduceFont = function () {
                if (_this.textSize() > 1) {
                    _this.zoom(-0.5);
                }
            };
            _this.enlargeFont = function () {
                _this.zoom(+0.5);
            };
            _this.zoom = function (increment) {
                _this.textSize(_this.textSize() + increment);
            };
            return _this;
        }
        HomeViewModel.prototype.init = function (successFunction) {
            var me = this;
            me.executingService(true);
            var request = null;
            me.services.executeService('GetSongs', request, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    var response = serviceResponse.Value;
                    me.verses(response.verses);
                    me.songs(response.songs);
                    me.sets(response.sets);
                    me.title(response.title);
                }
            })
                .fail(function () {
                var trace = me.services.getErrorInformation();
            })
                .always(function () {
                me.executingService(false);
                me.bindDefaultSection();
                successFunction();
            });
        };
        return HomeViewModel;
    }(Peanut.ViewModelBase));
    Peanut.HomeViewModel = HomeViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=HomeViewModel.js.map