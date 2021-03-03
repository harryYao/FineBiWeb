import Enum from './enum';

export const pageTypeEnum = new Enum(
  { alias: 'FrPage', text: 'FR报表页', value: '1' },
  { alias: 'VuePage', text: '自研web页', value: '2' },
);

export default {

  install(Vue) {
    Vue.prototype.Enums = {};
    Vue.prototype.Enums.pageType = pageTypeEnum;
  },

};
