import { addAutocompleteProvider } from 'ui/autocomplete_providers';
console.log('init hack');
import { fromKueryExpression } from '@kbn/es-query';

const cursorSymbol = '@kuery-cursor@';

addAutocompleteProvider('kuery', ({ config, indexPatterns, boolFilter }) => {
  console.log('config', config);
  console.log('indexPatterns', indexPatterns);
  console.log('boolFilter', boolFilter);
  return function getSuggestions({ query, selectionStart, selectionEnd }) {
    const cursoredQuery = `${query.substr(0, selectionStart)}${cursorSymbol}${query.substr(selectionEnd)}`;

    let cursorNode;
    try {
      cursorNode = fromKueryExpression(cursoredQuery, { cursorSymbol, parseCursor: true });
    } catch (e) {
      cursorNode = {};
    }

    console.log('cursorNode', cursorNode);

    try {
      const cn = fromKueryExpression(query);
      console.log('ast', cn);
    } catch (e) {
      console.log(e);
    }

    const fields = indexPatterns[0].fields.map(f => {
      return {
        type: 'field',
        text: f.name,
        description: f.displayName,
        start: cursorNode.start,
        end: cursorNode.end
      };
    });


    const ret = fields.filter(f => f.text.includes(cursorNode.text));
    // const ret = [
    //   {
    //     'type': 'field',
    //     'text': 'customer_first_name ',
    //     'description': 'hard code 1',
    //     'start': 0,
    //     'end': 1
    //   },
    //   {
    //     'type': 'field',
    //     'text': 'customer_full_name.keyword ',
    //     'description': 'hard code 2',
    //     'start': 0,
    //     'end': 1
    //   }
    // ];

    return Promise.resolve(ret);
  };
});
