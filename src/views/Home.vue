<script setup>
import ChristmasTree from '../components/ChristmasTree.vue';
</script>

<template>
  <div class="home-container">
    <div class="header-area">
      <h1>Deco My Tree 🎄</h1>
      <p>点击圣诞树，挂上你的礼物</p>
    </div>
    <ChristmasTree />
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 确保主页只占一屏，绝对不许滚 */
  height: 100vh; 
  width: 100%;
  height: 100dvh;
  overflow: hidden; /* ⚠️ 关键：如果有溢出，直接切掉（或强制压缩子元素） */
  
  /* PC端布局 */
  justify-content: center;
  padding-top: 20px;
  box-sizing: border-box;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .home-container {
    justify-content: flex-start;
    /* 给顶部倒计时留空，但不能留太多导致树没地方放 */
    padding-top: 90px;
    /* padding-left: 20px;  */
    /* padding-right: 20px; */
    padding-bottom: 20px; /* 底部留点空隙给导航条 */
    overflow: hidden;
  }
  
  h1 {
    font-size: 1.8rem;
    margin: 0 0 10px 0;
  }
  .header-area {
  /* 👇 核心代码：控制标题整体与下方树的距离 */
  margin-bottom: 0px; 
  
  flex-shrink: 0;
  z-index: 5;
  }
}
/* 你的标题样式 */
h1 { font-family: 'Mountains of Christmas', cursive; color: #f9f9f9; margin-bottom: 5px; text-shadow: 0 4px 6px rgba(139, 0, 0, 0.6); }
p { color: white; margin-top: 0; text-shadow: 0 2px 4px rgba(168, 26, 28, 0.5); }
</style>