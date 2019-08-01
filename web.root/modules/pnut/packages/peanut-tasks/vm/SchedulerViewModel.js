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
var PeanutTasks;
(function (PeanutTasks) {
    var SchedulerViewModel = (function (_super) {
        __extends(SchedulerViewModel, _super);
        function SchedulerViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logRequest = {
                filter: null,
                limit: 15,
                offset: 0
            };
            _this.tab = ko.observable('schedule');
            _this.taskEditForm = {
                id: ko.observable(0),
                taskNameError: ko.observable(''),
                namespaceError: ko.observable(''),
                frequencyError: ko.observable(''),
                active: ko.observable(true),
                taskname: ko.observable(''),
                namespace: ko.observable(''),
                inputs: ko.observable(''),
                startdate: ko.observable(''),
                enddate: ko.observable(''),
                time: ko.observable(''),
                date: ko.observable(''),
                frequency: ko.observable(''),
                frequencyCount: ko.observable(1),
                comments: ko.observable(''),
                frequencyUnit: null,
                dayOfWeek: null,
                intervalType: null,
                weekOrdinal: null,
                updating: ko.observable(false)
            };
            _this.taskQueue = ko.observableArray([]);
            _this.logFilters = ko.observableArray();
            _this.logFilter = ko.observable();
            _this.taskLog = ko.observableArray([]);
            _this.prevEntries = ko.observable(false);
            _this.moreEntries = ko.observable(false);
            _this.setSchedule = function (schedule) {
                var list = [];
                list.push('All');
                _.forEach(schedule, function (item) {
                    if (list.indexOf(item.taskname) === -1) {
                        list.push(item.taskname);
                    }
                });
                _this.logFilters(list);
                _this.logFilter('All');
                _this.taskQueue(schedule);
            };
            _this.applyLogFilter = function (filter) {
                _this.logFilter(filter);
                _this.logRequest.filter = filter == 'All' ? null : filter;
                _this.refreshLogs();
            };
            _this.showScheduleTab = function () {
                var me = _this;
                me.tab('schedule');
            };
            _this.editTask = function (item) {
                var me = _this;
                me.clearTaskEditForm();
                me.taskEditForm.id(item.id);
                me.taskEditForm.active(item.active == 1);
                me.taskEditForm.namespace(item.namespace);
                me.taskEditForm.comments(item.comments);
                me.taskEditForm.inputs(item.inputs);
                me.taskEditForm.startdate(item.startdate);
                me.taskEditForm.enddate(item.enddate);
                me.taskEditForm.taskname(item.taskname);
                me.assignIntervalValues(item);
                jQuery('#edit-task-modal').modal('show');
            };
            _this.setIntervalType = function (value) {
                if (value === void 0) { value = null; }
                _this.taskEditForm.intervalType.unsubscribe();
                if (value) {
                    _this.taskEditForm.intervalType.setValue(value);
                }
                else {
                    _this.taskEditForm.intervalType.setDefaultValue();
                }
                _this.taskEditForm.intervalType.subscribe();
            };
            _this.assignIntervalValues = function (item) {
                _this.taskEditForm.frequency(item.frequency);
                var intervalType = 1;
                if (!item.intervalType) {
                    item.intervalType = 1;
                }
                else {
                    intervalType = Number(item.intervalType);
                }
                _this.setIntervalType(intervalType);
                if (!item.frequency) {
                    return;
                }
                var parts = item.frequency.split(' ');
                switch (intervalType) {
                    case 2:
                        _this.taskEditForm.frequencyCount(parts[0] || 1);
                        if (parts[1]) {
                            _this.taskEditForm.frequencyUnit.setValue(parts[1].toLowerCase());
                        }
                        break;
                    case 3:
                        var dowPart = (_this.taskEditForm.weekOrdinal.hasOption(parts[0])) ? 1 : 0;
                        var timePart = dowPart + 1;
                        if (dowPart > 0) {
                            _this.taskEditForm.weekOrdinal.setValue(parts[0]);
                        }
                        if (dowPart < parts.length - 1) {
                            _this.taskEditForm.dayOfWeek.setValue(parts[dowPart]);
                            if (parts[timePart]) {
                                _this.taskEditForm.time(parts[timePart]);
                            }
                        }
                        break;
                    case 4:
                        if (item.frequency) {
                            _this.taskEditForm.time(item.frequency);
                        }
                        break;
                    case 5:
                        if (item.frequency) {
                            _this.taskEditForm.date(parts[0]);
                            if (parts.length > 1) {
                                _this.taskEditForm.time(parts[1]);
                            }
                        }
                        break;
                    default:
                        return {};
                }
            };
            _this.refreshLogs = function () {
                var me = _this;
                me.logRequest.offset = 0;
                me.getLogs();
            };
            _this.getLogs = function () {
                var me = _this;
                me.application.showBannerWaiter(me.translate('tasks-get-log'));
                me.services.executeService('peanut.peanut-tasks::GetTaskLog', me.logRequest, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var log = serviceResponse.Value;
                        me.taskLog(log);
                        me.moreEntries(log.length == me.logRequest.limit);
                        me.prevEntries(me.logRequest.offset > 0);
                        me.tab('log');
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.application.hideWaiter();
                });
            };
            _this.getNextLog = function () {
                var me = _this;
                me.logRequest.offset += me.logRequest.limit;
                me.getLogs();
            };
            _this.getPrevLog = function () {
                var me = _this;
                if (me.logRequest.offset >= me.logRequest.limit) {
                    me.logRequest.offset -= me.logRequest.limit;
                }
                me.getLogs();
            };
            _this.newTask = function () {
                var me = _this;
                me.clearTaskEditForm();
                jQuery('#edit-task-modal').modal('show');
            };
            _this.getFrequencyValue = function () {
                var result = '';
                switch (_this.taskEditForm.intervalType.getValue()) {
                    case 2:
                        result = _this.taskEditForm.frequencyCount() + ' ' + _this.taskEditForm.frequencyUnit.getValue();
                        break;
                    case 3:
                        var ord = _this.taskEditForm.weekOrdinal.getValue();
                        if (ord != 'every') {
                            result = ord;
                        }
                        result += ' ' + (_this.taskEditForm.dayOfWeek.getValue());
                        if (_this.taskEditForm.time()) {
                            result += ' ' + _this.taskEditForm.time();
                        }
                        break;
                    case 4:
                        result = _this.taskEditForm.time();
                        break;
                    case 5:
                        var date = _this.taskEditForm.date().trim();
                        if (!date) {
                            _this.taskEditForm.frequencyError('A date is required for one-time execution');
                            return false;
                        }
                        result = date;
                        if (_this.taskEditForm.time()) {
                            result += ' ' + _this.taskEditForm.time();
                        }
                        break;
                }
                return result.trim();
            };
            _this.updateTask = function () {
                var me = _this;
                me.clearErrors();
                var request = {
                    intervalType: me.taskEditForm.intervalType.getValue(),
                    inputs: me.taskEditForm.inputs(),
                    frequency: me.getFrequencyValue(),
                    active: me.taskEditForm.active() ? 1 : 0,
                    taskname: me.taskEditForm.taskname(),
                    startdate: me.taskEditForm.startdate(),
                    comments: me.taskEditForm.comments(),
                    namespace: me.taskEditForm.namespace(),
                    subdir: '',
                    enddate: me.taskEditForm.enddate(),
                    id: me.taskEditForm.id()
                };
                if (me.validateTask(request)) {
                    var nsparts = request.namespace.split('::');
                    request.namespace = nsparts[0].replace('\\', '::');
                    if (nsparts.length > 1) {
                        request.subdir = nsparts[1];
                    }
                    request.namespace = request.namespace.replace('\\', '::');
                    me.taskEditForm.updating(true);
                    me.services.executeService('peanut.peanut-tasks::UpdateScheduledTask', request, function (serviceResponse) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            var response = serviceResponse.Value;
                            if (response.error == 'class') {
                                me.taskEditForm.taskNameError('Cannot create task class');
                                me.taskEditForm.namespaceError('Namespace may be incorrect');
                            }
                            else {
                                me.taskQueue(response.schedule);
                                jQuery('#edit-task-modal').modal('hide');
                            }
                        }
                    }).fail(function () {
                        jQuery('#edit-task-modal').modal('hide');
                        var trace = me.services.getErrorInformation();
                    }).always(function () {
                        me.taskEditForm.updating(false);
                    });
                }
            };
            _this.onIntervalTypeChange = function (type) {
                var me = _this;
                me.taskEditForm.time('');
            };
            return _this;
        }
        SchedulerViewModel.prototype.init = function (successFunction) {
            var me = this;
            Peanut.logger.write('Scheduler Init');
            me.application.loadResources([
                '@lib:jqueryui-css',
                '@lib:jqueryui-js',
                '@lib:lodash',
                '@pnut/selectListObservable',
            ], function () {
                me.taskEditForm.intervalType = new Peanut.selectListObservable(me.onIntervalTypeChange, [
                    { Name: 'On demand', Value: 1 },
                    { Name: 'Regular interval', Value: 2 },
                    { Name: 'Weeky', Value: 3 },
                    { Name: 'Daily', Value: 4 },
                    { Name: 'Fixed time', Value: 5 }
                ], 1);
                me.taskEditForm.frequencyUnit = new Peanut.selectListObservable(null, [
                    { Name: 'Minutes', Value: 'minutes' },
                    { Name: 'Hours', Value: 'hours' },
                    { Name: 'Days', Value: 'days' },
                    { Name: 'Months', Value: 'months' }
                ], 'minutes');
                me.taskEditForm.dayOfWeek = new Peanut.selectListObservable(null, [
                    { Name: 'Sunday', Value: 'Sun' },
                    { Name: 'Monday', Value: 'Mon' },
                    { Name: 'Tuesday', Value: 'Tue' },
                    { Name: 'Wednesday', Value: 'Wed' },
                    { Name: 'Thursday', Value: 'Thu' },
                    { Name: 'Friday', Value: 'Fri' },
                    { Name: 'Saturday', Value: 'Sat' }
                ], 'Sun');
                me.taskEditForm.weekOrdinal = new Peanut.selectListObservable(null, [
                    { Name: 'Every', Value: 'every' },
                    { Name: 'First', Value: '1st' },
                    { Name: 'Second', Value: '2nd' },
                    { Name: 'Third', Value: '3rd' },
                    { Name: 'Fourth', Value: '4th' },
                    { Name: 'Fifth', Value: '5th' }
                ], 'every');
                jQuery(function () {
                    jQuery(".datepicker").datepicker().datepicker("option", "dateFormat", 'yy-mm-dd');
                });
                me.services.executeService('peanut.peanut-tasks::GetTaskSchedule', null, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            var response = serviceResponse.Value;
                            me.setSchedule(response.schedule);
                            me.addTranslations(response.translations);
                        }
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.bindDefaultSection();
                    successFunction();
                });
            });
        };
        SchedulerViewModel.prototype.showLogsTab = function () {
            var me = this;
            if (me.taskLog().length == 0) {
                me.getLogs();
            }
            else {
                me.tab('log');
            }
        };
        SchedulerViewModel.prototype.clearErrors = function () {
            var me = this;
            me.taskEditForm.namespaceError('');
            me.taskEditForm.frequencyError('');
            me.taskEditForm.taskNameError('');
        };
        SchedulerViewModel.prototype.clearTaskEditForm = function () {
            var me = this;
            me.clearErrors();
            me.taskEditForm.id(0);
            me.taskEditForm.active(true);
            me.taskEditForm.namespace('');
            me.taskEditForm.comments('');
            me.taskEditForm.enddate('');
            me.taskEditForm.frequency('');
            me.taskEditForm.inputs('');
            me.taskEditForm.startdate('');
            me.taskEditForm.enddate('');
            me.taskEditForm.taskname('');
            me.taskEditForm.time('');
            me.taskEditForm.date('');
            me.setIntervalType();
            me.taskEditForm.frequencyCount(1);
            me.taskEditForm.frequencyUnit.setDefaultValue();
            me.taskEditForm.dayOfWeek.setDefaultValue();
            me.taskEditForm.weekOrdinal.setDefaultValue();
        };
        SchedulerViewModel.prototype.validateTask = function (task) {
            var me = this;
            var valid = true;
            if (!task.namespace) {
                valid = false;
                me.taskEditForm.namespaceError('Namespace is required');
            }
            if (task.frequency === false) {
                valid = false;
            }
            if (!task.taskname) {
                valid = false;
                me.taskEditForm.taskNameError('Task name is required');
            }
            return valid;
        };
        return SchedulerViewModel;
    }(Peanut.ViewModelBase));
    PeanutTasks.SchedulerViewModel = SchedulerViewModel;
})(PeanutTasks || (PeanutTasks = {}));
//# sourceMappingURL=SchedulerViewModel.js.map