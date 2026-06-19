# 07 验证记录

## 命令

```bash
npm test
npm run brief
npm run manifest
npm run capture
npm run card
npm run permissions
npm run prompt
```

预期：

- `npm test` 8 条通过。
- `manifest` 输出 `manifestVersion: 3`。
- `manifest` 输出 `hostPermissions: []`。
- `permissions` 输出 activeTab、scripting、storage 的用途。
- `card` 输出 `chrome.storage.local` 和 `current-tab-user-triggered`。

## 页面

```bash
npm start
```

访问：

```text
http://127.0.0.1:5177/popup.html
```

预期：

- 页面能打开。
- 点击“采集当前页面”后显示示例素材卡片。
- 本地记录出现一条记录。
- 点击“清空本地记录”后记录清空。
