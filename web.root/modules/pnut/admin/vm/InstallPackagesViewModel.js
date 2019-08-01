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
    var InstallPackagesViewModel = (function (_super) {
        __extends(InstallPackagesViewModel, _super);
        function InstallPackagesViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.activePage = ko.observable('');
            _this.packageList = ko.observableArray([]);
            _this.installResultMessage = ko.observable('');
            _this.installResultLog = ko.observableArray([]);
            _this.showPackageList = function (pkgList) {
                var me = _this;
                me.packageList(pkgList);
                if (pkgList.length == 0) {
                    me.activePage('noPackages');
                }
                else {
                    me.activePage('packageList');
                }
            };
            _this.installPkg = function (pkgInfo) {
                var pkgName = pkgInfo.name;
                var me = _this;
                var request = pkgName;
                me.installResultLog([]);
                me.installResultMessage('');
                me.application.hideServiceMessages();
                me.application.showWaiter('Installing ' + pkgName + '...');
                me.services.executeService('Peanut::InstallPackage', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    var response = serviceResponse.Value;
                    var resultMessage = 'Installation of ' + pkgName + ' ' + (response.success ? 'succeeded' : 'failed');
                    me.installResultMessage(resultMessage);
                    me.installResultLog(response.log);
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.showPackageList(response.list);
                    }
                    me.showInstallationResult();
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                    me.application.hideWaiter();
                });
            };
            _this.uninstallPkg = function (pkgInfo) {
                var pkgName = pkgInfo.name;
                var me = _this;
                var request = pkgName;
                me.installResultLog([]);
                me.installResultMessage('');
                me.application.hideServiceMessages();
                me.application.showWaiter('Installing ' + pkgName + '...');
                me.services.executeService('Peanut::UninstallPackage', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    var response = serviceResponse.Value;
                    var resultMessage = 'Uninstall of ' + pkgName + ' ' + (response.success ? 'succeeded' : 'failed');
                    me.installResultMessage(resultMessage);
                    me.installResultLog(response.log);
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.showPackageList(response.list);
                    }
                    me.showInstallationResult();
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                    me.application.hideWaiter();
                });
            };
            _this.showInstallationResult = function () {
                jQuery("#install-results-modal").modal('show');
            };
            return _this;
        }
        InstallPackagesViewModel.prototype.init = function (successFunction) {
            var me = this;
            var request = {};
            me.application.hideServiceMessages();
            me.application.showWaiter('Looking for packages...');
            me.services.executeService('Peanut::GetPackageList', request, function (serviceResponse) {
                me.application.hideWaiter();
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    var response = serviceResponse.Value;
                    me.showPackageList(response);
                    me.bindDefaultSection();
                }
            }).fail(function () {
                me.application.hideWaiter();
            });
        };
        return InstallPackagesViewModel;
    }(Peanut.ViewModelBase));
    Peanut.InstallPackagesViewModel = InstallPackagesViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=InstallPackagesViewModel.js.map