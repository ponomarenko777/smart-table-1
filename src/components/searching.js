import {createComparison, rules} from "../lib/compare.js";

export function initSearching(searchFieldName) {
    const compare = createComparison(["skipEmptyTargetValues"],
        [rules.searchMultipleFields(searchFieldName, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        if (!state[searchFieldName]) return data;
        return data.filter(row => compare(row, state));
    };
}