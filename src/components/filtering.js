export function initFiltering(elements) {
  /**
   * Заполняет селекты продавцов/покупателей после получения индексов
   */
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };

  /**
   * Добавляет параметры фильтрации в запрос к API
   */
  const applyFiltering = (query, state, action) => {
    // --- очистка поля ---
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;

      const wrapper = action.closest(".filter-wrapper");
      if (wrapper) {
        const input = wrapper.querySelector("input, select");
        if (input) input.value = "";
      }

      state[fieldName] = "";
    }

    // --- формирование filter[...] параметров ---
    const filter = {};

    Object.keys(elements).forEach((key) => {
      const el = elements[key];

      if (!el) return;

      if (["INPUT", "SELECT"].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    // если фильтры есть — добавляем в query
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
