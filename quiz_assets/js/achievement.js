// === СИСТЕМА ДОСТИЖЕНИЙ ===
class AchievementSystem {
    constructor() {
        console.log('✅ AchievementSystem constructor called!');
        this.achievements = {
            'quiz1': { image: 'https://nalojka.github.io/quiz_assets/img/1quiz.png', earned: false },
            'quiz3': { image: 'https://nalojka.github.io/quiz_assets/img/3quiz.png', earned: false },
            'quiz5': { image: 'https://nalojka.github.io/quiz_assets/img/5quiz.png', earned: false },
            'dnr': { image: 'https://nalojka.github.io/quiz_assets/img/dnr.png', earned: false },
            'lnr': { image: 'https://nalojka.github.io/quiz_assets/img/lnr.png', earned: false },
            'zaporoj': { image: 'https://nalojka.github.io/quiz_assets/img/zaporoj.png', earned: false },
            'herson': { image: 'https://nalojka.github.io/quiz_assets/img/herson.png', earned: false },
            'krim': { image: 'https://nalojka.github.io/quiz_assets/img/krim.png', earned: false },
            '100score': { image: 'https://nalojka.github.io/quiz_assets/img/100score.png', earned: false },
            '0score': { image: 'https://nalojka.github.io/quiz_assets/img/0score.png', earned: false },
            '1place': { image: 'https://nalojka.github.io/quiz_assets/img/1place.png', earned: false },
            '2place': { image: 'https://nalojka.github.io/quiz_assets/img/2place.png', earned: false },
            '3place': { image: 'https://nalojka.github.io/quiz_assets/img/3place.png', earned: false },
            '1_3place': { image: 'https://nalojka.github.io/quiz_assets/img/1_3place.png', earned: false },
            '30second': { image: 'https://nalojka.github.io/quiz_assets/img/30seconds.png', earned: false }
        };
        
        this.quizCount = 0;
        this.completedRegions = new Set();
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        this.preloadedImages = new Map();
    }

    async init() {
        console.log('✅ AchievementSystem init called!');
        await this.loadAchievements();
        this.setupAchievementsContainer();
        await this.preloadAllImages();
        console.log('✅ All achievement images preloaded');
    }

    async loadAchievements() {
        try {
            const saved = localStorage.getItem('quiz_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = { ...this.achievements, ...data.achievements };
                this.quizCount = data.quizCount || 0;
                this.completedRegions = new Set(data.completedRegions || []);
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    saveAchievements() {
        const data = {
            achievements: this.achievements,
            quizCount: this.quizCount,
            completedRegions: Array.from(this.completedRegions)
        };
        localStorage.setItem('quiz_achievements', JSON.stringify(data));
    }

    setupAchievementsContainer() {
        if (!document.getElementById('achievements-container')) {
            const container = document.createElement('div');
            container.id = 'achievements-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 10000;
                pointer-events: none;
                max-height: calc(100vh - 40px);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
            console.log('✅ Achievements container created!');
        }
    }

    // Предзагрузка всех изображений
    async preloadAllImages() {
        const preloadPromises = Object.entries(this.achievements).map(([id, achievement]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.preloadedImages.set(achievement.image, {
                        element: img,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                    resolve();
                };
                img.onerror = () => {
                    console.warn('Failed to preload image:', achievement.image);
                    // Fallback - создаем цветной квадрат БЕЗ ТЕКСТА
                    const canvas = document.createElement('canvas');
                    canvas.width = 80;
                    canvas.height = 80;
                    const ctx = canvas.getContext('2d');
                    
                    let color = '#4CAF50';
                    if (id.includes('place')) color = '#FFD700';
                    if (id.includes('score')) color = '#2196F3';
                    if (id.includes('quiz')) color = '#9C27B0';
                    if (id.includes('minute') || id.includes('second')) color = '#FF5722';
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, 80, 80);
                    
                    const fallbackImg = new Image();
                    fallbackImg.src = canvas.toDataURL();
                    this.preloadedImages.set(achievement.image, {
                        element: fallbackImg,
                        width: 80,
                        height: 80
                    });
                    resolve();
                };
                img.src = achievement.image;
            });
        });

        await Promise.all(preloadPromises);
    }

    // Получение оптимального размера для изображения
    getOptimalSize(naturalWidth, naturalHeight) {
        const maxSize = 100;
        const minSize = 60;
        
        const aspectRatio = naturalWidth / naturalHeight;
        
        let width, height;
        
        if (aspectRatio > 1) {
            width = Math.min(maxSize, naturalWidth);
            height = width / aspectRatio;
        } else {
            height = Math.min(maxSize, naturalHeight);
            width = height * aspectRatio;
        }
        
        if (width < minSize) {
            width = minSize;
            height = width / aspectRatio;
        }
        if (height < minSize) {
            height = minSize;
            width = height * aspectRatio;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    unlockAchievement(achievementId) {
        console.log('🔓 Unlocking achievement:', achievementId);
        if (!this.achievements[achievementId] || this.achievements[achievementId].earned) {
            return false;
        }

        this.achievements[achievementId].earned = true;
        this.addToQueue(achievementId);
        this.saveAchievements();
        return true;
    }

    addToQueue(achievementId) {
        console.log('📥 Adding to queue:', achievementId);
        this.achievementQueue.push(achievementId);
        this.processQueue();
    }

    processQueue() {
        if (this.isShowingAchievement || this.achievementQueue.length === 0) {
            return;
        }

        const achievementId = this.achievementQueue.shift();
        this.showAchievement(achievementId);
    }

    showAchievement(achievementId) {
        console.log('🎯 Showing achievement:', achievementId);
        this.isShowingAchievement = true;
        const achievement = this.achievements[achievementId];
        const container = document.getElementById('achievements-container');
        
        if (!container) {
            console.error('Achievements container not found!');
            this.isShowingAchievement = false;
            this.processQueue();
            return;
        }

        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        
        // Используем предзагруженное изображение
        const preloaded = this.preloadedImages.get(achievement.image);
        
        if (preloaded) {
            const optimalSize = this.getOptimalSize(preloaded.width, preloaded.height);
            
            achievementElement.style.cssText = `
                transform: translateX(-150px);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                background-image: url('${achievement.image}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${optimalSize.width}px;
                height: ${optimalSize.height}px;
                flex-shrink: 0;
                border: 3px solid #4CAF50;
                background-color: #ffffff;
            `;
        } else {
            // Fallback БЕЗ ТЕКСТА
            let color = '#4CAF50';
            if (achievementId.includes('place')) color = '#FFD700';
            if (achievementId.includes('score')) color = '#2196F3';
            if (achievementId.includes('quiz')) color = '#9C27B0';
            if (achievementId.includes('minute') || achievementId.includes('second')) color = '#FF5722';
            
            achievementElement.style.cssText = `
                transform: translateX(-150px);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                background-color: ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                flex-shrink: 0;
                border: 3px solid #2E7D32;
            `;
        }
        
        container.appendChild(achievementElement);

        // Принудительный reflow для анимации
        achievementElement.offsetHeight;

        // Анимация появления
        requestAnimationFrame(() => {
            achievementElement.style.transform = 'translateX(0)';
            achievementElement.style.opacity = '1';
        });

        // Автопрокрутка
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);

        // Автоматическое скрытие через 3.5 секунды
        setTimeout(() => {
            achievementElement.style.transform = 'translateX(-150px)';
            achievementElement.style.opacity = '0';
            
            setTimeout(() => {
                if (achievementElement.parentNode) {
                    achievementElement.parentNode.removeChild(achievementElement);
                }
                this.isShowingAchievement = false;
                setTimeout(() => this.processQueue(), 100);
            }, 600);
        }, 3500);
    }

    async onQuizComplete(score, timeSeconds, region, playerName) {
        console.log('📝 Quiz completed - checking achievements');
        this.quizCount++;
        this.completedRegions.add(region);
        
        const achievementsToUnlock = [];
        
        // Достижения по количеству квизов
        if (this.quizCount >= 1 && !this.achievements.quiz1.earned) {
            achievementsToUnlock.push('quiz1');
        }
        if (this.quizCount >= 3 && !this.achievements.quiz3.earned) {
            achievementsToUnlock.push('quiz3');
        }
        if (this.quizCount >= 5 && !this.achievements.quiz5.earned) {
            achievementsToUnlock.push('quiz5');
        }
        
        // Достижения за регионы
        const regionAchievements = {
            'Донецкая Народная Республика': 'dnr',
            'Луганская Народная Республика': 'lnr', 
            'Запорожская область': 'zaporoj',
            'Херсонская область': 'herson',
            'Республика Крым': 'krim'
        };
        
        if (regionAchievements[region] && !this.achievements[regionAchievements[region]].earned) {
            achievementsToUnlock.push(regionAchievements[region]);
        }
        
        // Достижения за баллы
        const totalPoints = currentSessionQuestions.length * POINTS;
        if (score === totalPoints && !this.achievements['100score'].earned) {
            achievementsToUnlock.push('100score');
        }
        if (score === 0 && !this.achievements['0score'].earned) {
            achievementsToUnlock.push('0score');
        }
        
        // Достижения за время
        if (timeSeconds < 60 && !this.achievements['1minute'].earned) {
            achievementsToUnlock.push('1minute');
        }
        if (timeSeconds < 30 && !this.achievements['30second'].earned) {
            achievementsToUnlock.push('30second');
        }
        
        console.log('🏆 Achievements to unlock:', achievementsToUnlock);
        
        // Разблокируем достижения с задержкой
        achievementsToUnlock.forEach((achievementId, index) => {
            setTimeout(() => {
                this.unlockAchievement(achievementId);
            }, index * 4000);
        });
        
        this.saveAchievements();
    }

    // Проверка достижений лидерборда
    async checkLeaderboardAchievements(region, playerName) {
        const achievements = [];
        
        try {
            const leaders = await getLeadersForRegion(region);
            const playerPosition = leaders.findIndex(leader => leader.name === playerName) + 1;
            
            if (playerPosition === 1 && !this.achievements['1place'].earned) {
                achievements.push('1place');
            }
            if (playerPosition === 2 && !this.achievements['2place'].earned) {
                achievements.push('2place');
            }
            if (playerPosition === 3 && !this.achievements['3place'].earned) {
                achievements.push('3place');
            }
            if (playerPosition >= 1 && playerPosition <= 3 && !this.achievements['1_3place'].earned) {
                achievements.push('1_3place');
            }
        } catch (error) {
            console.error('Error checking leaderboard achievements:', error);
        }
        
        return achievements;
    }

    getQuizCount() {
        return this.quizCount;
    }

    resetAchievements() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].earned = false;
        });
        this.quizCount = 0;
        this.completedRegions.clear();
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        this.preloadedImages.clear();
        localStorage.removeItem('quiz_achievements');
        
        const container = document.getElementById('achievements-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}
