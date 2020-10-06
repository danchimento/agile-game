import $ from 'jquery';
import store from './data/store.json';

export default class StoreWindow {

    _$window;
    _purchasedItems = [];
    _onPurchase;

    constructor(onPurchase) {
        this._$window = $("#store-window");
        this._onPurchase = onPurchase;

        this._loadStore();
    }

    get name() { return "Store" }

    open() {
        this._$window.show();
    }

    close() {
        this._$window.hide();
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
                    .on("click", () => this._buyButtonClick(item))
                    .appendTo($item);

                if (this._purchasedItems.indexOf(item.name) > -1) {
                    $buyButton.text("PURCHASED");
                    $item.addClass("purchased");
                } else {
                    $buyButton.text(`BUY FOR $${item.price}`);
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