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
    var TestPageViewModel = (function (_super) {
        __extends(TestPageViewModel, _super);
        function TestPageViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.messageText = ko.observable('');
            _this.itemName = ko.observable('');
            _this.itemId = ko.observable(1);
            _this.messagePanel = ko.observable('button');
            _this.messageFormVisible = ko.observable(false);
            _this.messageButtonVisible = ko.observable(true);
            _this.languageA = ko.observable('');
            _this.languageB = ko.observable('');
            _this.loadcss = function (path, media) {
                if (media === void 0) { media = null; }
                if (path) {
                    path = '/application/assets/styles/' + path;
                    var fileref = document.createElement("link");
                    fileref.setAttribute("rel", "stylesheet");
                    fileref.setAttribute("type", "text/css");
                    fileref.setAttribute("href", path);
                    if (media) {
                        fileref.setAttribute('media', media);
                    }
                    if (typeof fileref === "undefined") {
                        console.error('Failed to load stylesheet ' + path);
                    }
                    document.getElementsByTagName("head")[0].appendChild(fileref);
                    console.log('Loaded stylesheet: ' + path);
                }
            };
            _this.save = function () {
                jQuery("#confirm-save-modal").modal('hide');
                alert('you saved');
            };
            _this.onShowError = function () {
                _this.application.showError("This is an error message.");
            };
            _this.onService = function () {
                var me = _this;
                var request = { "tester": 'Terry SoRelle' };
                me.application.hideServiceMessages();
                me.application.showWaiter('Testing service...');
                me.services.executeService('PeanutTest::HelloWorld', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        alert('hello ' + response.message);
                        me.addTranslations(response.translations);
                        me.languageA(me.translate('hello', 'Hello'));
                        me.languageB(me.translate('world'));
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.application.hideWaiter();
                });
            };
            _this.onShowForm = function () {
                console.log('Show form component');
                var me = _this;
                _this.application.attachComponent('tests/test-form', function (returnFuncton) {
                    console.log('attachComponent - returnFunction');
                    _this.application.loadComponents('@app/tests/test-form', function () {
                        console.log('instatiate testForm component');
                        if (!Peanut.testFormComponent) {
                            console.log('Test form component not loaded.');
                            return;
                        }
                        me.testForm = new Peanut.testFormComponent();
                        me.testForm.setMessage('Watch this space.');
                        me.messagePanel('form');
                        returnFuncton(me.testForm);
                    });
                });
            };
            _this.onSendMessage = function () {
                _this.testForm.setMessage(_this.messageText());
            };
            _this.onShowMessageComponent = function () {
                _this.attachComponent('tests/test-message');
                _this.messageButtonVisible(false);
            };
            _this.currentPage = ko.observable(1);
            _this.maxPages = ko.observable(10);
            _this.changePage = function (move) {
                var current = _this.currentPage() + move;
                _this.currentPage(current);
            };
            return _this;
        }
        TestPageViewModel.prototype.init = function (successFunction) {
            var me = this;
            me.application.loadStyleSheets('test.css media=print');
            me.addTranslation('test', 'Un prueba de traducadora');
            me.addTranslation('thing-plural', 'thingies');
            me.addTranslation('save-modal-message', 'Do you want to save changes now?');
            me.application.registerComponents('tests/intro-message,@pnut/modal-confirm,@pnut/pager', function () {
                me.application.loadComponents('tests/message-constructor', function () {
                    me.application.loadResources([
                        '@lib:lodash',
                        '@lib:local/TestLib.js',
                        '@pnut/searchListObservable',
                        '@pnut/ViewModelHelpers'
                    ], function () {
                        me._ = _.noConflict();
                        var test = me._.head(['one', 'two', 'three']);
                        if (test === 'one') {
                            console.log('Lodash installed');
                        }
                        Testing.Test.sayHello();
                        var cvm = new Peanut.messageConstructorComponent('Smoke Test Buttons:');
                        me.application.registerComponent('tests/message-constructor', cvm, function () {
                            me.bindDefaultSection();
                            successFunction();
                        });
                    });
                });
            });
        };
        TestPageViewModel.prototype.onGetItem = function () {
            var me = this;
            me.application.showWaiter('Please wait...');
            me.services.getFromService('TestGetService', 3, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    me.itemName(serviceResponse.Value.name);
                    me.itemId(serviceResponse.Value.id);
                }
                else {
                    alert("Service failed");
                }
            }).always(function () {
                me.application.hideWaiter();
            });
        };
        TestPageViewModel.prototype.onPostItem = function () {
            var me = this;
            var request = {
                testMessageText: me.itemName()
            };
            me.application.showWaiter('Please wait...');
            me.services.executeService('TestService', request)
                .always(function () {
                me.application.hideWaiter();
            });
        };
        TestPageViewModel.prototype.onAddMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showMessage(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onAddErrorMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showError(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onAddWarningMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showWarning(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onShowSpinWaiter = function () {
            var me = this;
            var count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString());
            var t = window.setInterval(function () {
                if (count > 50) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onShowBannerWaiter = function () {
            var me = this;
            var count = 0;
            me.application.showBannerWaiter('Wait a few seconds, please.');
            var t = window.setInterval(function () {
                if (count > 20) {
                    clearInterval(t);
                }
                else {
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onShowActionWaiter = function () {
            var count = 0;
            var me = this;
            var message = this.showActionWaiter('add', 'thing-plural');
            var t = window.setInterval(function () {
                if (count > 50) {
                    clearInterval(t);
                    me.application.hideWaiter();
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onShowWaiter = function () {
            var me = this;
            me.application.showWaiter();
            var t = window.setInterval(function () {
                clearInterval(t);
                me.application.hideWaiter();
            }, 1000);
        };
        TestPageViewModel.prototype.onShowProgressWaiter = function () {
            var count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString(), 'progress-waiter');
            var t = window.setInterval(function () {
                if (count > 100) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                    Peanut.WaitMessage.setProgress(count, true);
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onHideWaiter = function () {
            Peanut.WaitMessage.hide();
        };
        TestPageViewModel.prototype.onShowModalForm = function () {
            jQuery("#test-modal").modal('show');
        };
        TestPageViewModel.prototype.onSaveChanges = function () {
            jQuery("#test-modal").modal('hide');
            jQuery("#confirm-save-modal").modal('show');
        };
        return TestPageViewModel;
    }(Peanut.ViewModelBase));
    Peanut.TestPageViewModel = TestPageViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=TestPageViewModel.js.map