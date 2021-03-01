import Vue from 'vue';
import Vant from 'vant';
import 'lib-flexible/flexible';
import 'vant/lib/index.css';

import mobile from './mobile.vue';
import router from './router';
import store from './store';

import './assets/base.less';
import './assets/icons/iconfont.css';

Vue.use(Vant);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#mobile',
  router,
  store,
  components: { mobile },
  template: '<mobile/>',
});
