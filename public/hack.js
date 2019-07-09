import { addAutocompleteProvider } from 'ui/autocomplete_providers';
console.log('init hack');
addAutocompleteProvider('kuery', ({ config, indexPatterns, boolFilter }) => {
  return function getSuggestions({ query, selectionStart, selectionEnd }) {
    const ret = [
      {
        'type': 'field',
        'text': 'customer_first_name ',
        'description': 'hard code',
        'start': 0,
        'end': 1
      },
      {
        'type': 'field',
        'text': 'customer_full_name.keyword ',
        'description': 'hard code 2',
        'start': 0,
        'end': 1
      }
    ];

    return Promise.resolve(ret);
  };
});
