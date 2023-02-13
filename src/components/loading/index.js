import loading from './index.vue';
export default Vue => {
  let loadingComp = Vue.extend(loading);
  let loadingDom;
  function showLoading(msg, duration = 3e3) {
    loadingDom = new loadingComp({
      data() {
        return {
          show: true,
          msg,
        };
      },
    }).$mount();
    document.body.appendChild(loadingDom.$el);
  }

  function hideLoading() {
    loadingDom.show = false;
  }
  Vue.prototype.$loadingshow = showLoading;
  Vue.prototype.$loadinghide = hideLoading;
};
