import $ from 'jquery';
import { px } from '../Util';

export default class ElementManager {
    
    $container;

    constructor(containerSelector) {
        this.$container = $(containerSelector);
    }

    addElement() {
        var $elem = $("<div>")
            .css({ position: "fixed"})
            .appendTo(this.$container);

        return $elem;
    }

    addText(text) {
        return this.addElement()
            .text(text);
    }

    addContainer(width, height) {
        
    }

    move($elem, x, y, animate) {
        $elem.css({
            left: px(x),
            top: px(y)
        });

        return $elem;
    }

    get containerWidth () { return this.$container.width() }
    get containerHeight () { return this.$container.height() }
}
