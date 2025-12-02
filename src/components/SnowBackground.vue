<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const containerRef = ref(null);
let rafId = null;
let particles = [];
let width = 0;
let height = 0;

// 只使用雪花色系：白色 / 浅蓝 / 乳白 / 非鲜艳的蓝灰
const possibleColors = ["#ffffff", "#f8feff", "#eaf8ff", "#dff6ff", "#f3f7fb"];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const el = containerRef.value;
  if (el) {
    el.style.width = width + 'px';
    el.style.height = height + 'px';
  }
}

function createParticle() {
  const color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
  const size = 6 + Math.random() * 18; // 大小范围
  const x = Math.random() * width;
  const y = -20 - Math.random() * 40;
  const vx = (Math.random() - 0.5) * 0.6; // 水平漂移
  const vy = 0.4 + Math.random() * 1.2;   // 下落速度
  const rotation = Math.random() * 360;
  const rotationSpeed = (Math.random() - 0.5) * 2;
  const lifeSpan = 300 + Math.floor(Math.random() * 200);

  const el = document.createElement('span');
  el.className = 'snowflake';
  el.textContent = '❄';
  el.style.position = 'fixed';
  el.style.left = '0';
  el.style.top = '0';
  el.style.pointerEvents = 'none';
  el.style.touchAction = 'none';
  el.style.zIndex = '10';
  el.style.willChange = 'transform, opacity';
  el.style.color = color;
  el.style.fontSize = size + 'px';
  el.style.opacity = (0.6 + Math.random() * 0.4).toString();

  containerRef.value.appendChild(el);

  const particle = {
    el,
    x,
    y,
    vx,
    vy,
    rotation,
    rotationSpeed,
    size,
    opacity: parseFloat(el.style.opacity),
    lifeSpan
  };

  particles.push(particle);
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.lifeSpan--;

    const lifeRatio = Math.max(p.lifeSpan / 500, 0);
    const scale = 0.6 + 0.4 * lifeRatio;
    const fade = Math.min(1, lifeRatio + 0.2);

    p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg) scale(${scale})`;
    p.el.style.opacity = (p.opacity * fade).toString();

    if (p.y > height + 50 || p.lifeSpan <= 0) {
      if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
      particles.splice(i, 1);
    }
  }
}

let lastSpawn = 0;
function loop(ts) {
  // spawn rate control: 大约每 30-100ms 生成 0-2 个雪花，形成连续背景雪
  if (!lastSpawn) lastSpawn = ts;
  const delta = ts - lastSpawn;
  if (delta > 30) {
    const count = Math.random() < 0.3 ? 0 : (Math.random() < 0.7 ? 1 : 2);
    for (let i = 0; i < count; i++) createParticle();
    lastSpawn = ts;
  }

  updateParticles();
  rafId = requestAnimationFrame(loop);
}

onMounted(() => {
  resize();
  window.addEventListener('resize', resize);
  // 初始填充一些雪花
  for (let i = 0; i < 30; i++) createParticle();
  rafId = requestAnimationFrame(loop);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  cancelAnimationFrame(rafId);
  // 清理 DOM 元素
  particles.forEach(p => {
    if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
  });
  particles = [];
});
</script>

<template>
  <div ref="containerRef" class="snow-surface" aria-hidden="true"></div>
</template>

<style scoped>
.snow-surface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* 与之前 canvas 行为一致，雪花在前面 */
  pointer-events: none; /* 让鼠标点击能穿透雪花 */
  overflow: hidden;
}

/* 单个雪花基本样式（具体样式在运行时按元素设置） */
.snowflake {
  display: inline-block;
  line-height: 1;
  user-select: none;
}
</style>