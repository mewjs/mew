## 数据类型

### [强制] 数据类型只允许 `string`、`number`、`boolean`、`Array` 及 `Object`，不允许有 `null` 与 `undefined` 值。

解释：

`Array` 和 `Object` 的最终字段的值也只允许 `string`、`number`、`boolean`。

TypeScript 描述：

```ts
    type KObject = {
        [Key in string]?: KValue
    };

    type KArray = KValue[];

    type KPrimitive = string | number | boolean;

    type KValue = KPrimitive | KObject | KArray;

```

示例：

```json
// BAD
{
    "code": 0,
    "data": null
}

{
    "code": 0,
    "data": undefined
}

{
    "code": 0,
    "data": new Date(2022, 0, 19)
}

{
    "code": 0,
    "data": /^https?:\/\/[a-z\d-]+\.corp\.github.com/xxxx\.com/
}

// GOOD
{
    "code": 1,
    "info": [
        {
            "name": "loginName",
            "msg": "不允许使用的登录名"
        },
        {
            "name": "nick",
            "msg": "'foobar' 已被使用，可以试试 'foobar2022'"
        }
    ]
}

{
    "code": 1,
    "info": [
        {
            "name": "loginName",
            "msg": "不允许使用的登录名"
        },
        {
            "name": "nick",
            "msg": "'foobar' 已被使用，可以试试 'foobar2022'"
        }
    ]
}

{
    "code": 0,
    "data": [
        "foo",
        "bar"
    ]
}

{
    "code": 0,
    "data": [
        {
            "id": 1,
            "name": "foo",
            "valid": true
        },
        {
            "id": 2,
            "name": "bar",
            "valid": false
        }
    ]
}

{
    "code": 0,
    "data": {
        "page": 1,
        "size": 10,
        "total": 1024,
        "list": [
            {
                "name": "dev",
                "updatedAt": "2022-01-18"
            },
            {
                "name": "prod",
                "updatedAt": "2022-01-19"
            }
        ]
    }
}
```
