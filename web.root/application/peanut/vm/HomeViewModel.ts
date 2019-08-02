/// <reference path="../../../modules/pnut/core/ViewModelBase.ts" />
/// <reference path='../../../modules/typings/knockout/knockout.d.ts' />
/// <reference path='../../../modules/pnut/core/peanut.d.ts' />

namespace Peanut {

    import INameValuePair = Peanut.INameValuePair;

    interface IGetVersesResponse {
        // title: string;
        verses: any[];
    }

    interface IGetSongsResponse extends IGetVersesResponse {
        set: string;
        sets: INameValuePair[];
        songs: INameValuePair[];
        catalogSize: number;
    }

    interface IGetSetResponse extends IGetVersesResponse {
        songs: INameValuePair[];
    }

    interface IGetSongsRequest {
        set?: string;
        song?: string;
    }

    export class HomeViewModel extends Peanut.ViewModelBase {
        // observables
        page= ko.observable('lyrics');
        verses: any[] = [];
        verses1 = ko.observableArray();
        verses2 = ko.observableArray();
        set = ko.observable('');
        sets = ko.observableArray<INameValuePair>();
        songList : INameValuePair[] = [];
        songs : KnockoutObservableArray<INameValuePair>[] = [];
        allsongs = ko.observableArray<INameValuePair>();
        textSize = ko.observable(2);
        columnDisplay = ko.observable(false);
        selectedSong = ko.observable('');
        title = ko.observable('');

        verseColumn : any; //ko.observable('col-md-6');

        songIndex = 0;
        songCount = 0;
        maxSongColumnItems = 0;

        init(successFunction?: () => void) {
            let me = this;
            for (let i = 0; i< 4; i++ ) {
                this.songs[i] = ko.observableArray<INameValuePair>();
            }

            let request = null;
            me.services.executeService('GetSongs', request, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetSongsResponse>serviceResponse.Value;
                    me.sets(response.sets);
                    me.set(response.set);
                    this.loadSongList(response.songs);
                    me.setVerses(response.verses);
                    me.maxSongColumnItems = Math.floor(response.catalogSize / 4);
                }
            })
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                })
                .always(() => {
                    me.bindDefaultSection();
                    successFunction();
                });
        }
        
        setSongIndex = (value: number) => {
            this.songIndex = value;
            let current = this.songList[this.songIndex];
            this.selectedSong(current.Value);
            this.title(current.Name);
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

        getLyrics = (songIndex: number) => {
            let me = this;
            let current = this.songList[songIndex];

            me.page('loading');
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
                    me.page('lyrics');
                });
        };

        setVerses = (verses: any[]) => {
            this.verses = verses;
            this.verses1(verses);
            this.verses2([]);
            this.columnDisplay(false);
        };

        selectSet = (set: INameValuePair) => {
            let me = this;
            me.page('loading');
            me.services.executeService('GetSet', set.Value, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetSetResponse>serviceResponse.Value;
                    me.set(set.Value);
                    this.loadSongList(response.songs);
                    me.setVerses(response.verses);
                }
            })
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                })
                .always(() => {
                    me.page('lyrics');
                });
        };

        loadSongList = (songs: INameValuePair[]) => {
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

        selectSong = (item : INameValuePair) => {
            let songIndex = this.songList.indexOf(item);
            this.getLyrics(songIndex);
        }
    }
}
