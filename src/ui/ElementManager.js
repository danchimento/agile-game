import $ from 'jquery';
import Element from './Element';

export default class ElementManager {
    
    $container;

    constructor(containerSelector) {
        $container = $(containerSelector);
        this.$container.css({
            position: "absolute"
        });
    }

    addElement(x, y) {
        var element = new Element(x, y);
        element._$ = $("<div>")
            .text(text)
            .appendTo(this.$container);
    }

    addText(text, x, y) {
        var elem = this.addElement(x, y);
        elem._$.text(text);
        elem.moveTo(x, y);

        return elem;
    }

    moveTo(x, y, animate) {
        this._$.css({
            left: x,
            top: y
        });

        return this;
    }
}
