/*
 * @Author: puito123
 * @Date: 2024-12-22 13:45:58
 * @LastEditTime: 2024-12-22 21:45:26
 * @LastEditors: puito123
 * @FilePath: \youtube\content.js
 * @Description: 
 */
console.log('Content script loaded');

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
  window.intervalId = setInterval(getSkipBtn, 1000); // 每秒检查一次
}

function stopAutoClick() {
  console.log('Stopping auto click...');
  clearInterval(window.intervalId);
}

function getSkipBtn() {
  Array.from(document.getElementsByClassName("ytp-skip-ad-button")).forEach(btn => {
    if (btn.style.display == "none") {
      console.log('Button is hidden, showing it...');
      btn.style.display = "";
    }
    console.log("Clicking skip button...")
    btn.click();

  });
}


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