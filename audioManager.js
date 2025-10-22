// Basic Web Audio API Sound Manager
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
export var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager() {
        _class_call_check(this, AudioManager);
        // Use '||' for broader browser compatibility, though 'webkit' is largely legacy
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = null;
        this.isInitialized = false;
        this.lastClickTime = 0;
        this.clickInterval = 200; // Milliseconds between clicks for rhythm
        if (AudioContext) {
            try {
                this.audioCtx = new AudioContext();
                this.isInitialized = true;
                console.log("AudioContext created successfully.");
            } catch (e) {
                console.error("Error creating AudioContext:", e);
            }
        } else {
            console.warn("Web Audio API is not supported in this browser.");
        }
    }
    _create_class(AudioManager, [
        {
            // Resume audio context after user interaction (required by many browsers)
            key: "resumeContext",
            value: function resumeContext() {
                if (this.audioCtx && this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume().then(function() {
                        console.log("AudioContext resumed successfully.");
                    }).catch(function(e) {
                        return console.error("Error resuming AudioContext:", e);
                    });
                }
            }
        },
        {
            key: "playInteractionClickSound",
            value: function playInteractionClickSound() {
                if (!this.isInitialized || !this.audioCtx || this.audioCtx.state !== 'running') return;
                var internalCurrentTime = this.audioCtx.currentTime;
                // Check if enough time has passed since the last click
                if (internalCurrentTime - this.lastClickTime < this.clickInterval / 1000) {
                    return; // Too soon for the next click
                }
                this.lastClickTime = internalCurrentTime;
                var oscillator = this.audioCtx.createOscillator();
                var gainNode = this.audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(this.audioCtx.destination);
                oscillator.type = 'sine'; // Softer waveform for a 'tic'
                oscillator.frequency.setValueAtTime(1200, this.audioCtx.currentTime); // Lowered base pitch
                // A very quick pitch drop can make it sound more 'clicky'
                oscillator.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.01); // Lowered pitch drop target
                var clickVolume = 0.08; // Increased volume slightly
                gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime); // Start silent for a clean attack
                gainNode.gain.linearRampToValueAtTime(clickVolume, this.audioCtx.currentTime + 0.003); // Very fast attack
                gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.005); // Keep decay short for 'tic'
                oscillator.start(this.audioCtx.currentTime);
                oscillator.stop(this.audioCtx.currentTime + 0.005); // Match decay duration
            }
        }
    ]);
    return AudioManager;
}();
