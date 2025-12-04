
<script setup>
import SnowBackground from './components/SnowBackground.vue';
import Countdown from './components/Countdown.vue';
// 👇 1. 引入 useRoute
import { useRoute } from 'vue-router';
const route=useRoute();
</script>

<!-- <template>
  <div class="app-container">
    <SnowBackground />
    <Countdown />
    <div class="content">
      <h1>Deco My Tree 🎄</h1>
      <p>点击圣诞树，挂上你的礼物</p>
      <!-- <p>Tree Owner: 45dino</p> -->
      <!-- <ChristmasTree /> -->
    <!-- </div> -->
  <!-- </div> -->
<!-- </template> --> 

<template>
  <div class="app-container">
    <SnowBackground />
    <Countdown />

    <router-link 
      v-if="route.path !== '/about'" 
      to="/about" 
      class="about-link" 
      title="关于本站"
    >
      <span class="icon">ℹ️</span> 
      <span class="text">About</span>
    </router-link>

    <div class="content">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  position: relative;
  z-index: 10; /* 确保在雪花上面 */
}

/* 关于按钮样式 */
.about-link {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 60; /* 确保在最上层 */
  
  display: flex;
  align-items: center;
  gap: 5px;
  
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  padding: 8px 15px;
  border-radius: 30px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-family: 'Nunito', sans-serif;
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s;
}

.about-link:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}
/* 👇👇👇 新增：移动端适配 👇👇👇 */
@media (max-width: 768px) {
  .about-link {
    /* 移动端改为左上角 */
    right: auto; /* 清除 right 属性 */
    left: 20px;  /* 设置 left */
    
    /* 可选：移动端只显示图标，不显示文字，省空间 */
    /* 如果你想保留文字，下面这几行可以不用加 */
    padding: 8px;
    border-radius: 50%; /* 变成圆形按钮 */
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  /* 如果要在移动端隐藏 "About" 文字只留图标 i，可以加这个 */
  .about-link .text {
    display: none;
  }
}
/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 全局样式重置 */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%; /* 强制占满 */
  overflow: hidden; /* ⚠️ 关键：默认禁止全局滚动，具体的滚动交给子页面（如 About 页）去处理 */
  
  /* 禁止移动端浏览器的“橡皮筋”回弹效果 */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
body::before {
  content: "";
  position: fixed; /* 强制固定在窗口 */
  top: 0;
  left: 0;
  width: 100vw;  /* 强制视口宽度 */
  height: 100vh; /* 强制视口高度 */
  z-index: -1;   /* 放在最底层 */
  
  /* 在这里设置你的背景 */
  /* 如果是之前的红黄渐变： */
  /* background: linear-gradient(135deg, #d42426 0%, #f97316 50%, #fbbf24 100%); */
  
  /* 如果是深蓝色夜空（截图里的样子）： */
  background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);

  background-size: cover;
  background-repeat: no-repeat;
  /* background-position: center; */
}
h1, h2, h3, .title {
  font-family: 'Mountains of Christmas', cursive; /* 圣诞标题字体 */
  font-weight: 700;
}

#app {
  /* position: relative; */
  width: 100%;
  min-height: 100%;
  /* 确保内容不会被背景层盖住 */
}
</style>

<style scoped>
.app-container {
  height: 100vh; /* 强制占满一屏 */
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1; /* 让内容区自动填满剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 内容垂直居中 */
  overflow: hidden;
}
h1 {
  font-size: 2.5rem; /* 稍微改小一点 */
  margin: 10px 0;    /* 减小间距 */
  color: white
}
p {
  color: #94a3b8;
  font-size: 0.9rem;
}
@media (max-width: 768px) {
  /* 当 body 有 reading-mode 类时，隐藏 .countdown-container */
  body.reading-mode .countdown-container {
    opacity: 0 !important;
    pointer-events: none !important;
    transform: translateX(-50%) translateY(-20px) !important;
    transition: all 0.3s ease;
  }
}
</style>
