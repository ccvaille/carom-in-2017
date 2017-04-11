> attributes 是 HTML 元素（标签）的属性，而 properties 是 DOM 对象的属性

> 自 jQuery 1.6 版本起，attr() 方法对于未设置的 attributes （即标签中没写该 attributes）都会返回 undefined。对于检索和改变 DOM 的 properties，如表单元素的 checked、selected 或 disabled 状态，应使用 .prop() 方法。

---

- prop
    ```
    $(elem).prop("checked") // true (Boolean) , 会随着 checkbox 状态作出相应改变
    ```

- attr
    ```
    $(elem).attr("checked") (1.6)	//"checked" (String) , checkbox 的初始状态；并且不会随着 checkbox 的状态而改变
    ```

---

- 总结
    - 对于HTML元素本身就带有的固有属性，在处理时，使用prop方法
    - 对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr方法
