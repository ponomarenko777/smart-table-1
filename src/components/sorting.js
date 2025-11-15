import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        // если нажата кнопка сортировки
        if (action && action.name === "sort") {

            // переключаем значение сортировки
            action.dataset.value = sortMap[action.dataset.value];

            field = action.dataset.field;
            order = action.dataset.value;

            // сбрасываем все остальные колонки
            columns.forEach(column => {
                if (column.dataset.field !== field) {
                    column.dataset.value = "none";
                }
            });

        } else {
            // если кнопка не нажата — читаем текущее состояние
            columns.forEach(column => {
                if (column.dataset.value !== "none") {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // формируем строку field:order
        const sort = (field && order !== "none") ? `${field}:${order}` : null;

        // если сортировка есть — добавляем её в query
        return sort
            ? Object.assign({}, query, { sort })
            : query;
    };
}
