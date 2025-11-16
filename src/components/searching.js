export function initSearching(searchField) {
  return (query, state, action) => {
    // если в поле поиска есть данные — добавляем параметр "search"
    if (state[searchField]) {
      return Object.assign({}, query, {
        search: state[searchField],
      });
    }

    // иначе возвращаем query без изменений
    return query;
  };
}
