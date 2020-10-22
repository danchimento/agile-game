import './style/index.scss';
import ElementManager from './ui/ElementManager';
import CodeWindow from './game/CodeWindow';
import StoreWindow from './game/StoreWindow';
import TeamWindow from './game/TeamWindow';
import ProjectTracker from './game/ProjectTracker';
import $ from 'jquery';
import Wallet from './game/Wallet';
import MusicPlayer from './game/spotify';
import EmailWindow from './game/EmailWindow';

var em = null;
var pt = null;
var wa = null;

var activeWindow = null;
var $apps;
var projectNumber = 0;
var project = null;

var codeWindow;
var storeWindow;
var teamWindow;
var musicPlayer;
var emailWindow;

$apps = $("#apps");

// musicPlayer = new MusicPlayer();

// var urlParams = new URLSearchParams(window.location.search);
// if (urlParams.has('code')) {
    
//     $.ajax({
//         url: 'https://accounts.spotify.com/api/token',
//         type: 'post',
//         data: {
//             grant_type: 'authorization_code',
//             code: urlParams.get('code'),
//             redirect_uri: 'http://localhost:8080'
//         },
//         headers: {
//             Authorization: 'Basic [BASE64 ENCODE CLIENT_ID:CLIENT_SECRET]', 
//         },
//         dataType: 'json',
//         success: function (data) {
//             console.log(data)
//             musicPlayer.init(data.access_token);
//         }
//     });
// }

// Loading timer
setTimeout(() => {
    var availableFunds = 250;
    wa = new Wallet(em, availableFunds, (revenue) => {
        storeWindow.onRevenueChange(revenue);
    });

    // Set up project tracker
    pt = new ProjectTracker("#project-tracker", (project) => {
        var revenueAfterPayingTeam = teamWindow.processRevenue(project.revenue);
        wa.increaseRevenue(revenueAfterPayingTeam);
        loadNextProject();   
    });

    loadNextProject();

    // Init code window
    codeWindow = new CodeWindow(output => {
        pt.progressTask(output);
    });
    storeWindow = new StoreWindow(onPurchaseItem, availableFunds);
    teamWindow = new TeamWindow(output => {
        pt.progressTask(output);
    });

    emailWindow = new EmailWindow();

    emailWindow.showNextEmail();

    switchToWindow(codeWindow);

}, 2000);

$apps.on("click", "div", function() {
    switch($(this).attr('data-window')) {
        case "Code":
            switchToWindow(codeWindow);
            break;
        case "Store":
            switchToWindow(storeWindow);
            break;
        case "Team":
            switchToWindow(teamWindow);
            break;
        case "Email":
            switchToWindow(emailWindow);
            break;
    }
});

$("#auth-button").on("click", () => {
    var clientId = 'a8fe84d931b74adba5b9c405ef579c06';
    var redirectUri = 'http://localhost:8080'
    var scopes = encodeURIComponent('user-read-email user-read-private user-read-currently-playing streaming user-read-playback-state user-modify-playback-state')
    location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
})


$("#play-button").on("click", () => {
    musicPlayer.play();  
})

function switchToWindow(window) {
    if (activeWindow) activeWindow.close();
    
    activeWindow = window;
    window.open();

    $("#apps div").removeClass("active");
    $(`#apps [data-window=${window.name}]`).addClass('active');
}

function loadNextProject() {
    project = pt.loadNextProject();

    // TODO: Add actual project ids? 
    if (project.title == "Integrate Facebook in Login") {
        emailWindow.showNextEmail()
    }
}

function onPurchaseItem(item) {
    wa.decreaseRevenue(item.price);
    codeWindow.increaseOutput(item.outputIncrease);
}