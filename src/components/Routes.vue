<template>
  <div id="routes">
    <div class="map" id="map"></div>
    <div :class="leftchartup" id="thunder"></div>
    <div :class="leftchartmiddle" id="left-chart-middle"></div>
    <div :class="rightchartup">
      <div class="options">
        <div class="left-span">
          <span class="demonstration" style="color: #ffffff">半径</span>
        </div>
        <div class="right-slider">
          <el-slider :min="rsliderMin" :max="rsliderMax" :step="rsliderStep" v-model="radius"></el-slider>
        </div>
      </div>
    </div>
    <div :class="rightchartmiddle">
      <div id="right-chart-panel"></div>
      <el-radio-group v-model="radio" class="switch" :change="has_change()">
        <!-- @change="has_cange" v-change="has_change()"-->
        <el-radio-button label="1">极坐标图</el-radio-button>
        <el-radio-button label="2">主题河流图</el-radio-button>
      </el-radio-group>
      <!--<div class="switch">
        <el-button type="primary" @click="drawThemeRiver()">主题河流图</el-button>
        <el-button type="success" @click="drawPolarStack()">极坐标图</el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import $ from 'jquery';
import { usecurve } from '../assets/js/leaflet.curve';
//import "leaflet/dist/leaflet.css"
export default {
  name: 'home',
  data() {
    return {
      rsliderMin: 100,
      map: null,
      circle: null,
      radius: 150,
      d_lat: 0,
      d_lng: 0,
      min_lat: 0,
      lat_foot: 0,
      min_lng: 0,
      lng_foot: 0,
      rsliderMax: 200,
      rsliderStep: 2,
      leftchartup: 'left-chart-up-hidden',
      leftchartmiddle: 'left-chart-middle-hidden',
      rightchartup: 'right-chart-up-hidden',
      rightchartmiddle: 'right-chart-middle-hidden',
      radio: 0,
      point_list: [],
      violin_list: [
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
        [0, 0, 0, [0]],
      ],
      thunder_list: [0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  watch: {
    radius: {
      handler: function(val) {
        this.d_lat = val / 111000;
        this.d_lng = val / 100000;
      },
    },
    getCount(val) {
      if (!val) {
        (this.leftchartup = 'left-chart-up-hidden'),
          (this.leftchartmiddle = 'left-chart-middle-hidden'),
          (this.rightchartup = 'right-chart-up-hidden'),
          (this.rightchartmiddle = 'right-chart-middle-hidden');
      }
    },
  },
  computed: {
    getCount() {
      return this.$store.state.show;
    },
  },
  methods: {
    has_change() {
      if (this.radio === 0) {
        return;
      }
      if (this.radio === '1') {
        this.drawPolarStack();
      } else {
        this.drawThemeRiver();
      }
    },
    getLngList(lng) {
      let that = this;
      let list = [];
      let index = Math.max(
        parseInt((lng - that.d_lng - that.min_lng) / that.lng_foot),
        0
      );
      while (that.min_lng + index * that.lng_foot <= lng + that.d_lng) {
        list.push((that.min_lng + index * that.lng_foot).toFixed(4));
        index += 1;
      }
      return list;
    },
    getLatList(lat) {
      let list = [];
      let index = Math.max(
        parseInt((lat - this.d_lat - this.min_lat) / this.lat_foot),
        0
      );
      while (this.min_lat + index * this.lat_foot <= lat + this.d_lat) {
        list.push((this.min_lat + index * this.lat_foot).toFixed(4));
        index += 1;
      }
      return list;
    },
    //绘制左上极坐标下堆叠柱状图方法
    drawPolarStack() {
      var chart = document.getElementById('right-chart-panel');
      chart.removeAttribute('_echarts_instance_');
      let polarStackChart = this.$echarts.init(
        document.getElementById('right-chart-panel')
      );

      polarStackChart.setOption({
        title: {
          text: '过去一周人流量概览',
          textStyle: {
            color: 'white',
          },
          top: '5%',
          left: '30%',
        },
        angleAxis: {
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
          axisTick: {
            lineStyle: {
              color: 'white',
            },
          },
        },
        radiusAxis: {
          type: 'category',
          axisLabel: {
            //interval: 0,
            color: 'white',
          },
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          z: 10,
        },
        polar: {
          center: ['50%', '60%'],
        },
        series: [
          {
            type: 'bar',
            data: [1, 2, 1, 3, 5, 6, 6],
            coordinateSystem: 'polar',
            name: '0:00-1:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [1, 2, 4, 3, 1, 2, 4],
            coordinateSystem: 'polar',
            name: '1:00-2:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [1, 1, 2, 3, 4, 2, 3],
            coordinateSystem: 'polar',
            name: '2:00-3:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [2, 1, 3, 1, 3, 4, 4],
            coordinateSystem: 'polar',
            name: '3:00-4:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [2, 1, 1, 2, 4, 3, 7],
            coordinateSystem: 'polar',
            name: '4:00-5:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [2, 2, 1, 1, 3, 1, 3],
            coordinateSystem: 'polar',
            name: '5:00-6:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [2, 2, 1, 1, 3, 1, 3],
            coordinateSystem: 'polar',
            name: '6:00-7:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [4, 5, 6, 5, 5, 7, 5],
            coordinateSystem: 'polar',
            name: '7:00-8:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [12, 14, 16, 15, 12, 8, 3],
            coordinateSystem: 'polar',
            name: '8:00-9:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [15, 14, 13, 12, 15, 9, 10],
            coordinateSystem: 'polar',
            name: '9:00-10:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [13, 10, 15, 12, 14, 13, 10],
            coordinateSystem: 'polar',
            name: '10:00-11:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [8, 7, 6, 8, 7, 6, 5],
            coordinateSystem: 'polar',
            name: '11:00-12:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [6, 4, 7, 5, 6, 4, 3],
            coordinateSystem: 'polar',
            name: '12:00-13:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [7, 2, 5, 6, 4, 6, 5],
            coordinateSystem: 'polar',
            name: '13:00-14:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [10, 8, 7, 6, 7, 8, 9],
            coordinateSystem: 'polar',
            name: '14:00-15:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [11, 12, 15, 13, 15, 10, 15],
            coordinateSystem: 'polar',
            name: '15:00-16:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [17, 14, 15, 16, 14, 16, 15],
            coordinateSystem: 'polar',
            name: '16:00-17:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [21, 22, 25, 24, 26, 26, 25],
            coordinateSystem: 'polar',
            name: '17:00-18:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [11, 12, 10, 9, 13, 16, 17],
            coordinateSystem: 'polar',
            name: '18:00-19:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [13, 12, 9, 8, 11, 8, 11],
            coordinateSystem: 'polar',
            name: '19:00-20:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [14, 8, 13, 16, 14, 15, 17],
            coordinateSystem: 'polar',
            name: '20:00-21:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [7, 4, 6, 8, 4, 5, 4],
            coordinateSystem: 'polar',
            name: '21:00-22:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [5, 6, 7, 5, 4, 3, 5],
            coordinateSystem: 'polar',
            name: '22:00-23:00',
            stack: 'a',
          },
          {
            type: 'bar',
            data: [2, 1, 2, 3, 4, 2, 3],
            coordinateSystem: 'polar',
            name: '23:00-0:00',
            stack: 'a',
          },
        ],
        tooltip: {
          show: true,
          trigger: 'item',
        },
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          polarStackChart.resize();
        });
      }, 200);
    },
    //绘制主题河流图方法
    drawThemeRiver() {
      var chart = document.getElementById('right-chart-panel');
      chart.removeAttribute('_echarts_instance_');
      let themeRiver = this.$echarts.init(
        document.getElementById('right-chart-panel')
      );
      themeRiver.setOption({
        title: {
          text: '过去一周人流量情况',
          textStyle: {
            color: 'white',
          },
          top: '5%',
          left: '30%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(255,255,255,0.2)',
              width: 1,
              type: 'solid',
            },
          },
        },
        singleAxis: {
          top: 50,
          bottom: 50,
          axisLine: {
            color: 'white',
          },
          axisTick: {
            color: 'white',
          },
          axisLabel: {
            color: 'white',
          },
          type: 'time',
          axisPointer: {
            animation: true,
            label: {
              show: true,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              opacity: 0.2,
            },
          },
        },

        series: [
          {
            type: 'themeRiver',
            label: {
              position: 'inside',
              color: 'white',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.8)',
              },
            },
            data: [
              ['2015/11/08', 10, 'DQ'],
              ['2015/11/09', 15, 'DQ'],
              ['2015/11/10', 35, 'DQ'],
              ['2015/11/11', 38, 'DQ'],
              ['2015/11/12', 22, 'DQ'],
              ['2015/11/13', 16, 'DQ'],
              ['2015/11/14', 7, 'DQ'],
              ['2015/11/15', 2, 'DQ'],
              ['2015/11/16', 17, 'DQ'],
              ['2015/11/17', 33, 'DQ'],
              ['2015/11/18', 40, 'DQ'],
              ['2015/11/19', 32, 'DQ'],
              ['2015/11/20', 26, 'DQ'],
              ['2015/11/21', 35, 'DQ'],
              ['2015/11/22', 40, 'DQ'],
              ['2015/11/23', 32, 'DQ'],
              ['2015/11/24', 26, 'DQ'],
              ['2015/11/25', 22, 'DQ'],
              ['2015/11/26', 16, 'DQ'],
              ['2015/11/27', 22, 'DQ'],
              ['2015/11/28', 10, 'DQ'],
              ['2015/11/08', 35, 'TY'],
              ['2015/11/09', 36, 'TY'],
              ['2015/11/10', 37, 'TY'],
              ['2015/11/11', 22, 'TY'],
              ['2015/11/12', 24, 'TY'],
              ['2015/11/13', 26, 'TY'],
              ['2015/11/14', 34, 'TY'],
              ['2015/11/15', 21, 'TY'],
              ['2015/11/16', 18, 'TY'],
              ['2015/11/17', 45, 'TY'],
              ['2015/11/18', 32, 'TY'],
              ['2015/11/19', 35, 'TY'],
              ['2015/11/20', 30, 'TY'],
              ['2015/11/21', 28, 'TY'],
              ['2015/11/22', 27, 'TY'],
              ['2015/11/23', 26, 'TY'],
              ['2015/11/24', 15, 'TY'],
              ['2015/11/25', 30, 'TY'],
              ['2015/11/26', 35, 'TY'],
              ['2015/11/27', 42, 'TY'],
              ['2015/11/28', 42, 'TY'],
              ['2015/11/08', 21, 'SS'],
              ['2015/11/09', 25, 'SS'],
              ['2015/11/10', 27, 'SS'],
              ['2015/11/11', 23, 'SS'],
              ['2015/11/12', 24, 'SS'],
              ['2015/11/13', 21, 'SS'],
              ['2015/11/14', 35, 'SS'],
              ['2015/11/15', 39, 'SS'],
              ['2015/11/16', 40, 'SS'],
              ['2015/11/17', 36, 'SS'],
              ['2015/11/18', 33, 'SS'],
              ['2015/11/19', 43, 'SS'],
              ['2015/11/20', 40, 'SS'],
              ['2015/11/21', 34, 'SS'],
              ['2015/11/22', 28, 'SS'],
              ['2015/11/23', 26, 'SS'],
              ['2015/11/24', 37, 'SS'],
              ['2015/11/25', 41, 'SS'],
              ['2015/11/26', 46, 'SS'],
              ['2015/11/27', 47, 'SS'],
              ['2015/11/28', 41, 'SS'],
              ['2015/11/08', 10, 'QG'],
              ['2015/11/09', 15, 'QG'],
              ['2015/11/10', 35, 'QG'],
              ['2015/11/11', 38, 'QG'],
              ['2015/11/12', 22, 'QG'],
              ['2015/11/13', 16, 'QG'],
              ['2015/11/14', 7, 'QG'],
              ['2015/11/15', 2, 'QG'],
              ['2015/11/16', 17, 'QG'],
              ['2015/11/17', 33, 'QG'],
              ['2015/11/18', 40, 'QG'],
              ['2015/11/19', 32, 'QG'],
              ['2015/11/20', 26, 'QG'],
              ['2015/11/21', 35, 'QG'],
              ['2015/11/22', 40, 'QG'],
              ['2015/11/23', 32, 'QG'],
              ['2015/11/24', 26, 'QG'],
              ['2015/11/25', 22, 'QG'],
              ['2015/11/26', 16, 'QG'],
              ['2015/11/27', 22, 'QG'],
              ['2015/11/28', 10, 'QG'],
              ['2015/11/08', 10, 'SY'],
              ['2015/11/09', 15, 'SY'],
              ['2015/11/10', 35, 'SY'],
              ['2015/11/11', 38, 'SY'],
              ['2015/11/12', 22, 'SY'],
              ['2015/11/13', 16, 'SY'],
              ['2015/11/14', 7, 'SY'],
              ['2015/11/15', 2, 'SY'],
              ['2015/11/16', 17, 'SY'],
              ['2015/11/17', 33, 'SY'],
              ['2015/11/18', 40, 'SY'],
              ['2015/11/19', 32, 'SY'],
              ['2015/11/20', 26, 'SY'],
              ['2015/11/21', 35, 'SY'],
              ['2015/11/22', 4, 'SY'],
              ['2015/11/23', 32, 'SY'],
              ['2015/11/24', 26, 'SY'],
              ['2015/11/25', 22, 'SY'],
              ['2015/11/26', 16, 'SY'],
              ['2015/11/27', 22, 'SY'],
              ['2015/11/28', 10, 'SY'],
              ['2015/11/08', 10, 'DD'],
              ['2015/11/09', 15, 'DD'],
              ['2015/11/10', 35, 'DD'],
              ['2015/11/11', 38, 'DD'],
              ['2015/11/12', 22, 'DD'],
              ['2015/11/13', 16, 'DD'],
              ['2015/11/14', 7, 'DD'],
              ['2015/11/15', 2, 'DD'],
              ['2015/11/16', 17, 'DD'],
              ['2015/11/17', 33, 'DD'],
              ['2015/11/18', 4, 'DD'],
              ['2015/11/19', 32, 'DD'],
              ['2015/11/20', 26, 'DD'],
              ['2015/11/21', 35, 'DD'],
              ['2015/11/22', 40, 'DD'],
              ['2015/11/23', 32, 'DD'],
              ['2015/11/24', 26, 'DD'],
              ['2015/11/25', 22, 'DD'],
              ['2015/11/26', 16, 'DD'],
              ['2015/11/27', 22, 'DD'],
              ['2015/11/28', 10, 'DD'],
            ],
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          themeRiver.resize();
        });
      }, 200);
    },
    drawThunder() {
      let that = this;
      let thunder = this.$echarts.init(document.getElementById('thunder'));
      thunder.setOption({
        grid: {
          position: 'center',
          left: '10%',
          right: '10%',
          top: '15%',
          bottom: '10%',
        },
        tooltip: {
          //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
          confine: true,
          enterable: true, //鼠标是否可以移动到tooltip区域内
        },
        radar: {
          splitNumber: 3, // 雷达图圈数设置
          name: {
            textStyle: {
              color: 'white',
            },
          },
          indicator: [
            { name: 'N', max: 30 },
            { name: 'NW', max: 30 },
            { name: 'W', max: 30 },
            { name: 'SW', max: 30 },
            { name: 'S', max: 30 },
            { name: 'SE', max: 30 },
            { name: 'E', max: 30 },
            { name: 'NE', max: 30 },
          ],
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
          splitArea: {
            areaStyle: {
              color: [
                'rgba(114, 172, 209, 0.2)',
                'rgba(114, 172, 209, 0.4)',
                'rgba(114, 172, 209, 0.6)',
                'rgba(114, 172, 209, 0.8)',
                'rgba(114, 172, 209, 1)',
              ],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'white', // 设置网格的颜色
            },
          },
        },

        series: [
          {
            name: '雷达图', // tooltip中的标题
            type: 'radar', //表示是雷达图
            symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
            symbolSize: 8, // 拐点的大小
            areaStyle: {
              normal: {
                width: 1,
                opacity: 0.2,
              },
            },
            data: [
              {
                value: that.thunder_list,
                name: '2018-07',
              },
            ],
          },
        ],
      });
    },
    violinChart() {
      let that = this;
      d3.select('#left-chart-middle')
        .selectAll('svg')
        .remove();
      var colorScale = d3
        .scaleOrdinal()
        .range([
          '#ef476f',
          '#f78c6b',
          '#ffd166',
          '#06d6a0',
          '#118ab2',
          '#073b4c',
          '#ff1654',
          '#f3ffbd',
        ]);
      var normal = d3.randomNormal();
      let list = [];
      for (let i = 0; i < 8; i++) {
        if (that.thunder_list[i] != 0) {
          list.push(d3.range(100).map(d => normal()));
        } else {
          list.push([]);
        }
      }
      var histoChart = d3.histogram();
      histoChart
        .domain([-2.8, 2.8])
        .thresholds([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])
        .value(d => d);
      var svg = d3
        .select('#left-chart-middle')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400)
        .style('margin', 10);
      var yScale = d3
        .scaleLinear()
        .domain([-2.8, 2.8])
        .range([150, 0]);
      var yAxis = d3
        .axisRight()
        .scale(yScale)
        .tickSize(370);
      var area = d3
        .area()
        .x0(d => -d.length)
        .x1(d => d.length)
        .y(d => yScale(d.x0))
        .curve(d3.curveCatmullRom);
      svg
        .selectAll('g.violin')
        .data(list)
        .enter()
        .append('g')
        .attr(
          'transform',
          (d, i) => `translate(203.5, 204) rotate(${180 - 45 * i})`
        )
        .append('path')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill', (d, i) => colorScale(i))
        .attr('opacity', 0.5)
        .attr('d', d => area(histoChart(d)));
    },
    getLineAngle(lat1, lng1, lat2, lng2) {
      let tmp_value = 0;
      let lat_start = (lat1 * Math.PI) / 180;
      let lng_start = (lng1 * Math.PI) / 180;
      let lat_end = (lat2 * Math.PI) / 180;
      let lng_end = (lng2 * Math.PI) / 180;
      if (lng1 === lng2 || lat1 === lat2) {
        if (lng1 == lng2) {
          if (lat2 >= lat1) {
            return 0;
          } else {
            return 180;
          }
        } else {
          if (lng2 >= lng1) {
            return 90;
          } else {
            return 270;
          }
        }
      }
      tmp_value =
        Math.sin(lat_start) * Math.sin(lat_end) +
        Math.cos(lat_start) * Math.cos(lat_end) * Math.cos(lng_end - lng_start);
      tmp_value = Math.sqrt(1 - tmp_value * tmp_value);
      tmp_value =
        (Math.cos(lat_end) * Math.sin(lng_end - lng_start)) / tmp_value;
      let resultAngle = Math.abs((Math.asin(tmp_value) * 180) / Math.PI);

      if (lng2 > lng1) {
        if (lat2 >= lat1) {
          return resultAngle;
        } else {
          return 180 - resultAngle;
        }
      } else {
        if (lat2 >= lat1) {
          return 360 - resultAngle;
        } else {
          return 180 + resultAngle;
        }
      }
    },
    getLineDistance(lat1, lng1, lat2, lng2) {
      let a, b, R;
      R = 6378137;
      lat1 = (lat1 * Math.PI) / 180.0;
      lat2 = (lat2 * Math.PI) / 180.0;
      a = lat1 - lat2;
      b = ((lng1 - lng2) * Math.PI) / 180.0;
      let d;
      let sa2, sb2;
      sa2 = Math.sin(a / 2.0);
      sb2 = Math.sin(b / 2.0);
      d =
        2 *
        R *
        Math.asin(
          Math.sqrt(sa2 * sa2 + Math.cos(lat1) * Math.cos(lat2) * sb2 * sb2)
        );
      return d;
    },
    calculation() {
      let that = this;
      let temp_list = [[], [], [], [], [], [], [], []];
      this.violin_list = [[], [], [], [], [], [], [], []];
      this.thunder_list = [0, 0, 0, 0, 0, 0, 0, 0];
      this.point_list.forEach(point => {
        let angle = that.getLineAngle(point[0], point[1], point[2], point[3]);
        let distance = that.getLineDistance(
          point[0],
          point[1],
          point[2],
          point[3]
        );
        if (angle <= 22.5 || angle >= 337.5) {
          if(that.thunder_list[0] <= 28){
            that.thunder_list[0]++;
          }
          temp_list[0].push(distance);
        } else {
          if(that.thunder_list[Math.ceil(8 - (angle + 22.5) / 45)] <= 28){
          that.thunder_list[Math.ceil(8 - (angle + 22.5) / 45)]++;}
          temp_list[Math.ceil(8 - (angle + 22.5) / 45)].push(distance);
        }
      });
      temp_list.forEach((violin, index) => {
        violin.sort();
        let len = violin.length;
        let Q3 = Math.floor((len + 1) * 0.75);
        let Q2 = Math.floor((len + 1) * 0.5);
        let Q1 = Math.floor((len + 1) * 0.25);
        that.violin_list[index].push(
          violin[Q1 - 1],
          violin[Q2 - 1],
          violin[Q3 - 1],
          violin
        );
      });
      this.drawThunder();
      this.violinChart();
    },
  },
  mounted() {
    usecurve(L);
    this.$store.commit('show');
    setTimeout(() => {
      (this.leftchartup = 'left-chart-up'),
        (this.leftchartmiddle = 'left-chart-middle'),
        (this.rightchartup = 'right-chart-up'),
        (this.rightchartmiddle = 'right-chart-middle');
    }, 500);

    let that = this;
    this.map = L.map('map', {
      minZoom: 5,
      maxZoom: 17,
      center: [41.79, 123.40353],
      zoom: 15,
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
    this.drawThunder();
    this.drawPolarStack();
    this.radio = '1';
    this.violinChart();
    this.circle = L.circle([30.258134, 120.19382669582967], this.radius, {
      color: '#fa9fb5',
    }).addTo(this.map);

    this.d_lat = this.radius / 111000;
    this.d_lng = this.radius / 100000;
    this.min_lat = 29.992;
    this.lat_foot = 0.0005;
    this.min_lng = 119.7542;
    this.lng_foot = 0.0008;

    this.$http
      .get('http://101.132.71.166/recommend')
      .then(res => {
        this.min_lat = res.data.data.min_lat;
        this.lat_foot = res.data.data.lat_foot;
        this.min_lng = res.data.data.min_lng;
        this.lng_foot = res.data.data.lng_foot;
        let list_data = res.data.data.data;
        this.map.on('mousemove', function(e) {
          $('path').remove('.once');
          that.point_list = [];
          that.circle.setLatLng(e.latlng);
          that.circle.setRadius(that.radius);
          let lat = e.latlng['lat'],
            lng = e.latlng['lng'];
          if (lat < that.min_lat || lat > that.min_lat + 1000 * that.lat_foot) {
            return;
          }
          if (lng < that.min_lng || lng > that.min_lng + 1000 * that.lng_foot) {
            return;
          }
          let lat_list = that.getLatList(lat),
            lng_list = that.getLngList(lng);

          for (let i = 0; i < lat_list.length; i += 1) {
            if (list_data[lat_list[i]] !== undefined) {
              for (let j = 0; j < lng_list.length; j += 1) {
                if (list_data[lat_list[i]][lng_list[j]] !== undefined) {
                  for (
                    let k = 0;
                    k < list_data[lat_list[i]][lng_list[j]].length;
                    k += 1
                  ) {
                    let lat1 = list_data[lat_list[i]][lng_list[j]][k][1];
                    let lng1 = list_data[lat_list[i]][lng_list[j]][k][0];
                    if (
                      e.latlng.distanceTo(L.latLng(lat1, lng1)) < that.radius
                    ) {
                      let lat2 = list_data[lat_list[i]][lng_list[j]][k][3];
                      let lng2 = list_data[lat_list[i]][lng_list[j]][k][2];
                      let lat3 = 0;
                      let lng3 = 0;
                      lat3 = (lat2 + lat1) / 2 + (lng1 - lng2) / 6;
                      lng3 = (lng2 + lng1) / 2 + (lat2 - lat1) / 6;
                      that.point_list.push([lat1, lng1, lat2, lng2]);

                      L.circle([lat1, lng1], 10, {
                        color: '#00FF99',
                        className: 'once',
                      }).addTo(that.map);
                      L.circle([lat2, lng2], 10, {
                        color: '#FF3333',
                        className: 'once',
                      }).addTo(that.map);
                      L.curve(
                        ['M', [lat1, lng1], 'Q', [lat3, lng3], [lat2, lng2]],
                        {
                          color: '#ffffd9',
                          opacity: 0.8,
                          weight: 3,
                          clickable: false,
                          className: 'once',
                        }
                      ).addTo(that.map);
                    }
                  }
                }
              }
            }
          }
          that.calculation();
        });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  },
};
</script>

<style scoped>
@import '~leaflet/dist/leaflet.css';
#routes {
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
  width: 400px;
  height: 400px;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 3%; */
  top: 15%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transition: all 0.6s;
}
.left-chart-up-hidden {
  position: absolute;
  left: -50%;
  width: 420px;
  height: 420px;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  /* top: 3%; */
  top: 15%;
  background-color: rgba(7, 11, 32, 0.8);
  transition: all 0.6s;
}
.left-chart-middle {
  position: absolute;
  left: 1%;
  width: 420px;
  height: 420px;

  z-index: 100;
  /* top: 3%; */
  top: 15%;
  transition: all 0.6s;
  transform: translate(-2px, -2px);
}
.left-chart-middle-hidden {
  position: absolute;
  left: -50%;
  width: 420px;
  height: 420px;

  z-index: 100;
  /* top: 3%; */
  top: 15%;
  transition: all 0.6s;
}
.right-chart-up {
  position: absolute;
  right: 1%;
  height: 20%;
  width: 420px;

  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 11%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.6s;
}
.right-chart-up-hidden {
  position: absolute;
  right: -50%;
  height: 11%;
  width: 420px;

  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  top: 1%;
  background-color: rgba(7, 11, 32, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.6s;
}
.right-chart-middle {
  position: absolute;
  right: 1%;
  width: 25%;
  height: 50%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  bottom: 2%;
  /* background-color: rgba(14, 14, 17, 0.8); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.6s;
}
.right-chart-middle-hidden {
  position: absolute;
  right: -50%;
  width: 25%;
  height: 50%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  bottom: 2%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.6s;
}
#right-chart-panel {
  display: flex;
  width: 100%;

  flex: 1;
}
.switch {
  height: 70px;
  display: flex;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
