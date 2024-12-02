/*
 * @Author: puito123
 * @Date: 2024-12-01 15:52:59
 * @LastEditTime: 2024-12-02 14:06:50
 * @LastEditors: puito123
 * @FilePath: \youtube\content.js
 * @Description: content scripts（内容脚本）：

    JavaScript文件，注入到网页中，可以操作网页的DOM、修改样式、处理用户交互等。
    通常用于与页面交互，捕获页面数据、修改页面行为等。
 */
console.log('Content script loaded');

let intervalId;
// 清除之前的定时器
if (intervalId) {
  clearInterval(intervalId);
}

function startAutoClick() {
  console.log('Starting auto click...');
  intervalId = setInterval(getSkipBtn, 1000); // 每秒检查一次
}

function stopAutoClick() {
  console.log('Stopping auto click...');
  clearInterval(intervalId);
}
function getSkipBtn() {
  // console.log(document.getElementsByClassName("ytp-skip-ad-button"));
  Array.from(document.getElementsByClassName("ytp-skip-ad-button")).forEach(btn => {
    console.log(btn);
    if (btn.style.display == "none") {
      console.log('Button is hidden, showing it...');
      btn.style.display = "";
    }
    console.log('Attempting to click the button...');
    // 尝试使用 dispatchEvent 触发点击事件
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    btn.dispatchEvent(clickEvent);
    console.log('Click event dispatched');
  });
}


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
      newScript.src = "/s/player/b46bb280/player_ias.vflset/zh_CN/base.js"; // 你的新脚本路径
      newScript.nonce = ""; // 如果需要，可以设置 nonce
      newScript.className = "js-httpswwwyoutubecomsplayerb46bb280player_iasvflsetzh_CNbasejs"; // 设置类名

      // 替换旧的 <script> 标签
      script.parentNode.replaceChild(newScript, script);

      console.log('Replaced script:', script.src, 'with', newScript.src);
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message: " + request.action);
  if (request.action === 'toggleAutoSkip') {
    if (request.value) {
      startAutoClick();
    } else {
      stopAutoClick();
    }
  }
});