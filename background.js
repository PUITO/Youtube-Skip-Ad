/*
 * @Author: puito123
 * @Date: 2024-12-01 15:22:46
 * @LastEditTime: 2024-12-01 16:05:41
 * @LastEditors: puito123
 * @FilePath: \youtube\background.js
 * @Description: background.js：
 * 
    后台脚本文件，可以用来监听浏览器事件、与内容脚本通信、管理扩展的生命周期等。
    可以用来执行扩展的后台任务，如处理异步操作、与服务器通信等。
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );

    // 根据 key 执行相应的操作
    if (key === 'autoClick') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAutoClick', value: newValue });
      });
    }
}
});
