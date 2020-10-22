import $ from 'jquery';
import Animations from '../ui/Animations';

export default class Wallet {
    revenue;
    _em;
    _$revenue;
    _$wallet;
    _onRevenueChange;

    constructor(elementManager, startingRevenue, onRevenueChange) {
        this.revenue = startingRevenue;
        this._em = elementManager;
        this._onRevenueChange = onRevenueChange;
        this._$revenue = $("#revenue");
        this._$wallet = $("#wallet");

        this._displayRevenue();
    }

    increaseRevenue(amount) {
        this.revenue += amount;
        Animations.pop(`+${amount}`, this._$revenue, "darkgreen",  "SMALL");
        this._onRevenueChange(this.revenue);
        this._displayRevenue();
    }

    decreaseRevenue(amount) {
        this.revenue -= amount;
        Animations.pop(`-${amount}`, this._$revenue, "red",  "SMALL");
        this._onRevenueChange(this.revenue);
        this._displayRevenue();
    }

    _displayRevenue() {
        this._$revenue.text(`$${this.revenue}`);
    }
}