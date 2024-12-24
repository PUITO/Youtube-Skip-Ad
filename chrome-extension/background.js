/*
 * @Author: puito123
 * @Date: 2024-12-01 15:22:46
 * @LastEditTime: 2024-12-24 22:39:27
 * @LastEditors: puito123
 * @FilePath: \youtube\chrome-extension\background.js
 * @Description: background.js：
 * 
    后台脚本文件，可以用来监听浏览器事件、与内容脚本通信、管理扩展的生命周期等。
    可以用来执行扩展的后台任务，如处理异步操作、与服务器通信等。
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

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
            // 延迟发送消息以确保内容脚本已加载
            setTimeout(() => {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAutoSkip', value: newValue }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('Failed to send message:', chrome.runtime.lastError.message);
                } else {
                  console.log('Message sent successfully:', response);
                }
              });
            }, 500); // 延迟 500 毫秒
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

/*********************    WebSocket           ***************************************/
const ws = new WebSocket('ws://localhost:12000');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket server');
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clickMouse') {
    console.log('Click mouse action received with coordinates:', request.x, request.y);
    ws.send(JSON.stringify({ action: 'click', x: request.x, y: request.y, isVideoFullScreen: request.isVideoFullScreen }));
    sendResponse({ status: 'success' });
  }
});