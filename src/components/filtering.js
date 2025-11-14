import {createComparison, defaultRules} from "../lib/compare.js";

// Компаратор фильтров
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполнение select опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // Очистка поля
        if (action && action.name === 'clear') {
            const wrapper = action.closest('[data-field]');
            const fieldName = wrapper.dataset.field;

            const input = wrapper.querySelector('input, select');
            if (input) input.value = '';

            state[fieldName] = '';
        }

        // Применение фильтра
        return data.filter(row => compare(row, state));
    }
}
