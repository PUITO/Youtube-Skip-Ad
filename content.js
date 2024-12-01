/*
 * @Author: puito123
 * @Date: 2024-12-01 15:52:59
 * @LastEditTime: 2024-12-01 16:08:13
 * @LastEditors: puito123
 * @FilePath: \youtube\content.js
 * @Description: content scripts（内容脚本）：

    JavaScript文件，注入到网页中，可以操作网页的DOM、修改样式、处理用户交互等。
    通常用于与页面交互，捕获页面数据、修改页面行为等。
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAutoClick') {
    if (request.value) {
      startAutoClick();
    } else {
      stopAutoClick();
    }
  }
});

let intervalId;

function startAutoClick() {
  console.log('Starting auto click...');
  intervalId = setInterval(getSkipBtn, 1000); // 每秒检查一次
}

function stopAutoClick() {
  console.log('Stopping auto click...');
  clearInterval(intervalId);
}
function getSkipBtn() {
    document.querySelectorAll('.ytp-skip-ad-button').forEach(btn => {
        btn.click();
    });
}

