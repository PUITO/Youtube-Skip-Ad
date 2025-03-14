/*
 * @Author: puito123
 * @Date: 2024-12-23 22:29:12
 * @LastEditTime: 2025-03-11 16:33:40
 * @LastEditors: puito123
 * @FilePath: \youtube\robotjs\server.js
 * @Description: 
 */
const WebSocket = require('ws');
const robot = require('robotjs')
// const si = require('systeminformation');
// const { Service, Tray } = require('node-windows');

PORT = 12000
const wss = new WebSocket.Server({ port: PORT });

// WebSocket 服务通讯
wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        try {
            let data = JSON.parse(message);
            console.log('Received message:', data);

            if (data.action === 'click') {
                console.log('Performing mouse click...');
                // 调整坐标以适应屏幕缩放
                const adjustedX = data.x; //1189 / scaleFactor;
                const adjustedY = data.isVideoFullScreen ? data.y : data.y + 120;//769 / scaleFactor;
                console.log(`${dateFormat(new Date())}: Adjusted coordinates: ${adjustedX}, ${adjustedY}`);
                robot.moveMouse(adjustedX, adjustedY);
                robot.mouseClick();
                ws.send(JSON.stringify({ status: 'success' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ status: 'error', message: error.message }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

/**
 * 格式化日期为指定格式 YYYY-MM-DD HH:MM
 * @param {Date} date - 要格式化的日期对象
 * @returns {string} - 格式化后的日期字符串
 */
function dateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}