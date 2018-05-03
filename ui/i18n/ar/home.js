/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "تنزيل مقادير كبيرة من البيانات",
        database_description:"Database description",
        database_description_text:"database description text text ar",
        all_faostat_data: "FAOSTAT جميع بيانات",
        updated_on: "تمّ تحديثها في",
        url_json: "datasets_E.json",
        url_xml: "datasets_E.xml",
        // database updates
        database_updates: "مستجدات قاعدة البيانات",

        // Statistical Yearbook
        fao_statistical_yearbooks: "كتب الإحصاء السنوية عن المنظمة",
        fao_statistical_yearbooks_text: "يقدم كتاب الإحصاء السنوي عن المنظمة مجموعة مختارة من المؤشرات بشأن الأغذية والزراعة حسب البلدان.يتضمن الجزء الأول من الكتاب جداول بيانات مواضيعية توفر بيانات مرئية (رسوما وأشكالا بيانية، وخرائط) إلى جانب النص الأساسي. ويتضمن الجزء الثاني جداول بعدد مختار من المؤشرات تتعلّق بالبلدان.",

        // country indicators
        country_indicators: "المؤشرات القطرية",
        country_indicators_text: "توفر المؤشرات القطرية لمحة عامة عن المؤشرات والرسوم البيانية الرئيسية حسب البلد.",

        // Rankings
        rankings: "الترتيب",
        rankings_text: "توفر مؤشرات التصنيف العالمي لمحة عامة عن المؤشرات والرسوم البيانية الرئيسية بحسب السلعة.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "الأغذية والزراعة في جدول أعمال 2030 للتنمية المستدامة",
        development_goals_text: "جدول أعمال 2030 للتنمية المستدامة، يتضمن جدول الأعمال أهداف التنمية المستدامة السبعة عشر، وهي الأهداف العالمية الجديدة التي تعقب الأهداف الإنمائية للألفية في 1 كانون الثاني/يناير 2016. والأهداف الإنمائية المستدامة ستشكل سياسات التنمية الوطنية للسنوات ال 15 القادمة. ويكمن القضاء على الفقر والجوع والاستجابة لتغير المناخ والحفاظ على مواردنا الطبيعية والأغذية والزراعة في صميم جدول أعمال عام 2030.",

        // Contacts
        rome: "روما",
        italy: "إيطاليا",
        info: "للحصول على المعلومات",

        explore_data: "استكشاف البيانات",
        explore_data_title: "بيانات عن الأغذية والزراعة",
        explore_data_text: "توفر قاعدة البيانات الإحصائية الاطّلاع المجاني على بيانات الأغذية والزراعة لأكثر من 245 بلدا وإقليما، وتشمل جميع التجمعات الإقليمية التابعة للمنظمة في الفترة من 1961 إلى السنة الأخيرة المتاحة.",

        //Food Security

        fao_food_security: " 2017حااللة غاذلأائمين وا في لاتلغعذاية لم",
        fao_food_security_text: "2030يلتزم المجتمع الدولي بالقضاء على الجوع وجميع أشكال سوء التغذية في العالم بحلول عام"

    });

});