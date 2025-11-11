// Управление темами
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i'); // Получаем иконку внутри кнопки
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Применяем сохранённую тему
        this.applyTheme(this.currentTheme);
        
        // Добавляем обработчик события
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Обновляем иконку
        this.updateIcon();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateIcon();
        this.updateScrollbar();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Добавляем анимацию переключения
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateIcon() {
        if (this.currentTheme === 'dark') {
            // Для тёмной темы - солнце
            this.themeIcon.className = 'fa-solid fa-sun';
            this.themeIcon.title = 'Переключить на светлую тему';
        } else {
            // Для светлой темы - луна
            this.themeIcon.className = 'fa-solid fa-moon';
            this.themeIcon.title = 'Переключить на тёмную тему';
        }
    }
    
    updateScrollbar() {
        // Обновляем стили скроллбара для тёмной темы
        const style = document.createElement('style');
        style.id = 'scrollbar-style';
        
        if (this.currentTheme === 'dark') {
            style.textContent = `
                ::-webkit-scrollbar-track {
                    background: rgba(30, 41, 59, 0.8);
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, var(--accent-color), #3b82f6);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #60a5fa, #3b82f6);
                }
            `;
        } else {
            style.textContent = `
                ::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.8);
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, var(--accent-color), #60a5fa);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                }
            `;
        }
        
        // Удаляем старый стиль и добавляем новый
        const oldStyle = document.getElementById('scrollbar-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
