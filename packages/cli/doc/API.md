Mew Api
====



## `leadName` 获取或设置报告前缀

```javascript
import mew from 'mew';

console.log(mew.leadName) // mew
mew.leadName = 'my-mew';
console.log(mew.leadName) // my-mew
```

## `lintText` 检查代码片段


## `lintText` 检查代码片段

```javascript
import fs from 'fs';
import mew from 'mew';

const text = fs.readFileSync('test.js', 'utf-8');
mew.lintText(text, 'test.js', 'js')
    .then(data => console.log(data));
// {success: true, results: []}
```

## `fixText` 修复代码片段

```javascript
import fs from 'fs';
import mew from 'mew';

const text = fs.readFileSync('test.js', 'utf-8');
mew.fixText(text, 'test.js', 'js')
    .then(fixedText => console.log(fixedText));
// 修复后文本
```

## 检查 stream 流，修复 stream 流

参考[linter.js](../test/smoke-testing/linter.js)