# Firebase 新项目设置步骤

## 1. 在 Firebase Console 中创建 Web 应用

1. 访问：https://console.firebase.google.com/project/rememberme-davidgao/overview
2. 点击项目设置（齿轮图标）或 "Project settings"
3. 滚动到 "Your apps" 部分
4. 点击 "</>" (Web) 图标来添加 Web 应用
5. 应用昵称填写：`rememberme`
6. 勾选 "Also set up Firebase Hosting"（如果还没设置）
7. 点击 "Register app"
8. 复制 Firebase 配置对象（firebaseConfig）

## 2. 更新 firebase.js

将新的配置粘贴到 `src/firebase.js` 文件中。

## 3. 部署

运行以下命令部署到新项目：

```bash
npm run build
firebase deploy --only hosting
```

## 4. 访问地址

部署后，应用将在以下地址可用：
- https://rememberme-davidgao.web.app
- https://rememberme-davidgao.firebaseapp.com

## 5. 自定义域名 RememberMe.web.app

要使用 RememberMe.web.app，需要：
1. 在 Firebase Console > Hosting 中添加自定义域名
2. 按照指示验证域名所有权
3. 配置 DNS 记录

注意：RememberMe.web.app 需要域名验证，可能需要一些时间。

