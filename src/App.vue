<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',

  data() {
    return {
      isCollapse: true,
    };
  },
  methods: {
    changeroute(mr) {
      this.$router.push(mr);
      window.location.reload();
    },
  },
  computed: {
    changeMessage() {
      return this.$route.path;
    },
  },
};
</script>

<style>
html,
body,
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: white;
}
.el-cascader__dropdown {
  height: 130px;
}
.el-cascader-panel {
  height: 130px;
}
</style>
