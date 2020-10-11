import $ from 'jquery';
import Velocity from 'velocity-animate';
import { rand } from '../Util';
import ElementManager from './ElementManager';

export default class Animations {
    static pop(text, $anchor, color, size) {

        var $text = ElementManager.addText(text)
            .css("color", color);

        
        ElementManager.move($text, 
            $anchor.offset().left + $anchor.width() / 2 - $text.width() / 2, 
            $anchor.offset().top + $anchor.height() / 2 - $text.height() / 2);

        var minVert = 75;
        var maxVert = 125;
        var minHor = -50;
        var maxHor = 50;

        switch(size) {
            case "SMALL":
                minVert = 35;
                maxVert = 50;
                minHor = -25;
                maxHor = 25;
                break;
            default:
                break;
        }

        var topTo = $text.position().top - rand(minVert, maxVert);
        var leftTo = $text.position().left - rand(minHor, maxHor);

        var removeElem = () => { $text.remove() };

        Velocity($text, { top: topTo }, { duration: 1000, easing: "easeOutSine" });
        Velocity($text, { left: leftTo }, { duration: 1000, queue: false, easing: "easeInSine" });
        Velocity($text, { opacity: 0 }, { duration: 1000, queue: false, easing: "easeInQuart", complete: removeElem });
    }
}
