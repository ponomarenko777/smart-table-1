import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализация таблицы
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);

    // --- Клонируем шаблоны before ---
    before.slice().reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);

        // Собираем элементы по data-name
        root[subName].elements = {};
        root[subName].container.querySelectorAll('[data-name]').forEach(el => {
            root[subName].elements[el.dataset.name] = el;
        });
    });

    // --- Клонируем шаблоны after ---
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);

        // Собираем элементы по data-name
        root[subName].elements = {};
        root[subName].container.querySelectorAll('[data-name]').forEach(el => {
            root[subName].elements[el.dataset.name] = el;
        });
    });

    // --- Обработка событий ---
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', (e) => setTimeout(() => onAction(e)));
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    // --- Рендер строк ---
    root.render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) row.elements[key].textContent = item[key];
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return root;
}
