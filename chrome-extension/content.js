/*
 * @Author: puito123
 * @Date: 2024-12-22 13:45:58
 * @LastEditTime: 2024-12-24 17:09:54
 * @LastEditors: puito123
 * @FilePath: \youtube\content.js
 * @Description: 
 */
console.log('Content script loaded');

let intervalId = null;

let lastSendTime = 0; //最后发送时间
const sendInterval = 2000; // 发送间隔
const maxSendsPerMinute = 5; // 最大发送次数
let sendCount = 0; // 发送次数
const resetInterval = 60000; // 1分钟


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



function startAutoClick() {
  console.log('Starting auto click...');
  if (intervalId) {
    console.log('Auto click is already running.');
    return;
  }
  intervalId = setInterval(getSkipBtn, 2000); // 每2秒检查一次
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

  Array.from(document.getElementsByClassName("ytp-skip-ad-button")).forEach(btn => {
    if (btn.style.display == "none") {
      console.log('Button is hidden, showing it...');
      btn.style.display = "";
    }
    console.log("Clicking skip button...")
    // 获取按钮在屏幕上的位置
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + rect.height / 2 + window.scrollY;
    console.log(`跳过按钮坐标：(${x}, ${y})`);


    // 检查是否可以发送消息
    const currentTime = Date.now();
    if (currentTime - lastSendTime >= sendInterval && sendCount < maxSendsPerMinute) {
      // 发送坐标给后台脚本
      chrome.runtime.sendMessage({ action: 'clickMouse', x, y, isFullScreen, isVideoFullScreen }, (response) => {
        console.log('Response from background:', response);
      });
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


/*
// 在页面加载后进行操作
window.addEventListener('load', function () {
  // 查找所有的 <script> 标签
  const scripts = document.getElementsByTagName('script');

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    // 检查当前 <script> 标签的 src 属性
    if (script.src.includes("base.js")) {
      // 创建一个新的 <script> 标签
      const newScript = document.createElement('script');
      newScript.src = "base.js"; // 你的新脚本路径
      newScript.nonce = ""; // 如果需要，可以设置 nonce
      newScript.className = "js-httpswwwyoutubecomsplayerb46bb280player_iasvflsetzh_CNbasejs"; // 设置类名

      // 替换旧的 <script> 标签
      script.parentNode.replaceChild(newScript, script);

      console.log('Replaced script:', script.src, 'with', newScript.src);
    }
  }
});
*/