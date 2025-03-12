/*
 * @Author: puito123
 * @Date: 2024-12-01 15:22:46
 * @LastEditTime: 2025-03-11 17:17:50
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

// 消息缓冲队列
const messageQueue = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clickMouse') {
    console.log('Click mouse action received with coordinates:', request.x, request.y);
    const message = { action: 'click', x: request.x, y: request.y, isVideoFullScreen: request.isVideoFullScreen };
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else if (ws.readyState === WebSocket.CONNECTING) {
      // 如果 WebSocket 连接仍在 CONNECTING 状态，将消息缓冲起来
      messageQueue.push(message);
    } else {
      console.error('WebSocket is not open or connecting, cannot send message');
    }
    sendResponse({ status: 'success' });
  }
});