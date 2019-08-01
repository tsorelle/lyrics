/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {
    export class multiSelectComponent {
        errorMessage = ko.observable('');
        lookupItems : KnockoutObservableArray<ILookupItem>;
        selected : KnockoutObservableArray<ILookupItem>;
        selectedItem = ko.observable<ILookupItem>(null);
        available = ko.observableArray<ILookupItem>([]);
        label = ko.observable('');
        caption = ko.observable('Please select...');
        removeText = ko.observable('Remove');
        itemSubscription : any = null;
        selectionsSubscription : any = null;

        static lo : any;

        controlId = ko.observable('multi-select-field');
        lo : any;
        sortValue = 'name';

        constructor(params: any) {
            let me = this;
            me.errorMessage('Cannot load multi-select');
            if (!params) {
                console.error('multiSelectComponent: Params not defined in multi-select');
                return;
            }
            let valid = true;

            if (!params.items) {
                console.error('multiSelectComponent: Parameter "items" is required');
                valid = false;
            }

            if (!params.selected) {
                console.error('multiSelectComponent: Parameter "selected" is required');
                valid = false;
            }

            if (!valid) {
                return;
            }

            me.errorMessage('');


            if (params.translator) {
                let translator = <ViewModelBase>params.translator();
                me.removeText(translator.translate('label-remove','Remove'));
                if (params.label) {
                    me.label(translator.translate(params.label));
                }
                if (params.caption) {
                    me.caption(translator.translate(params.caption));
                }
            }

            if (params.sort) {
                me.sortValue = params.sort;
            }
            me.lookupItems = params.items;
            me.selected = params.selected;
            if (!multiSelectComponent.lo) {
                multiSelectComponent.lo = _.noConflict();
            }

            me.lo = multiSelectComponent.lo;
            me.filterAvailable();

            me.activateSubscriptions();
        }

        filterAvailable = () => {
            let me = this;
            let test = me.available();
            let selected = me.selected();
            let items = me.lookupItems();
            let result = me.lo.filter(items, (item: Peanut.ILookupItem) => {
                let existing = me.lo.find(selected, (selectItem: Peanut.ILookupItem) => {
                    return selectItem.id == item.id;
                });
                return (!existing);
            });
            me.available(result);
        };

        addItem = (item: Peanut.ILookupItem) => {
            if (item) {
                this.moveSelectedItem(item, this.available, this.selected);
            }
        };

        removeItem = (item: Peanut.ILookupItem) => {
            this.moveSelectedItem(item,this.selected,this.available);

        };

        moveSelectedItem = (item: Peanut.ILookupItem,
                            source: KnockoutObservableArray<Peanut.ILookupItem>,
                            target: KnockoutObservableArray<Peanut.ILookupItem>) => {
            let me = this;
            me.suspendSubscriptions();
            let remaining = me.lo.filter(source(),(sourceItem: Peanut.ILookupItem) => {
                return sourceItem.id != item.id;
            });
            remaining = me.lo.sortBy(remaining,me.sortValue);
            target.push(item);
            let targetItems = me.lo.sortBy(target(),me.sortValue);
            source(remaining);
            target(targetItems);
            me.activateSubscriptions();
        };

        suspendSubscriptions = () => {
            if (this.itemSubscription !== null) {
                this.itemSubscription.dispose();
                this.itemSubscription = null;
            }
            if (this.selectionsSubscription !== null) {
                this.selectionsSubscription.dispose();
                this.selectionsSubscription = null;
            }
        };

        activateSubscriptions = () => {
            this.selectedItem(null);
            this.itemSubscription = this.selectedItem.subscribe(this.addItem);
            this.selectionsSubscription = this.selected.subscribe(this.filterAvailable)
        };


    }
}