import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {

    // Шаблон кнопки страницы
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    // Храним количество страниц, чтобы работать с action=last
    let pageCount = 1;

    /**
     * Формирует параметры запроса для API (limit, page)
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // --- переносим логику из @todo 2.6 ---
        if (action) {
            switch (action.name) {
                case "prev":  page = Math.max(1, page - 1); break;
                case "next":  page = Math.min(pageCount, page + 1); break;
                case "first": page = 1; break;
                case "last":  page = pageCount; break;
            }
        }

        // возвращаем новый объект (не мутируем query)
        return Object.assign({}, query, {
            limit,
            page
        });
    };

    /**
     * Перерисовывает пагинатор после получения total данных
     */
    const updatePagination = (total, { page, limit }) => {
        // количество страниц
        pageCount = Math.ceil(total / limit);

        // --- переносим из @todo 2.4 ---
        const visiblePages = getPages(page, pageCount, 5);

        pages.replaceChildren(
            ...visiblePages.map(pageNum => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNum, pageNum === page);
            })
        );

        // --- переносим из @todo 2.5 ---
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return {
        applyPagination,
        updatePagination
    };
};
