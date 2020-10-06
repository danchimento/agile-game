import Animations from '../ui/Animations';
import $ from 'jquery';
import code from './code.json';
import { rand } from '../Util';

export default class CodeWindow {

    _em;
    _onCode;

    _$window;
    _$flyingCodeAnchor;

    output;

    constructor(elementManager, onCode) {
        this._em = elementManager;
        this._onCode = onCode;
        this.output = 1;

        this._$window = $("#code-window");
        this._$flyingCodeAnchor = $("#flying-code-anchor");
    }

    get name() { return "Code" }

    open() {
        $(document).on("keydown", () => { this.type() });
        this._$window.show();
    }

    close() {
        $(document).off("keydown");
        this._$window.hide();
    }

    type() {
        var textIndex = rand(0, code.length - 1);
        var $text = this._em.addText(`+${this.output} ${code[textIndex]}`)
            .addClass("flying-code");

        this._em.move($text, this._$flyingCodeAnchor.offset().left - $text.width() / 2, this._$flyingCodeAnchor.offset().top);
        Animations.pop($text);

        this._onCode(this.output);
    }

    increaseOutput(amount) {
        this.output += amount;
    }
}