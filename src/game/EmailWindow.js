import $ from 'jquery';
import emails from './data/emails.json';

export default class EmailWindow {

    _$window;
    _receivedEmails = [];
    _$unreadEmailCount;
    _$unreadEmails;
    _$readEmails;

    constructor() {
        this._$window = $("#email-window");
        this._$unreadEmailCount = $("#unread-email-count");
        this._$unreadEmails = $("#unread-emails");
        this._$readEmails = $("#read-emails");

        this._loadEmails();
    }

    get name() { return "Email" }

    open() {
        this._$window.show();
        this._updateUi();

        for (var email of this._receivedEmails) {
            email.read = true;
        }
    }

    close() {
        this._$window.hide();
    }

    showNextEmail() {
        for (var email of emails) {
            if (!email.received) {
                this._receivedEmails.push(email);
                email.received = true;
                email.read = false;

                this._updateUi();

                return;
            }
        }
    }

    _updateUi() {
        this._$unreadEmails.empty();
        this._$readEmails.empty();
        var unreadEmails = 0;

        for (var email of this._receivedEmails) {

            var $email = $("<div class='email'>")
                .append(`<div class='from'>from: ${email.from}</div>`)
                .append(`<div class='subject'>subject: ${email.subject}</div>`)
                .append(`<div class='body'>${email.body}</div>`);

            if (!email.read) {
                $email.prependTo(this._$unreadEmails)
                unreadEmails++;
            } else {
                $email.prependTo(this._$readEmails);
            }
        }

        this._$unreadEmailCount.html(unreadEmails);
    }

    _loadEmails() {
        for (var email of emails) {
            email.received = false;
        }

        this._updateUi();
    }
}