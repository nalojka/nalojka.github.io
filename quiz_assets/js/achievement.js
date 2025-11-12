// === СИСТЕМА ДОСТИЖЕНИЙ ===
class AchievementSystem {
    constructor() {
        console.log('✅ AchievementSystem constructor called!');
        this.achievements = {
            'quiz1': { image: 'quiz_assets/img/1quiz.png', earned: false },
            'quiz3': { image: 'quiz_assets/img/3quiz.png', earned: false },
            'quiz5': { image: 'quiz_assets/img/5quiz.png', earned: false },
            'dnr': { image: 'quiz_assets/img/dnr.png', earned: false },
            'lnr': { image: 'quiz_assets/img/lnr.png', earned: false },
            'zaporoj': { image: 'quiz_assets/img/zaporoj.png', earned: false },
            'herson': { image: 'quiz_assets/img/herson.png', earned: false },
            'krim': { image: 'quiz_assets/img/krim.png', earned: false },
            '100score': { image: 'quiz_assets/img/100score.png', earned: false },
            '0score': { image: 'quiz_assets/img/0score.png', earned: false },
            '1place': { image: 'quiz_assets/img/1place.png', earned: false },
            '2place': { image: 'quiz_assets/img/2place.png', earned: false },
            '3place': { image: 'quiz_assets/img/3place.png', earned: false },
            '1_3place': { image: 'quiz_assets/img/1_3place.png', earned: false },
            '30second': { image: 'quiz_assets/img/30seconds.png', earned: false }
        };
        
        this.quizCount = 0;
        this.completedRegions = new Set();
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        this.preloadedImages = new Map();
        
        this.init();
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
                console.log('📁 Loaded achievements:', this.achievements);
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
        console.log('💾 Saved achievements to localStorage');
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
                    console.log(`✅ Preloaded: ${achievement.image}`);
                    resolve();
                };
                img.onerror = () => {
                    console.warn('❌ Failed to preload image:', achievement.image);
                    resolve();
                };
                img.src = achievement.image;
            });
        });

        await Promise.all(preloadPromises);
    }

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
        
        if (!this.achievements[achievementId]) {
            console.warn('❌ Achievement not found:', achievementId);
            return false;
        }
        
        if (this.achievements[achievementId].earned) {
            console.log('ℹ️ Achievement already unlocked:', achievementId);
            return false;
        }

        this.achievements[achievementId].earned = true;
        this.achievementQueue.push(achievementId);
        this.saveAchievements();
        
        console.log('✅ Achievement unlocked and queued:', achievementId);
        this.processQueue();
        return true;
    }

    processQueue() {
        if (this.isShowingAchievement || this.achievementQueue.length === 0) {
            return;
        }
        this.showAchievement(this.achievementQueue.shift());
    }

    showAchievement(achievementId) {
        console.log('🎯 Showing achievement:', achievementId);
        this.isShowingAchievement = true;
        
        const achievement = this.achievements[achievementId];
        const container = document.getElementById('achievements-container');
        
        if (!container) {
            console.error('❌ Achievements container not found!');
            this.isShowingAchievement = false;
            this.processQueue();
            return;
        }

        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        
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
            // Fallback
            achievementElement.style.cssText = `
                transform: translateX(-150px);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                background-color: #4CAF50;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                flex-shrink: 0;
                border: 3px solid #2E7D32;
                color: white;
                font-weight: bold;
                font-size: 12px;
                text-align: center;
                padding: 5px;
            `;
            achievementElement.textContent = achievementId;
        }
        
        container.appendChild(achievementElement);

        // Анимация появления
        setTimeout(() => {
            achievementElement.style.transform = 'translateX(0)';
            achievementElement.style.opacity = '1';
        }, 100);

        // Автопрокрутка
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 200);

        // Автоматическое скрытие через 4 секунды
        setTimeout(() => {
            achievementElement.style.transform = 'translateX(-150px)';
            achievementElement.style.opacity = '0';
            
            setTimeout(() => {
                if (achievementElement.parentNode) {
                    achievementElement.parentNode.removeChild(achievementElement);
                }
                this.isShowingAchievement = false;
                setTimeout(() => this.processQueue(), 300);
            }, 600);
        }, 4000);
    }

    async onQuizComplete(score, timeSeconds, region) {
        console.log('📝 Quiz completed - checking achievements');
        console.log('📊 Score:', score, 'Time:', timeSeconds, 'Region:', region);
        
        // Обновляем статистику
        this.quizCount++;
        this.completedRegions.add(region);
        
        const totalPoints = currentSessionQuestions.length * POINTS;
        console.log('🎯 Total possible points:', totalPoints);
        
        // Проверяем достижения
        const achievementsToUnlock = [];
        
        // 1. Достижения по количеству квизов
        if (this.quizCount >= 1 && !this.achievements.quiz1.earned) {
            console.log('✅ Condition met: quiz1');
            achievementsToUnlock.push('quiz1');
        }
        if (this.quizCount >= 3 && !this.achievements.quiz3.earned) {
            console.log('✅ Condition met: quiz3');
            achievementsToUnlock.push('quiz3');
        }
        if (this.quizCount >= 5 && !this.achievements.quiz5.earned) {
            console.log('✅ Condition met: quiz5');
            achievementsToUnlock.push('quiz5');
        }
        
        // 2. Достижения за регионы
        const regionMap = {
            'Донецкая Народная Республика': 'dnr',
            'Луганская Народная Республика': 'lnr', 
            'Запорожская область': 'zaporoj',
            'Херсонская область': 'herson',
            'Республика Крым': 'krim'
        };
        
        const regionAchievement = regionMap[region];
        if (regionAchievement && !this.achievements[regionAchievement].earned) {
            console.log('✅ Condition met:', regionAchievement);
            achievementsToUnlock.push(regionAchievement);
        }
        
        // 3. Достижения за баллы
        if (score === totalPoints && !this.achievements['100score'].earned) {
            console.log('✅ Condition met: 100score');
            achievementsToUnlock.push('100score');
        }
        if (score === 0 && !this.achievements['0score'].earned) {
            console.log('✅ Condition met: 0score');
            achievementsToUnlock.push('0score');
        }
        
        // 4. Достижения за время
        if (timeSeconds <= 30 && !this.achievements['30second'].earned) {
            console.log('✅ Condition met: 30second');
            achievementsToUnlock.push('30second');
        }
        
        console.log('🏆 Achievements to unlock:', achievementsToUnlock);
        
        // Разблокируем достижения
        achievementsToUnlock.forEach((achievementId, index) => {
            setTimeout(() => {
                this.unlockAchievement(achievementId);
            }, index * 1000); // Задержка 1 секунда между ачивками
        });
        
        this.saveAchievements();
        
        // Проверяем достижения лидерборда после сохранения результата
        setTimeout(async () => {
            await this.checkLeaderboardAchievements(region, player);
        }, 2000);
    }

    async checkLeaderboardAchievements(region, playerName) {
        console.log('🏆 Checking leaderboard achievements for:', playerName, 'in', region);
        
        try {
            const leaders = await getLeadersForRegion(region);
            console.log('📊 Leaders data:', leaders);
            
            if (!leaders || leaders.length === 0) return;
            
            const playerPosition = leaders.findIndex(leader => leader.name === playerName) + 1;
            console.log('📈 Player position:', playerPosition);
            
            if (playerPosition > 0) {
                if (playerPosition === 1 && !this.achievements['1place'].earned) {
                    console.log('✅ Condition met: 1place');
                    this.unlockAchievement('1place');
                }
                if (playerPosition === 2 && !this.achievements['2place'].earned) {
                    console.log('✅ Condition met: 2place');
                    this.unlockAchievement('2place');
                }
                if (playerPosition === 3 && !this.achievements['3place'].earned) {
                    console.log('✅ Condition met: 3place');
                    this.unlockAchievement('3place');
                }
                if (playerPosition >= 1 && playerPosition <= 3 && !this.achievements['1_3place'].earned) {
                    console.log('✅ Condition met: 1_3place');
                    this.unlockAchievement('1_3place');
                }
            }
        } catch (error) {
            console.error('❌ Error checking leaderboard achievements:', error);
        }
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
        
        console.log('🔄 All achievements reset');
    }
}

// Инициализация системы достижений
let achievementSystem;

document.addEventListener('DOMContentLoaded', function() {
    achievementSystem = new AchievementSystem();
});
