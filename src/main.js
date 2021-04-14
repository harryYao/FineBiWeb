// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Enums from './utils/enums';
import ElementUI from './utils/el';
import hljs from "highlight.js"

import 'highlight.js/styles/default.css';
import './assets/theme/index.css';
import './assets/base.less';
import './assets/icons/iconfont.css';

Vue.config.productionTip = false;

// 弹出框禁止滑动
Vue.prototype.noScroll = () => {
  const mo = (e) => {
    e.preventDefault();
  };
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', mo, false); // 禁止页面滑动
};

// 弹出框可以滑动
Vue.prototype.canScroll = () => {
  const mo = (e) => {
    e.preventDefault();
  };
  document.body.style.overflow = ''; // 出现滚动条
  document.removeEventListener('touchmove', mo, false);
};

// 定义自定义指令 highlight 代码高亮
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

// 引入 Element
// Vue.use(ElementUI);
// 改为按需引入，减少包的体积
Vue.use(ElementUI);
Vue.use(Enums);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
