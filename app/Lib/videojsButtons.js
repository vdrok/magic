import videojs from 'video.js';

const VjsButton = videojs.getComponent('Button');
const FBFButton = videojs.extend(VjsButton, {
    constructor: function(player, options) {
        VjsButton.call(this, player, options);
        this.player = player;
        this.callback = options.callback;
        this.on('click', this.onClick);
    },

    onClick: function() {

        this.player.pause();
        this.callback();
    },
});

function buttons(options) {
    var player = this;

    player.ready(function() {
        options.steps.forEach(function(opt) {

            //<div className="vjs-current-time vjs-time-control vjs-control"><span className="vjs-control-text">Current Time&nbsp;</span><span className="vjs-current-time-display" aria-live="off">0:09</span></div>
            player.controlBar.addChild(
                new FBFButton(player, {
                    el: videojs.createEl(
                        'button',
                        {
                            className: 'vjs-control vjs-button vjs-control-new-button',
                            innerHTML: '<span class="vjs-fbf">' + opt.text + '</span>'
                        },
                        {
                            role: 'button',
                            type: 'button',
                        }
                    ),
                    callback: opt.callback,
                }),
                {}, opt.index);
        });
    });
}
videojs.plugin('buttons', buttons);
