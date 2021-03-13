<template>
  <div id="map-view">
    <div class="container">
      <div class="head">
        <div class="weather">
          <div class="weather_text">
            {{ localweather.city }}&emsp;{{ localweather.country }}&emsp;{{
            localweather.wea }}&emsp;{{ localweather.tem }}&#8451;
          </div>
          <div class="weather_img">
            <img :src="weatherImg" />
          </div>
        </div>
        <div class="navigator">
          <div>
            <el-button type="primary" class="toreport" @click="toReport()">查看报表</el-button>
          </div>

          <div>
            <el-cascader
              v-model="value"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
          </div>
        </div>
        <h1>三向度空间大数据分析系统</h1>
        <time id="timer" class="arial">
          <span>{{ date }}</span>
        </time>
      </div>
      <div class="body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      localweather: {},
      weatherImg: '',
      date: new Date().toLocaleString(),
      value: [],
      options: [
        {
          value: 'data',
          label: '数据分析层',
          children: [
            {
              value: 'people',
              label: '👩🏼‍🤝‍👨🏿人群视图',
              children: [
                {
                  value: 'heat',
                  label: '🚍实时热力图',
                },
                {
                  value: 'routes',
                  label: '🚖轨迹透镜',
                },
                {
                  value: 'stationary',
                  label: '🏃用户行为分析',
                },
              ],
            },
            {
              value: 'resources',
              label: '🏡资源视图',
              children: [
                {
                  value: 'analysis',
                  label: '🌃城市功能分区',
                },
              ],
            },
            {
              value: 'links',
              label: '🏗链接视图',
              children: [
                {
                  value: 'metro',
                  label: '🌇交通可达性分析',
                },
              ],
            },
          ],
        },
        {
          value: 'strategy',
          label: '复合决策层',
          children: [
            {
              value: 'gether',
              label: '🚧异常人群聚集检测',
            },
            {
              value: 'predict',
              label: '🛢交通流量预测调度',
            },
            {
              value: 'develop',
              label: '🛫城市资源发展规划',
            },
          ],
        },
      ],
    };
  },
  created() {
    this.getWeather();
  },
  mounted() {
    var _this = this;
    this.timer = setInterval(() => {
      _this.date = new Date().toLocaleString(); // 修改数据date
    }, 1000);
    console.log(window.location.pathname);

    if (window.location.pathname === '/map/predict') {
      this.value = ['strategy', 'predict'];
    }
    if (window.location.pathname === '/map/gether') {
      this.value = ['strategy', 'gether'];
    }
    if (window.location.pathname === '/map/develop') {
      this.value = ['strategy', 'develop'];
    }
    if (window.location.pathname === '/map/stationary') {
      this.value = ['data', 'people', 'stationary'];
    }
    if (window.location.pathname === '/map/heat') {
      this.value = ['data', 'people', 'heat'];
    }
    if (window.location.pathname === '/map/routes') {
      this.value = ['data', 'people', 'routes'];
    }
    if (window.location.pathname === '/map/analysis') {
      this.value = ['data', 'resources', 'analysis'];
    }
    if (window.location.pathname === '/map/metro') {
      this.value = ['data', 'links', 'metro'];
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    handleChange(value) {
      this.$store.commit('hide');
      setTimeout(() => {
        this.changeroute(value[value.length - 1]);
      }, 500);
    },
    toReport() {
      this.changeroute('/report');
    },
    changeroute(mr) {
      this.$router.push(mr);
    },
    getWeather: function() {
      var _this = this;
      this.$http
        .get(
          'https://tianqiapi.com/api?version=v6&appid=71549884&appsecret=XH6bWw5A&cityid=101070101'
        )
        .then(function(response) {
          _this.localweather = response.data;
          _this.weatherImg =
            'http://tq.daodaoim.com//tianqiapi/skin/pitaya/' +
            response.data.wea_img +
            '.png';
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 1600px;
  padding: 2.66rem;
}
.head {
  /* display: flex; */
  position: relative;
  display: block;
  font-size: 20px;
  /* width: 100%;
  height: 100px; */
  /* background: #2c3e50; */
  /* color: aliceblue; */
  /* justify-content: space-between; */
  text-align: center;
  z-index: 2;
}
.head h1 {
  font-weight: lighter;
  font-size: 2.666666667rem;
  margin: 0px;
  padding-top: 0.333333333rem;
  padding-bottom: 0.666666667rem;
  border-bottom: 4px rgba(75, 202, 235, 0.32) solid;
  letter-spacing: 1px;
}
.weather {
  position: absolute;
  display: flex;
  top: 10px;
  /* padding-left: 50px;
  align-items: center;
  justify-content: center; */
}
.weather div {
  /* line-height: 55px; */
  display: inline-flex;
  padding: 10px;
}

.weather_text {
  height: 50px;
  line-height: 50px;
}

.title h1 {
  margin: 0;
}
.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.body {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 1;
  min-height: 907px;
  /* position: relative;
  flex: 1;
  width: 100%;
  background: #2c3e50; */
}
.navigator {
  display: flex;
  position: absolute;
  right: 10px;
  top: 0px;
  /* position: relative;
  padding-right: 80px;
  align-items: center;
  justify-content: space-around; */
}
.navigator div {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toreport {
  background-color: rgba(69, 123, 157, 0.3) !important;
  color: aliceblue !important;
  height: 39.98px;
  border-color: white !important;
}
.toreport:hover {
  background-color: rgba(69, 123, 157, 0.8) !important;
  color: aliceblue !important;
  border-color: rgb(64, 158, 255) !important;
}
.el-cascader {
  width: 350px;
}
#timer {
  width: 35rem;
  display: block;
  margin: 0 auto;
  border-bottom: 4px rgba(75, 202, 235, 0.32) solid;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-top: 1px #111317 solid;
  position: relative;
  top: -4px;
}
time#timer:before {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: -20px;
  top: -1px;
  transform: skew(45deg, 0deg);
  border-left: 5px rgba(75, 202, 235, 0.32) solid;
  border-top: 4px #111317 solid;
}

#timer:after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  right: -20px;
  top: -1px;
  transform: skew(-45deg, 0deg);
  border-right: 5px rgba(75, 202, 235, 0.32) solid;
  border-top: 4px #111317 solid;
}
</style>
<style>
.el-cascader input {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
.el-cascader-panel {
  background-color: rgba(0, 25, 46, 0.3) !important;
}
.el-cascader__dropdown {
  background-color: rgba(0, 25, 46, 0.3) !important;
}
.el-cascader-panel span {
  color: aliceblue !important;
}
.el-cascader-menu li :hover {
  color: aliceblue !important;
}
.el-cascader-node:not(.is-disabled):hover {
  background-color: rgba(69, 123, 157, 0.8) !important;
  color: aliceblue !important;
}
</style>

