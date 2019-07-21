import { addAutocompleteProvider } from 'ui/autocomplete_providers';
console.log('init hack');
import { fromKueryExpression } from '@kbn/es-query';
// import chrome from '../../chrome';
import { getSuggestions as getValueSuggestion } from 'ui/value_suggestions';

const cursorSymbol = '@kuery-cursor@';
// const baseUrl = chrome.addBasePath('/api/kibana/suggestions/values');

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
        end: cursorNode.start + f.name.length,
        field: f
      };
    });


    const ret = [];
    let ret2;
    const filteredFields = indexPatterns[0].fields.filter(f => f.name === cursorNode.fieldName);

    for (let t of cursorNode.suggestionTypes) {
      switch (t) {
        case 'field':
          const f1 = fields.filter(f => f.text.includes(cursorNode.text));
          ret.push(...f1);
          console.log(ret);
          break;
        case 'conjunction':
          ret.push({
            type: 'conjunction',
            text: ' and ',
            description: 'and',
            start: cursorNode.end,
            end: cursorNode.end + 5
          });
          break;
        case 'operator':
          ret.push({
            type: 'operator',
            text: ':',
            description: ':',
            start: cursorNode.end,
            end: cursorNode.end + 1
          });
          break;
        case 'value':
          console.log('filteredFields', filteredFields);
          const query = `${cursorNode.prefix}${cursorNode.suffix}`;
          const title = filteredFields[0].indexPattern.title;
          const field = filteredFields[0];
          return getValueSuggestion(title, field, query, boolFilter)
            .then(res => {
              console.log(res);

              const re = res.map(v => {
                console.log(v);
                return {
                  type: 'value',
                  text: v + ' ',
                  description: v,
                  start: cursorNode.end,
                  end: cursorNode.end + v.length + 1
                };
              });

              return re;
            });

          // ret.push({
          //   type: 'value',
          //   text: '123',
          //   description: '123',
          //   start: cursorNode.end,
          //   end: cursorNode.end + 3
          // });
        default:
      }
    }
    // const ret = [
    //   {
    //     'type': 'field',
    //     'text': 'customer_full_name.keyword ',
    //     'description': 'hard code 2',
    //     'start': 0,
    //     'end': 1
    //   }
    // ];

    const ret1 = Promise.resolve(ret);

    return ret1;
  };
});
