import $ from 'jquery';
import Velocity from 'velocity-animate';
import { rand } from '../Util';

export default class Animations {
    static pop($elem, size) {

        var minVert = 75;
        var maxVert = 125;
        var minHor = -100;
        var maxHor = 100;

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

        var topTo = $elem.position().top - rand(minVert, maxVert);
        var leftTo = $elem.position().left - rand(minHor, maxHor);

        var removeElem = () => { $elem.remove() };

        Velocity($elem, { top: topTo }, { duration: 1000, easing: "easeOutSine" });
        Velocity($elem, { left: leftTo }, { duration: 1000, queue: false, easing: "easeInSine" });
        Velocity($elem, { opacity: 0 }, { duration: 1000, queue: false, easing: "easeInQuart", complete: removeElem });
    }
}
