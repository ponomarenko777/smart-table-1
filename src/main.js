import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Инициализация API
const api = initData(sourceData);

/**
 * Сбор состояния формы
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Асинхронная перерисовка таблицы
 */
async function render(action) {
  let state = collectState();
  let query = {}; // здесь копим параметры запроса

  // --- сбор параметров запроса ---
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  // --- запрос данных ---
  const { total, items } = await api.getRecords(query);

  // --- обновляем пагинацию после запроса ---
  updatePagination(total, query);

  // --- вывод данных ---
  sampleTable.render(items);
}

/**
 * Инициализация таблицы
 */
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "filter", "header"],
    after: ["pagination"],
  },
  render
);

// поиск
const applySearching = initSearching("search");

// фильтрация
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

// сортировка
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// пагинация
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// вывод таблицы в DOM
document.querySelector("#app").appendChild(sampleTable.container);

/**
 * Асинхронная инициализация проекта
 */
async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
    // если понадобятся покупатели, добавим:
    // searchByCustomer: indexes.customers
  });
}

// старт
init().then(render);
