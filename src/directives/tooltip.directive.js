
export default {
    bind(el, b) { // создаем в директиве шаблон по которому будем передавать данные (сообщения или html код)  
        let res = M.Tooltip.init(el, {
            html: b.value.html,
            position: b.value.position || "bottom",
            outDuration: b.value.outDuration || 0

        });
    },
    componentUpdated(el, b) { // жизненный цикл директивы обновление 
        M.Tooltip.init(el, {
            html: b.value.html,
            position: b.value.position || "bottom",
            outDuration: b.value.outDuration || 0
        });
    },
    unbind(el) { // метод аналогичен в жизненном цикле destroyed () - удаляется после завершения работы в компоненте 
        // данный метод вызывается тогда когда директива уничтожается  
        let tooltip = M.Tooltip.getInstance(el); // создаем переменную с методом который закрывает (убирает подсказки )
        if (tooltip && tooltip.destroy) { // проверяем если tooltip существует и у его есть метод уничтожения
            tooltip.destroy(); // тогда уничтожаем его 
        }
    }
};
