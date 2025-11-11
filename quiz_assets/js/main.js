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

/***** Функции для перемешивания *****/
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function prepareQuestionsForSession(originalQuestions) {
  const questionsCopy = JSON.parse(JSON.stringify(originalQuestions));
  const shuffledQuestions = shuffleArray(questionsCopy);
  
  const processedQuestions = shuffledQuestions.map(question => {
    const correctAnswer = question.options[question.answer];
    const shuffledOptions = shuffleArray([...question.options]);
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswer);
    
    return {
      q: question.q,
      options: shuffledOptions,
      answer: newAnswerIndex,
      explanation: question.explanation
    };
  });
  
  return processedQuestions;
}

/***** Инициализация списка областей в стартовом экране *****/
const regions = Object.keys(ORIGINAL_QUESTIONS_BY_REGION);

function buildAreasGrid(){
  areasGrid.innerHTML = "";
  regions.forEach((r, idx) => {
    const d = document.createElement('div');
    d.className = 'area-card';
    d.dataset.region = r;
    d.innerHTML = `<strong style="display:block;margin-bottom:6px;">${r}</strong><small style="opacity:.7">Вопросов: ${ORIGINAL_QUESTIONS_BY_REGION[r].length}</small>`;
    d.onclick = () => {
      document.querySelectorAll('.area-card').forEach(el => el.classList.remove('active'));
      d.classList.add('active');
      selectedRegion = r;
      regionLabel.textContent = r;
      document.getElementById('page-title').textContent = `Квиз: ${r}`;
    };
    areasGrid.appendChild(d);
  });
}
buildAreasGrid();

/***** Theme toggle с Font  и motion blur *****/
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'light';

if(savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
} else {
  themeIcon.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.onclick = () => {
  themeToggle.classList.add('rotating');
  setTimeout(() => {
    const isDark = document.body.classList.toggle('dark');
    if(isDark) {
      themeIcon.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      themeIcon.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setTimeout(() => {
      themeToggle.classList.remove('rotating');
    }, 100);
  }, 400);
};

/***** Quiz flow *****/
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

startBtn.onclick = () => {
  player = document.getElementById('player').value.trim();
  if(!player) return alert('Введите имя!');
  if(!selectedRegion) return alert('Выберите область, для которой пройдёте квиз.');
  
  const originalQuestions = ORIGINAL_QUESTIONS_BY_REGION[selectedRegion];
  currentSessionQuestions = prepareQuestionsForSession(originalQuestions);
  
  current = 0; score = 0; startTime = Date.now();
  hide(startScreen); hide(resultScreen); hide(leadersScreen);
  show(quizScreen);
  renderQuestion();
};

function renderQuestion(){
  const q = currentSessionQuestions[current];
  qText.textContent = q.q;
  progressText.textContent = `Вопрос ${current+1} из ${currentSessionQuestions.length}`;
  regionLabel.textContent = selectedRegion;
  optionsBox.innerHTML = '';
  explanationContainer.innerHTML = '';
  
  q.options.forEach((opt, i) => {
    const el = document.createElement('div');
    el.className = 'option';
    el.textContent = opt;
    el.tabIndex = 0;
    el.onclick = ()=> selectAnswer(i, el);
    el.onkeydown = (e) => { if(e.key === 'Enter') selectAnswer(i, el); };
    optionsBox.appendChild(el);
  });

  resetAutoNext();
}

function selectAnswer(idx, elClicked){
  if(autoNextTimer) return;
  const q = currentSessionQuestions[current];

  // Показываем пояснение при неправильном ответе
  if(idx !== q.answer) {
    explanationContainer.innerHTML = `<div class="explanation"><strong>Пояснение:</strong> ${q.explanation}</div>`;
  } else {
    explanationContainer.innerHTML = '';
  }

  // Подсветка
  Array.from(optionsBox.children).forEach((optEl, i) => {
    if(i === q.answer) optEl.classList.add('correct');
    if(i === idx && idx !== q.answer) optEl.classList.add('wrong');
  });

  if(idx === q.answer) score += POINTS;

  startAutoNext();
}

document.getElementById('skip-btn').onclick = () => {
  if(autoNextTimer) return;
  startAutoNext(true);
};

document.getElementById('end-btn').onclick = () => {
  finishQuiz();
};

function startAutoNext(forceSkip=false){
  let progress = 0;
  const steps = 1500 / 30;
  autoNextTimer = true;
  autoNextProgress.style.width = '0%';
  autoNextInterval = setInterval(()=>{
    progress += 100/steps;
    autoNextProgress.style.width = progress + '%';
    if(progress >= 100){
      clearInterval(autoNextInterval);
      autoNextInterval = null;
      autoNextTimer = null;
      autoNextProgress.style.width = '0%';
      nextOrFinish();
    }
  }, 30);
}

function resetAutoNext(){
  if(autoNextInterval){ clearInterval(autoNextInterval); autoNextInterval = null; autoNextTimer = null; }
  autoNextProgress.style.width = '0%';
}

function nextOrFinish(){
  if(current < currentSessionQuestions.length - 1){
    current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz(){
  endTime = Date.now();
  const timeSpent = Math.floor((endTime - startTime) / 1000);

  hide(quizScreen);
  show(resultScreen);

  const totalPoints = currentSessionQuestions.length * POINTS;
  finalScoreEl.textContent = `${score} / ${totalPoints}`;
  timeResultEl.textContent = `Время: ${timeSpent} сек`;

  const pct = Math.round((score / totalPoints) * 100);
  if(pct >= 80) resultTextEl.textContent = "Отлично! 🎉";
  else if(pct >= 60) resultTextEl.textContent = "Хорошо! 👍";
  else resultTextEl.textContent = "Можно лучше! 💪";

  savingTextEl.textContent = "Сохраняем результат...";
  
  // Вызов системы достижений
  if (achievementSystem) {
      achievementSystem.onQuizComplete(score);
  }
  
  autoSaveScore(timeSpent);
}

playAgainBtn.onclick = () => {
  hide(resultScreen); hide(leadersScreen); show(startScreen);
  document.querySelectorAll('.area-card').forEach(el => el.classList.remove('active'));
  selectedRegion = null;
  regionLabel.textContent = '';
  document.getElementById('page-title').textContent = 'Квиз по областям';
  currentSessionQuestions = [];
};

/***** Supabase: сохранение с проверкой лучшего результата *****/
async function autoSaveScore(timeSeconds){
  try{
    // Сначала проверяем существующие результаты для этого игрока и региона
    const { data: existingResults, error: checkError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('name', player)
      .eq('region', selectedRegion);

    if(checkError) throw checkError;

    let shouldSave = true;
    
    // Если есть предыдущие результаты, проверяем, нужно ли сохранять новый
    if(existingResults && existingResults.length > 0) {
      const bestResult = existingResults.reduce((best, current) => {
        // Сравниваем сначала по очкам, затем по времени
        if(current.score > best.score) return current;
        if(current.score === best.score && current.time_seconds < best.time_seconds) return current;
        return best;
      });

      // Если текущий результат хуже лучшего, не сохраняем
      if(score < bestResult.score || (score === bestResult.score && timeSeconds >= bestResult.time_seconds)) {
        shouldSave = false;
        savingTextEl.textContent = "Ваш результат не улучшил предыдущее достижение";
      }
    }

    // Сохраняем только если результат лучше или это первый результат
    if(shouldSave) {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([
          {
            name: player,
            score: score,
            total_questions: currentSessionQuestions.length,
            time_seconds: timeSeconds,
            region: selectedRegion,
            created_at: new Date().toISOString()
          }
        ]);
      if(error) throw error;
      savingTextEl.textContent = "✅ Результат сохранен в лидерборд!";
    }

  }catch(err){
    console.error('Save error', err);
    savingTextEl.textContent = "❌ Ошибка сохранения";
  }
}

/***** Получение лидеров с уникальными именами *****/
async function getLeadersForRegion(region){
  try{
    // Получаем все результаты для региона
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('region', region)
      .order('score', { ascending: false })
      .order('time_seconds', { ascending: true });

    if(error) throw error;

    // Группируем по имени и выбираем лучший результат для каждого игрока
    const uniquePlayers = new Map();
    
    data.forEach(row => {
      const existing = uniquePlayers.get(row.name);
      if(!existing) {
        uniquePlayers.set(row.name, row);
      } else {
        // Сравниваем результаты: сначала по очкам, затем по времени
        if(row.score > existing.score || 
           (row.score === existing.score && row.time_seconds < existing.time_seconds)) {
          uniquePlayers.set(row.name, row);
        }
      }
    });

    // Преобразуем обратно в массив и сортируем
    return Array.from(uniquePlayers.values())
      .sort((a, b) => {
        if(b.score !== a.score) return b.score - a.score;
        return a.time_seconds - b.time_seconds;
      })
      .slice(0, 20); // Ограничиваем 20 лучшими

  }catch(err){
    console.error('Load leaders error', err);
    return [];
  }
}

async function showLeaders(){
  if(!selectedRegion){
    alert('Сначала выберите область на стартовом экране, чтобы посмотреть лидеров конкретной области.');
    return;
  }
  hide(startScreen); hide(quizScreen); hide(resultScreen);
  show(leadersScreen);
  leadersRegionName.textContent = selectedRegion;
  leadersBody.innerHTML = '<tr><td colspan="4">Загрузка...</td></tr>';
  const arr = await getLeadersForRegion(selectedRegion);
  if(!arr.length){
    leadersBody.innerHTML = '<tr><td colspan="4">Нет данных</td></tr>';
    return;
  }
  leadersBody.innerHTML = '';
  arr.forEach((row, i) => {
    const tr = document.createElement('tr');
    const pos = i+1;
    tr.innerHTML = `<td>${pos}</td><td>${escapeHtml(row.name)}</td><td>${row.score}</td><td>${row.time_seconds} сек</td>`;
    leadersBody.appendChild(tr);
  });
}

viewLeadersBtn.onclick = showLeaders;
viewLeadersBtn2.onclick = showLeaders;
backHomeBtn.onclick = () => { hide(leadersScreen); show(startScreen); };
refreshLeadersBtn.onclick = showLeaders;

/***** Utilities *****/
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

/***** Keyboard shortcuts accessibility *****/
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    hide(quizScreen); hide(resultScreen); hide(leadersScreen); show(startScreen);
  }
});
