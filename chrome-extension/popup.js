/*
 * @Author: puito123
 * @Date: 2024-12-01 11:47:42
 * @LastEditTime: 2024-12-01 20:24:32
 * @LastEditors: puito123
 * @FilePath: \youtube\popup.js
 * @Description: 
 *  弹出式窗口的HTML文件，当用户点击插件图标时会显示。
 *  可以包含用户界面元素，如按钮、表单等，用于与用户交互
 */

window.onload = function() {
    console.log("popup loaded");
    chrome.storage.sync.get("autoSkip", function(data) {
        document.getElementById("autoSkip").checked = data.autoSkip;
    });
};

document.getElementById("autoSkip").addEventListener("change", () => {
    const value = document.getElementById("autoSkip").checked;
    chrome.storage.sync.set({
        autoSkip: value
    }, () => {
        console.log("autoSkip saved :"+value);
    });
});