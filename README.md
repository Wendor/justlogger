# Just Logger

is a simple logger for your project.

## Installation
```npm install --save justlogger```

## Usage
Example [_example.js_](./example.js):
```javascript
const log = require('./libs/logger')('MAIN', {
    colors: true,
    timestamp: true,
    level: 5,
    inspectDepth: 5,
    filename: 'logs/output.log'
});

log.trace('It\'s a simple logger library');
log.debug(['Can be', 'used for your', 'project']);

log.log('License');
log.info({GPL: 3.0});

log.warn('May combine in output variables and', {objects: ['or', 'arrays']});

log.error('Can use %s in strings %d', 'placeholders', 1);
```
