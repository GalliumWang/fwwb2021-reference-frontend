<template>
  <div id="stationary">
    <div id="stationary-map" class="map"></div>
    <!-- <div class="left-chart-up"></div>
    <div class="left-chart-middle"></div>
    <div class="right-chart-up"></div>
    <div class="right-chart-middle"></div>
    <div class="chart-down"></div>-->
    <div :class="showFlag ? 'notifyshow' : 'notifyhidden'">
      <p v-for="(item, i) in location_time" :key="i" style="color:white">进入时间：{{ item }}</p>
    </div>
    <div :class="bottomright">
      <div style class="border-bottom">
        <div id="bottom-right-text">点标记操作</div>
      </div>
      <el-button round id="reset" @click="resetAll()">重置</el-button>
      <el-button round id="point-extraction" @click="drawLocate()">驻点抽取</el-button>
      <el-button round id="point-analysis" @click="showAna()">驻点分析</el-button>
    </div>
    <div :class="leftchart">
      <div class="border-bottom">
        <div id="bottom-right-text">排名次序</div>
        <div id="bottom-right-text">移动行为模式拓扑结构</div>
        <div id="bottom-right-text">所占比例</div>
      </div>
      <div class="left-chart-list">
        <div class="left-chart-item" v-for="(item, i) in topology" :key="i">
          <!-- 序号 -->
          <div class="left-chart-item-left">
            <span>{{ item.index }}</span>
          </div>
          <!-- 拓扑结构 -->
          <div class="left-chart-item-middle">
            <img :src="item.topoSrc" />
          </div>
          <!-- 所占比例 -->
          <div class="left-chart-item-right">
            <span>{{ item.proportion }}</span>
          </div>
        </div>
      </div>
    </div>

    <div :class="showFlag ? 'middle-show' : 'middle-hidden'">
      <p class="middle-p" v-for="(item, i) in location_time" :key="i" style="color:white">
        时间：{{ item }}
        <br />重叠用户：
        <br />
        {{['178****4353', '178****3768','178****4594','178****1235','178****7894','178****4353','178****8245'].slice(Math.ceil(Math.random()*3),Math.ceil(Math.random()*3)+4).join('\r\n')}}
      </p>
    </div>

    <div class="right-chart" v-if="showAnalysis === 1">
      <div class="border-bottom">
        <div id="bottom-right-text">用户分析</div>
      </div>
      <div class="right-chart-list">
        <div class="right-chart-item">
          <span style="float:left;">用户ID：{{ user_analysis.id }}</span>
        </div>
        <div class="right-chart-item">
          <span style="float:left;">用户手机：{{ user_analysis.phone }}</span>
        </div>
        <div class="right-chart-item" style="margin-bottom:0;">
          <span style="float:left;">用户出行拓扑模式：</span>
        </div>
        <div class="right-chart-item" style="margin-top:0;">
          <img :src="user_analysis.topoSrc" style />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#stationary {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.notifyshow {
  position: absolute;
  right: 1%;
  width: 260px;
  /* height:10%; */
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 55%; */
  top: 65%;
  max-height: 20%;
  overflow-y: auto;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transform: translateX('-50%');
  transition: all 0.6s;
  padding: 20px;
}
.notifyhidden {
  position: absolute;
  right: -30%;
  width: 260px;
  /* height: 5%; */
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 55%; */
  top: 65%;
  max-height: 20%;
  overflow-y: auto;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transform: translateX('-150%');
  transition: all 0.6s;
  padding: 20px;
}
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 2;
}

.bottom-right {
  position: absolute;
  right: 1%;
  bottom: 1%;
  width: 420px;
  height: 15%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transition: all 0.4s;
}

.bottom-right-hidden {
  position: absolute;
  right: -50%;
  bottom: 1%;
  width: 300px;
  height: 15%;
  /* border: solid 3px #2a4053; */
  border-radius: 2px;
  z-index: 100;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transition: all 0.4s;
}
#bottom-right-text {
  color: white;
  float: left;
  margin: 15px;
}
.el-button {
  background-color: #345f93;
  color: white;
}
#reset {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-15%);
}
#point-extraction {
  position: absolute;
  top: 50%;
  left: 33%;
  transform: translateY(-15%);
}
#point-analysis {
  position: absolute;
  top: 50%;
  left: 65%;
  transform: translateY(-15%);
}
.border-bottom {
  position: relative;
  border-bottom: solid 1px #346885;
  height: 42px;
  width: 95%;
  margin-left: 2%;
}
.left-chart {
  position: absolute;
  left: 1%;
  margin: 1%;
  width: 400px;
  height: 85%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  top: 11%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transition: all 0.4s;
}
.left-chart-hidden {
  position: absolute;
  left: -50%;
  margin: 1%;
  width: 400px;
  height: 95%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* background-color: rgba(7, 11, 32, 0.8); */
  transition: all 0.4s;
}
.left-chart-list {
  position: absolute;
  top: 42px;
  margin: 3%;
  width: 94%;
  height: 90%;
  overflow: auto;
  color: white;
}
.middle-p {
  margin: 30px;
}
.right-chart-list {
  position: relative;
  top: 10px;
  margin: 3%;
  width: 94%;

  overflow: auto;
  color: white;
}
.left-chart-item {
  position: relative;
  float: left;
  margin: 1%;
  height: 15%;
  width: 98%;
}
.right-chart-item img {
  position: relative;
  width: 100%;
  height: auto;
}
.right-chart-item {
  position: relative;
  float: left;
  margin: 2%;

  width: 98%;
}
.left-chart-item-left {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 23%;
  margin-right: 2%;
}
.left-chart-item-left span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.left-chart-item-middle {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 48%;
  margin-right: 2%;
}
.left-chart-item-middle img {
  position: absolute;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.left-chart-item-right {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 23%;
  margin-right: 2%;
}
.left-chart-item-right span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 滑动条 */
::-webkit-scrollbar {
  width: 6px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: inherit;
  background-color: rgba(144, 147, 153, 0.5);
  -webkit-transition: 0.3s background-color;
  transition: 0.3s background-color;
}
.reset_button {
  position: absolute;
  /* top:5%; */
  top: 14%;
  z-index: 100;
  left: 50%;
  transform: translateX('-50%');
}

/* 右div */
.right-chart {
  position: absolute;
  /* top: 1%; */
  top: 11%;
  right: 1%;
  width: 300px;

  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  background-color: rgba(7, 11, 32, 0.8);
  animation: fade-in;
  animation-duration: 0.5s;
  -webkit-animation: fade-in 0.5s;
}

.middle-show {
  position: absolute;
  /* top: 1%; */
  top: 11%;
  right: 20%;
  width: 300px;

  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  background-color: rgba(7, 11, 32, 0.8);
  transition: all 0.4s;
}
.middle-hidden {
  position: absolute;
  /* top: 1%; */
  top: -50%;
  right: 20%;
  width: 300px;

  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  background-color: rgba(7, 11, 32, 0.8);
  transition: all 0.4s;
}

/* right-chart的动画 */
@keyframes fade-in {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@-webkit-keyframes fade-in {
  /*针对webkit内核*/
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>

<script>
import * as L from 'leaflet';
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
import $ from 'jquery';
import personal_info from '../assets/data/person9.json';

import topo1 from '../assets/css/images/topo/1.png';
import topo2 from '../assets/css/images/topo/2.png';
import topo3 from '../assets/css/images/topo/3.png';
import topo4 from '../assets/css/images/topo/4.png';
import topo5 from '../assets/css/images/topo/5.png';
import topo6 from '../assets/css/images/topo/6.png';
import topo7 from '../assets/css/images/topo/7.png';

import man from '../assets/css/images/people.png';
import locate from '../assets/css/images/dot.png';
import geo from '../assets/data/shenyang.json';

export default {
  name: 'Stationary',
  data() {
    return {
      showFlag: 0,
      showAnalysis: 0,
      map: null,
      idxs: [],
      tmpID: '',
      location_time: [],
      display: false,
      topology: [
        { index: 1, topoSrc: topo1, proportion: '18.5%' },
        { index: 2, topoSrc: topo2, proportion: '12.6%' },
        { index: 3, topoSrc: topo3, proportion: '8.0%' },
        { index: 4, topoSrc: topo4, proportion: '7.9%' },
        { index: 5, topoSrc: topo5, proportion: '6.1%' },
        { index: 6, topoSrc: topo6, proportion: '5.9%' },
        { index: 7, topoSrc: topo7, proportion: '3.4%' },
      ],
      user_analysis: {
        id: '',
        phone: '178****0329',
        topoSrc: '',
      },
      bottomright: 'bottom-right-hidden',
      leftchart: 'left-chart-hidden',
      svg: null,
      g: null,
      transform: null,
      idIndex: 0,
      timei: 0,
      phones: [
        '178****4353',
        '178****3768',
        '178****4594',
        '178****1235',
        '178****7894',
        '178****4353',
        '178****8245',
      ],
      // doubleuser: [
      //   {
      //     time: '12345',
      //     users: ['178****4353', '178****3768'],
      //   },
      //   {
      //     time: '45678',
      //     users: ['178****0219', 'xzcc', '178****8144'],
      //   },
      // ],
    };
  },
  computed: {
    getCount() {
      return this.$store.state.show;
    },
  },
  watch: {
    getCount(val) {
      if (!val) {
        this.leftchart = 'left-chart-hidden';
        this.bottomright = 'bottom-right-hidden';
      }
    },
  },
  mounted() {
    this.$store.commit('show');
    setTimeout(() => {
      this.bottomright = 'bottom-right';
      this.leftchart = 'left-chart';
    }, 500);
    this.map = L.map('stationary-map', {
      minZoom: 3,
      maxZoom: 14,
      center: [41.8, 123.38333],
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

    this.getIdxs();
    this.drawPerson();
  },
  methods: {
    showNotify() {
      this.showFlag = 1;
      console.log(
        this.location_time.map(function(item) {
          let temp = item.split(' ');
          let date = item[0].split('--').join('/');
          let time = date + ' ' + temp[1];
          return Date.parse(time);
        })
      );
      console.log(this.tmpID);
      console.log(this.timei);
    },
    hideNotify() {
      this.showFlag = 0;
    },
    drawLocate() {
      if (this.user_analysis.id === '') {
        this.$message({
          message: '请选择要分析的个人',
          type: 'warning',
        });
        return;
      }
      $('.locate').css('display', 'block');
    },
    getIdxs() {
      this.idxs = personal_info.map(item => item['idx']);
    },
    adjust() {
      let that = this;
      d3.selectAll($('.man'))
        .attr('x', function(d) {
          return (
            that.map.latLngToLayerPoint(L.latLng(d.trace[0][1], d.trace[0][0]))
              .x - 20
          );
        })
        .attr('y', function(d) {
          return (
            that.map.latLngToLayerPoint(L.latLng(d.trace[0][1], d.trace[0][0]))
              .y - 36
          );
        });

      d3.selectAll($('.locate'))
        .attr('x', function(data) {
          return that.map.latLngToLayerPoint(L.latLng(data[1], data[0])).x - 10;
        })
        .attr('y', function(data) {
          return that.map.latLngToLayerPoint(L.latLng(data[1], data[0])).y - 32;
        });

      d3.selectAll($('.route')).attr('d', function(d) {
        let res = 'M';
        let len = d.trace.length;
        for (let i = 0; i < len - 1; i++) {
          let xy = that.map.latLngToLayerPoint(
            L.latLng(d.trace[i][1], d.trace[i][0])
          );
          res += xy.x + ' ' + xy.y + 'L';
        }
        let xy = that.map.latLngToLayerPoint(
          L.latLng(d.trace[len - 1][1], d.trace[len - 1][0])
        );
        res += xy.x + ' ' + xy.y;
        return res;
      });
      d3.selectAll('animateMotion').attr('path', function(d) {
        var res = 'M0 0';
        var len = d.trace.length;
        var first = that.map.latLngToLayerPoint(
          L.latLng(d.trace[0][1], d.trace[0][0])
        );
        for (let i = 1; i < len; i++) {
          let xy = that.map.latLngToLayerPoint(
            L.latLng(d.trace[i][1], d.trace[i][0])
          );
          res += 'L' + (xy.x - first.x) + ' ' + (xy.y - first.y);
        }
        return res;
      });
    },
    drawPerson() {
      let that = this;
      this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
      this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');

      this.g
        .selectAll('image')
        .data(personal_info, function(d) {
          return d;
        })
        .enter()
        .append('image')
        .attr('xlink:href', man)
        .attr('id', function(d) {
          return d.idx;
        })
        .attr('class', 'man')
        .attr('x', function(d) {
          return (
            that.map.latLngToLayerPoint(L.latLng(d.trace[0][1], d.trace[0][0]))
              .x - 20
          );
        })
        .attr('y', function(d) {
          return (
            that.map.latLngToLayerPoint(L.latLng(d.trace[0][1], d.trace[0][0]))
              .y - 36
          );
        })
        .attr('width', '40px')
        .attr('height', '72px')
        .on('click', function(d) {
          that.map.flyTo(L.latLng(d.trace[0][1], d.trace[0][0]), 12);
          that.tmpID = d.idx;
          let idIndex = that.idxs.indexOf(that.tmpID);
          that.user_analysis.id = d.idx;
          that.user_analysis.topoSrc =
            that.topology[personal_info[idIndex]['pattern'] - 1].topoSrc;
          that.g.selectAll('path').remove();
          that.g.selectAll('animateMotion').remove();
          d3.selectAll($('.locate')).remove();
          d3.selectAll($('.man')).remove();
          that.g
            .selectAll('image')
            .data([d], function(data) {
              return data;
            })
            .enter()
            .append('image')
            .attr('class', 'locate')
            .attr('xlink:href', man)
            .attr('id', function(d) {
              return d.idx;
            })
            .attr('class', 'man')
            .attr('x', function(d) {
              return (
                that.map.latLngToLayerPoint(
                  L.latLng(d.trace[0][1], d.trace[0][0])
                ).x - 10
              );
            })
            .attr('y', function(d) {
              return (
                that.map.latLngToLayerPoint(
                  L.latLng(d.trace[0][1], d.trace[0][0])
                ).y - 18
              );
            })
            .attr('width', '40px')
            .attr('height', '75px');

          that.g
            .selectAll('image')
            .data(d.eps, function(data, i) {
              //
              return data;
            })
            .enter()
            .append('image')
            .attr('class', 'locate')
            .attr('xlink:href', locate)
            .attr('x', function(data) {
              return (
                that.map.latLngToLayerPoint(L.latLng(data[1], data[0])).x - 10
              );
            })
            .attr('y', function(data) {
              return (
                that.map.latLngToLayerPoint(L.latLng(data[1], data[0])).y - 32
              );
            })
            .attr('width', '35px')
            .attr('height', '50px')
            .style('display', 'none')
            .style('cursor', 'pointer')
            .on('mouseover', function(data, i) {
              that.idIndex = that.idxs.indexOf(that.tmpID);
              that.timei = i;
              that.location_time = personal_info[that.idIndex]['time'][i];
              function debounce(func, wait) {
                let timer;
                return function() {
                  let context = this;
                  let args = arguments;
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    func.apply(this, args);
                  }, wait);
                };
              }
              debounce(that.showNotify(), 3000);
            })
            .on('mouseout', function() {
              function debounce(func, wait) {
                let timer;
                return function() {
                  let context = this;
                  let args = arguments;
                  if (timer) clearTimeout(timer);
                  timer = setTimeout(() => {
                    func.apply(this, args);
                  }, wait);
                };
              }
              debounce(that.hideNotify(), 3000);
            });

          that.g
            .selectAll('path')
            .data([d], function(data) {
              return data;
            })
            .enter()
            .append('path')
            .attr('d', function(data) {
              var res = 'M';
              let len = data.trace.length;
              for (let i = 0; i < len - 1; i++) {
                let xy = that.map.latLngToLayerPoint(
                  L.latLng(data.trace[i][1], data.trace[i][0])
                );
                res += xy.x + ' ' + xy.y + 'L';
              }
              let xy = that.map.latLngToLayerPoint(
                L.latLng(data.trace[len - 1][1], data.trace[len - 1][0])
              );
              res += xy.x + ' ' + xy.y;
              return res;
            })
            .attr('class', 'route')
            .style('fill', 'none')
            .style('stroke-linejoin', 'round')
            .style('stroke', '#edf8b1')
            .style('stroke-width', '3px');
          d3.selectAll($('#' + d.idx))
            .append('animateMotion')
            .attr('dur', '15s')
            .attr('fill', 'freeze')
            .attr('repeatCount', 'indefinite')
            .attr('path', function(d) {
              var res = 'M0 0';
              var len = d.trace.length;
              var first = that.map.latLngToLayerPoint(
                L.latLng(d.trace[0][1], d.trace[0][0])
              );
              for (let i = 1; i < len; i++) {
                let xy = that.map.latLngToLayerPoint(
                  L.latLng(d.trace[i][1], d.trace[i][0])
                );
                res += 'L' + (xy.x - first.x) + ' ' + (xy.y - first.y);
              }
              return res;
            });
        })
        .style('pointer-events', 'auto')
        .style('cursor', 'pointer');

      this.transform = d3geo.geoTransform({
        point: function(x, y) {
          var point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        },
      });
      this.reset();
      // that.map.on('move', this.reset);
      this.map.on('zoom', this.reset);
    },
    reset() {
      let path = d3geo.geoPath().projection(this.transform);
      var bounds = path.bounds(geo),
        topLeft = bounds[0],
        bottomRight = bounds[1];
      this.svg
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');
      this.g.attr(
        'transform',
        'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')'
      );
      this.adjust();
    },

    showAna() {
      if (this.user_analysis.id === '') {
        this.$message({
          message: '请选择要分析的个人',
          type: 'warning',
        });
        return;
      }
      this.showAnalysis = 1;
    },
    resetAll() {
      d3.select(this.map.getPanes().overlayPane)
        .selectAll('svg')
        .remove();
      //   .selectAll('path')
      //   .remove();
      // d3.select(this.map.getPanes().overlayPane)
      //   .select('.leaflet-zoom-hide')
      //   .selectAll('animateMotion')
      //   .remove();
      // d3.selectAll($('.locate')).remove();
      // d3.selectAll($('.man')).remove();
      this.drawPerson();
      this.showAnalysis = 0;
      this.user_analysis = {
        id: '',
        phone: '178****0329',
        topoSrc: '',
      };
    },
  },
};
</script>
