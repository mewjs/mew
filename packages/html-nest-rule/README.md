# html

html-nest-rule is nesting rule realization for [HTML spec](https://www.w3.org/TR/html5/Overview.html).

## Install

```sh
npm i @mewjs/html-nest-rule
```

## Usage

```javascript
import nest from '@mewjs/html-nest-rule';

const element = document.createElement('p');
const rule = nest.from(element);

// ['flow content', 'palpable content'], categories of given element
rule.getCategories(element);
// [], do context validate
rule.validateContext(element);
 // [], do content validate
rule.validateContent(element);
```
