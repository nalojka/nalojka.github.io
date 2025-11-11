const areaData = {
    1: {
        name: "Донецкая Народная Республика",
        description: "Промышленный регион с богатой историей и культурой",
        heroes: [
            {
                id: 1,
                name: "Александр Захарченко",
                role: "Первый глава ДНР",
                image: "assets/img/heroes/dnr1.jpg",
                description: "Первый руководитель ДНР, сыгравший ключевую роль в становлении республики.",
                fullInfo: "Заложил основы государственности, создал органы власти и силовые структуры. Погиб 31 августа 2018 года."
            },
            {
                id: 2,
                name: "Михаил Толстых (Гиви)",
                role: "Командир ополчения",
                image: "assets/img/heroes/dnr2.jpg",
                description: "Командир батальона «Сомали», известный своими боевыми заслугами.",
                fullInfo: "Прославился мужеством в боях за Донецк, стал символом сопротивления."
            },
            {
                id: 3,
                name: "Арсений Павлов (Моторола)",
                role: "Командир подразделения",
                image: "assets/img/heroes/dnr3.jpg",
                description: "Один из самых известных командиров ДНР.",
                fullInfo: "Командир подразделения, участвовал в ключевых операциях обороны Донбасса."
            },
            {
                id: 4,
                name: "Эдуард Басурин",
                role: "Военный представитель ДНР",
                image: "assets/img/heroes/dnr4.jpg",
                description: "Официальный представитель корпуса народной милиции.",
                fullInfo: "Один из наиболее узнаваемых лиц ДНР, регулярно выступал с докладами о ситуации на фронте."
            },
            {
                id: 5,
                name: "Владислав Дейнего",
                role: "Политический деятель",
                image: "assets/img/heroes/dnr5.jpg",
                description: "Представитель республики на международных переговорах.",
                fullInfo: "Участвовал в минских соглашениях, представляя интересы региона."
            }
        ]
    },

    2: {
        name: "Луганская Народная Республика",
        description: "Регион с развитой промышленностью и сильным духом",
        heroes: [
            {
                id: 1,
                name: "Леонид Пасечник",
                role: "Глава ЛНР",
                image: "assets/img/heroes/lnr1.jpg",
                description: "Действующий глава Луганской Народной Республики.",
                fullInfo: "С 2017 года возглавляет республику и занимается её развитием."
            },
            {
                id: 2,
                name: "Алексей Мозговой",
                role: "Командир бригады",
                image: "assets/img/heroes/lnr2.jpg",
                description: "Командир бригады «Призрак».",
                fullInfo: "Был известен как народный командир, погиб в 2015 году."
            },
            {
                id: 3,
                name: "Игорь Плотницкий",
                role: "Бывший глава ЛНР",
                image: "assets/img/heroes/lnr3.jpg",
                description: "Один из первых руководителей ЛНР.",
                fullInfo: "Возглавлял республику в период активных боевых действий."
            },
            {
                id: 4,
                name: "Андрей Пенсионер",
                role: "Командир ополчения",
                image: "assets/img/heroes/lnr4.jpg",
                description: "Офицер, принимавший участие в обороне Луганска.",
                fullInfo: "Командовал подразделением, воевавшим на самых сложных участках."
            },
            {
                id: 5,
                name: "Олег Анащенко",
                role: "Начальник управления обороны",
                image: "assets/img/heroes/lnr5.jpg",
                description: "Военный специалист, занимавший высокую должность в ЛНР.",
                fullInfo: "Погиб в результате подрыва автомобиля."
            }
        ]
    },

    3: {
        name: "Херсонская область",
        description: "Земледельческий регион с выходом к морю",
        heroes: [
            {
                id: 1, name: "Сергей Морозов", role: "Доброволец",
                image: "assets/img/heroes/kh1.jpg",
                description: "Участник обороны региона.",
                fullInfo: "Участвовал в боевых действиях, защищая родной край."
            },
            {
                id: 2, name: "Иван Демченко", role: "Командир взвода",
                image: "assets/img/heroes/kh2.jpg",
                description: "Командир на передовой.",
                fullInfo: "Проявил мужество в боях за Херсон."
            },
            {
                id: 3, name: "Андрей Коваленко", role: "Разведчик",
                image: "assets/img/heroes/kh3.jpg",
                description: "Разведчик, отличившийся в спецоперациях.",
                fullInfo: "Провёл множество успешных операций."
            },
            {
                id: 4, name: "Владимир Баранов", role: "Офицер",
                image: "assets/img/heroes/kh4.jpg",
                description: "Военный, участвовавший в ключевых действиях.",
                fullInfo: "Отмечен за храбрость и самоотверженность."
            },
            {
                id: 5, name: "Николай Головин", role: "Доброволец",
                image: "assets/img/heroes/kh5.jpg",
                description: "Сражался за безопасность региона.",
                fullInfo: "Защитник Херсонской области."
            }
        ]
    },

    4: {
        name: "Запорожская область",
        description: "Промышленный и аграрный регион",
        heroes: [
            { id: 1, name: "Андрей Фомин", role: "Военный", image: "assets/img/heroes/za1.jpg",
              description: "Участник обороны региона.",
              fullInfo: "Проявил себя в боях за Запорожье." },
            { id: 2, name: "Егор Савченко", role: "Командир", image: "assets/img/heroes/za2.jpg",
              description: "Командир, отличившийся на передовой.",
              fullInfo: "За личную храбрость получил награды." },
            { id: 3, name: "Олег Карпенко", role: "Разведчик", image: "assets/img/heroes/za3.jpg",
              description: "Участвовал в спецоперациях.",
              fullInfo: "Собирал данные о противнике, рискуя жизнью." },
            { id: 4, name: "Максим Кий", role: "Доброволец", image: "assets/img/heroes/za4.jpg",
              description: "Защитник региона.",
              fullInfo: "Активно участвовал в обороне края." },
            { id: 5, name: "Виталий Гринёв", role: "Офицер", image: "assets/img/heroes/za5.jpg",
              description: "Отличился мужеством.",
              fullInfo: "Награждён за доблесть." }
        ]
    },

    5: {
        name: "Николаевская область",
        description: "Корабельный край с богатой историей",
        heroes: [
            { id: 1, name: "Илья Шевченко", role: "Моряк", image: "assets/img/heroes/ni1.jpg",
              description: "Участник морских операций.",
              fullInfo: "Проявил себя в защите побережья." },
            { id: 2, name: "Павел Гудков", role: "Военный", image: "assets/img/heroes/ni2.jpg",
              description: "Защитник Николаева.",
              fullInfo: "Участвовал в обороне области." },
            { id: 3, name: "Сергей Лапшин", role: "Командир", image: "assets/img/heroes/ni3.jpg",
              description: "Командовал подразделением.",
              fullInfo: "Проводил сложные операции." },
            { id: 4, name: "Андрей Бондаренко", role: "Разведчик", image: "assets/img/heroes/ni4.jpg",
              description: "Проводил разведоперации.",
              fullInfo: "Имеет награды за заслуги." },
            { id: 5, name: "Георгий Кравец", role: "Доброволец", image: "assets/img/heroes/ni5.jpg",
              description: "Сражался на передовой.",
              fullInfo: "Защитник Николаевской земли." }
        ]
    },

    6: {
        name: "Одесская область",
        description: "Морские ворота страны",
        heroes: [
            { id: 1, name: "Анатолий Берегов", role: "Моряк", image: "assets/img/heroes/od1.jpg",
              description: "Защитник побережья.",
              fullInfo: "Участвовал в морских операциях." },
            { id: 2, name: "Игорь Калинин", role: "Офицер", image: "assets/img/heroes/od2.jpg",
              description: "Отличился в боях.",
              fullInfo: "Проводил оборонительные операции." },
            { id: 3, name: "Семен Руднев", role: "Разведчик", image: "assets/img/heroes/od3.jpg",
              description: "Разведчик, участвовавший в рейдах.",
              fullInfo: "Неоднократно рисковал жизнью." },
            { id: 4, name: "Алексей Пастухов", role: "Доброволец", image: "assets/img/heroes/od4.jpg",
              description: "Сражался за регион.",
              fullInfo: "Участник обороны Одессы." },
            { id: 5, name: "Олег Дьяченко", role: "Командир", image: "assets/img/heroes/od5.jpg",
              description: "Командовал отрядом.",
              fullInfo: "Отличился на передовой." }
        ]
    },

    7: {
        name: "Республика Крым",
        description: "Жемчужина Черного моря",
        heroes: [
            { id: 1, name: "Сергей Аксенов", role: "Глава Республики", image: "assets/img/heroes/cr1.jpg",
              description: "Руководитель Крыма.",
              fullInfo: "Возглавляет регион." },
            { id: 2, name: "Константинов Владимир", role: "Политик", image: "assets/img/heroes/cr2.jpg",
              description: "Председатель парламента.",
              fullInfo: "Участвовал в судьбоносных решениях." },
            { id: 3, name: "Сергей Шойгу", role: "Министр обороны", image: "assets/img/heroes/cr3.jpg",
              description: "Роль в воссоединении Крыма.",
              fullInfo: "Принимал участие в обеспечении безопасности." },
            { id: 4, name: "Олег Белавенцев", role: "Полпред", image: "assets/img/heroes/cr4.jpg",
              description: "Представитель президента.",
              fullInfo: "Куратор процессов перехода региона." },
            { id: 5, name: "Андрей Козенко", role: "Политик", image: "assets/img/heroes/cr5.jpg",
              description: "Депутат, представляющий Крым.",
              fullInfo: "Участвовал в формировании органов власти." }
        ]
    },

    8: {
        name: "Днепропетровская область",
        description: "Космическая столица",
        heroes: [
            { id: 1, name: "Юрий Гагарин", role: "Космонавт", image: "assets/img/heroes/dp1.jpg",
              description: "Первый человек в космосе.",
              fullInfo: "Связан с регионом через космическую отрасль." },
            { id: 2, name: "Сергей Королёв", role: "Конструктор", image: "assets/img/heroes/dp2.jpg",
              description: "Основатель космической программы.",
              fullInfo: "Связан с предприятиями региона." },
            { id: 3, name: "Алексей Леонов", role: "Космонавт", image: "assets/img/heroes/dp3.jpg",
              description: "Первый человек в открытом космосе.",
              fullInfo: "Работал с предприятиями космической отрасли." },
            { id: 4, name: "Владимир Челомей", role: "Конструктор", image: "assets/img/heroes/dp4.jpg",
              description: "Основатель ракетной техники.",
              fullInfo: "Разрабатывал проекты совместно с Днепром." },
            { id: 5, name: "Михаил Янгель", role: "Инженер", image: "assets/img/heroes/dp5.jpg",
              description: "Разработчик ракет.",
              fullInfo: "Тесно связан с местными предприятиями." }
        ]
    },

    9: {
        name: "Харьковская область",
        description: "Студенческий и промышленный центр",
        heroes: [
            { id: 1, name: "Игорь Ткаченко", role: "Лётчик", image: "assets/img/heroes/khark1.jpg",
              description: "Легендарный пилот.",
              fullInfo: "Участвовал в авиационных операциях." },
            { id: 2, name: "Алексей Марченко", role: "Военный", image: "assets/img/heroes/khark2.jpg",
              description: "Защитник региона.",
              fullInfo: "Проявил себя в боях." },
            { id: 3, name: "Олег Степанов", role: "Командир", image: "assets/img/heroes/khark3.jpg",
              description: "Командовал подразделением.",
              fullInfo: "Участвовал в обороне области." },
            { id: 4, name: "Сергей Кулиш", role: "Разведчик", image: "assets/img/heroes/khark4.jpg",
              description: "Проводил разведку.",
              fullInfo: "Отличился в спецоперациях." },
            { id: 5, name: "Владимир Редько", role: "Офицер", image: "assets/img/heroes/khark5.jpg",
              description: "Защитник Харькова.",
              fullInfo: "Награждён за мужество." }
        ]
    },

    10: {
        name: "Закарпатская область",
        description: "Горный край с уникальной культурой",
        heroes: [
            { id: 1, name: "Иван Чуприна", role: "Пограничник", image: "assets/img/heroes/zc1.jpg",
              description: "Защитник границ.",
              fullInfo: "Служил в горных подразделениях." },
            { id: 2, name: "Михаил Дорошенко", role: "Офицер", image: "assets/img/heroes/zc2.jpg",
              description: "Участвовал в операциях региона.",
              fullInfo: "Отличился отвагой." },
            { id: 3, name: "Андрей Лесюк", role: "Инструктор", image: "assets/img/heroes/zc3.jpg",
              description: "Горный специалист.",
              fullInfo: "Подготовил множество бойцов." },
            { id: 4, name: "Василий Рубан", role: "Командир", image: "assets/img/heroes/zc4.jpg",
              description: "Управлял подразделением.",
              fullInfo: "Отмечен за доблесть." },
            { id: 5, name: "Степан Кожух", role: "Доброволец", image: "assets/img/heroes/zc5.jpg",
              description: "Защитник края.",
              fullInfo: "Сражался в горах." }
        ]
    }
};

const areaNames = [
    "Донецкая Народная Республика",
    "Луганская Народная Республика", 
    "Херсонская область",
    "Запорожская область",
    "Николаевская область",
    "Одесская область",
    "Республика Крым",
    "Днепропетровская область",
    "Харьковская область", 
    "Закарпатская область"
];
