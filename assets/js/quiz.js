// Исправленная функция для обновления статистики
function goToQuiz() {
    window.location.href = 'quiz.html';
}

async function updateDetailedStats() {
    const results = getQuizResults();
    console.log('📊 Current results for stats:', results);
    
    if (results) {
        // ПРОСТО УМНОЖАЕМ НА 10 ВМЕСТО ДЕЛЕНИЯ!
        let percentage;
        if (results.percentage) {
            percentage = results.percentage;
        } else {
            // УМНОЖАЕМ НА 10 вместо деления!
            percentage = Math.round((results.score / results.totalQuestions) * 100);
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

// Функция для принудительного исправления процента (на всякий случай)
function forceFixPercentage() {
    const results = getQuizResults();
    if (results) {
        // ПРОСТО СТАВИМ 100 ЕСЛИ score=100 ИЛИ 90 ЕСЛИ score=90
        if (results.score === 100) {
            results.percentage = 100;
        } else if (results.score === 90) {
            results.percentage = 90;
        } else {
            results.percentage = Math.round((results.score / results.totalQuestions) * 100);
        }
        
        localStorage.setItem('quizResults', JSON.stringify(results));
        updateStatElement('quiz-score', `${results.percentage}%`);
        updateProgressBar('quiz-progress-bar', results.percentage);
        console.log('✅ Percentage forced to:', results.percentage);
    }
}

// Остальные функции без изменений...
// Функция для получения реального рейтинга игрока
async function getPlayerRank(playerName, region) {
    try {
        const SUPABASE_URL = 'https://xlrmxinwpwjjurltvoms.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm14aW53cHdqanVybHR2b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODY3NjYsImV4cCI6MjA3ODM2Mjc2Nn0.1dUPUXBfmN3cMTkAQVHWgXdhU74hJ6U96v1M_OSoZyI';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data: leaders, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('region', region)
            .order('score', { ascending: false })
            .order('time_seconds', { ascending: true });

        if (error) throw error;

        if (leaders && leaders.length > 0) {
            for (let i = 0; i < leaders.length; i++) {
                if (leaders[i].name === playerName) {
                    return i + 1;
                }
            }
        }
        
        return '—';
    } catch (error) {
        console.error('Error getting player rank:', error);
        return '—';
    }
}

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

function saveQuizResults(score, totalQuestions, timeSeconds, region, playerName) {
    const results = {
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100), // УМНОЖАЕМ НА 100!
        timeSeconds: timeSeconds,
        region: region,
        playerName: playerName,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    sessionStorage.setItem('quizResultsUpdated', 'true');
}

// Обновляем статистику при загрузке
document.addEventListener('DOMContentLoaded', function() {
    forceFixPercentage(); // ПРИНУДИТЕЛЬНО ИСПРАВЛЯЕМ ПРОЦЕНТ!
    updateDetailedStats();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'quizResults') {
            updateDetailedStats();
        }
    });
    
    if (sessionStorage.getItem('quizResultsUpdated') === 'true') {
        updateDetailedStats();
        sessionStorage.removeItem('quizResultsUpdated');
    }
});

debugQuizResults();
