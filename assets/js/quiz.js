function goToQuiz() {
    window.location.href = 'quiz.html';
}

async function updateDetailedStats() {
    const results = getQuizResults();
    
    if (results) {
        // ПРИНУДИТЕЛЬНО СТАВИМ 100% ЕСЛИ score=100
        let percentage = results.score === 100 ? 100 : Math.round((results.score / results.totalQuestions) * 100);
        
        updateStatElement('quiz-score', `${percentage}%`);
        updateProgressBar('quiz-progress-bar', percentage);
        updateStatElement('quiz-time', `${results.timeSeconds} сек`);
        
        // Прогресс для времени
        const timePercentage = Math.max(0, Math.min(100, 100 - (results.timeSeconds / 300) * 100));
        updateProgressBar('time-progress-bar', timePercentage);
        
        // Рейтинг
        if (results.playerName && results.region) {
            updateStatElement('quiz-rank', 'Загрузка...');
            const rank = await getPlayerRank(results.playerName, results.region);
            updateStatElement('quiz-rank', rank);
        } else {
            updateStatElement('quiz-rank', '—');
        }
        
    } else {
        updateStatElement('quiz-score', '0%');
        updateStatElement('quiz-time', '0 сек');
        updateStatElement('quiz-rank', '—');
    }
}

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

        if (leaders) {
            for (let i = 0; i < leaders.length; i++) {
                if (leaders[i].name === playerName) return i + 1;
            }
        }
        
        return '—';
    } catch (error) {
        return '—';
    }
}

function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

function updateProgressBar(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) progressBar.style.width = `${percentage}%`;
}

function getQuizResults() {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : null;
}

document.addEventListener('DOMContentLoaded', function() {
    updateDetailedStats();
});
