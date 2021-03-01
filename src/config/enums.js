import Enum from '@/utils/enum';

export const pageTypeEnum = new Enum(
  { alias: 'FrPage', text: 'FR报表页', value: '1' },
  { alias: 'VuePage', text: '自研报表页', value: '2' },
);

export default {

  install(Vue) {
    Vue.prototype.Enums = {};
    Vue.prototype.Enums.pageType = pageTypeEnum;
  },

};
