// Mobile audio fix - Direct audio playback on touch
(function() {
    let currentAudioIndex = 0;
    let audioInitialized = false;
    let touchCount = 0;
    
    function initAudioElements() {
        if (audioInitialized) return;
        
        console.log('Initializing audio elements...');
        
        // Initialize all audio elements on first interaction
        ['f1', 'f2', 'f3', 'f4', 'f5', 's6'].forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                audio.load();
                // Muted play to unlock on iOS
                audio.muted = true;
                const p = audio.play();
                if (p) {
                    p.then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.muted = false;
                        console.log('Audio ' + id + ' initialized');
                    }).catch(err => {
                        console.log('Init failed for ' + id + ':', err.message);
                    });
                }
            }
        });
        
        audioInitialized = true;
    }
    
    function playClickSound() {
        touchCount++;
        console.log('Touch #' + touchCount + ' - Playing audio');
        
        const audioIds = ['f1', 'f2', 'f3', 'f4', 'f5'];
        const audioId = audioIds[currentAudioIndex];
        const audio = document.getElementById(audioId);
        
        if (!audio) {
            console.log('Audio element not found:', audioId);
            return;
        }
        
        console.log('Playing:', audioId, 'Ready state:', audio.readyState);
        audio.currentTime = 0;
        const playPromise = audio.play();
        
        if (playPromise) {
            playPromise
                .then(() => {
                    console.log('Audio played successfully:', audioId);
                })
                .catch(e => {
                    console.log('Play error for ' + audioId + ':', e.message);
                });
        }
        
        currentAudioIndex = (currentAudioIndex + 1) % audioIds.length;
    }
    
    // Setup test button
    function setupTestButton() {
        const testBtn = document.getElementById('audioTestBtn');
        if (testBtn) {
            testBtn.addEventListener('click', function() {
                testBtn.textContent = 'Playing...';
                testBtn.style.background = '#ffff00';
                initAudioElements();
                playClickSound();
                setTimeout(function() {
                    testBtn.textContent = 'Test Audio';
                    testBtn.style.background = '#00ff00';
                }, 500);
            });
            console.log('Test button setup complete');
        }
    }
    
    // Wait for DOM to be ready
    function setupAudioFix() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) {
            console.log('Canvas not found, retrying...');
            setTimeout(setupAudioFix, 100);
            return;
        }
        
        console.log('Audio fix setup complete - canvas found');
        
        // Add direct event listeners with high priority (capture phase)
        canvas.addEventListener('touchstart', function(e) {
            console.log('Touchstart detected on canvas');
            initAudioElements();
            playClickSound();
        }, { capture: true, passive: false });
        
        canvas.addEventListener('click', function(e) {
            console.log('Click detected on canvas');
            initAudioElements();
            playClickSound();
        }, { capture: true });
        
        // Also add to document body as fallback
        document.body.addEventListener('touchstart', function(e) {
            if (!audioInitialized) {
                console.log('Body touchstart - initializing audio');
                initAudioElements();
            }
        }, { once: true, capture: true });
        
        // Setup test button
        setupTestButton();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAudioFix);
    } else {
        setupAudioFix();
    }
    
    console.log('Audio fix script loaded');
})();
