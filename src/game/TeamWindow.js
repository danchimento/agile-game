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

    _$memberAvatar;
    _$memberName;
    _$memberOutput;
    _$memberCost;
    _$hireButton;

    constructor(onProduceOutput) {
        this._$window = $("#team-window");
     
        this._onProduceOutput = onProduceOutput;
        this._$members = $("#members");
        this._$chatWindow = $("#chat-window");
        this._$teamOutput = $("#team-output");

        this._$memberAvatar = $("#member-avatar");
        this._$memberName = $("#member-name");
        this._$memberOutput = $("#member-output");
        this._$memberCost = $("#member-cost");
        this._$hireButton = $("#member-hire-button");

        this._teamMembers = team;

        this._lorem = new LoremIpsum( {
            wordsPerSentence: {
                max: 10,
                min: 2
              }
        });

        this._loadTeamMembers();
        this._$members.find(".team-member").first().click()

        this._startProductionTimer();
    }

    get name() { return "Team" }

    processRevenue(revenue) {
        for (var member of this._teamMembers) {
            if (member.hired) {
                revenue -= (revenue * member.percentageCut * .01)
            }
        }

        return revenue;
    }

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
        this._populateMemberDetails(member);
    }

    _loadTeamMembers() {

        this._$members.empty();
        var totalOutput = 0;

        for (var member of this._teamMembers) {
            member.messages = [];
            
            $("<div class='team-member'></div>")
                .attr('data-name', member.name) 
                .append(`
                    <img class='avatar' src='images\\avatars\\${member.avatar}' />
                    <div class='info'>
                        <div class='name'>${member.name}</div>
                        ${member.hired ? `<div class='output'>+${member.outputPerSecond} / sec</div>` : `<div class='output'>(Available)</div>`}
                    </div>`)
                .on("click", (e) => this._onClickMember(e))
                .appendTo(this._$members);

            if (member.hired) {
                var numMessages = rand(5, 15);
                totalOutput += member.outputPerSecond;

                for (var i = 0; i < numMessages; i++) {
                    member.messages.push({
                        text: this._generateMessage(),
                        from: rand(0, 1) == 1
                    });
                }
            }
        }

        this._$teamOutput.text(`+${totalOutput}`);
    }

    _generateMessage() {
        return this._lorem.generateSentences(rand(1, 4));
    }

    _populateMemberDetails(member) {
        // this._$chatWindow.empty();
        // for (var message of member.messages) {
        //     $("<div class='message'></div>")
        //         .text(message.text)
        //         .addClass(message.from ? 'from' : 'to')
        //         .appendTo(this._$chatWindow);
        // }

        //this._$chatWindow.scrollTop(this._$chatWindow.prop('scrollHeight'));

        this._$memberAvatar.attr('src', `images\\avatars\\${member.avatar}`);
        this._$memberName.html(member.name);
        this._$memberOutput.html(`${member.outputPerSecond} / sec`);
        this._$memberCost.html(`${member.percentageCut}% of project revenue`);

        if (!member.hired) {
            this._$hireButton
                .show()    
                .off("click")
                .on("click", () => this._hireTeamMember(member));
        } else {
            this._$hireButton.hide();
        }
    }

    _hireTeamMember(member) {
        member.hired = true;
        this._loadTeamMembers();
        this._findMember(member.name).click();
    }

    _startProductionTimer() {
        this._productionTimer = setInterval(() => {
            var output = 0;

            for (var member of this._teamMembers) {
                if (!member.hired) {
                    continue;
                }

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