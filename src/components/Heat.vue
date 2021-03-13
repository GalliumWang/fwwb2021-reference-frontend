<template>
  <div id="heat">
    <div id="heat-map" class="map"></div>
    <div class="left-chart-up">
      <div id="left-chart-panel"></div>
      <el-radio-group v-model="radio" class="switch" :change="has_change()">
        <!-- @change="has_cange" v-change="has_change()"-->
        <el-radio-button label="1">玫瑰图</el-radio-button>
        <el-radio-button label="2">柱状图</el-radio-button>
      </el-radio-group>
      <!-- <div class="switch">
        <el-button type="primary" @click="drawRose()">玫瑰图</el-button>
        <el-button type="success" @click="drawBar()">柱状图</el-button>
      </div>-->
    </div>

    <div class="right-chart-up">
      <div class="options">
        <div class="left-span">
          <span class="demonstration" style="color: #ffffff">半径</span>
        </div>
        <div class="right-slider">
          <el-slider :min="rsliderMin" :max="rsliderMax" :step="rsliderStep" v-model="radius"></el-slider>
        </div>
      </div>
      <div class="options">
        <div class="left-span">
          <span class="demonstration" style="color: #ffffff">阈值</span>
        </div>
        <div class="right-slider">
          <el-slider :max="thresholdMax" v-model="max"></el-slider>
        </div>
      </div>
    </div>
    <div class="right-chart-middle" id="right-chart-middle"></div>

    <div class="right-chart-down">
      <div class="tip">
        <span class="heatmap-span-left">{{heatmin}}</span>
        <span class="heatmap-span-right">{{max}}</span>
      </div>
      <div class="gradients"></div>
    </div>
    <div class="chart-down" id="chart-heat"></div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
export default {
  name: 'Heat',
  data() {
    return {
      heatMapData: [],
      time: [],
      sum: [],
      map: null,
      buttonName: '用户设置',
      unchange: true,
      leftChartSwitch: true,
      heatMapLayer: null,
      count: 0,
      s: 0,
      websock: null,
      _themeRiver: null,
      _polarStack: null,
      radius: 0.004,
      max: 100,
      heatmin: 0,
      rsliderMin: 0.001,
      rsliderMax: 0.005,
      rsliderStep: 0.0001,
      thresholdMax: 200,
      colorList: [
        '#ef476f',
        '#f78c6b',
        '#ffd166',
        '#06d6a0',
        '#118ab2',
        '#073b4c',
        '#ff1654',
        '#f3ffbd',
        '#b2dbbf',
        '#70c1b3',
        '#247ba0',
        '#5f0f40',
        '#9a031e',
      ],
      radio: 0,
    };
  },
  created() {
    this.initWebSocket();
  },

  mounted() {
    let tmptime = new Date().getTime();
    this.heatMapData = [];
    this.time = new Array(6)
      .fill(tmptime)
      .map((item, i) => item - i * 2000)
      .reverse();
    var that = this;
    this.map = L.map('heat-map', {
      minZoom: 3,
      maxZoom: 14,
      center: [41.79, 123.40333],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
    });

    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.map);
    this.sum = [
      [211, 228, 283],
      [195, 314, 451],
      [187, 238, 357],
      [436, 152, 106],
      [372, 456, 349],
      [372, 456, 349],
      [404, 407, 455],
    ];
    this.setHeatMapLayer();
    this.drawBottomChart();
    this.drawRose();
    this.radio = '1';
    // this.drawBar()
    this.drawPictorialBar();
  },
  beforeDestroy() {
    this.over();
  },
  methods: {
    has_change() {
      console.log(this.radio === '1');
      console.log(typeof this.radio);
      if (this.radio === 0) {
        return;
      }
      if (this.radio === '1') {
        this.drawRose();
      } else {
        this.drawBar();
      }
    },
    initWebSocket() {
      let that = this;
      // 打开一个 web socket
      if (!this.websock) {
        this.websock = new WebSocket(
          'ws://121.199.31.210:8000/chat/get_geo_data/100'
        );

        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
        this.over = () => {
          this.websock.close();
          this.websock.onclose = function(e) {
            console.log(e);
            console.log('关闭');
          };
        };
      }
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let actions = { test: '12345' };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连

      this.initWebSocket();
      console.log('重连');
    },
    websocketonmessage(e) {
      //数据接收
      this.time.push(new Date().getTime());

      this.sum.push(JSON.parse(e.data).sum);
      console.log(JSON.parse(e.data));
      this.map.removeLayer(this.heatMapLayer);
      this.setHeatMapLayer();
      let temp = Math.random() * 100;
      this.heatMapLayer.setData({
        data: JSON.parse(e.data).data,
        max: this.max,
      });

      this.drawBottomChart();
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log('断开连接');
    },
    setHeatMapLayer() {
      var config = {
        radius: this.radius,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      };

      this.heatMapLayer = new HeatmapOverlay(config);
      this.heatMapLayer.addTo(this.map);
    },
    drawBottomChart() {
      var that = this;
      //地铁
      // 初始化底部折线图echarts实例
      let heat_chart = this.$echarts.init(
        document.getElementById('chart-heat')
      );

      // 绘制图表
      heat_chart.setOption({
        grid: {
          top: '2%',
          bottom: '2%',
          left: '2%',
          right: '2%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.time.map(function(item) {
            let date = new Date(item);
            let h = date.getHours();
            let mm = date.getMinutes();
            let s = date.getSeconds();

            h = h > 9 ? h : '0' + h;
            mm = mm > 9 ? mm : '0' + mm;
            s = s > 9 ? s : '0' + s;

            return h + ':' + mm + ':' + s;
          }),
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            data: that.sum.map(item => item[0]),
            type: 'line',
            areaStyle: {},
            smooth: true,
            stack: '总量',
          },
          {
            data: that.sum.map(item => item[1]),
            type: 'line',
            areaStyle: {},
            smooth: true,
            stack: '总量',
          },
          {
            data: that.sum.map(item => item[2]),
            type: 'line',
            areaStyle: {},
            smooth: true,
            stack: '总量',
          },
        ],
      });

      setTimeout(function() {
        window.addEventListener('resize', function() {
          heat_chart.resize();
        });
      }, 200);
    },
    //绘制左上角行政区风玫瑰图方法
    drawRose() {
      var chart = document.getElementById('left-chart-panel', 'dark');
      console.log(chart);

      chart.removeAttribute('_echarts_instance_');
      let rose = this.$echarts.init(
        document.getElementById('left-chart-panel')
      );
      rose.setOption({
        title: {
          text: '行政区域人数风玫瑰图',
          textStyle: {
            color: 'white',
          },
          left: 'center',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: ['10%', '60%'],
            roseType: 'area',
            data: [
              { value: 681313, name: '和平区' },
              { value: 71161, name: '沈河区' },
              { value: 660323, name: '大东区' },
              { value: 829659, name: '皇姑区' },
              { value: 908852, name: '铁西区' },
              { value: 425174, name: '苏家屯区' },
              { value: 372468, name: '浑南区' },
              { value: 323748, name: '沈北新区' },
              { value: 479011, name: '于洪区' },
              { value: 518822, name: '辽中区' },
              { value: 343466, name: '康平县' },
              { value: 440019, name: '法库县' },
              { value: 675057, name: '新民市' },
            ],
            color: [
              /* 莫兰迪配色，低饱和度保障:) */
              '#ef476f',
              '#f78c6b',
              '#ffd166',
              '#06d6a0',
              '#118ab2',
              '#073b4c',
              '#ff1654',
              '#f3ffbd',
              '#b2dbbf',
              '#70c1b3',
              '#247ba0',
              '#5f0f40',
              '#9a031e',
            ],
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          rose.resize();
        });
      }, 200);
    },

    drawBar() {
      var chart = document.getElementById('left-chart-panel');
      chart.removeAttribute('_echarts_instance_');
      let that = this;
      let bar = this.$echarts.init(document.getElementById('left-chart-panel'));
      bar.setOption({
        title: {
          text: '行政区域人数柱状图',
          textStyle: {
            color: 'white',
          },
          left: 'center',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            magicType: {show: true, type:['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        grid: {
          top: '10%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [
            '和平区',
            '沈河区',
            '大东区',
            '皇姑区',
            '铁西区',
            '苏家屯区',
            '浑南区',
            '沈北新区',
            '于洪区',
            '辽中区',
            '康平县',
            '法库县',
            '新民市',
          ],
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },

        yAxis: {
          type: 'value',
          name: '人数',
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: [
              681313,
              71161,
              660323,
              829659,
              908852,
              425174,
              372468,
              323748,
              479011,
              518822,
              343466,
              440019,
              675057,
            ],
            itemStyle: {
              normal: {
                color: function(params) {
                  return that.colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          bar.resize();
        });
      }, 200);
    },

    //绘制象形图
    drawPictorialBar() {
      let pictorial = this.$echarts.init(
        document.getElementById('right-chart-middle', 'dark')
      );
      const pathSymbols = {
        stable:
          'path://M426.666667 128a85.333333 85.333333 0 1 1 85.333333 85.333333 85.333333 85.333333 0 0 1-85.333333-85.333333z m403.2 384l-161.28-194.56A170.666667 170.666667 0 0 0 537.173333 256h-50.346666a170.666667 170.666667 0 0 0-131.413334 61.44L194.133333 512a21.333333 21.333333 0 0 0 2.986667 29.866667l32.426667 27.306666a21.76 21.76 0 0 0 30.293333-2.56L384 416.426667V960a21.333333 21.333333 0 0 0 21.333333 21.333333h42.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V640h85.333334v320a21.333333 21.333333 0 0 0 21.333333 21.333333h42.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V416.426667l124.16 149.333333a21.76 21.76 0 0 0 30.293333 2.56l32.426667-27.306667a21.333333 21.333333 0 0 0 2.986667-29.013333z',
        shift:
          'path://M419.413333 375.04L341.333333 403.456V554.666667H256V343.466667h0.64l224.768-81.834667c10.410667-3.968 21.76-5.973333 33.365333-5.589333a111.616 111.616 0 0 1 103.552 77.653333c7.936 24.874667 15.189333 41.685333 21.76 50.432A212.992 212.992 0 0 0 810.666667 469.333333v85.333334a298.069333 298.069333 0 0 1-230.485334-108.672l-29.738666 168.789333L640 689.92V981.333333h-85.333333v-251.648l-96.853334-81.237333-31.018666 176.085333-294.144-51.84 14.848-84.053333 210.090666 37.034667L419.413333 375.04zM576 234.666667a85.333333 85.333333 0 1 1 0-170.666667 85.333333 85.333333 0 0 1 0 170.666667z',
      };

      const labelSetting = {
        normal: {
          show: true,
          position: 'right',
          offset: [10, 0],
          textStyle: {
            fontSize: 16,
            color: '#FFFFFF',
          },
        },
      };
      pictorial.setOption({
        legend: {
          top: '5%',
          data: ['2017', '2018'],
          textStyle: {
            color: 'white',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          containLabel: true,
          left: 20,
        },
        yAxis: {
          data: ['shift', 'stable'],
          inverse: false,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            margin: 50,
            color: 'white',
            fontSize: 14,
          },
          axisPointer: {
            label: {
              show: true,
              margin: 30,
            },
          },
        },
        xAxis: {
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            name: '2017',
            type: 'pictorialBar',
            label: labelSetting,
            symbolRepeat: true,
            symbolSize: [20, 20],
            barCategoryGap: '40%',
            data: [
              {
                value: 157,
                symbol: pathSymbols.shift,
              },
              {
                value: 21,
                symbol: pathSymbols.stable,
              },
            ],
          },
          {
            name: '2018',
            type: 'pictorialBar',
            barGap: '10%',
            label: labelSetting,
            symbolRepeat: true,
            symbolSize: [20, 20],
            data: [
              {
                value: 184,
                symbol: pathSymbols.shift,
              },
              {
                value: 29,
                symbol: pathSymbols.stable,
              },
            ],
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          pictorial.resize();
        });
      }, 200);
    },
  },
  watch: {
    radius: {
      handler(newRadius) {
        this.radius = newRadius;
        console.log(newRadius);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
#heat {
  height: 100%;
  position: relative;
}
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 2;
}
.left-chart-up {
  position: absolute;
  left: 1%;
  width: 25%;
  /* height: 64%; */
  height: 50%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 17%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#left-chart-panel {
  display: flex;
  width: 100%;

  flex: 1;
}
.switch {
  height: 70px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 95%;
}
.el-button {
  margin: 30px;
}
.options {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.left-span {
  flex: 1;
  text-align: center;
}

.right-slider {
  flex: 3;
  padding-right: 20px;
}

.right-chart-up {
  position: absolute;
  right: 1%;
  width: 20%;
  height: 11%;

  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 18%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  /* border: solid 3px #2a4053; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.right-chart-middle {
  position: absolute;
  right: 1%;
  width: 20%;
  height: 41%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 13.5%; */
  top: 29.5%;
  background-color: rgba(7, 11, 32, 0.8);
}
.right-chart-down {
  position: absolute;
  box-sizing: border-box;
  padding-left: 30px;
  right: 1%;
  width: 20%;
  height: 21%;
  /* border: solid 1px #436983; */
  /* border-radius: 2px; */
  /* box-shadow: #3b5d74 0px 0px 10px 5px inset; */
  z-index: 100;
  top: 60%;
  /* background-color: rgba(7, 11, 32, 0.8); */
}
.gradients {
  width: 80%;
  height: 20%;
  margin-top: 120px;
  background-image: linear-gradient(
    to right,
    blue,
    indigo,
    green,
    yellow,
    orange,
    red
  );
}
.tip {
  width: 80%;
}
.heatmap-span-left {
  margin-top: 100px;
  float: left;
  color: white;
}
.heatmap-span-right {
  margin-top: 100px;
  float: right;
  color: white;
}
.chart-down {
  position: absolute;
  left: 1%;
  width: 98%;
  height: 20%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  bottom: 1%;
  padding-top: 1%;
  /* background-color: rgba(7, 11, 32, 0.8); */
}
.chart-down-in {
  width: 100%;
  height: 33%;
}
.demo .el-switch__label {
  color: antiquewhite;
}
</style>
