// Система достижений для квиза (только изображения) с очередью
class AchievementSystem {
    constructor() {
        this.achievements = {
            'welcome': { image: 'welcome.png', earned: false },
            'quiz1': { image: 'quiz1.png', earned: false },
            'quiz3': { image: 'quiz3.png', earned: false },
            'quiz5': { image: 'quiz5.png', earned: false },
            'quiz7': { image: 'quiz7.png', earned: false },
            'quiz10': { image: 'quiz10.png', earned: false },
            'zero': { image: 'zero.png', earned: false }
        };
        this.quizCount = 0;
        this.achievementQueue = []; // Очередь достижений
        this.isShowingAchievement = false; // Флаг показа достижения
        this.init();
    }

    async init() {
        await this.loadAchievements();
        this.setupAchievementsContainer();
        
        // Автоматически выдаем достижение при первом заходе
        if (!this.achievements.welcome.earned) {
            setTimeout(() => {
                this.unlockAchievement('welcome');
            }, 1500);
        }
    }

    // Загрузка достижений из localStorage
    async loadAchievements() {
        try {
            const saved = localStorage.getItem('quiz_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = { ...this.achievements, ...data.achievements };
                this.quizCount = data.quizCount || 0;
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    // Сохранение достижений в localStorage
    saveAchievements() {
        const data = {
            achievements: this.achievements,
            quizCount: this.quizCount
        };
        localStorage.setItem('quiz_achievements', JSON.stringify(data));
    }

    // Создание контейнера для достижений
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
        }
    }

    // Разблокировка достижения
    unlockAchievement(achievementId) {
        if (!this.achievements[achievementId] || this.achievements[achievementId].earned) {
            return false;
        }

        this.achievements[achievementId].earned = true;
        this.addToQueue(achievementId);
        this.saveAchievements();
        return true;
    }

    // Добавление достижения в очередь
    addToQueue(achievementId) {
        this.achievementQueue.push(achievementId);
        this.processQueue();
    }

    // Обработка очереди достижений
    processQueue() {
        if (this.isShowingAchievement || this.achievementQueue.length === 0) {
            return;
        }

        const achievementId = this.achievementQueue.shift();
        this.showAchievement(achievementId);
    }

    // Показ анимации достижения
    showAchievement(achievementId) {
        this.isShowingAchievement = true;
        const achievement = this.achievements[achievementId];
        const container = document.getElementById('achievements-container');
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.style.cssText = `
            width: 80px;
            height: 80px;
            background-image: url('assets/quiz/images/${achievement.image}');
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

        // Анимация появления
        requestAnimationFrame(() => {
            achievementElement.style.transform = 'translateX(0)';
            achievementElement.style.opacity = '1';
        });

        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            achievementElement.style.transform = 'translateX(-100px)';
            achievementElement.style.opacity = '0';
            
            setTimeout(() => {
                if (achievementElement.parentNode) {
                    achievementElement.parentNode.removeChild(achievementElement);
                }
                this.isShowingAchievement = false;
                this.processQueue(); // Показываем следующее достижение
            }, 500);
        }, 3000);
    }

    // Метод для вызова при завершении квиза
    onQuizComplete(score) {
        this.quizCount++;
        
        const achievementsToUnlock = [];
        
        // Проверяем достижения по количеству пройденных квизов
        if (this.quizCount >= 1 && !this.achievements.quiz1.earned) {
            achievementsToUnlock.push('quiz1');
        }
        if (this.quizCount >= 3 && !this.achievements.quiz3.earned) {
            achievementsToUnlock.push('quiz3');
        }
        if (this.quizCount >= 5 && !this.achievements.quiz5.earned) {
            achievementsToUnlock.push('quiz5');
        }
        if (this.quizCount >= 7 && !this.achievements.quiz7.earned) {
            achievementsToUnlock.push('quiz7');
        }
        if (this.quizCount >= 10 && !this.achievements.quiz10.earned) {
            achievementsToUnlock.push('quiz10');
        }
        
        // Проверяем достижение за 0 баллов
        if (score === 0 && !this.achievements.zero.earned) {
            achievementsToUnlock.push('zero');
        }
        
        // Разблокируем все достижения с небольшой задержкой между ними
        achievementsToUnlock.forEach((achievementId, index) => {
            setTimeout(() => {
                this.unlockAchievement(achievementId);
            }, index * 3500); // Задержка 3.5 секунды между достижениями
        });
        
        this.saveAchievements();
    }

    // Получение текущего количества квизов
    getQuizCount() {
        return this.quizCount;
    }

    // Сброс всех достижений (для тестирования)
    resetAchievements() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].earned = false;
        });
        this.quizCount = 0;
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        localStorage.removeItem('quiz_achievements');
        
        // Очищаем контейнер
        const container = document.getElementById('achievements-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}
