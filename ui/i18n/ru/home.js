/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "Пакетная загрузка",
        database_description:"Database description",
        all_faostat_data: "Все данные ФАОСТАТ",
        updated_on: "Обновлено",

        // database updates
        database_updates: "Обновление базы данных",

        // Statistical Yearbook
        fao_statistical_yearbooks: "Статистический ежегодник ФАО",
        fao_statistical_yearbooks_text: "Статистический ежегодник ФАО представляет набор показателей в области продовольствия и сельского хозяйства по странам. <br> Первая часть книги включает в себя тематические обзоры с визуально представленными данными (графики, диаграммы, карты). Вторая часть представляет собой таблицы с определенными показателями по странам.",

        // country indicators
        country_indicators: "Страновые показатели",
        country_indicators_text: "Обзор ключевых показателей и графиков разных стран.",

        // Rankings
        rankings: "Ранжирование",
        rankings_text: "Показатели ранжирования представяют собой ключевые показатели и графики по видам товаров.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "Продовольствие и сельское хозяйство в повестке дня в области устойчивого развития на период до 2030 года",
        development_goals_text: "Повестка дня в области устойчивого развития на период до 2030 года включает в себя 17 целей в области устойчивого развития (ЦУР), которые являются новыми международными целями, сменившими Цели в области развития 1 января 2016 года. ЦУР будут определять национальную политику в области развития в ближайшие 15 лет. Продовольствие и сельское хозяйство находятся в центре внимания данной повестки дня, начиная с ликвидации нищеты и голода до борьбы с изменением климата и сохранения природных ресурсов.",

        // Contacts
        rome: "Рим",
        italy: "Италия",
        info: "Информация",

        explore_data: "Просмотреть данные",
        explore_data_title: "Данные в области продовольствия и сельского хозяйства",
        explore_data_text: "ФАОСТАТ предоставляет бесплатный доступ к собранным с 1961 до предыдущего года данным более 245 стран и территорий в области продовольствия и сельского хозяйства, которые охватывают все региональные группы ФАО.",

        //Food Security

        fao_food_security: "Положение дел в области продовольственной безопасности и питания в мире 2017",
        fao_food_security_text: "Международное сообщество намерено к 2030 году покончить с голодом и неполноценным питанием во всех его проявлениях. "

    });

});