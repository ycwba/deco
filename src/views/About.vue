<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="about-container">
    <div class="glass-card">
      <h2>关于 Deco Tree 🎅</h2>
      
      <div class="section">
        <h3>🌟 这是一个什么项目？</h3>
        <p>这是一个属于冬日的“时间胶囊”。你可以在树上挂下你的祝福、心愿或照片，但它们会被“封印”起来。</p>
        <p>直到 <b>2025年12月25日</b> 圣诞节当天，所有的礼物都会自动解封，我们可以一起回看这棵承载着记忆的树。</p>
      </div>

      <div class="section">
        <h3>📝 如何操作？</h3>
        <ul>
          <li>点击树上的 <b>空白处</b> 即可挂上新的礼物。</li>
          <li>你可以上传最多 <b>3 张照片</b>。</li>
          <li>点击左右箭头可以切换查看不同的树（每棵树限挂 10 个）。</li>
          <li>尝试多切换几次图标，也许会发现 <b>隐藏彩蛋</b> 哦！</li>
        </ul>
      </div>

      <div class="section credits">
        <h3>Build with ❤️</h3>
        <p>如果觉得有趣，欢迎去 GitHub 点个 Star。</p>
        <a href="https://github.com/shmilyty/deco" target="_blank" class="github-btn">
          <svg height="20" width="20" viewBox="0 0 16 16" version="1.1" class="github-icon" aria-hidden="true">
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>

      <button class="back-btn" @click="router.push('/')">返回圣诞树</button>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  /* ⚠️ 核心修改 1: 保持居中，但如果屏幕太矮，padding 会保底 */
  align-items: center; 
  
  /* 确保容器本身占满屏幕 */
  height: 100vh; 
  width: 100%;
  
  /* ⚠️ 核心修改 2: 增加上下内边距 */
  /* 顶部留 80px 避开倒计时，底部留 40px */
  padding: 80px 20px 40px 20px; 
  box-sizing: border-box;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  color: #2c3e50;
  font-family: 'Nunito', sans-serif;
  box-sizing: border-box;

  /* 👇👇👇 核心修改 3：全局限制高度 👇👇👇 */
  /* 无论在手机还是电脑，卡片高度永远不会超过容器高度 */
  /* height: 100%; 会强制填满，不好看，用 max-height */
  max-height: 100%; 
  
  /* 👇👇👇 核心修改 4：开启内部滚动 👇👇👇 */
  /* 当内容超过 max-height 时，卡片内部出现滚动条 */
  overflow-y: auto;
  
  /* 优化滚动体验 */
  overscroll-behavior: contain; /* 防止滚动传导给背景 */
}

/* 移动端适配 (微调) */
@media (max-width: 768px) {
  .about-container {
    padding-top: 120px; /* 手机端顶部避让更多，因为倒计时居中 */
    align-items: flex-start; /* 手机上靠顶对齐可能更好看，或者保持 center 也可以 */
  }
  
  .glass-card {
    padding: 25px;
  }
}
.glass-card::-webkit-scrollbar {
  width: 6px;
}
.glass-card::-webkit-scrollbar-track {
  background: transparent;
}
.glass-card::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.glass-card::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2);}
h2 {
  font-family: 'Mountains of Christmas', cursive;
  color: #fbbf24;
  font-size: 2.5rem;
  text-align: center;
  margin-top: 0;
}

h3 {
  color: #165b33; /* 圣诞绿 */
  margin-bottom: 10px;
  font-family: 'Ma Shan Zheng', cursive;
}

p, li { line-height: 1.6; font-size: 1.1rem; }
ul { padding-left: 20px; }
li { margin-bottom: 8px; }

.credits { margin-top: 30px; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; }

.github-btn:visited,
.github-btn:active,
.github-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* 图标和文字的间距 */
  
  /* background-color: #24292e; GitHub 官方黑 */
  background-color: #000000;
  color: white  !important;
  text-decoration: none;
  
  padding: 10px 20px;
  border-radius: 30px; /* 胶囊形状 */
  font-weight: bold;
  font-size: 1rem;
  
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
}

.github-btn:hover {
  background-color: #333333; /* 悬停变深黑 */
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  color: #ffffff !important;
}

.github-icon {
  fill: white; /* 确保 Logo 是白色的 */
}

.back-btn {
  display: block;
  width: 100%;
  margin-top: 30px;
  padding: 15px;
  background: #d42426;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(212, 36, 38, 0.3);
  transition: transform 0.2s;
}
.back-btn:hover { transform: scale(1.02); }
</style>