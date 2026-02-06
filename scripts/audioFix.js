// Mobile audio fix - Override Audio constructor for click sounds
(function() {
    // Store reference to audio elements
    const audioElements = [
        document.getElementById('f1'),
        document.getElementById('f2'),
        document.getElementById('f3'),
        document.getElementById('f4'),
        document.getElementById('f5')
    ];
    
    let currentIndex = 0;
    
    // Store original Audio constructor
    const OriginalAudio = window.Audio;
    
    // Override Audio constructor to use existing elements
    window.Audio = function(src) {
        // If it's one of our glitter sounds, use the existing element
        if (src && src.includes('glitter')) {
            // Return a proxy that plays the appropriate audio element
            const audioElement = audioElements[currentIndex];
            currentIndex = (currentIndex + 1) % audioElements.length;
            
            return {
                play: function() {
                    if (audioElement) {
                        audioElement.currentTime = 0;
                        const playPromise = audioElement.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => console.log('Audio play failed:', e.message));
                        }
                    }
                },
                pause: function() {
                    if (audioElement) audioElement.pause();
                },
                load: function() {
                    if (audioElement) audioElement.load();
                },
                get currentTime() {
                    return audioElement ? audioElement.currentTime : 0;
                },
                set currentTime(val) {
                    if (audioElement) audioElement.currentTime = val;
                }
            };
        }
        
        // For other audio, use original constructor
        return new OriginalAudio(src);
    };
    
    // Copy properties from original constructor
    window.Audio.prototype = OriginalAudio.prototype;
})();
