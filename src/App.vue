<script setup>
import SnowBackground from './components/SnowBackground.vue'
import ChristmasTree from './components/ChristmasTree.vue'
import Countdown from './components/Countdown.vue'
</script>

<template>
  <div class="app-container">
    <SnowBackground />
    <Countdown />
    <div class="content">
      <h1>Deco My Tree 🎄</h1>
      <p>点击圣诞树，挂上你的礼物</p>
      <!-- <p>Tree Owner: 45dino</p> -->
      <ChristmasTree />
    </div>
  </div>
</template>

<style>
/* 全局样式重置 */
body {
  margin: 0;
  background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%); /* 优化背景：由亮到暗的夜空 */
  color: white;
  font-family: 'Nunito', sans-serif; /* 正文圆润字体 */
  overflow-x: hidden;
  overflow: hidden;
}

h1, h2, h3, .title {
  font-family: 'Mountains of Christmas', cursive; /* 圣诞标题字体 */
  font-weight: 700;
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
}
p {
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>