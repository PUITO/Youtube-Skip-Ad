/*
 * @Author: puito123
 * @Date: 2024-12-01 15:22:46
 * @LastEditTime: 2024-12-02 13:06:36
 * @LastEditors: puito123
 * @FilePath: \youtube\background.js
 * @Description: background.js：
 * 
    后台脚本文件，可以用来监听浏览器事件、与内容脚本通信、管理扩展的生命周期等。
    可以用来执行扩展的后台任务，如处理异步操作、与服务器通信等。
 */
//注入脚本
// chrome.webNavigation.onCompleted.addListener((details) => {
//   if (details.url.includes("https://www.youtube.com/")) {
//     chrome.scripting.executeScript({
//       target: { tabId: details.tabId },
//       files: ['content.js']
//     });
//   }
// });
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );

    // 根据 key 执行相应的操作
    if (key === 'autoSkip' && namespace === 'sync') {
      chrome.tabs.query({ active: true }, (tabs) => {
        if (tabs.length > 0) {
          console.log("Found YouTube tabs:", tabs);
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }).then(() => {
            console.log('Content script injected successfully');
            chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAutoSkip', value: newValue }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to send message:', chrome.runtime.lastError.message);
              } else {
                console.log('Message sent successfully:', response);
              }
            });
          }).catch((error) => {
            console.error('Failed to inject content script:', error);
          });
        } else {
          console.error('No YouTube tab found');
        }
      });
    }
}
});