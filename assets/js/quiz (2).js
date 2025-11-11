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