# 🔜 学习路线（下一步）
1. 组件拆分
- 把 TodoItem 独立成一个组件。
- 父组件（App.vue）只管理数据，子组件（TodoItem.vue）负责展示和操作。
👉 学会 父子组件通信（props、emit）。
2.	Props & Emit
-	父组件把 todo 传给子组件。
-	子组件点击“删除”时，通过 emit("delete", id) 通知父组件处理。
3.	组件复用 & 代码结构
-	你会发现：列表项的逻辑更清晰了。
-	后面做更大项目时，这个思维方式很重要。

⸻

## 🔧 任务设计

我给你一个目标任务（可运行的方向）：
-	创建一个新文件：src/components/TodoItem.vue
-	在里面写一个组件，接收 todo（props）并发出删除事件（emit）。
-	在 App.vue 中用 TodoItem 渲染列表。

第 5 步：编辑任务 ✏️

目标：
- 双击任务文字时，进入「编辑模式」。
- 编辑完成后按下 Enter 保存，按下 Esc 或失焦（blur）取消。

大概思路：
1. 给 TodoItem.vue 添加一个 编辑状态（用 ref 或 data）。
2. 当双击 <span> 时，切换到输入框 <input>。
3. 在输入框里输入文字，按下 Enter 发出 update 事件，传给父组件修改 todos。
4. 如果 Esc 或 blur，就退出编辑，不保存。