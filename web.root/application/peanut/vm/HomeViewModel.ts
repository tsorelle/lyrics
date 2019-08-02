/// <reference path="../../../modules/pnut/core/ViewModelBase.ts" />
/// <reference path='../../../modules/typings/knockout/knockout.d.ts' />
/// <reference path='../../../modules/pnut/core/peanut.d.ts' />

namespace Peanut {

    import INameValuePair = Peanut.INameValuePair;

    interface IGetVersesResponse {
        title: string;
        verses: any[];
    }

    interface IGetSongsResponse extends IGetVersesResponse {
        set: string;
        sets: INameValuePair[];
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
                    me.verses = response.verses;
                    me.verses1(me.verses);
                    me.title(response.title);
                    me.loadSet(response);

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
        
        loadSet = (response: IGetSongsResponse) => {
            this.loadSongList(response.songs);
            this.songIndex = 0;

            this.songCount = response.songs.length;
            // this.selectedSong = response.songs[0].Value;
            this.set(response.set);
        };

        setSongIndex = (value: number) => {
            this.songIndex = value;
            this.selectedSong(this.songList[this.songIndex].Value);
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

                    me.verses = response.verses;
                    me.verses1(response.verses);
                    me.verses2([]);
                    me.columnDisplay(false);

                    me.title(response.title);
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

        loadSongList = (songs: INameValuePair[]) => {
            this.songList = songs;
            let colCount = songs.length % 4;
            let maxItems = 10;
            let index = 0;
            let colIndex = 0;
            for (let i = 0; i < 4; i++) {
                this.songs[i]([]);
            }

            let column = [];
            let columnIndex = 0;
            for(let i = 0; i < songs.length; i++) {
                column.push(songs[i]);
                if (column.length >= maxItems && columnIndex < 3) {
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
                this.verses2([]);
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
