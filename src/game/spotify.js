export default class MusicPlayer {

    player;
    token;
    deviceId;

    constructor() {

        window.onSpotifyWebPlaybackSDKReady = () => {

        };
    }

    init(token) {
        this.token = token;
        this.player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(this.token); }
        });

        // Error handling
        this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
        this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
        this.player.addListener('account_error', ({ message }) => { console.error(message); });
        this.player.addListener('playback_error', ({ message }) => { console.error(message); });

        //Playback status updates
        this.player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            this.deviceId = device_id;
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the this.player!
        this.player.connect();
    }

    play() {

        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [this.deviceId],
                "play": true,
            }),
        });
    }
}