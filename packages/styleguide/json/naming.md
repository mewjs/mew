## 命名

### [强制] 数据字段名称统一使用 camelCase 风格。

解释：

与 JavaScript 代码规范中的对象字段命名风格保持一致，避免在消费数据时处处要转换。

```json
// BAD
{
    "code": 1,
    "info": [
        {
            "login-name": "不允许使用的登录名"
        },
        {
            "nick_name": "'foobar' 已被使用，可以试试 'foobar2022'"
        }
    ]
}

{
    "code": 1,
    "info": {
        "login-name": "不允许使用的登录名",
        "nick_name": "'foobar' 已被使用，可以试试 'foobar2022'"
    }
}

// GOOD
{
    "code": 1,
    "info": [
        {
            "loginName": "不允许使用的登录名"
        },
        {
            "nickName": "'foobar' 已被使用，可以试试 'foobar2022'"
        }
    ]
}

{
    "code": 2,
    "info": {
        "loginName": "不允许使用的登录名",
        "nickName": "'foobar' 已被使用，可以试试 'foobar2022'"
    }
}
```
