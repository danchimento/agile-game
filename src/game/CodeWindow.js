import Animations from '../ui/Animations';
import $ from 'jquery';
import code from './data/code.txt';
import { rand } from '../Util';

export default class CodeWindow {

    _onCode;

    _$window;
    _$output;
    _codeLine;

    output;

    constructor(onCode) {
        this._onCode = onCode;
        this.output = 0;
        this._codeLine = 0;

        this._$window = $("#code-window");
        this._$output = $("#output");

        this.increaseOutput(1);
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
        var length = 5;
     //   Animations.pop(`+${this.output} ${code[textIndex]}`, this._$flyingCodeAnchor, "white");

        let codeLine = code.substring(this._codeLine, this._codeLine + length).replace(/[\u00A0-\u9999<>\&]/gim, function(a) {
            return "&#" + a.charCodeAt(0) + ";"
        });

        this._$window[0].innerHTML += codeLine,
        this._codeLine += length,

        this._$window.scrollTop(this._$window.prop("scrollHeight"));
        Animations.pop(`+${this.output}`, this._$output, "white");

        this._onCode(this.output);
    }

    increaseOutput(amount) {
        this.output += amount;

        this._$output.text(`+${this.output}`);
    }
}