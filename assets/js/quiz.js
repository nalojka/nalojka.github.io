// Функция для перехода на страницу quiz
function goToQuiz() {
    window.location.href = 'quiz.html';
}

// Функция для получения результатов квиза из localStorage
function getQuizResults() {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : null;
}

// Функция для обновления статистики на главной странице
function updateMainPageStats() {
    const results = getQuizResults();
    
    if (!results) {
        // Если результатов нет, оставляем значения по умолчанию
        return;
    }

    // Обновляем прогресс квиза
    const quizProgress = document.querySelector('.progress-item:nth-child(1) .progress-value');
    const quizProgressBar = document.querySelector('.progress-item:nth-child(1) .progress-fill');
    
    if (quizProgress && quizProgressBar) {
        const percentage = Math.round((results.score / (results.totalQuestions * 10)) * 100);
        quizProgress.textContent = `${percentage}%`;
        quizProgressBar.style.width = `${percentage}%`;
    }

    // Обновляем место в рейтинге (здесь нужно будет доработать после реализации полноценного рейтинга)
    const rankProgress = document.querySelector('.progress-item:nth-child(2) .progress-value');
    const rankProgressBar = document.querySelector('.progress-item:nth-child(2) .progress-fill');
    
    if (rankProgress && rankProgressBar) {
        // Временное решение - можно установить фиксированное значение или рассчитать на основе результатов
        rankProgress.textContent = '—';
        rankProgressBar.style.width = '0%';
    }

    // Обновляем время прохождения
    const timeProgress = document.querySelector('.progress-item:nth-child(3) .progress-value');
    const timeProgressBar = document.querySelector('.progress-item:nth-child(3) .progress-fill');
    
    if (timeProgress && timeProgressBar) {
        timeProgress.textContent = `${results.timeSeconds} сек`;
        const timePercentage = Math.min(100, Math.round((results.timeSeconds / 300) * 100)); // Предполагаем макс время 5 минут
        timeProgressBar.style.width = `${100 - timePercentage}%`; // Меньше время = лучше
    }
}

// Функция для сохранения результатов квиза
function saveQuizResults(score, totalQuestions, timeSeconds, region) {
    const results = {
        score: score,
        totalQuestions: totalQuestions,
        timeSeconds: timeSeconds,
        region: region,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Также сохраняем в sessionStorage для немедленного обновления при возврате
    sessionStorage.setItem('quizResultsUpdated', 'true');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateMainPageStats();
    
    // Если вернулись с обновленными результатами квиза
    if (sessionStorage.getItem('quizResultsUpdated') === 'true') {
        updateMainPageStats();
        sessionStorage.removeItem('quizResultsUpdated');
    }
});

// Расширенная функция для обновления статистики
function updateDetailedStats() {
    const results = getQuizResults();
    const quizButton = document.querySelector('.cta-button[onclick="goToQuiz()"]');
    const quizButtonText = document.getElementById('quiz-button-text');
    
    if (results) {
        // Пользователь прошел квиз
        if (quizButtonText) {
            quizButtonText.textContent = 'Пройти Quiz снова';
        }
        
        // Обновляем элементы статистики
        updateStatElement('quiz-score', `${Math.round((results.score / (results.totalQuestions * 10)) * 100)}%`);
        updateStatElement('quiz-time', `${results.timeSeconds} сек`);
        updateStatElement('quiz-rank', '—'); // Можно доработать для реального рейтинга
        
        // Обновляем прогресс-бары
        updateProgressBar('quiz-progress-bar', Math.round((results.score / (results.totalQuestions * 10)) * 100));
        updateProgressBar('time-progress-bar', Math.min(100, Math.round((300 - results.timeSeconds) / 3))); // Инверсная шкала для времени
        updateProgressBar('rank-progress-bar', 0); // Заглушка для рейтинга
        
    } else {
        // Пользователь не проходил квиз
        if (quizButtonText) {
            quizButtonText.textContent = 'Пройти Quiz';
        }
        
        // Сбрасываем значения по умолчанию
        updateStatElement('quiz-score', '0%');
        updateStatElement('quiz-time', '0 сек');
        updateStatElement('quiz-rank', '—');
        
        updateProgressBar('quiz-progress-bar', 0);
        updateProgressBar('time-progress-bar', 0);
        updateProgressBar('rank-progress-bar', 0);
    }
}

// Вспомогательные функции
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateProgressBar(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Обновляем статистику при загрузке и при возвращении на страницу
document.addEventListener('DOMContentLoaded', function() {
    updateDetailedStats();
    
    // Слушаем изменения в storage для обновления в реальном времени
    window.addEventListener('storage', function(e) {
        if (e.key === 'quizResults') {
            updateDetailedStats();
        }
    });
    
    // Проверяем, не вернулись ли мы с обновленными результатами
    if (sessionStorage.getItem('quizResultsUpdated') === 'true') {
        updateDetailedStats();
        sessionStorage.removeItem('quizResultsUpdated');
    }
});
