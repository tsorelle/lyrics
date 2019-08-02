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
            _this.page = ko.observable('lyrics');
            _this.verses = [];
            _this.verses1 = ko.observableArray();
            _this.verses2 = ko.observableArray();
            _this.set = ko.observable('');
            _this.sets = ko.observableArray();
            _this.songList = [];
            _this.songs = [];
            _this.allsongs = ko.observableArray();
            _this.textSize = ko.observable(2);
            _this.columnDisplay = ko.observable(false);
            _this.selectedSong = ko.observable('');
            _this.title = ko.observable('');
            _this.songIndex = 0;
            _this.songCount = 0;
            _this.maxSongColumnItems = 0;
            _this.setSongIndex = function (value) {
                _this.songIndex = value;
                var current = _this.songList[_this.songIndex];
                _this.selectedSong(current.Value);
                _this.title(current.Name);
            };
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
            _this.nextSong = function () {
                var songIndex = _this.songIndex == _this.songCount - 1 ? 0 : ++_this.songIndex;
                _this.getLyrics(songIndex);
            };
            _this.prevSong = function () {
                var songIndex = _this.songIndex == 0 ? _this.songCount - 1 : --_this.songIndex;
                _this.getLyrics(songIndex);
            };
            _this.getLyrics = function (songIndex) {
                var me = _this;
                var current = _this.songList[songIndex];
                me.page('loading');
                var request = null;
                me.services.executeService('GetVerses', current, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.setVerses(response.verses);
                        me.setSongIndex(songIndex);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                })
                    .always(function () {
                    me.page('lyrics');
                });
            };
            _this.setVerses = function (verses) {
                _this.verses = verses;
                _this.verses1(verses);
                _this.verses2([]);
                _this.columnDisplay(false);
            };
            _this.selectSet = function (set) {
                var me = _this;
                me.page('loading');
                me.services.executeService('GetSet', set.Value, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.set(set.Value);
                        _this.loadSongList(response.songs);
                        me.setVerses(response.verses);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                })
                    .always(function () {
                    me.page('lyrics');
                });
            };
            _this.loadSongList = function (songs) {
                _this.songList = songs;
                _this.songCount = songs.length;
                for (var i = 0; i < 4; i++) {
                    _this.songs[i]([]);
                }
                var column = [];
                var columnIndex = 0;
                for (var i = 0; i < songs.length; i++) {
                    column.push(songs[i]);
                    if (column.length >= _this.maxSongColumnItems && columnIndex < 3) {
                        _this.songs[columnIndex](column);
                        columnIndex++;
                        column = [];
                    }
                }
                _this.songs[columnIndex](column);
                _this.setSongIndex(0);
            };
            _this.showSongList = function () {
                _this.page('songs');
            };
            _this.splitColumns = function () {
                var split = !_this.columnDisplay();
                _this.verses1([]);
                _this.verses2([]);
                if (split) {
                    var colA = [];
                    var colB = [];
                    var verseCount = _this.verses.length;
                    var colsize = verseCount / 2;
                    for (var i = 0; i < verseCount; i++) {
                        if (i < colsize) {
                            colA.push(_this.verses[i]);
                        }
                        else {
                            colB.push(_this.verses[i]);
                        }
                    }
                    _this.verses1(colA);
                    _this.verses2(colB);
                }
                else {
                    _this.verses1(_this.verses);
                }
                _this.columnDisplay(split);
            };
            _this.selectSong = function (item) {
                var songIndex = _this.songList.indexOf(item);
                _this.getLyrics(songIndex);
            };
            return _this;
        }
        HomeViewModel.prototype.init = function (successFunction) {
            var _this = this;
            var me = this;
            for (var i = 0; i < 4; i++) {
                this.songs[i] = ko.observableArray();
            }
            var request = null;
            me.services.executeService('GetSongs', request, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    var response = serviceResponse.Value;
                    me.sets(response.sets);
                    me.set(response.set);
                    _this.loadSongList(response.songs);
                    me.setVerses(response.verses);
                    me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                }
            })
                .fail(function () {
                var trace = me.services.getErrorInformation();
            })
                .always(function () {
                me.bindDefaultSection();
                successFunction();
            });
        };
        return HomeViewModel;
    }(Peanut.ViewModelBase));
    Peanut.HomeViewModel = HomeViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=HomeViewModel.js.map