// Исправленная функция для обновления статистики
// ИСПРАВЛЕННАЯ функция для обновления статистики
// ИСПРАВЛЕННАЯ функция для обновления статистики
async function updateDetailedStats() {
    const results = getQuizResults();
    console.log('📊 Current results for stats:', results);
    
    if (results) {
        // Исправляем расчет процента
        let percentage;
        if (results.percentage) {
            percentage = results.percentage; // Используем сохраненный процент
        } else {
            // Запасной вариант расчета
            percentage = Math.round((results.score / results.totalQuestions) * 10); // score=100, questions=100 → 10%
        }
        
        console.log('📈 Percentage calculated:', percentage);
        
        updateStatElement('quiz-score', `${percentage}%`);
        updateProgressBar('quiz-progress-bar', percentage);
        updateStatElement('quiz-time', `${results.timeSeconds} сек`);
        
        // Прогресс для времени
        const maxReasonableTime = 300;
        const timePercentage = Math.max(0, Math.min(100, 100 - (results.timeSeconds / maxReasonableTime) * 100));
        updateProgressBar('time-progress-bar', timePercentage);
        
        // Получаем и отображаем рейтинг
        if (results.playerName && results.region) {
            console.log('🔍 Searching for player:', results.playerName, 'in region:', results.region);
            updateStatElement('quiz-rank', 'Загрузка...');
            
            const rank = await getPlayerRank(results.playerName, results.region);
            console.log('🏆 Rank found:', rank);
            
            updateStatElement('quiz-rank', rank);
            
            // Обновляем прогресс-бар рейтинга
            let rankProgress = 0;
            if (rank !== '—' && typeof rank === 'number') {
                rankProgress = rank === 1 ? 100 : rank === 2 ? 80 : rank === 3 ? 60 : 
                             rank <= 5 ? 40 : rank <= 10 ? 20 : 10;
            }
            updateProgressBar('rank-progress-bar', rankProgress);
        } else {
            console.log('❌ No player name or region found');
            updateStatElement('quiz-rank', '—');
            updateProgressBar('rank-progress-bar', 0);
        }
        
    } else {
        console.log('❌ No quiz results found');
        // Сбрасываем значения по умолчанию
        updateStatElement('quiz-score', '0%');
        updateStatElement('quiz-time', '0 сек');
        updateStatElement('quiz-rank', '—');
        updateProgressBar('quiz-progress-bar', 0);
        updateProgressBar('time-progress-bar', 0);
        updateProgressBar('rank-progress-bar', 0);
    }
}

// Функция для получения реального рейтинга игрока
async function getPlayerRank(region, score, timeSeconds) {
    try {
        // Используем тот же Supabase клиент, что и в quiz.html
        const SUPABASE_URL = 'https://xlrmxinwpwjjurltvoms.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm14aW53cHdqanVybHR2b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODY3NjYsImV4cCI6MjA3ODM2Mjc2Nn0.1dUPUXBfmN3cMTkAQVHWgXdhU74hJ6U96v1M_OSoZyI';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Получаем всех игроков для этого региона
        const { data: leaders, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('region', region)
            .order('score', { ascending: false })
            .order('time_seconds', { ascending: true });

        if (error) throw error;

        if (leaders && leaders.length > 0) {
            // Находим позицию текущего игрока
            for (let i = 0; i < leaders.length; i++) {
                if (leaders[i].score === score && leaders[i].time_seconds === timeSeconds) {
                    return i + 1; // Возвращаем позицию (начинается с 1)
                }
            }
        }
        
        return '—'; // Если не нашли в рейтинге
    } catch (error) {
        console.error('Error getting player rank:', error);
        return '—';
    }
}

// Вспомогательные функции (оставляем без изменений)
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

// Функция для получения результатов квиза из localStorage
function getQuizResults() {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : null;
}

function debugQuizResults() {
    const results = localStorage.getItem('quizResults');
    console.log('Raw localStorage results:', results);
    if (results) {
        const parsed = JSON.parse(results);
        console.log('Parsed results:', parsed);
        console.log('Score:', parsed.score, 'Total:', parsed.totalQuestions);
        console.log('Calculated percentage:', Math.round((parsed.score / parsed.totalQuestions) * 100));
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
    sessionStorage.setItem('quizResultsUpdated', 'true');
}

// Обновляем статистику при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateDetailedStats();
    
    // Слушаем изменения в storage
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

debugQuizResults();
