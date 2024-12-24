<!--
 * @Author: puito123
 * @Date: 2024-12-24 17:37:47
 * @LastEditTime: 2024-12-24 19:13:47
 * @LastEditors: puito123
 * @FilePath: \youtube\README.md
 * @Description: 
-->
# <center>YouTube 跳过广告</center>

## 简介

`YouTube 跳过广告`  是一款专为提升 YouTube 视频观看体验而设计的 Chrome 扩展程序。它通过自动跳过视频中的广告，使用户能够更顺畅地享受内容。此扩展程序的主要功能是显示隐藏的“跳过广告”按钮，并利用 rotbot.js 模拟点击操作。

## 实现思路
 1. 显示跳过按钮：扩展程序首先会识别并显示隐藏的跳过按钮。
 2. 模拟点击：利用 rotbot.js 模拟点击跳过按钮的操作，绕过 YouTube 的广告限制机制。

## 当前支持的广告类型：
  - 长度大于 5 秒的广告

## 安装指南

 1. 下载本项目源码。
 2. 打开 Chrome 浏览器，进入 `chrome://extensions/`。
 3. 开启右上角的“开发者模式”。
 4. 点击“加载已解压的扩展程序”，选择项目文件夹 `chrome-extension` 。

## 使用方法

将插件导入后，点击插件图标，开启跳过广告功能。

## 目录结构
 - `chrome-extension` 谷歌插件地址 
 - `robotjs` NODE 库，用于控制键盘和鼠标。
  
## 注意事项
 - 本扩展仅供个人使用，请遵循 YouTube 的使用条款与版权政策。