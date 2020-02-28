import store from "@/store"
export default function currencyFilter(value, currency = 'UAH') {
    const local = store.getters.info.locale
    return new Intl.NumberFormat(local, { // возвращаем новый экземпляр класса Intl у которого есть свойство
        // NumberFormat, по умолчанию задаем локаль 'ua-Ua', а дальше есть набор опций в которых указываем 
        style: 'currency', // стиль валюта 
        currency: currency // Валюта, используемая при форматировании валют
    }).format(value); // после того когда все сформировано передаем значение для данного фильтра 
}

