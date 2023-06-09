## 协议

不管是 HTTP 协议还是 RPC 协议，数据传输都可以遵守本规范（除非对数据体积敏感、对性能有极致要求的场景）。不同之处在于，基于 HTTP 协议时，需要考虑 HTTP Status Code 与本规范的 `code` 的关系。

### [强制] HTTP 响应状态码应遵守 HTTP 规范，出现错误时不允许始终为 200。

解释：

常见的一种不正确用法是不管后端状态，反馈到 HTTP 状态码上都是 200，再把真正的错误码置于 JSON 的 `code` 或 `status` 字段，导致排错成本高，前端无法识别出可自动重试的场景（5xx），监控效率低——无法直接从 HTTP 状态码上发现问题，需要解包后才知道真正的错误原因。

所以正确的做法是，HTTP 状态码按技术分类，而 JSON 的 `code` 字段提供更为具体的、业务上的指引。

### [强制] 输出 JSON 时 HTTP `Content-Type` 必须为 `text/javascript;charset=UTF-8` 或 `application/json;charset=UTF-8`。

解释：

浏览器通常会根据 `Content-Type` 声明的类型作相应的处理，声明其他类型时可能会出现不符合预期的结果，甚至会导致安全问题。

另外声明只包含 MIME 类型而无编码信息，也可能会导致异常。
