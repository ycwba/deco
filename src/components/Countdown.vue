<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 目标日期：2025年12月25日 00:00:00
const TARGET_DATE = new Date('2025-12-25T00:00:00').getTime();

const timeLeft = ref(0);
let timer = null;

// 计算剩余时间的函数
const updateTime = () => {
  const now = new Date().getTime();
  const diff = TARGET_DATE - now;
  timeLeft.value = Math.max(0, diff);
};

// 将毫秒转换为 天:时:分:秒
const timeData = computed(() => {
  const diff = timeLeft.value;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 补零函数 (1 -> 01)
  const pad = (n) => n.toString().padStart(2, '0');

  return {
    days: days, // 天数可能超过2位，不补零
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  };
});

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="countdown-container">
    <div class="glass-box">
      <div class="label-text">Christmas Countdown</div>
      
      <div class="timer-row">
        <div class="time-block">
          <div class="number-wrapper">
            <Transition name="slide-num" mode="out-in">
              <span :key="timeData.days" class="number">{{ timeData.days }}</span>
            </Transition>
          </div>
          <span class="label">DAYS</span>
        </div>

        <span class="colon">:</span>

        <div class="time-block">
          <div class="number-wrapper">
            <Transition name="slide-num" mode="out-in">
              <span :key="timeData.hours" class="number">{{ timeData.hours }}</span>
            </Transition>
          </div>
          <span class="label">HRS</span>
        </div>

        <span class="colon">:</span>

        <div class="time-block">
          <div class="number-wrapper">
            <Transition name="slide-num" mode="out-in">
              <span :key="timeData.minutes" class="number">{{ timeData.minutes }}</span>
            </Transition>
          </div>
          <span class="label">MIN</span>
        </div>

        <span class="colon">:</span>

        <div class="time-block is-seconds">
          <div class="number-wrapper">
            <Transition name="slide-num" mode="out-in">
              <span :key="timeData.seconds" class="number">{{ timeData.seconds }}</span>
            </Transition>
          </div>
          <span class="label">SEC</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器定位：默认左上角 */
.countdown-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 50; /* 保证在树的上方，但在弹窗下方 */
  user-select: none;
  pointer-events: none; /* 让鼠标点击穿透，不影响下方操作 */
}

/* 毛玻璃卡片 */
.glass-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 15px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: white;
  min-width: 200px;
}

.label-text {
  font-family: 'Mountains of Christmas', cursive; /* 呼应标题字体 */
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #fbbf24; /* 金色 */
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  letter-spacing: 1px;
}

/* 时间行布局 */
.timer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px; /* 固定宽度防止数字变化时抖动 */
}

/* 数字样式 */
.number-wrapper {
  height: 36px; /* 固定高度容器 */
  overflow: hidden; /* 隐藏动画溢出 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.number {
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  line-height: 1;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.label {
  font-size: 0.6rem;
  opacity: 0.8;
  margin-top: 2px;
  font-weight: bold;
  letter-spacing: 1px;
}

/* 冒号闪烁 */
.colon {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px; /* 对齐数字 */
  animation: blink 1s infinite;
  color: rgba(255,255,255,0.6);
}

/* 秒数强调色 */
.is-seconds .number {
  color: #fbbf24;
}

/* --- 动画特效 --- */
@keyframes blink {
  50% { opacity: 0.3; }
}

/* 数字切换动画 (Slide Up) */
.slide-num-enter-active,
.slide-num-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-num-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-num-leave-to {
  transform: translateY(-100%);
  opacity: 0;
  position: absolute; /* 让旧数字腾出空间 */
}

/* --- 📱 移动端适配 (Media Query) --- */
@media (max-width: 768px) {
  .countdown-container {
    /* 移动端逻辑：取消左上角，改为顶部居中并缩小 */
    top: 10px;
    left: 50%;
    transform: translateX(-50%) scale(0.8); /* 整体缩小 20% */
    width: max-content;
  }
  
  .glass-box {
    padding: 10px 15px; /* 减少内边距 */
    background: rgba(0, 0, 0, 0.2); /* 移动端背景稍微深一点，增加对比度 */
  }

  .label-text {
    font-size: 1rem;
  }
}
</style>