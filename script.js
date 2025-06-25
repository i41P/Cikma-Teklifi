class RomanticMessage {
    constructor() {
        this.musicStarted = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAnimations();
        this.setupMusic();
    }

    setupMusic() {
        // Müzik için yerel dosya oluştur
        this.createMusicFile();
        
        // Sayfa etkileşimi sonrası müziği başlat
        document.addEventListener('click', () => {
            if (!this.musicStarted) {
                this.playMusic();
                this.musicStarted = true;
            }
        }, { once: false });
    }

    createMusicFile() {
        // Web Audio API ile basit romantik melodi oluştur
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.playRomanticMelody = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const notes = [
                { freq: 523.25, duration: 0.5 }, // C5
                { freq: 587.33, duration: 0.5 }, // D5
                { freq: 659.25, duration: 0.5 }, // E5
                { freq: 698.46, duration: 0.5 }, // F5
                { freq: 783.99, duration: 1.0 }, // G5
                { freq: 659.25, duration: 0.5 }, // E5
                { freq: 523.25, duration: 1.0 }, // C5
            ];
            
            let currentTime = audioContext.currentTime;
            
            notes.forEach(note => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration;
            });
            
            // Melodiyi tekrarla
            setTimeout(() => {
                if (this.musicStarted) {
                    this.playRomanticMelody();
                }
            }, currentTime * 1000 + 2000);
        };
    }

    playMusic() {
        try {
            this.playRomanticMelody();
        } catch (e) {
            console.log('Müzik çalınamadı:', e);
        }
    }

    bindEvents() {
        const heart = document.getElementById('heart');
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const finalYesBtn = document.getElementById('finalYesBtn');
        
        heart.addEventListener('click', () => this.openEnvelope());
        yesBtn.addEventListener('click', () => this.showFinalScreen());
        noBtn.addEventListener('click', () => this.showSecondChance());
        finalYesBtn.addEventListener('click', () => this.showFinalScreen());
    }

    setupAnimations() {
        const heart = document.getElementById('heart');
        heart.addEventListener('mouseenter', () => {
            heart.style.transform = 'scale(1.2)';
        });
        
        heart.addEventListener('mouseleave', () => {
            heart.style.transform = 'scale(1)';
        });
    }

    openEnvelope() {
        const envelope = document.getElementById('envelope');
        const letter = document.getElementById('letter');
        
        // Müziği başlat
        if (!this.musicStarted) {
            this.playMusic();
            this.musicStarted = true;
        }
        
        // Zarfı aç
        envelope.classList.add('opened');
        
        // Mektubu zarftan çıkıyor gibi göster
        setTimeout(() => {
            letter.classList.add('show');
            this.typeWriter();
        }, 1000);
    }

    typeWriter() {
        const messageText = document.querySelector('.message-text');
        const fullText = "Bunu sana söylemek için doğru zamanı bekledim... Çünkü seninle her konuştuğumda, içimde istiyorum. Eğer sen de istersen... benimle bir adım daha ileri gider misin? Benimle çıkar mısın?";
        
        messageText.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < fullText.length) {
                messageText.textContent += fullText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    showSecondChance() {
        const letter = document.getElementById('letter');
        const secondChanceLetter = document.getElementById('secondChanceLetter');
        
        // İlk mektubu gizle
        letter.classList.remove('show');
        
        // İkinci şans mektubunu göster
        setTimeout(() => {
            secondChanceLetter.classList.add('show');
            this.typeSecondChanceMessage();
        }, 600);
    }

    typeSecondChanceMessage() {
        const messageText = document.querySelector('#secondChanceLetter .message-text');
        const fullText = "Biliyorum biraz çocukça oldu ancak... 2. şansa ne dersin? Belki bu sefer kalbinle düşünebilirsin?";
        
        messageText.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < fullText.length) {
                messageText.textContent += fullText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    showFinalScreen() {
        const letter = document.getElementById('letter');
        const secondChanceLetter = document.getElementById('secondChanceLetter');
        const finalScreen = document.getElementById('finalScreen');
        
        // Tüm mektupları gizle
        letter.classList.remove('show');
        secondChanceLetter.classList.remove('show');
        
        // Final ekranını göster
        setTimeout(() => {
            finalScreen.classList.add('show');
            this.createFloatingHearts();
        }, 600);
    }

    createFloatingHearts() {
        const finalScreen = document.getElementById('finalScreen');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createFloatingHeart(finalScreen);
            }, i * 300);
        }
    }

    createFloatingHeart(container) {
        const hearts = ['💕', '💖', '💗', '💝'];
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 15 + 15 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.opacity = '0.8';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1';
        
        container.appendChild(heart);
        
        // Animasyon
        const duration = Math.random() * 3000 + 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const y = 100 - (progress * 120);
                const x = parseFloat(heart.style.left) + Math.sin(progress * Math.PI * 4) * 2;
                const opacity = 0.8 * (1 - progress);
                
                heart.style.top = y + '%';
                heart.style.left = x + '%';
                heart.style.opacity = opacity;
                
                requestAnimationFrame(animate);
            } else {
                heart.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    new RomanticMessage();
});

// Mobil dokunma desteği
document.addEventListener('touchstart', function() {}, true);