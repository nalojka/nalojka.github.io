// Инициализация приложения
let mapManager;
let popupManager;

document.addEventListener('DOMContentLoaded', function() {
    mapManager = new MapManager();
    popupManager = new PopupManager();
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Обработка формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Закрытие popup по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popupManager.hidePopup();
        }
    });
});

// Функция для прокрутки к секции
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// Обработка формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Здесь можно добавить отправку формы
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Данные формы:', data);
    
    // Показываем сообщение об успехе
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    e.target.reset();
}

// Анимация счетчиков статистики
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Скорость анимации

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target;
            counter.classList.add('animated');
        }
    });
}

// Запуск анимации при скролле
function initCounterAnimation() {
    const statsSection = document.querySelector('.statistics');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(statsSection);
}