// Audio initialization and playback manager for mobile compatibility
(function() {
    let audioInitialized = false;
    let currentAudioIndex = 0;
    const audioElements = ['f1', 'f2', 'f3', 'f4', 'f5'];
    
    function initAudio() {
        if (audioInitialized) return;
        
        // Play and immediately pause all audio elements to initialize them
        ['f1', 'f2', 'f3', 'f4', 'f5', 's6'].forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                // Load the audio
                audio.load();
                // Try to play and pause to unlock audio on mobile
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(e => {
                        console.log('Audio init for ' + id + ':', e.message);
                    });
                }
            }
        });
        
        audioInitialized = true;
    }
    
    // Function to play the next audio in sequence
    window.playClickSound = function() {
        if (!audioInitialized) {
            initAudio();
        }
        
        const audioId = audioElements[currentAudioIndex];
        const audio = document.getElementById(audioId);
        
        if (audio) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Play failed:', e.message);
                });
            }
        }
        
        currentAudioIndex++;
        if (currentAudioIndex >= audioElements.length) {
            currentAudioIndex = 0;
        }
    };
    
    // Initialize audio on first user interaction
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });
})();
