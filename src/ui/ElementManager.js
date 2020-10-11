import $ from 'jquery';
import { px } from '../Util';

export default class ElementManager {
    
    static addElement() {
        var $elem = $("<div>")
            .css({ position: "fixed"})
            .appendTo($("body"));

        return $elem;
    }

    static addText(text) {
        return ElementManager.addElement()
            .text(text);
    }

    static move($elem, x, y) {
        $elem.css({
            left: px(x),
            top: px(y)
        });

        return $elem;
    }
}
