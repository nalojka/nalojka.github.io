/***** Supabase config *****/
const SUPABASE_URL = 'https://xlrmxinwpwjjurltvoms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm14aW53cHdqanVybHR2b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODY3NjYsImV4cCI6MjA3ODM2Mjc2Nn0.1dUPUXBfmN3cMTkAQVHWgXdhU74hJ6U96v1M_OSoZyI';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/***** Achievement System *****/
let achievementSystem;

// Инициализация системы достижений после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    achievementSystem = new AchievementSystem();
});

/***** Переменные состояния *****/
const POINTS = 10;
const AUTO_NEXT_DELAY = 1500; // ms (1.5 s)
let selectedRegion = null;
let player = "";
let current = 0, score = 0;
let startTime = 0, endTime = 0;
let autoNextTimer = null;
let autoNextInterval = null;
let currentSessionQuestions = []; // Вопросы для текущей сессии квиза

/* Elements */
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const leadersScreen = document.getElementById('leaders-screen');

const areasGrid = document.getElementById('areasGrid');
const startBtn = document.getElementById('start-btn');
const viewLeadersBtn = document.getElementById('view-leaders');
const viewLeadersBtn2 = document.getElementById('view-leaders-2');
const playAgainBtn = document.getElementById('play-again');
const backHomeBtn = document.getElementById('back-home');
const refreshLeadersBtn = document.getElementById('refresh-leaders');

const progressText = document.getElementById('progress-text');
const regionLabel = document.getElementById('region-label');
const qText = document.getElementById('question-text');
const optionsBox = document.getElementById('options');
const explanationContainer = document.getElementById('explanation-container');
const autoNextProgress = document.getElementById('auto-next-progress');

const finalScoreEl = document.getElementById('final-score');
const timeResultEl = document.getElementById('time-result');
const resultTextEl = document.getElementById('result-text');
const savingTextEl = document.getElementById('saving-text');
const leadersBody = document.getElementById('leaders-body');
const leadersRegionName = document.getElementById('leaders-region-name');

/***** Функ
