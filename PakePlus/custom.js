// 重要：移动端Tauri链接处理代码
const { WebviewWindow } = window.__TAURI__.webviewWindow;

// 判断是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 处理链接点击
const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
    
    if ((origin && origin.href && origin.target === '_blank') || 
        (origin && origin.href && isBaseTargetBlank)) {
        
        e.preventDefault();
        console.log('在Tauri窗口中打开:', origin.href);
        
        const label = `external_${Date.now()}`;
        const isMobile = isMobileDevice();
        
        // 移动设备配置：全屏显示
        if (isMobile) {
            new WebviewWindow(label, {
                url: origin.href,
                fullscreen: true,
                title: '新窗口',
                resizable: false,
                decorations: false,
                visible: true
            });
        } 
        // 桌面设备配置
        else {
            new WebviewWindow(label, {
                url: origin.href,
                width: 800,
                height: 600,
                center: true,
                title: '新窗口',
                resizable: true,
                visible: true
            });
        }
    }
}

// 重写window.open方法
window.open = function (url, target, features) {
    if (url) {
        const label = `external_${Date.now()}`;
        const isMobile = isMobileDevice();
        
        if (isMobile) {
            new WebviewWindow(label, {
                url: url,
                fullscreen: true,
                title: '新窗口',
                resizable: false,
                decorations: false,
                visible: true
            });
        } else {
            new WebviewWindow(label, {
                url: url,
                width: features?.includes('width') ? parseInt(features.match(/width=(\d+)/i)?.[1]) : 800,
                height: features?.includes('height') ? parseInt(features.match(/height=(\d+)/i)?.[1]) : 600,
                center: true,
                title: '新窗口',
                resizable: true
            });
        }
    }
}

// 添加事件监听
document.addEventListener('click', hookClick, { capture: true });