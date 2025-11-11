// Функции для работы с картой
class MapManager {
    constructor() {
        this.areas = document.querySelectorAll('.map-area');
        this.mapBody = document.querySelector('.map_body');
        this.init();
    }

    init() {
        this.setAreaNames();
        this.addEventListeners();
        this.loadBaseMap();
        this.setupResponsiveBehavior();
    }

    setupResponsiveBehavior() {
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Инициализация при загрузке
        this.handleResize();
    }

    handleResize() {
        const width = window.innerWidth;
        
        // Добавляем/убираем классы в зависимости от размера экрана
        if (width <= 480) {
            this.mapBody.classList.add('mobile-small');
            this.mapBody.classList.remove('mobile', 'tablet', 'desktop');
        } else if (width <= 768) {
            this.mapBody.classList.add('mobile');
            this.mapBody.classList.remove('mobile-small', 'tablet', 'desktop');
        } else if (width <= 1024) {
            this.mapBody.classList.add('tablet');
            this.mapBody.classList.remove('mobile-small', 'mobile', 'desktop');
        } else {
            this.mapBody.classList.add('desktop');
            this.mapBody.classList.remove('mobile-small', 'mobile', 'tablet');
        }

        // Оптимизация для touch-устройств
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.remove('touch-device');
        }
    }

    blurBackground() {
        this.mapBody.classList.add('blurred');
    }

    unblurBackground() {
        this.mapBody.classList.remove('blurred');
    }
}
