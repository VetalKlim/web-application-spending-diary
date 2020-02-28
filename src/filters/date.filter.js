import store from '@/store'

export default function dateFilter(value, format = "date") { 
    const options = {}; 
    if (format.includes("date")) { 
       
        options.day = "2-digit"; // формат дня 
        options.month = 'long'; // формат месяца
        options.year = "numeric"; // формат года 
    }
    if (format.includes('month')) {
        options.month = 'long',
            options.year = 'numeric'
    }
    if (format.includes('time')) { // проверяем с помощью метода includes есть ли в format значение time. Если есть то тогда заполняем 
        // options данными в формате время  
        options.hour = "2-digit"; // формат часы
        options.minute = "2-digit"; // формат минуты 
        options.second = "2-digit"; // формат секунды
    }
    // console.log(format); // date time
    const locale = store.getters.info.locale;
    return new Intl.DateTimeFormat(locale, options).format(new Date(value));
    
}
