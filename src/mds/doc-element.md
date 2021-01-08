<details>
<summary>路由要以更清晰的层次结构进行配置，尽量要用“-”，避免大写英文，同时保持简练</summary>

```
用户模块列表，详情，编辑的路由设计
列表页：/user
详情页：/user/detail
编辑页：/user/edit

注意：要避免/user/userEdit这种有重复语义的命名方式
```
</details>

<details>
<summary>每个路由模块都应该要有index默认入口页</summary>

```
比如用户模块
列表页：/user
而非
列表页：/user/list

```
</details>
