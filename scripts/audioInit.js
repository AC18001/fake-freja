// Audio initialization fix for browser autoplay policy
(function() {
    let audioInitialized = false;
    
    function initAudio() {
        if (audioInitialized) return;
        
        // Play and immediately pause all audio elements to initialize them
        const audioElements = ['f1', 'f2', 'f3', 'f4', 'f5', 's6'];
        audioElements.forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(e => {
                    console.log('Audio init failed for ' + id, e);
                });
            }
        });
        
        audioInitialized = true;
    }
    
    // Initialize audio on first user interaction
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });
})();
