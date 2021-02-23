const snackbarPlugin = {
  install: (Vue, { store }) => {
    if (!store) {
      throw new Error('Please provide vuex store.');
    }

    Vue.prototype.$notify = {
      success: function (content = '') {
        store.commit('snackbar/showMessage', { content, color: "success" }, { root: true })
      },
      error: function (content = '') {
        store.commit('snackbar/showMessage', { content, color: "error" }, { root: true })
      },
      info: function (content = '') {
        store.commit('snackbar/showMessage', { content, color: "info" }, { root: true })
      }
    };
  },
};
export default snackbarPlugin;
