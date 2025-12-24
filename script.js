// ===== 状态管理 =====
const state = {
    currentPage: 'welcome',
    openedGifts: new Set(),
    allGiftsOpened: false
};

// ===== DOM 元素 =====
const pages = {
    welcome: document.getElementById('welcomePage'),
    gifts: document.getElementById('giftsPage'),
    surprise: document.getElementById('surprisePage'),
    complete: document.getElementById('completePage')
};

const buttons = {
    openNow: document.getElementById('openNowBtn'),
    openLater: document.getElementById('openLaterBtn'),
    back: document.getElementById('backBtn'),
    backFromSurprise: document.getElementById('backFromSurpriseBtn'),
    backFromComplete: document.getElementById('backFromCompleteBtn')
};

const giftBoxes = document.querySelectorAll('.gift-box');

// ===== 页面切换函数 =====
function showPage(pageName) {
    // 隐藏所有页面
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
        state.currentPage = pageName;
    }
}

// ===== 礼物盒交互 =====
function handleGiftClick(event) {
    const giftBox = event.currentTarget;
    const giftId = giftBox.dataset.giftId;
    
    if (giftBox.classList.contains('opened')) {
        // 如果礼物已经打开，点击返回礼物页面（不关闭礼物）
        // 不做任何操作，保持打开状态
        return;
    }
    
    // 打开礼物
    openGift(giftBox, giftId);
}

function openGift(giftBox, giftId) {
    // 添加打开状态
    giftBox.classList.add('opened');
    // 清除所有内联 transform 样式，确保卡片回正
    giftBox.style.transform = '';
    state.openedGifts.add(giftId);

    // 检查是否所有礼物都已打开
    if (state.openedGifts.size === giftBoxes.length) {
        state.allGiftsOpened = true;
        document.getElementById('toCompleteBtn').style.display = 'block';
    }
}

// ===== 重置礼物状态 =====
function resetGifts() {
    giftBoxes.forEach(box => {
        box.classList.remove('opened');
    });
    state.openedGifts.clear();
    state.allGiftsOpened = false;
}

// ===== 按钮事件监听 =====

// "现在拆礼物" 按钮
buttons.openNow.addEventListener('click', () => {
    showPage('gifts');
});

// "保留惊喜" 按钮
buttons.openLater.addEventListener('click', () => {
    showPage('surprise');
});

// "返回首页" 按钮（从礼物页面）
buttons.back.addEventListener('click', () => {
    showPage('welcome');
});

// "返回首页" 按钮（从惊喜页面）
buttons.backFromSurprise.addEventListener('click', () => {
    showPage('welcome');
});

// "返回首页" 按钮（从完成页面）
buttons.backFromComplete.addEventListener('click', () => {
    resetGifts();
    showPage('welcome');
});

// "See All Gifts" 按钮点击跳转到 complete 页面
document.getElementById('toCompleteBtn').addEventListener('click', function() {
    showPage('complete');
});

// 为每个礼物盒添加点击事件
giftBoxes.forEach(box => {
    box.addEventListener('click', handleGiftClick);
});

// ===== 键盘快捷键 =====
document.addEventListener('keydown', (event) => {
    // ESC 键返回首页
    if (event.key === 'Escape') {
        if (state.currentPage !== 'welcome') {
            if (state.currentPage === 'complete') {
                resetGifts();
            }
            showPage('welcome');
        }
    }
    
    // 数字键 1-4 打开对应礼物（仅在礼物页面）
    if (state.currentPage === 'gifts') {
        const num = parseInt(event.key);
        if (num >= 1 && num <= 4) {
            const giftBox = document.querySelector(`[data-gift-id="${num}"]`);
            if (giftBox && !giftBox.classList.contains('opened')) {
                openGift(giftBox, num.toString());
            }
        }
    }
});

// ===== 页面加载完成 =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 圣诞礼物页面已加载！');
    console.log('提示：按 ESC 键可随时返回首页');
    console.log('提示：在礼物页面按数字键 1-4 可快速打开对应礼物');
    
    // 确保初始显示欢迎页面
    showPage('welcome');
});

// ===== 礼物盒悬停效果增强 =====
giftBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
        if (!box.classList.contains('opened')) {
            box.style.transform = 'translateY(-8px) scale(1.02)';
        }
    });
    
    box.addEventListener('mouseleave', () => {
        // 清除内联样式，让 CSS 控制
        box.style.transform = '';
    });
});

// ===== 添加音效（可选，需要音频文件）=====
// 如果你想添加音效，可以取消下面的注释并添加相应的音频文件

/*
const sounds = {
    open: new Audio('assets/sounds/open.mp3'),
    complete: new Audio('assets/sounds/complete.mp3'),
    click: new Audio('assets/sounds/click.mp3')
};

// 在相应的地方调用：
// sounds.open.play(); // 打开礼物时
// sounds.complete.play(); // 完成所有礼物时
// sounds.click.play(); // 按钮点击时
*/

// ===== 导出状态（用于调试）=====
window.giftState = state;
console.log('可以通过 window.giftState 查看当前状态');
