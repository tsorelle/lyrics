var Mailboxes;
(function (Mailboxes) {
    var mailboxManagerComponent = (function () {
        function mailboxManagerComponent(params) {
            var _this = this;
            this.test = ko.observable('test');
            this.onListChanged = function (mailboxes) {
            };
            this.insertId = 0;
            this.mailboxId = ko.observable('');
            this.mailboxCode = ko.observable('');
            this.mailboxName = ko.observable('');
            this.mailboxDescription = ko.observable('');
            this.mailboxEmail = ko.observable('');
            this.mailboxPublic = ko.observable(true);
            this.formHeading = ko.observable('');
            this.editMode = ko.observable('');
            this.mailboxDescriptionHasError = ko.observable(false);
            this.mailboxEmailHasError = ko.observable(false);
            this.mailboxNameHasError = ko.observable(false);
            this.mailboxCodeHasError = ko.observable(false);
            this.submitChanges = function (box) {
                var me = _this;
                me.hideForm();
                me.application.hideServiceMessages();
                me.owner().showActionWaiter(me.editMode(), 'mailbox-entity');
                me.services.executeService('peanut.Mailboxes::UpdateMailbox', box, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.mailboxes.setMailboxes(serviceResponse.Value);
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.application.hideWaiter();
                });
            };
            this.dropMailbox = function (box) {
                var me = _this;
                me.hideForm();
                me.application.hideServiceMessages();
                me.owner().showActionWaiter('delete', 'mailbox-entity');
                me.services.executeService('peanut.Mailboxes::DeleteMailbox', box.mailboxcode, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.mailboxes.setMailboxes(serviceResponse.Value);
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.application.hideWaiter();
                });
            };
            this.editMailbox = function (box) {
                var me = _this;
                me.clearValidation();
                me.editMode('update');
                me.mailboxId(box.id);
                me.mailboxCode(box.mailboxcode);
                me.mailboxName(box.displaytext);
                me.mailboxEmail(box.address);
                me.mailboxPublic(box.public == '1');
                me.mailboxDescription(box.description);
                me.formHeading("Edit mailbox: " + box.mailboxcode);
                me.showForm();
            };
            this.newMailbox = function () {
                var me = _this;
                me.clearValidation();
                me.editMode('add');
                me.mailboxId('0');
                me.mailboxCode('');
                me.mailboxName('');
                me.mailboxEmail('');
                me.mailboxDescription('');
                me.mailboxPublic(true);
                me.formHeading('New mailbox');
                me.showForm();
            };
            this.clearValidation = function () {
                var me = _this;
                me.mailboxCodeHasError(false);
                me.mailboxDescriptionHasError(false);
                me.mailboxEmailHasError(false);
                me.mailboxDescriptionHasError(false);
                me.mailboxNameHasError(false);
            };
            this.createMailboxDto = function () {
                var me = _this;
                var valid = true;
                var box = {
                    'id': me.mailboxId(),
                    'mailboxcode': me.mailboxCode(),
                    'displaytext': me.mailboxName(),
                    'address': me.mailboxEmail(),
                    'description': me.mailboxDescription(),
                    'public': me.mailboxPublic()
                };
                if (box.mailboxcode == '') {
                    me.mailboxCodeHasError(true);
                    valid = false;
                }
                if (box.displaytext == '') {
                    me.mailboxNameHasError(true);
                    valid = false;
                }
                var emailOk = Peanut.Helper.ValidateEmail(box.address);
                me.mailboxEmailHasError(!emailOk);
                if (!emailOk) {
                    valid = false;
                    me.mailboxEmailHasError(true);
                }
                if (valid) {
                    return box;
                }
                return null;
            };
            this.confirmRemoveMailbox = function (box) {
                var me = _this;
                me.tempMailbox = box;
                me.mailboxCode(box.mailboxcode);
                me.showConfirmForm();
            };
            var me = this;
            if (!params) {
                console.error('maibox-manager: Params not defined in modalConfirmComponent');
                return;
            }
            if (!params.owner) {
                console.error('maibox-manager: Owner parameter required for modalConfirmComponent');
                return;
            }
            me.owner = params.owner;
            me.test('hello');
            var ownerVm = params.owner();
            me.application = ownerVm.getApplication();
            me.bootstrapVersion = ownerVm.bootstrapVersion;
            me.services = ownerVm.getServices();
            me.mailboxes = ownerVm.mailboxes;
            me.mailboxes.subscribe(this.onListChanged);
        }
        mailboxManagerComponent.prototype.hideForm = function () {
            jQuery("#mailbox-update-modal").modal('hide');
        };
        mailboxManagerComponent.prototype.showForm = function () {
            var me = this;
            me.clearValidation();
            jQuery("#mailbox-update-modal").modal('show');
        };
        mailboxManagerComponent.prototype.hideConfirmForm = function () {
            jQuery("#confirm-delete-modal").modal('hide');
        };
        mailboxManagerComponent.prototype.showConfirmForm = function () {
            var me = this;
            jQuery("#confirm-delete-modal").modal('show');
        };
        mailboxManagerComponent.prototype.updateMailbox = function () {
            var me = this;
            var box = me.createMailboxDto();
            if (box) {
                me.submitChanges(box);
            }
        };
        mailboxManagerComponent.prototype.removeMailbox = function () {
            var me = this;
            me.hideConfirmForm();
            me.dropMailbox(me.tempMailbox);
        };
        return mailboxManagerComponent;
    }());
    Mailboxes.mailboxManagerComponent = mailboxManagerComponent;
})(Mailboxes || (Mailboxes = {}));
//# sourceMappingURL=mailboxManagerComponent.js.map