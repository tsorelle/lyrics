/// <reference path="../../../modules/pnut/core/ViewModelBase.ts" />
/// <reference path='../../../modules/typings/knockout/knockout.d.ts' />
/// <reference path='../../../modules/pnut/core/peanut.d.ts' />

namespace Peanut {

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
        executingService = ko.observable(false);
        verses = ko.observableArray();
        set = ko.observable('Default');
        sets = ko.observableArray<INameValuePair>();
        songs = ko.observableArray<INameValuePair>();
        allsongs = ko.observableArray<INameValuePair>();
        textSize = ko.observable(2);
        title = ko.observable('');

        init(successFunction?: () => void) {
            let me = this;
            me.executingService(true);
            let request = null;
            me.services.executeService('GetSongs', request, (serviceResponse: IServiceResponse) => {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    let response = <IGetSongsResponse>serviceResponse.Value;
                    me.verses(response.verses);
                    me.songs(response.songs);
                    me.sets(response.sets);
                    me.title(response.title);
                }
            })
                .fail(() => {
                    let trace = me.services.getErrorInformation();
                })
                .always(() => {
                    me.executingService(false);
                    me.bindDefaultSection();
                successFunction();
            });
        }

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
    }
}
