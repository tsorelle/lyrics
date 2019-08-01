var Mailboxes;
(function (Mailboxes) {
    var MailboxListObservable = (function () {
        function MailboxListObservable(client) {
            var _this = this;
            this.list = ko.observableArray([]);
            this.callbacks = [];
            this.subscriptions = [];
            this.downloadMailboxList = function (all, translations, doneFunction) {
                if (all === void 0) { all = true; }
                if (translations === void 0) { translations = false; }
                var me = _this;
                var request = {
                    filter: all ? 'all' : false,
                    translations: translations,
                    context: me.owner.getVmContext()
                };
                me.application.hideServiceMessages();
                var translated = (me.owner.translate('mailbox-entity-plural') !== 'mailbox-entity-plural');
                if (translated) {
                    me.owner.showActionWaiter('load', 'mailbox-entity-plural');
                }
                me.services.executeService('peanut.Mailboxes::GetMailboxList', request, function (serviceResponse) {
                    if (translated) {
                        me.application.hideWaiter();
                    }
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.owner.addTranslations(response.translations);
                        me.setMailboxes(response.list);
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    if (translated) {
                        me.application.hideWaiter();
                    }
                    if (doneFunction) {
                        doneFunction();
                    }
                });
            };
            this.getUpdatedMailboxList = function (doneFunction) {
                _this.downloadMailboxList(true, false);
            };
            this.refreshList = function (doneFunction) {
                var me = _this;
                var list = me.list();
                me.suspendSubscriptions();
                me.list([]);
                me.restoreSubscriptions();
                me.list(list);
                doneFunction();
            };
            this.getMailboxList = function (doneFunction) {
                var me = _this;
                if (me.list().length == 0) {
                    me.downloadMailboxList(true, false, doneFunction);
                }
                else {
                    me.refreshList(doneFunction);
                }
            };
            this.getMailboxListWithTranslations = function (doneFunction) {
                _this.downloadMailboxList(true, false, doneFunction);
            };
            this.setMailboxes = function (mailboxes) {
                var me = _this;
                var list = _.sortBy(mailboxes, function (box) {
                    return box.displaytext.toLowerCase();
                });
                me.list(list);
            };
            var me = this;
            me.application = client.getApplication();
            me.services = client.getServices();
            me.owner = client;
        }
        MailboxListObservable.prototype.subscribe = function (callback) {
            var me = this;
            me.callbacks.push(callback);
            var subscription = me.list.subscribe(callback);
            me.subscriptions.push(subscription);
        };
        MailboxListObservable.prototype.suspendSubscriptions = function () {
            var me = this;
            for (var i = 0; i < me.subscriptions.length; i++) {
                me.subscriptions[i].dispose();
            }
            me.subscriptions = [];
        };
        MailboxListObservable.prototype.restoreSubscriptions = function () {
            var me = this;
            for (var i = 0; i < me.callbacks.length; i++) {
                var subscription = me.list.subscribe(me.callbacks[i]);
                me.subscriptions.push(subscription);
            }
        };
        return MailboxListObservable;
    }());
    Mailboxes.MailboxListObservable = MailboxListObservable;
})(Mailboxes || (Mailboxes = {}));
//# sourceMappingURL=MailboxListObservable.js.map