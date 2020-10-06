import './style/index.scss';
import ElementManager from './ui/ElementManager';
import CodeWindow from './game/CodeWindow';
import StoreWindow from './game/StoreWindow';
import ProjectTracker from './game/ProjectTracker';
import $ from 'jquery';
import Wallet from './game/Wallet';

var em = null;
var pt = null;
var wa = null;

var activeWindow = null;
var $apps;
var projectNumber = 0;
var project = null;

var codeWindow;
var storeWindow;

$apps = $("#apps");

// Loading timer
setTimeout(() => {
    em = new ElementManager("#game");
    wa = new Wallet(em, 250);

    // Set up project tracker
    pt = new ProjectTracker("#project-tracker", (project) => {
        wa.increaseRevenue(project.revenue);
        loadNextProject();   
    });

    loadNextProject();

    // Init code window
    codeWindow = new CodeWindow(em, output => {
        pt.progressTask(output);
    });
    storeWindow = new StoreWindow(onPurchaseItem);

    switchToWindow(codeWindow);
}, 300);

$apps.on("click", "div", function() {
    switch($(this).attr('data-window')) {
        case "Code":
            switchToWindow(codeWindow);
            break;
        case "Store":
            switchToWindow(storeWindow);
            break;
    }
});

function switchToWindow(window) {
    if (activeWindow) activeWindow.close();
    
    activeWindow = window;
    window.open();

    $("#apps div").removeClass("active");
    $(`#apps [data-window=${window.name}]`).addClass('active');
}

function loadNextProject() {
    project = pt.loadNextProject();
}

function onPurchaseItem(item) {
    wa.decreaseRevenue(item.price);
    codeWindow.increaseOutput(item.outputIncrease);
}