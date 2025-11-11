// quiz_assets/js/achievement.js
class AchievementSystem {
    constructor() {
        console.log('AchievementSystem loaded!'); // Добавьте для отладки
        this.achievements = {
            'quiz1': { image: 'quiz1.png', earned: false },
            'quiz3': { image: 'quiz3.png', earned: false },
            'quiz5': { image: 'quiz5.png', earned: false },
            'dnr': { image: 'dnr.png', earned: false },
            'lnr': { image: 'lnr.png', earned: false },
            'zaporoj': { image: 'zaporoj.png', earned: false },
            'herson': { image: 'herson.png', earned: false },
            'krim': { image: 'krim.png', earned: false },
            '100score': { image: '100score.png', earned: false },
            '0score': { image: '0score.png', earned: false },
            '1place': { image: '1place.png', earned: false },
            '1_3place': { image: '1_3place.png', earned: false },
            '1minute': { image: '1minute.png', earned: false },
            '30second': { image: '30second.png', earned: false }
        };
        
        this.quizCount = 0;
        this.completedRegions = new Set();
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        this.init();
    }

    async init() {
        console.log('Initializing achievements...');
        await this.loadAchievements();
        this.setupAchievementsContainer();
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
            `;
            document.body.appendChild(container);
            console.log('Achievements container created');
        }
    }

    unlockAchievement(achievementId) {
        if (!this.achievements[achievementId] || this.achievements[achievementId].earned) {
            return false;
        }

        console.log('Unlocking achievement:', achievementId);
        this.achievements[achievementId].earned = true;
        this.addToQueue(achievementId);
        this.saveAchievements();
        return true;
    }

    addToQueue(achievementId) {
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
        this.isShowingAchievement = true;
        const achievement = this.achievements[achievementId];
        const container = document.getElementById('achievements-container');
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.style.cssText = `
            width: 80px;
            height: 80px;
            background-image: url('quiz_assets/img/${achievement.image}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            transform: translateX(-100px);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            margin-bottom: 10px;
        `;

        container.appendChild(achievementElement);

        requestAnimationFrame(() => {
            achievementElement.style.transform = 'translateX(0)';
            achievementElement.style.opacity = '1';
        });

        setTimeout(() => {
            achievementElement.style.transform = 'translateX(-100px)';
            achievementElement.style.opacity = '0';
            
            setTimeout(() => {
                if (achievementElement.parentNode) {
                    achievementElement.parentNode.removeChild(achievementElement);
                }
                this.isShowingAchievement = false;
                this.processQueue();
            }, 500);
        }, 3000);
    }

    async onQuizComplete(score, timeSeconds, region, playerName) {
        console.log('Quiz completed:', { score, timeSeconds, region, playerName });
        
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
        const totalPoints = 100; // Максимальный балл
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
        
        console.log('Achievements to unlock:', achievementsToUnlock);
        
        // Разблокируем достижения
        achievementsToUnlock.forEach((achievementId, index) => {
            setTimeout(() => {
                this.unlockAchievement(achievementId);
            }, index * 3500);
        });
        
        this.saveAchievements();
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
        localStorage.removeItem('quiz_achievements');
        
        const container = document.getElementById('achievements-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}
