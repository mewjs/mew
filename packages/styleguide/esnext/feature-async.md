
### 异步

#### [强制] 回调函数的嵌套不得超过3层。

解释：

深层次的回调函数的嵌套会让代码变得难以阅读。

示例：

```js
// BAD
getUser(userId, function (user) {
    validateUser(user, function (isValid) {
        if (isValid) {
            saveReport(report, user, function () {
                notice('Saved!');
            });
        }
    });
});
```

#### [建议] 使用 `Promise` 代替 `callback`。

解释：

相比 `callback`，使用 `Promise` 能够使复杂异步过程的代码更清晰。

示例：

```js
// GOOD
let user;
getUser(userId)
    .then(function (userObj) {
        user = userObj;
        return validateUser(user);
    })
    .then(function (isValid) {
        if (isValid) {
            return saveReport(report, user);
        }

        return Promise.reject('Invalid!');
    })
    .then(
        function () {
            notice('Saved!');
        },
        function (message) {
            notice(message);
        }
    );
```

#### [强制] 使用标准的 `Promise` API。

解释：

1. 不允许使用非标准的 `Promise` API，如 `jQuery` 的 `Deferred`、`Q.js` 的 `defer` 等。
2. 不允许使用非标准的 `Promise` 扩展 API，如 `bluebird` 的 `Promise.any` 等。

使用标准的 `Promise` API，当运行环境都支持时，可以把 Promise Lib 直接去掉。

#### [强制] 不允许直接扩展 `Promise` 对象的 `prototype`。

解释：

理由和 **不允许修改和扩展任何原生对象和宿主对象的原型** 是一样的。如果想要使用更方便，可以用 utility 函数的形式。

#### [强制] 不得为了编写的方便，将可以并行的IO过程串行化。

解释：

并行 IO 消耗时间约等于 IO 时间最大的那个过程，串行的话消耗时间将是所有过程的时间之和。

示例：

```js
requestData().then(function (data) {
    renderTags(data.tags);
    renderArticles(data.articles);
});

// GOOD
async function requestData() {
    const [tags, articles] = await Promise.all([
        requestTags(),
        requestArticles()
    ]);
    return {tags, articles};
}

// BAD
async function requestData() {
    let tags = await requestTags();
    let articles = await requestArticles();

    return Promise.resolve({tags, articles});
}
```

#### [建议] 使用 `async/await` 代替 `generator` + `co`。

解释：

使用语言自身的能力可以使代码更清晰，也无需引入 `co` 库。

示例：

```js
addReport(report, userId).then(
    function () {
        notice('Saved!');
    },
    function (message) {
        notice(message);
    }
);

// GOOD
async function addReport(report, userId) {
    let user = await getUser(userId);
    let isValid = await validateUser(user);

    if (isValid) {
        let savePromise = saveReport(report, user);
        return savePromise();
    }

    return Promise.reject('Invalid');
}

// BAD
function addReport(report, userId) {
    return co(function* () {
        let user = yield getUser(userId);
        let isValid = yield validateUser(user);

        if (isValid) {
            let savePromise = saveReport(report, user);
            return savePromise();
        }

        return Promise.reject('Invalid');
    });
}
```
