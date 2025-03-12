/*
 * @Author: puito123
 * @Date: 2024-12-22 13:45:58
 * @LastEditTime: 2025-03-11 17:23:49
 * @LastEditors: puito123
 * @FilePath: \youtube\chrome-extension\content.js
 * @Description: 
 */
console.log('Content script loaded');

intervalId = null;

lastSendTime = 0; //最后发送时间
sendInterval = 1000; // 发送间隔
maxSendsPerMinute = 5; // 最大发送次数
sendCount = 0; // 发送次数
resetInterval = 60000; // 1分钟


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === 'toggleAutoSkip') {
    console.log(`Toggle auto skip: ${request.value}`);
    // 执行相应操作
    if (request.value) {
      startAutoClick();
    } else {
      stopAutoClick();
    }
    sendResponse({ status: 'success' }); // 确保发送响应
  }
});

// 在页面加载后进行操作
window.addEventListener('load', function () {
  chrome.storage.sync.get(['autoSkip'], function (result) {
    if (result.autoSkip) {
      startAutoClick();
    } else {
      stopAutoClick();
    }
  });
});



function startAutoClick() {
  console.log('Starting auto click...');
  if (intervalId) {
    console.log('Auto click is already running.');
    return;
  }
  intervalId = setInterval(getSkipBtn, 1000); // 每2秒检查一次
}

function stopAutoClick() {
  console.log('Stopping auto click...');
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}



function getSkipBtn() {
  // 获取当前页面是否时全屏显示   ytp-fullscreen-button
  const isFullScreen = document.fullscreenElement !== null;
  //获取当前播放器是否是全屏显示
  const fullscreenDOM = document.getElementsByClassName("ytp-fullscreen-button")[0];
  let isVideoFullScreen = false;

  if (fullscreenDOM) {
    const title = fullscreenDOM.title || '';
    isVideoFullScreen = title.includes("退出全屏"); // 或者使用 indexOf
  }
  // console.log(`浏览器全屏状态：${isFullScreen} 播放器全屏状态：${isVideoFullScreen}`)
  Array.from(document.getElementsByClassName("ytp-skip-ad-button")).forEach(btn => {
    if (btn.style.display == "none") {
      console.log('Button is hidden, showing it...');
      btn.style.display = "";
    }
    console.log("Clicking skip button...")
    // 获取按钮在屏幕上的位置
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.screenX;
    const y = rect.top + rect.height / 2 + window.screenY;
    console.log(`跳过按钮坐标：(${x}, ${y})`);


    // 检查是否可以发送消息
    const currentTime = Date.now();
    if (currentTime - lastSendTime >= sendInterval && sendCount < maxSendsPerMinute) {
      // 发送坐标给后台脚本
      try {
        chrome.runtime.sendMessage({ action: 'clickMouse', x, y, isFullScreen, isVideoFullScreen }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Failed to send message:', chrome.runtime.lastError);
          } else {
            console.log('Response from background:', response);
          }
        });
      } catch (error) {

      }
      lastSendTime = currentTime;
      sendCount++;
    } else {
      console.log('Message send rate limit exceeded');
    }

    btn.click();
  });
}

// 重置发送计数器
setInterval(() => {
  sendCount = 0;
}, resetInterval);


