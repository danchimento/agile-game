import $ from 'jquery';
import team from './data/team.json';
import { LoremIpsum } from "lorem-ipsum";
import { rand } from '../Util';
import Animations from '../ui/Animations';

export default class TeamWindow {

    _$window;
    _teamMembers = [];
    _lorem;

    _$members;
    _$chatWindow;
    _onProduceOutput;
    _productionTimer;
    _$teamOutput;

    constructor(onProduceOutput) {
        this._$window = $("#team-window");
     
        this._onProduceOutput = onProduceOutput;
        this._$members = $("#members");
        this._$chatWindow = $("#chat-window");
        this._$teamOutput = $("#team-output");

        this._lorem = new LoremIpsum( {
            wordsPerSentence: {
                max: 10,
                min: 2
              }
        });

        this._loadTeamMembers();
        this._startProductionTimer();
    }

    get name() { return "Team" }

    open() {
        this._$window.css({ display: "flex" });
    }

    close() {
        this._$window.hide();
    }

    _onClickMember(e) {
        this._$members.find(".team-member").removeClass("selected");
        $(e.currentTarget).addClass("selected");

        // Super hacky way to get the name.
        var name = $(e.currentTarget).attr('data-name');
        var member = this._teamMembers.find(e => e.name == name);
        this._populateChatWindow(member.messages);
    }

    _loadTeamMembers() {

        this._$members.empty();
        var totalOutput = 0;

        for (var member of team) {
            member.messages = [];
            this._teamMembers.push(member);
            $("<div class='team-member'></div>")
                .attr('data-name', member.name) 
                .append(`<div class='name'>${member.name}</div>`)
                .append(`<div class='output'>+${member.outputPerSecond} / sec</div>`)
                .on("click", (e) => this._onClickMember(e))
                .appendTo(this._$members);

            var numMessages = rand(5, 15);
            totalOutput += member.outputPerSecond;

            for (var i = 0; i < numMessages; i++) {
                member.messages.push({
                    text: this._generateMessage(),
                    from: rand(0, 1) == 1
                });
            }
        }

        this._$members.find(".team-member").first().click()
        this._$teamOutput.text(`+${totalOutput}`);
    }

    _generateMessage() {
        return this._lorem.generateSentences(rand(1, 4));
    }

    _populateChatWindow(messages) {
        this._$chatWindow.empty();
        for (var message of messages) {
            $("<div class='message'></div>")
                .text(message.text)
                .addClass(message.from ? 'from' : 'to')
                .appendTo(this._$chatWindow);
        }

        this._$chatWindow.scrollTop(this._$chatWindow.prop('scrollHeight'));
    }

    _startProductionTimer() {
        this._productionTimer = setInterval(() => {
            var output = 0;

            for (var member of this._teamMembers) {
                output += member.outputPerSecond;
                var $member = this._findMember(member.name);

                Animations.pop(`+${member.outputPerSecond}`, $member, "white", "SMALL");
            }

            if (output > 0) {
                Animations.pop(`+${output}`, this._$teamOutput, "white", "SMALL");
                this._onProduceOutput(output);
            }
        }, 1000);
    }

    _findMember(name) {
        return this._$members.find(`[data-name='${name}']`);
    }
}