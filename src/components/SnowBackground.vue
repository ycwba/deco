<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref(null);
let animationFrameId;

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // 设置画布大小
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // 雪花粒子配置
  const particles = [];
  const particleCount = 100; // 雪花数量

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1, // 半径
      d: Math.random() * particleCount, // 密度因子
      speed: Math.random() * 1 + 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    update();
    animationFrameId = requestAnimationFrame(draw);
  }

  function update() {
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.y += p.speed;
      // 飘动效果
      p.x += Math.sin(p.d) * 0.5;

      // 如果雪花落到底部，重置到顶部
      if (p.y > height) {
        particles[i] = {
          x: Math.random() * width,
          y: -10,
          r: p.r,
          d: p.d,
          speed: p.speed
        };
      }
    }
  }

  draw();

  // 窗口大小改变时重置
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas ref="canvasRef" class="snow-canvas"></canvas>
</template>

<style scoped>
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 雪花在树的前面 */
  pointer-events: none; /* 关键：让鼠标点击能穿透雪花 */
}
</style>