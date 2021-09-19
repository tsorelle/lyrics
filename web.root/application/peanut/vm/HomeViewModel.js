var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
            _this.selectedSet = ko.observable();
            _this.sets = ko.observableArray();
            _this.songList = [];
            _this.songs = [];
            _this.allsongs = ko.observableArray();
            _this.textSize = ko.observable(2);
            _this.columnDisplay = ko.observable(false);
            _this.selectedSong = ko.observable();
            _this.title = ko.observable('');
            _this.loading = ko.observable('');
            _this.isAdmin = ko.observable(false);
            _this.setForm = {
                id: ko.observable(0),
                setName: ko.observable(''),
                nameError: ko.observable(''),
                lookupValue: ko.observable(''),
                selectedSongs: ko.observableArray(),
                avaliableSongs: ko.observableArray(),
                searchValue: ko.observable(),
                user: ''
            };
            _this.songForm = {
                id: ko.observable(0),
                title: ko.observable(''),
                lyrics: ko.observable(''),
                public: ko.observable(false),
                errorMessage: ko.observable(''),
                currentSetName: ko.observable(''),
                user: ko.observable(''),
                includeInSet: ko.observable(false)
            };
            _this.searchSubscription = null;
            _this.filterByUser = ko.observable(false);
            _this.credentials = {
                username: ko.observable(''),
                password: ko.observable(''),
            };
            _this.signedIn = ko.observable(false);
            _this.username = ko.observable('');
            _this.songIndex = 0;
            _this.songCount = 0;
            _this.maxSongColumnItems = 0;
            _this.setSongIndex = function (value) {
                _this.songIndex = value;
                var current = _this.songList[_this.songIndex];
                _this.selectedSong(current);
                _this.title(current.title);
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
                me.loading(current.title);
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
                    me.loading('');
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
                if ((set.setname == 'My Songs')) {
                    me.checkAuthentication(function () {
                        set.user = me.username();
                        set.id = set.user;
                        me.selectedSet(set);
                        me.loadSelectedSet();
                    });
                }
                else {
                    me.selectedSet(set);
                    me.loadSelectedSet();
                }
            };
            _this.loadSelectedSet = function () {
                var me = _this;
                var set = me.selectedSet();
                var setId = set.id ? set.id : 'all';
                me.loading(set.setname);
                me.services.executeService('GetSet', setId, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        _this.loadSongList(response.songs);
                        me.setVerses(response.verses);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                })
                    .always(function () {
                    me.page('songs');
                    me.loading('');
                });
            };
            _this.loadSongList = function (songs, songIndex) {
                if (songIndex === void 0) { songIndex = 0; }
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
                _this.setSongIndex(songIndex);
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
                var songIndex = _.findIndex(_this.songList, { id: item.id });
                if (songIndex == _this.songIndex) {
                    _this.page('lyrics');
                }
                else {
                    _this.getLyrics(songIndex);
                }
            };
            _this.help = function () {
                _this.page('help');
            };
            _this.home = function () {
                _this.page('lyrics');
            };
            _this.upload = function () {
                var me = _this;
                _this.checkAuthentication(function () {
                });
            };
            _this.showSigninForm = function () {
                _this.onLogin = _this.loadSelectedSet;
                jQuery("#signin-modal").modal('show');
            };
            _this.checkAuthentication = function (onLogin) {
                if (_this.signedIn()) {
                    onLogin();
                    return;
                }
                _this.onLogin = onLogin;
                jQuery("#signin-modal").modal('show');
            };
            _this.toggleUser = function () {
                var filtering = !_this.filterByUser();
                _this.filterByUser(filtering);
                _this.clearSearch();
            };
            _this.newSong = function () {
                _this.songForm.id(0);
                _this.songForm.title('');
                _this.songForm.lyrics('');
                _this.songForm.public(false);
                _this.songForm.errorMessage('');
                _this.songForm.user(_this.username());
                var currentSetName = _this.selectedSet().id > 0 ? _this.selectedSet().setname : '';
                _this.songForm.currentSetName(currentSetName);
                _this.songForm.includeInSet(currentSetName != '');
                _this.page('editsong');
            };
            _this.editSong = function (song) {
                var me = _this;
                me.songForm.id(song.id);
                me.songForm.title(song.title);
                me.songForm.errorMessage('');
                _this.songForm.currentSetName('');
                _this.songForm.includeInSet(false);
                me.services.executeService('GetSongForEdit', song.id, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.songForm.lyrics(response.lyrics);
                        me.songForm.public(response.public != 0);
                        me.songForm.user(response.user);
                        me.songIndex = -1;
                        me.page('editsong');
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                    if (1) { }
                })
                    .always(function () {
                });
            };
            _this.signInTerry = function () {
                _this.credentials.username('Terry');
                _this.credentials.password('De@dw00d');
                _this.signIn();
            };
            _this.signIn = function () {
                var me = _this;
                var signinCredentials = {
                    username: me.credentials.username().trim(),
                    password: me.credentials.password().trim()
                };
                if (signinCredentials.username && signinCredentials.password) {
                    var request = null;
                    me.services.executeService('SignIn', signinCredentials, function (serviceResponse) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            var response = serviceResponse.Value;
                            if (response.registered === 'failed') {
                                alert('Sign in failed. Correct and try again.');
                            }
                            else {
                                jQuery("#signin-modal").modal('hide');
                                if (response.registered !== 'no') {
                                    me.signedIn(true);
                                    me.username(signinCredentials.username);
                                    me.isAdmin(response.registered === 'admin');
                                    me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                                    if (response.sets) {
                                        var sets = me.sets();
                                        me.sets(sets.concat(response.sets));
                                    }
                                    if (me.onLogin) {
                                        me.onLogin();
                                    }
                                }
                                else {
                                    alert('Sorry. You are not registered to use this application.');
                                }
                            }
                        }
                        else {
                            jQuery("#signin-modal").modal('hide');
                        }
                    })
                        .fail(function () {
                        var trace = me.services.getErrorInformation();
                    });
                }
            };
            _this.newSet = function () {
                _this.setForm.id(null);
                _this.setForm.setName('');
                _this.setForm.user = _this.username();
                _this.initSetLists([]);
            };
            _this.editSet = function (set) {
                var me = _this;
                me.setForm.id(set.id);
                me.setForm.setName(set.setname);
                me.setForm.nameError('');
                me.setForm.user = set.user;
                me.initSetLists(set.id);
            };
            _this.removeFromSetList = function (song) {
                var me = _this;
                me.availableSongs.push(song);
                me.availableSongs = _.sortBy(me.availableSongs, ['title']);
                var selected = _this.setForm.selectedSongs();
                _.remove(selected, function (item) {
                    return item.id == song.id;
                });
                me.setForm.selectedSongs(selected);
                me.setForm.avaliableSongs(me.availableSongs);
                me.setForm.searchValue('');
            };
            _this.addToSetList = function (song) {
                var me = _this;
                me.insertSong(song);
                _.remove(me.availableSongs, function (item) {
                    return item.id == song.id;
                });
                me.setForm.avaliableSongs(me.availableSongs);
                me.setForm.searchValue('');
            };
            _this.moveSongUp = function (song) {
                _this.moveSong(song, -1);
            };
            _this.moveSongDown = function (song) {
                _this.moveSong(song, 1);
            };
            _this.insertSong = function (song) {
                var list = [song].concat(_this.setForm.selectedSongs());
                _this.setForm.selectedSongs(list);
            };
            _this.moveSong = function (song, offset) {
                var list = _this.setForm.selectedSongs();
                var oldI = _.findIndex(list, { id: song.id });
                var newI = oldI + offset;
                if (newI < 0) {
                    newI = list.length - 1;
                }
                else if (newI == list.length) {
                    newI = 0;
                }
                var swapped = list[newI];
                list[newI] = song;
                list[oldI] = swapped;
                _this.setForm.selectedSongs(list);
            };
            _this.clearSearch = function () {
                if (_this.searchSubscription !== null) {
                    _this.searchSubscription.dispose();
                    _this.searchSubscription = null;
                }
                _this.setForm.searchValue('');
                var available = _this.getAvailableSongsList();
                _this.setForm.avaliableSongs(available);
                _this.searchSubscription = _this.setForm.searchValue.subscribe(_this.filterAvailable);
            };
            _this.filterAvailable = function (value) {
                value = value.trim();
                if (value) {
                    var songs = _this.setForm.avaliableSongs();
                    var list = _.filter(songs, function (item) {
                        return item.title.toLowerCase().indexOf(value.toLowerCase()) == 0;
                    });
                    _this.setForm.avaliableSongs(list);
                }
                else {
                    var available = _this.getAvailableSongsList();
                    _this.setForm.avaliableSongs(available);
                }
            };
            _this.getAvailableSongsList = function () {
                var me = _this;
                if (me.filterByUser()) {
                    var user_1 = me.username();
                    return _.filter(_this.availableSongs, function (item) {
                        return (item.user == user_1);
                    });
                }
                return _this.availableSongs;
            };
            _this.saveSetList = function () {
                var me = _this;
                var request = {
                    setId: _this.setForm.id(),
                    songs: [],
                    setName: _this.setForm.setName().trim(),
                    user: _this.setForm.user
                };
                if (!request.setId) {
                    request.setId = 0;
                }
                if (!request.setName) {
                    _this.setForm.nameError('A name for the set is required.');
                    return;
                }
                var selected = _this.setForm.selectedSongs();
                for (var i = 0; i < selected.length; i++) {
                    request.songs.push({ songId: selected[i].id, sequence: i });
                }
                _this.setForm.nameError('');
                me.services.executeService('UpdateSongSet', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        var setList = me.sets();
                        me.sets([]);
                        var set = null;
                        if (request.setId > 0) {
                            var setIndex = _.findIndex(setList, { id: request.setId });
                            set = setList[setIndex];
                            set.setname = request.setName;
                            setList[setIndex] = set;
                        }
                        else {
                            set = {
                                id: response.setId,
                                setname: request.setName,
                                user: request.user
                            };
                            setList.push(set);
                        }
                        me.sets(setList);
                        me.selectedSet(set);
                        me.loadSongList(response.songs);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                    if (1) { }
                })
                    .always(function () {
                    me.page('songs');
                });
            };
            _this.cancelSetEdit = function () {
                _this.page('songs');
            };
            _this.saveSong = function () {
                var test = _this.songForm.lyrics();
                var me = _this;
                var request = {
                    id: me.songForm.id(),
                    user: me.songForm.user(),
                    title: me.songForm.title().trim(),
                    public: me.songForm.public() ? 1 : 0,
                    lyrics: me.songForm.lyrics().trim(),
                    setId: me.songForm.includeInSet() ? me.selectedSet().id : 0,
                };
                if (!request.title) {
                    me.songForm.errorMessage('Title is required');
                    return;
                }
                if (!request.lyrics) {
                    me.songForm.errorMessage('Add some lyrics please.');
                    return;
                }
                me.services.executeService('UpdateSong', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        var songIndex = _.findIndex(response.songs, { id: response.id });
                        if (songIndex < 0) {
                            songIndex = 0;
                        }
                        me.loadSongList(response.songs, songIndex);
                        me.songIndex = -1;
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                    if (1) { }
                })
                    .always(function () {
                    me.page('songs');
                });
            };
            _this.cancelSongEdit = function () {
                _this.page('songs');
            };
            _this.deleteSet = function () {
                jQuery("#confirm-delete-set-modal").modal('show');
            };
            _this.doDeleteSet = function () {
                var me = _this;
                jQuery("#confirm-delete-set-modal").modal('hide');
                var setId = me.setForm.id();
                me.services.executeService('RemoveSet', setId, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var invalidateSelected = me.selectedSet().id == setId;
                        var setList = me.sets();
                        _.remove(setList, function (item) {
                            item.id == setId;
                        });
                        if (me.selectedSet().id == setId) {
                            me.selectedSet(setList[0]);
                        }
                        me.sets(setList);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                    if (1) { }
                })
                    .always(function () {
                    me.page('songs');
                });
            };
            _this.deleteSong = function () {
                jQuery("#confirm-delete-song-modal").modal('show');
            };
            _this.doDeleteSong = function () {
                var me = _this;
                jQuery("#confirm-delete-song-modal").modal('hide');
                var songId = me.songForm.id();
                me.services.executeService('RemoveSong', songId, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var songList = _.concat(me.songs[0](), me.songs[1](), me.songs[2](), me.songs[3]());
                        _.remove(songList, function (item) {
                            return item.id == songId;
                        });
                        me.loadSongList(songList);
                    }
                })
                    .fail(function () {
                    var trace = me.services.getErrorInformation();
                    if (1) { }
                })
                    .always(function () {
                    me.page('songs');
                });
            };
            return _this;
        }
        HomeViewModel.prototype.init = function (successFunction) {
            var _this = this;
            var me = this;
            for (var i = 0; i < 4; i++) {
                this.songs[i] = ko.observableArray();
            }
            me.application.loadResources([
                '@lib:lodash',
                '@pnut/ViewModelHelpers.js'
            ], function () {
                me.application.registerComponents('@pnut/modal-confirm', function () {
                    var request = Peanut.Helper.getRequestParam('set');
                    me.services.executeService('GetSongs', request, function (serviceResponse) {
                        if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                            var response = serviceResponse.Value;
                            me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                            me.username('guest');
                            me.sets(response.sets);
                            me.selectedSet(response.set);
                            _this.loadSongList(response.songs);
                            me.setVerses(response.verses);
                        }
                    })
                        .fail(function () {
                        var trace = me.services.getErrorInformation();
                    })
                        .always(function () {
                        me.bindDefaultSection();
                        successFunction();
                    });
                });
            });
        };
        HomeViewModel.prototype.initSetLists = function (setId) {
            var me = this;
            me.setForm.selectedSongs([]);
            me.setForm.avaliableSongs([]);
            me.services.executeService('GetSongLists', setId, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    var response = serviceResponse.Value;
                    var selected = [];
                    if (setId) {
                        me.availableSongs = _.differenceBy(response.availableSongs, response.setSongs, 'id');
                        me.setForm.selectedSongs(response.setSongs);
                    }
                    else {
                        me.availableSongs = response.availableSongs;
                        me.setForm.selectedSongs([]);
                    }
                    me.setForm.avaliableSongs(me.availableSongs);
                    me.clearSearch();
                    me.page('editset');
                }
                else {
                }
            })
                .fail(function () {
                var trace = me.services.getErrorInformation();
            });
        };
        ;
        return HomeViewModel;
    }(Peanut.ViewModelBase));
    Peanut.HomeViewModel = HomeViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=HomeViewModel.js.map