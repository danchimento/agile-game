import $ from 'jquery';
import store from './data/store.json';

export default class StoreWindow {

    _$window;
    _purchasedItems = [];
    _onPurchase;
    _availableFunds;

    constructor(onPurchase, availabelFunds) {
        this._$window = $("#store-window");
        this._onPurchase = onPurchase;
        this._availableFunds = availabelFunds;

        this._loadStore();
    }

    get name() { return "Store" }

    onRevenueChange(availabelFunds) {
        this._availableFunds = availabelFunds;
        this._loadStore();
    }

    open() {
        this._$window.show();
    }

    close() {
        this._$window.hide();
    }

    _setBuyButtonClick($button, item) {
        $button.on("click", () => this._buyButtonClick(item))
    }

    _loadStore() {
        this._$window.empty();

        for (var category of store) {
            var $cat = $("<div>")
                .addClass("category")
                .append(`<div class='title'>${category.name}</div>`)
                .appendTo(this._$window);

            for (var item of category.items) {
                var $item = $("<div>")
                    .addClass("item")
                    .append(`<div>${item.name}</div>`)
                    .appendTo($cat);

                var $buyButton = $("<div>")
                    .addClass("buy-button")
                    .appendTo($item);

                this._setBuyButtonClick($buyButton, item);

                if (this._purchasedItems.indexOf(item.name) > -1) {
                    $buyButton.text("PURCHASED");
                    $item.addClass("purchased");
                } else {
                    $buyButton.text(`BUY FOR $${item.price}`);

                    if (this._availableFunds < item.price) {
                        $buyButton.addClass('disabled')
                    }
                }
            }
        }
    }

    _buyButtonClick(item) {
        if (this._purchasedItems.indexOf(item.name) > -1) {
            return;
        }

        this._purchasedItems.push(item.name);
        this._onPurchase(item);

        this._loadStore();
    }
}