// === СИСТЕМА ДОСТИЖЕНИЙ ===
class AchievementSystem {
    constructor() {
        console.log('✅ AchievementSystem constructor called!');
        this.achievements = {
            'quiz1': { image: 'quiz_assets/img/quiz1.png', earned: false },
            'quiz3': { image: 'quiz_assets/img/quiz3.png', earned: false },
            'quiz5': { image: 'quiz_assets/img/quiz5.png', earned: false },
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
            '1minute': { image: 'quiz_assets/img/1minute.png', earned: false },
            '30second': { image: 'quiz_assets/img/30second.png', earned: false }
        };
        
        this.quizCount = 0;
        this.completedRegions = new Set();
        this.achievementQueue = [];
        this.isShowingAchievement = false;
    }

    async init() {
        console.log('✅ AchievementSystem init called!');
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
                max-height: calc(100vh - 40px);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
            console.log('✅ Achievements container created!');
            
            this.addResponsiveStyles();
        }
    }

    addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #achievements-container {
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
            }
            
            .achievement {
                width: 80px;
                height: 80px;
                transform: translateX(-100px);
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                text-align: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            /* Адаптивность */
            @media (max-width: 768px) {
                .achievement {
                    width: 60px;
                    height: 60px;
                    font-size: 10px;
                }
                
                #achievements-container {
                    left: 10px;
                    top: 10px;
                    gap: 8px;
                }
            }
            
            @media (max-width: 480px) {
                .achievement {
                    width: 50px;
                    height: 50px;
                    font-size: 8px;
                }
                
                #achievements-container {
                    left: 5px;
                    top: 5px;
                    gap: 5px;
                }
            }
            
            @media (min-width: 1200px) {
                .achievement {
                    width: 90px;
                    height: 90px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
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
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.style.backgroundImage = `url('${achievement.image}')`;
        
        container.appendChild(achievementElement);

        // Автопрокрутка к новому достижению
        container.scrollTop = container.scrollHeight;

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
        
        // Достижения за места в лидерборде
        const leaderboardAchievements = await this.checkLeaderboardAchievements(region, playerName);
        achievementsToUnlock.push(...leaderboardAchievements);
        
        console.log('🏆 Achievements to unlock:', achievementsToUnlock);
        
        // Разблокируем достижения с задержкой
        achievementsToUnlock.forEach((achievementId, index) => {
            setTimeout(() => {
                this.unlockAchievement(achievementId);
            }, index * 3500);
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
        localStorage.removeItem('quiz_achievements');
        
        const container = document.getElementById('achievements-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}
