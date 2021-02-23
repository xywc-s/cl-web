<template>
  <v-snackbar v-model="show" :color="color" top text elevation="24" timeout="2000">
    <v-icon :color="color">{{color | iconFilter}}</v-icon>
    {{ message }}
    <!-- <v-btn text @click="show = false">Close</v-btn> -->
  </v-snackbar>
</template>

<script>
export default {
  filters: {
    iconFilter(val) {
      switch (val) {
        case 'success':
          return 'mdi-check-circle'
          break;
        case 'error':
          return 'mdi-close-circle'
          break;
        case 'info':
          return 'mdi-alert-circle'
          break;
        default: return ''
          break;
      }
    }
  },
  data() {
    return {
      show: false,
      message: '',
      color: ''
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  }
}
</script>
