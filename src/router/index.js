import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const router = createRouter({
  // ⚠️ 关键：必须设置 base 为 /tree/，否则刷新后可能会 404 或者路径错乱
  history: createWebHistory('/tree/'), 
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About }
  ]
});

export default router;