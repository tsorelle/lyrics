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
    var MailboxesViewModel = (function (_super) {
        __extends(MailboxesViewModel, _super);
        function MailboxesViewModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MailboxesViewModel.prototype.init = function (successFunction) {
            var me = this;
            Peanut.logger.write('Mailboxes form Init');
            me.application.loadResources([
                '@lib:fontawesome',
                '@lib:lodash',
                '@pnut/ViewModelHelpers.js',
                '@pkg/mailboxes/MailboxListObservable.js'
            ], function () {
                me.mailboxes = new Mailboxes.MailboxListObservable(me);
                me.application.registerComponents(['@pnut/modal-confirm', '@pkg/mailboxes/mailbox-manager'], function () {
                    me.mailboxes.getMailboxListWithTranslations(function () {
                        me.bindDefaultSection();
                        successFunction();
                    });
                });
            });
        };
        return MailboxesViewModel;
    }(Peanut.ViewModelBase));
    Mailboxes.MailboxesViewModel = MailboxesViewModel;
})(Mailboxes || (Mailboxes = {}));
//# sourceMappingURL=MailboxesViewModel.js.map