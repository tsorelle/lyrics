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
var Mailboxes;
(function (Mailboxes) {
    var ContactFormViewModel = (function (_super) {
        __extends(ContactFormViewModel, _super);
        function ContactFormViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.headerMessage = ko.observable('Send a Message');
            _this.fromAddress = ko.observable('');
            _this.fromName = ko.observable('');
            _this.messageSubject = ko.observable('');
            _this.messageBody = ko.observable('');
            _this.formVisible = ko.observable(false);
            _this.mailboxList = ko.observableArray([]);
            _this.mailboxSelectSubscription = null;
            _this.selectedMailbox = ko.observable(null);
            _this.subjectError = ko.observable('');
            _this.bodyError = ko.observable('');
            _this.fromNameError = ko.observable('');
            _this.fromAddressError = ko.observable('');
            _this.mailboxSelectError = ko.observable('');
            _this.selectRecipientCaption = ko.observable('');
            _this.userIsAnonymous = ko.observable(false);
            _this.getMailbox = function (doneFunction) {
                var me = _this;
                me.application.hideServiceMessages();
                var request = {
                    mailbox: me.mailboxCode,
                    context: me.getVmContext()
                };
                me.services.executeService('peanut.Mailboxes::GetContactForm', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            var response = serviceResponse.Value;
                            me.addTranslations(response.translations);
                            me.selectRecipientCaption(response.translations['mail-select-recipient']);
                            me.fromAddress(response.fromAddress);
                            me.fromName(response.fromName);
                            me.userIsAnonymous(response.fromAddress.trim() == '');
                            if (me.mailboxSelectSubscription !== null) {
                                me.mailboxSelectSubscription.dispose();
                                me.mailboxSelectSubscription = null;
                            }
                            if (response.mailboxList.length > 1) {
                                me.mailboxCode = 'all';
                                me.selectedMailbox(null);
                                me.mailboxSelectSubscription = me.selectedMailbox.subscribe(me.onMailBoxSelected);
                                me.headerMessage(response.translations['mail-header-select']);
                            }
                            else {
                                var mailbox = response.mailboxList.pop();
                                me.mailboxCode = mailbox.mailboxcode;
                                me.selectedMailbox(mailbox);
                                var test = me.selectedMailbox();
                                me.headerMessage(response.translations['mail-header-send'] + ': ' + mailbox.displaytext);
                            }
                            me.mailboxList(response.mailboxList);
                            me.formVisible(true);
                        }
                        else {
                            me.formVisible(false);
                        }
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    if (doneFunction) {
                        doneFunction();
                    }
                });
            };
            _this.createMessage = function () {
                var me = _this;
                me.mailboxSelectError('');
                me.subjectError('');
                me.bodyError('');
                me.fromAddressError('');
                me.fromNameError('');
                if (me.mailboxCode === 'all') {
                    var box = _this.selectedMailbox();
                    if (!box) {
                        me.mailboxSelectError(': ' + me.translate('mail-error-recipient'));
                        return false;
                    }
                    me.mailboxCode = box.mailboxcode;
                }
                var message = {
                    toName: '',
                    mailboxCode: me.mailboxCode,
                    fromName: me.fromName(),
                    fromAddress: me.fromAddress(),
                    subject: me.messageSubject(),
                    body: me.messageBody()
                };
                var valid = true;
                if (message.fromAddress.trim() == '') {
                    me.fromAddressError(': ' + me.translate('form-error-your-email-blank'));
                    valid = false;
                }
                else {
                    var fromAddressOk = Peanut.Helper.ValidateEmail(message.fromAddress);
                    if (!fromAddressOk) {
                        me.fromAddressError(': ' + me.translate('form-error-email-invalid'));
                        valid = false;
                    }
                }
                if (message.fromName.trim() == '') {
                    me.fromNameError(': ' + me.translate('form-error-your-name-blank'));
                    valid = false;
                }
                if (message.subject.trim() == '') {
                    me.subjectError(': ' + me.translate('form-error-email-subject-blank'));
                    valid = false;
                }
                if (message.body.trim() == '') {
                    me.bodyError(': ' + me.translate('form-error-email-message-blank'));
                    valid = false;
                }
                if (valid) {
                    return message;
                }
                return null;
            };
            _this.sendMessage = function () {
                var me = _this;
                var message = me.createMessage();
                if (message) {
                    me.application.hideServiceMessages();
                    me.application.showWaiter(me.translate('wait-sending-message'));
                    me.services.executeService('peanut.Mailboxes::SendContactMessage', message, function (serviceResponse) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            me.formVisible(false);
                            me.headerMessage(me.translate('mail-thanks-message'));
                        }
                    }).fail(function () {
                        var trace = me.services.getErrorInformation();
                    }).always(function () {
                        me.application.hideWaiter();
                    });
                }
            };
            _this.onMailBoxSelected = function (selected) {
                var me = _this;
                var title = 'Send a Message';
                if (selected) {
                    me.headerMessage(me.translate('mail-header-send') + ':  ' + selected.displaytext);
                }
                else {
                    me.headerMessage(me.translate('mail-header-select'));
                }
            };
            return _this;
        }
        ContactFormViewModel.prototype.init = function (successFunction) {
            var me = this;
            Peanut.logger.write('ContactForm Init');
            me.mailboxCode = me.getRequestVar('box', 'all');
            me.showLoadWaiter();
            me.application.loadResources([
                '@pnut/ViewModelHelpers.js'
            ], function () {
                me.getMailbox(function () {
                    me.application.registerComponents(['@pkg/peanut-riddler/riddler-captcha'], function () {
                        me.application.hideWaiter();
                        me.bindDefaultSection();
                        successFunction();
                    });
                });
            });
        };
        return ContactFormViewModel;
    }(Peanut.ViewModelBase));
    Mailboxes.ContactFormViewModel = ContactFormViewModel;
})(Mailboxes || (Mailboxes = {}));
//# sourceMappingURL=ContactFormViewModel.js.map