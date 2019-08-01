var Peanut;
(function (Peanut) {
    var editPanel = (function () {
        function editPanel(owner) {
            var _this = this;
            this.viewState = ko.observable('');
            this.hasErrors = ko.observable(false);
            this.isAssigned = false;
            this.relationId = null;
            this.translate = function (code, defaultText) {
                if (defaultText === void 0) { defaultText = null; }
                return _this.owner.translate(code, defaultText);
            };
            var me = this;
            me.owner = owner;
        }
        editPanel.prototype.edit = function (relationId) {
            if (relationId === void 0) { relationId = null; }
            var me = this;
            me.viewState('edit');
            me.relationId = relationId;
        };
        editPanel.prototype.close = function () {
            var me = this;
            me.viewState('closed');
        };
        editPanel.prototype.search = function () {
            var me = this;
            me.viewState('search');
        };
        editPanel.prototype.empty = function () {
            var me = this;
            me.viewState('empty');
        };
        editPanel.prototype.view = function () {
            var me = this;
            if (me.isAssigned) {
                me.viewState('view');
            }
            else {
                me.viewState('empty');
            }
        };
        editPanel.prototype.setViewState = function (state) {
            if (state === void 0) { state = 'view'; }
            var me = this;
            me.viewState(state);
        };
        return editPanel;
    }());
    Peanut.editPanel = editPanel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=editPanel.js.map