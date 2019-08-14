/// <reference path="../../../modules/pnut/core/ViewModelBase.ts" />
/// <reference path='../../../modules/typings/knockout/knockout.d.ts' />
/// <reference path='../../../modules/pnut/core/peanut.d.ts' />

namespace Peanut {

    import INameValuePair = Peanut.INameValuePair;

    interface IGetVersesResponse {
        // title: string;
        verses: any[];
    }

    interface ISongSet {
        id: any;
        setname: string;
        user: string;
    }

    interface ISongInfo {
        id: any;
        title: string;
        user: string;
    }

    interface IGetSongsResponse extends IGetVersesResponse {
        set: ISongSet;
        sets: ISongSet[];
        songs: ISongInfo[];
        catalogSize: number;
        username: string;
        isAdmin : any;
    }

    interface IGetSetResponse  {
        set: ISongSet;
        songs: ISongInfo[];
        verses: any[];
    }

    interface ISaveSetResponse {
        setId: any,
        songs: ISongInfo[];
    }

    interface IGetSongListsReponse {
        setSongs: ISongInfo[];
        availableSongs: ISongInfo[];
    }
    interface IGetSongsRequest {
        setId?: any;
        songId?: any;
    }

    interface ISignInResponse {
        registered: string;
        sets: ISongSet[];
        catalogSize: number;
    }

    interface ISaveSetRequest {
        setId: any;
        songs: ISongSetItem[];
        setName: string;
        user?: string;
    }

    interface ISongSetItem {
        songId: any,
        sequence: number
    }

    export class HomeViewModel extends Peanut.ViewModelBase {
        // observables
        page= ko.observable('lyrics');
        verses: any[] = [];
        verses1 = ko.observableArray();
        verses2 = ko.observableArray();
        selectedSet = ko.observable<ISongSet>();
        sets = ko.observableArray<ISongSet>();
        songList : ISongInfo[] = [];
        songs : KnockoutObservableArray<ISongInfo>[] = [];
        allsongs = ko.observableArray<ISongInfo>();
        textSize = ko.observable(2);
        columnDisplay = ko.observable(false);
        selectedSong = ko.observable<ISongInfo>();
        title = ko.observable('');
        loading = ko.observable('');
        isAdmin = ko.observable(false);
        setForm = {
            id: ko.observable(0),
            setName: ko.observable(''),
            nameError: ko.observable(''),
            lookupValue: ko.observable(''),
            selectedSongs : ko.observableArray<ISongInfo>(),
            avaliableSongs: ko.observableArray<ISongInfo>(),
            searchValue: ko.observable(),
            user: ''
        };

        availableSongs: ISongInfo[];
        searchSubscription : any = null;
        filterByUser = ko.observable(false);

        verseColumn : any; //ko.observable('col-md-6');

        credentials = {
            // todo: clear test values
            username: ko.observable('Terry'),
            password: ko.observable('De@dw00d'),
        };

        signedIn = ko.observable(false);
        username = ko.observable('');
        onLogin: any;

        songIndex = 0;
        songCount = 0;
        maxSongColumnItems = 0;

        init(successFunction?: () => void) {

            let me = this;
            for (let i = 0; i< 4; i++ ) {
                this.songs[i] = ko.observableArray<ISongInfo>();
            }
            me.application.loadResources([
                // Load libraries and core components
                '@lib:lodash'
            ], () => {
                let request = null;
                me.services.executeService('GetSongs', request, (serviceResponse: IServiceResponse) => {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <IGetSongsResponse>serviceResponse.Value;
                        me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                        me.username('quest');
                        // me.isAdmin(!!response.isAdmin);

                        me.sets(response.sets);
                        me.selectedSet(response.set);
                        this.loadSongList(response.songs);
                        me.setVerses(response.verses);
                    }
                })
                    .fail(() => {
                        let trace = me.services.getErrorInformation();
                    })
                    .always(() => {
                        me.bindDefaultSection();
                        successFunction();
                    });

            });

        }

        setSongIndex = (value: number) => {
            this.songIndex = value;
            let current = this.songList[this.songIndex];
            this.selectedSong(current);
            this.title(current.title);
        };

        reduceFont = () => {
            if (this.textSize() > 1) {
                this.zoom(-0.5)
            }
        };

        enlargeFont = () => {
            this.zoom(+0.5);
        };

        zoom = (increment) => {
              this.textSize(this.textSize() + increment);
        };

        nextSong = () => {
            let songIndex = this.songIndex == this.songCount - 1 ? 0 : ++this.songIndex;
            this.getLyrics(songIndex);

        };

        prevSong = () => {
            let songIndex = this.songIndex == 0 ? this.songCount-1 : --this.songIndex;
            this.getLyrics(songIndex);
        };

        getLyrics = (songIndex: any) => {
            let me = this;
            let current = this.songList[songIndex];

            me.loading(current.title);
            let request = null;
            me.services.executeService('GetVerses', current, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetVersesResponse>serviceResponse.Value;
                    me.setVerses(response.verses);
                    me.setSongIndex(songIndex);
                }
            })
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                })
                .always(() => {
                    me.loading('');
                    me.page('lyrics');
                });
        };

        setVerses = (verses: any[]) => {
            this.verses = verses;
            this.verses1(verses);
            this.verses2([]);
            this.columnDisplay(false);
        };

        selectSet = (set: ISongSet) => {
            let me = this;
            if ((set.setname == 'My Songs')) {
                me.checkAuthentication(() => {
                    set.user = me.username();
                    set.id = set.user;
                    me.selectedSet(set);
                    me.loadSelectedSet();
                })
            }
            else {
                me.selectedSet(set);
                me.loadSelectedSet();
            }
        };

        loadSelectedSet = () => {
            let me = this;
            let set = me.selectedSet();
            let setId = set.id ? set.id : 'all';

            me.loading(set.setname);
            me.services.executeService('GetSet', setId, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetSetResponse>serviceResponse.Value;
                    this.loadSongList(response.songs);
                    me.setVerses(response.verses);
                }
            })
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                })
                .always(() => {
                    // me.page('lyrics');
                    me.page('songs');
                    me.loading('');
                });

        };

        loadSongList = (songs: ISongInfo[]) => {
            this.songList = songs;
            this.songCount = songs.length;
            for (let i = 0; i < 4; i++) {
                this.songs[i]([]);
            }

            let column = [];
            let columnIndex = 0;
            for(let i = 0; i < songs.length; i++) {
                column.push(songs[i]);
                if (column.length >= this.maxSongColumnItems && columnIndex < 3) {
                    this.songs[columnIndex](column);
                    columnIndex++;
                    column = [];
                }
            }
            this.songs[columnIndex](column);
            this.setSongIndex(0);
        };

        showSongList = () => {
            this.page('songs')
        };

        splitColumns = () => {
            let split = !this.columnDisplay();
            this.verses1([]);
            this.verses2([]);
            if (split) {
                let colA = [];
                let colB = [];
                let verseCount = this.verses.length;
                let colsize = verseCount / 2;
                for (let i= 0; i<verseCount; i++) {
                    if (i < colsize) {
                        colA.push(this.verses[i]);
                    }
                    else {
                        colB.push(this.verses[i]);
                    }
                }
                this.verses1(colA);
                this.verses2(colB);
            }
            else {
                this.verses1(this.verses);
            }
            this.columnDisplay(split);
        };

        selectSong = (item : ISongInfo) => {
            let songIndex = _.findIndex(this.songList, {id: item.id});

            if (songIndex == this.songIndex) {
                this.page('lyrics');
            }
            else {
                this.getLyrics(songIndex);
            }
        };

        help = () => {
            this.page('help');
        };

        home = () => {
            this.page('lyrics');
        };

        upload = () => {
            let me = this;
            this.checkAuthentication(() => {
               //  me.uploadLyrics('Test')
            });
        };

        showSigninForm = () => {
            this.onLogin = this.loadSelectedSet;
            jQuery("#signin-modal").modal('show');

        };

        checkAuthentication = (onLogin: () => void) => {
            if (this.signedIn()) {
                onLogin();
                return;
            }

            this.onLogin = onLogin;
            jQuery("#signin-modal").modal('show');

        };

        toggleUser = () => {
            let filtering = !this.filterByUser();
            this.filterByUser(filtering);
            this.clearSearch();

        };
        newSong = () => {
            alert('new song');
        };

        editSong = () => {
            alert('edit song');
        };

        signIn = () => {
            let me = this;

            let credentials = {
                username: this.credentials.username().trim(),
                password: this.credentials.password().trim()
            };


            if (credentials.username && credentials.password) {
                let request = null;
                me.services.executeService( 'SignIn', credentials, (serviceResponse: IServiceResponse) => {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <ISignInResponse>serviceResponse.Value;
                        if (response.registered === 'failed') {
                            alert('Sign in failed. Correct and try again.');
                        }
                        else {
                            jQuery("#signin-modal").modal('hide');
                            if (response.registered !== 'no') {
                                me.signedIn(true);
                                me.username(credentials.username);
                                me.isAdmin(response.registered === 'admin');
                                me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                                if (response.sets) {
                                    let sets = me.sets();
                                    me.sets(sets.concat(response.sets));
                                }
                                if (me.onLogin) {
                                    me.onLogin();
                                }
                            }
                            else {
                                alert('Sorry. You are not registered to use this application.')
                            }
                        }
                    }
                    else {
                        jQuery("#signin-modal").modal('hide');
                    }
                })
                    .fail(() => {
                        let trace = me.services.getErrorInformation();
                    });
            }
        };

        initSetLists(setId) {
            let me = this;
            me.setForm.selectedSongs([]);
            me.setForm.avaliableSongs([]);

            me.services.executeService( 'GetSongLists', setId, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetSongListsReponse>serviceResponse.Value;
                    let selected = [];
                    if (setId) {
                        me.availableSongs =  _.differenceBy(response.availableSongs,response.setSongs,'id');
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
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                });

        };

        newSet = () => {
            this.setForm.id (null);
            this.setForm.setName('');
            this.setForm.user = this.username();
            this.initSetLists([]);
            alert('new set');
        };

        editSet = (set: ISongSet) => {
            let me = this;
            me.setForm.id(set.id);
            me.setForm.setName(set.setname);
            me.setForm.nameError('');
            me.setForm.user = set.user;
            me.initSetLists(set.id);
        };

        removeFromSetList = (song: ISongInfo) => {
            let me = this;
            me.availableSongs.push(song);
            me.availableSongs = _.sortBy(me.availableSongs,['title']);

            let selected = this.setForm.selectedSongs();
            _.remove(selected,(item: ISongInfo) => {
                return item.id == song.id;
            });

            me.setForm.selectedSongs(selected);
            me.setForm.avaliableSongs(me.availableSongs);
            me.setForm.searchValue('');
        };

        addToSetList = (song: ISongInfo) => {
            let me=this;
            me.setForm.selectedSongs.push(song);
            _.remove(me.availableSongs,(item: ISongInfo) => {
                return item.id == song.id;
            });
            me.setForm.avaliableSongs(me.availableSongs);
            me.setForm.searchValue('');
        };

        moveSongUp = (song: ISongInfo) => {
            this.moveSong(song,-1);
        };

        moveSongDown = (song: ISongInfo) => {
            this.moveSong(song,1);
        };

        moveSong = (song: ISongInfo, offset: number) => {
            let list = this.setForm.selectedSongs();
            let oldI = _.findIndex(list, {id: song.id});
            let newI = oldI + offset;
            if (newI < 0) {
                newI = list.length - 1;
            }
            else if (newI == list.length) {
                newI = 0;
            }
            let swapped = list[newI];
            list[newI] = song;
            list[oldI] = swapped;
            this.setForm.selectedSongs(list);
        };

        clearSearch = () => {
            if (this.searchSubscription !== null) {
                this.searchSubscription.dispose();
                this.searchSubscription = null;
            }
            this.setForm.searchValue('');
            let available = this.getAvailableSongsList();
            this.setForm.avaliableSongs(available);
            this.searchSubscription = this.setForm.searchValue.subscribe(this.filterAvailable)
        };

        filterAvailable = (value: string) => {
            value = value.trim();
            if (value) {
                let songs = this.setForm.avaliableSongs();
                let list = _.filter(songs, (item: ISongInfo) => {
                    return item.title.toLowerCase().indexOf(value.toLowerCase()) == 0;
                });
                this.setForm.avaliableSongs(list);
            }
            else {
                let available = this.getAvailableSongsList();
                this.setForm.avaliableSongs(available);
            }
        };

        getAvailableSongsList = () => {
            let me = this;
            if (me.filterByUser()) {
                let user = me.username();
                return _.filter(this.availableSongs,(item: ISongInfo) => {
                    return (item.user == user);
                });
            }
            return this.availableSongs;
        };

        saveSetList = () => {
            let me = this;

            let request = <ISaveSetRequest> {
                setId: this.setForm.id(),
                songs: [],
                setName: this.setForm.setName().trim(),
                user: this.setForm.user
            };

            if (!request.setId) {
                request.setId = 0;
            }

            if (!request.setName) {
                this.setForm.nameError('A name for the set is required.');
                return;
            }

            let selected  = this.setForm.selectedSongs();
            for (let i = 0; i < selected.length; i++) {
                request.songs.push(
                    <ISongSetItem>{songId: selected[i].id, sequence: i}
                )
            }

            this.setForm.nameError('');

            // me.loading(set.setname);
            me.services.executeService('UpdateSongSet', request, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <ISaveSetResponse>serviceResponse.Value;
                    let setList = me.sets();
                    me.sets([]);
                    let set : ISongSet = null;
                    if (request.setId > 0) {
                        let setIndex = _.findIndex(setList, {id: request.setId});
                        set = setList[setIndex];
                        set.setname = request.setName;
                        setList[setIndex] = set;
                    }
                    else {
                        set = <ISongSet>{
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
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                    if (1){} // set breakpoint here
                })
                .always(() => {
                    me.page('songs');
                });
        };

        cancelSetEdit = () => {
            this.page('songs');
        };
    }

}
