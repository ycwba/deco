<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

// 1. Props & Emits
const props = defineProps({
  isOpen: Boolean,
  mode: String,
  data: Object,
  locked: Boolean
});
const emit = defineEmits(['close', 'submit']);

// 2. 状态定义 (全部放在最前面)
const step = ref('edit');
const currentIndex = ref(0);
const nickname = ref('');
const content = ref('');
const isPrivate = ref(false);
const isEasterEgg = ref(false);
const selectedFiles = ref([]);
const previewUrls = ref([]);
const showWarning = ref(false);
const warningMsg = ref("");

// 3. 常量定义
const EASTER_EGG_ICON = '/tree/icons/secret.png';
const icons = [
  '/tree/icons/crystalball.png',
  '/tree/icons/gingerbread.png',
  '/tree/icons/glove.png',
  '/tree/icons/snowflake.png',
  '/tree/icons/gift.png',
  '/tree/icons/ribbon.png',
  '/tree/icons/ball.png',
  '/tree/icons/mistletoe.png',
  '/tree/icons/cupcake.png'
];

// 4. 计算属性
const visibleIcons = computed(() => {
  const total = icons.length;
  const result = [];
  for (let i = -2; i <= 2; i++) {
    const index = (currentIndex.value + i + total) % total;
    let iconPath = icons[index];
    if (i === 0 && isEasterEgg.value) {
      iconPath = EASTER_EGG_ICON;
    }
    result.push({ icon: iconPath, offset: i, realIndex: index });
  }
  return result;
});

// 5. 方法定义
const triggerWarning = (msg) => {
  warningMsg.value = msg;
  showWarning.value = true;
  setTimeout(() => { showWarning.value = false; }, 3000);
};

const tryTriggerEasterEgg = () => {
  isEasterEgg.value = false;
  if (Math.random() < 0.02) {
    isEasterEgg.value = true;
    console.log("🎉 彩蛋触发！");
  }
};

const nextIcon = () => { currentIndex.value = (currentIndex.value + 1) % icons.length; tryTriggerEasterEgg(); };
const prevIcon = () => { currentIndex.value = (currentIndex.value - 1 + icons.length) % icons.length; tryTriggerEasterEgg(); };
const selectIconByOffset = (offset) => { 
  if (offset === 0) return; 
  const total = icons.length; 
  currentIndex.value = (currentIndex.value + offset + total) % total; 
  tryTriggerEasterEgg(); 
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  if (selectedFiles.value.length + files.length > 3) {
    triggerWarning("包裹太重啦，最多只能放 3 张照片哦 📷");
    return;
  }
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    selectedFiles.value.push(file);
    previewUrls.value.push(URL.createObjectURL(file));
  });
  event.target.value = ''; 
};

const removeImage = (index) => {
  selectedFiles.value.splice(index, 1);
  URL.revokeObjectURL(previewUrls.value[index]);
  previewUrls.value.splice(index, 1);
};

const toPreview = () => {
  if (!content.value.trim()) {
    triggerWarning("你的祝福卡片还是空的呢 📝");
    return;
  }
  step.value = 'preview';
};

const backToEdit = () => { step.value = 'edit'; };

const confirmSubmit = () => {
  const finalIcon = isEasterEgg.value ? EASTER_EGG_ICON : icons[currentIndex.value];
  emit('submit', {
    icon: finalIcon,
    nickname: nickname.value || '神秘人',
    content: content.value,
    isPrivate: isPrivate.value,
    images: selectedFiles.value
  });
};

// 6. 监听器 (⚠️ 关键：必须放在所有变量声明之后！)
watch(() => props.isOpen, (val) => {
  if (val) {
    // 卡片打开：添加 class
    document.body.classList.add('reading-mode');
    
    // 如果是写模式：重置表单
    if (props.mode === 'write') {
      step.value = 'edit';
      currentIndex.value = 0;
      isEasterEgg.value = false;
      nickname.value = '';
      content.value = '';
      isPrivate.value = false;
      selectedFiles.value = [];
      previewUrls.value = [];
    }
  } else {
    // 卡片关闭：移除 class
    document.body.classList.remove('reading-mode');
  }
});

// 7. 生命周期钩子
onUnmounted(() => {
  document.body.classList.remove('reading-mode');
  previewUrls.value.forEach(url => URL.revokeObjectURL(url));
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
      
      <Transition name="slide-down">
        <div v-if="showWarning" class="warning-toast">
          <span class="warning-icon">⚠️</span>
          {{ warningMsg }}
        </div>
      </Transition>

      <div class="card" :class="{ 'locked-shake': mode === 'read' && locked }">
        <button class="close-btn" @click="$emit('close')">✕</button>

        <div v-if="mode === 'write'" class="flip-scene">
          <div class="flip-wrapper" :class="{ 'is-flipped': step === 'preview' }">
            
            <div class="card-face card-front">
              <h3 class="title">写下祝福 🎄</h3>
              <div class="carousel-container">
                <button class="nav-btn left" @click="prevIcon">‹</button>
                <div class="carousel-track">
                  <div 
                    v-for="item in visibleIcons" 
                    :key="item.realIndex + '-' + item.offset"
                    class="carousel-item"
                    :class="{ 
                      'active': item.offset === 0,
                      'side': item.offset !== 0,
                      'is-egg': item.offset === 0 && isEasterEgg  
                    }"
                    :style="{ '--offset': item.offset, '--abs-offset': Math.abs(item.offset) }"
                    @click="selectIconByOffset(item.offset)"
                  >
                    <img :src="item.icon" alt="icon" class="icon-img" />
                  </div>
                </div>
                <button class="nav-btn right" @click="nextIcon">›</button>
              </div>
              <div class="input-group">
                <input v-model="nickname" type="text" placeholder="你的昵称 (可选)" maxlength="12">
              </div>
              <div class="input-group">
                <textarea v-model="content" placeholder="在这个雪夜，你想说些什么..." rows="4"></textarea>
              </div>
              <div class="upload-section">
                <div class="preview-grid">
                  <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
                    <img :src="url" />
                    <button class="remove-btn" @click="removeImage(index)">×</button>
                  </div>
                  <label v-if="previewUrls.length < 3" class="upload-btn">
                    <input type="file" accept="image/*" multiple @change="handleFileChange" hidden>
                    <span>📷 添加图片</span>
                  </label>
                </div>
                <div class="limit-hint">{{ previewUrls.length }}/3</div>
              </div>
              <label class="toggle-privacy">
                <input type="checkbox" v-model="isPrivate">
                <span class="checkmark"></span>
                <span class="text">悄悄话 (仅对方可见)</span>
              </label>
              <button class="action-btn primary" @click="toPreview">生成预览</button>
            </div>

            <div class="card-face card-back">
              <h3 class="title">确认挂上去吗？</h3>
              <div class="preview-box">
                <div class="preview-icon"><img :src="isEasterEgg ? EASTER_EGG_ICON : icons[currentIndex]" class="preview-img-lg" /></div>
                <div class="preview-from">
                  <div class="from-label">From.</div>
                  <div class="from-name">{{ nickname || '神秘人' }}</div>
                </div>
                <div class="preview-body">{{ content }}</div>
                <div v-if="previewUrls.length > 0" class="image-gallery">
                  <img v-for="(url, idx) in previewUrls" :key="idx" :src="url" class="gallery-img" />
                </div>
                <div v-if="isPrivate" class="private-tag">🔒 私密消息</div>
              </div>
              <p class="warning-text">一旦挂上树梢，就不能取下来了哦</p>
              <div class="button-row">
                <button class="action-btn secondary" @click="backToEdit">返回修改</button>
                <button class="action-btn primary" @click="confirmSubmit">确认挂上</button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card-content read-mode">
          <div v-if="locked" class="locked-view">
            <div class="big-icon">🔒</div>
            <h3>封印中</h3>
            <p>From: {{ data?.nickname || '???' }}</p>
            <div class="blur-text">
              这里是由于时间魔法而被隐藏的内容...<br>等到圣诞节才可以拆开哦！
            </div>
            <p class="hint">预计解锁时间：12月25日</p>
          </div>
          <div v-else class="unlocked-view">
            <div class="big-icon"><img :src="data?.icon" class="preview-img-lg" /></div>
            <div class="message-meta">
              <div class="from-label">From.</div>
              <div class="from-name">{{ data?.nickname }}</div>
            </div>
            <div class="message-body">{{ data?.content }}</div>
            <div v-if="data?.images && data.images.length > 0" class="image-gallery">
              <img v-for="(path, idx) in data.images" :key="idx" :src="`http://localhost:3000${path}`" class="gallery-img" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 保持你原本的样式不变，不需要修改 */
/* ... 粘贴你原本的 CSS ... */
/* 基础动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:root {
  --handwriting-font: 'Courgette', 'Ma Shan Zheng', cursive;
}
.overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px;
}
.card {
  width: 90%; max-width: 360px; border-radius: 16px; padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative;
  border: 4px solid #d42426; color: #333;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #fffbf0;
  background-image: linear-gradient(#e8e8e8 1px, transparent 1px);
  background-size: 100% 2rem; background-attachment: local;
}
@keyframes popIn {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer; padding: 5px; z-index: 10; }
.title { text-align: center; margin-top: 0; color: #d42426; font-family: 'Georgia', serif; }
.carousel-container { display: flex; align-items: center; justify-content: center; position: relative; height: 80px; margin-bottom: 5px; perspective: 500px; }
.carousel-track { display: flex; align-items: center; justify-content: center; width: 100%; position: relative; }
.carousel-item {
  position: relative; font-size: 2.5rem; width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  user-select: none; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateX(calc(var(--offset) * 10px)) scale(calc(1 - var(--abs-offset) * 0.2)) translateZ(calc(var(--abs-offset) * -50px));
  opacity: calc(1 - var(--abs-offset) * 0.4); z-index: calc(10 - var(--abs-offset)); border-radius: 12px;
}
.carousel-item.active { background: #fff; box-shadow: 0 4px 12px rgba(212, 36, 38, 0.2); border: 2px solid #d42426; font-size: 3rem; z-index: 100; }
.nav-btn { background: none; border: none; font-size: 2rem; color: #d42426; cursor: pointer; padding: 0 10px; z-index: 20; opacity: 0.6; }
.nav-btn:hover { opacity: 1; transform: scale(1.2); }
.icon-img { width: 40px; height: 40px; object-fit: contain; pointer-events: none; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1)); }
.carousel-item.active.is-egg img { filter: drop-shadow(0 0 15px gold); animation: egg-shake 0.5s ease-in-out infinite; }
@keyframes egg-shake {
  0%, 100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(-10deg) scale(1.1); } 75% { transform: rotate(10deg) scale(1.1); }
}
.input-group { margin-bottom: 15px; }
input, textarea { width: 100%; padding: 8px 0; border: none; border-bottom: 2px dashed #d42426; background: transparent; font-family: 'Nunito', sans-serif; font-size: 1.1rem; color: #2c3e50; margin-bottom: 1rem; transition: border-color 0.3s; }
input:focus, textarea:focus { outline: none; border-bottom: 2px solid #165b33; }
textarea { resize: none; }
.action-btn { width: 100%; padding: 12px; border: none; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); letter-spacing: 1px; text-transform: uppercase; }
.action-btn:active { transform: translateY(2px); box-shadow: none; }
.primary { background: #d42426; color: white; }
.secondary { background: #eee; color: #666; }
.action-btn:hover { opacity: 0.9; }
.button-row { display: flex; gap: 10px; }
.preview-box { background: white; padding: 20px; border-radius: 8px; border: 1px dashed #ccc; text-align: center; margin-bottom: 15px; }
.preview-icon { font-size: 3rem; margin-bottom: 10px; }
.preview-img-lg { width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2)); }
.preview-from, .message-meta { text-align: left; color: #165b33; font-family: 'Courgette', 'Ma Shan Zheng', cursive; margin-bottom: 15px; margin-top: 10px; line-height: 1.2; }
.from-label { font-size: 1.1rem; font-weight: 800; opacity: 0.8; }
.from-name { font-size: 1.6rem; font-weight: 900; margin-left: 5px; letter-spacing: 1px; }
.preview-body, .message-body { font-size: 1.35rem; line-height: 1.8; text-align: left; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; max-width: 100%; color: #2c3e50; max-height: 200px; overflow-y: auto; background: rgba(255, 255, 255, 0.5); border-radius: 8px; padding: 12px; font-family: 'Courgette', 'Ma Shan Zheng', cursive; text-shadow: 0 0 1px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); box-sizing: border-box; }
.preview-body::-webkit-scrollbar, .message-body::-webkit-scrollbar { width: 6px; }
.preview-body::-webkit-scrollbar-track, .message-body::-webkit-scrollbar-track { background: transparent; }
.preview-body::-webkit-scrollbar-thumb, .message-body::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
.preview-body::-webkit-scrollbar-thumb:hover, .message-body::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
.upload-section { margin-bottom: 15px; }
.preview-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.preview-item { position: relative; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; }
.preview-item img { width: 100%; height: 100%; object-fit: cover; }
.remove-btn { position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.6); color: white; border: none; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.upload-btn { width: 60px; height: 60px; border: 2px dashed #d42426; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #d42426; cursor: pointer; background: rgba(212, 36, 38, 0.05); }
.upload-btn span { margin-top: 4px; font-size: 0.6rem; }
.limit-hint { font-size: 0.7rem; color: #999; text-align: right; margin-top: 4px; }
.image-gallery { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 5px; }
.gallery-img { height: 80px; width: auto; border-radius: 6px; border: 1px solid #eee; flex-shrink: 0; }
.flip-scene { perspective: 1000px; }
.flip-wrapper { display: grid; grid-template-areas: "stack"; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
.flip-wrapper.is-flipped { transform: rotateY(180deg); }
.card-face { grid-area: stack; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: transparent; width: 100%; }
.card-front { transform: rotateY(0deg); }
.card-back { transform: rotateY(180deg); }
.warning-toast { position: absolute; top: 10%; left: 50%; transform: translateX(-50%); background: #f97316; color: white; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); z-index: 200; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.toggle-privacy { display: flex; align-items: center; margin-bottom: 20px; cursor: pointer; font-size: 0.9rem; color: #666; }
.toggle-privacy input { display: none; }
.checkmark { width: 16px; height: 16px; border: 2px solid #ccc; border-radius: 4px; margin-right: 8px; display: inline-block; position: relative; }
.toggle-privacy input:checked + .checkmark { background: #d42426; border-color: #d42426; }
.locked-view { text-align: center; color: #666; }
.big-icon { font-size: 4rem; margin-bottom: 10px; display: block; }
.blur-text { filter: blur(4px); user-select: none; opacity: 0.5; margin: 20px 0; background: #eee; }
.hint { font-size: 0.8rem; color: #d42426; }
.unlocked-view { text-align: center; }
</style>