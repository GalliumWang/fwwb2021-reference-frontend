<template>
  <div id="analysis">
    <div id="analysis-map" class="map"></div>
    <div class="left-chart-up" id="pie_echarts" v-if="showBar === 1"></div>
    <div class="left-chart-up-stable" id="pie_echarts" v-else></div>
    <div class="left-chart-middle" id="cloud" ref="wordCloudBox" v-if="showBar === 1"></div>
    <div class="left-chart-middle" id="cloud" ref="wordCloudBox" style="display:none;" v-else></div>
    <div class="right-chart-up">
      <div id="odMap-title">
        <b>24h时空转移趋势图</b>
      </div>
      <div id="odMap"></div>
    </div>
    <div class="right-chart-middle" id="chart-string" v-if="showString === 1"></div>
    <div class="right-chart-middle" id="chart-string" style="display:none;" v-else></div>
    <div class="right-chart-down" id="items">
      <div class="item">
        <span
          style="display:inline-block;margin-right:5px;border-radius:10px;width:20px;height:15px;background-color:#63b2ee;"
        ></span>综合区
      </div>
      <!-- "#e41a1c", "#377eb8", "#4daf4a", "#984ea3" -->
      <div class="item">
        <span
          style="display:inline-block;margin-right:5px;border-radius:10px;width:20px;height:15px;background-color:#76da91;"
        ></span>餐饮娱乐区
      </div>
      <div class="item">
        <span
          style="display:inline-block;margin-right:5px;border-radius:10px;width:20px;height:15px;background-color:#f89588;"
        ></span>居住生活区
      </div>
      <div class="item">
        <span
          style="display:inline-block;margin-right:5px;border-radius:10px;width:20px;height:15px;background-color:#7cd6cf;"
        ></span>企业商务区
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '~leaflet/dist/leaflet.css';
#analysis {
  height: 100%;
  position: relative;
}
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 1;
}
.left-chart-up {
  position: absolute;
  padding-top: 10px;
  left: 1%;
  width: 420px;
  height: 30%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 21%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  animation: fade-in-left;
  animation-duration: 1s;
  -webkit-animation: fade-in-left 1s;
}
.left-chart-up-stable {
  position: absolute;
  padding-top: 10px;
  left: 1%;
  width: 420px;
  height: 30%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 21%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  opacity: 0;
}
.left-chart-middle {
  position: absolute;
  left: 1%;
  width: 420px;
  height: 300px;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 34%; */
  top: 54%;
  background-color: rgba(7, 11, 32, 0.8);
  animation: fade-in-left;
  animation-duration: 1s;
  -webkit-animation: fade-in-left 1s;
}
.right-chart-up {
  position: absolute;
  box-sizing: border-box;
  right: 1%;
  padding-top: 25px;
  width: 500px;
  height: 460px;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  /* top: 1%; */
  top: 21%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  animation: fade-in-right;
  animation-duration: 1s;
  -webkit-animation: fade-in-right 1s;
}
.right-chart-middle {
  position: absolute;
  box-sizing: border-box;
  right: 1%;
  width: 500px;
  height: 370px;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  z-index: 100;
  bottom: 1%;
  /* background-color: rgba(7, 11, 32, 0.8); */
  animation: fade-in-right;
  animation-duration: 1s;
  -webkit-animation: fade-in-right 1s;
}
.right-chart-down {
  position: absolute;
  left: 1%;
  width: 180px;
  height: 180px;
  /* border: solid 1px #436983; */
  /* border-radius: 2px; */
  /* box-shadow: #3b5d74 0px 0px 10px 5px inset; */
  z-index: 100;
  bottom: 1%;
  /* background-color: rgba(7, 11, 32, 0.8); */
}
.chart-down {
  position: absolute;
  left: 1%;
  width: 98%;
  height: 30%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  bottom: 1%;
  background-color: rgba(7, 11, 32, 0.8);
}
#items {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
}
.item {
  color: aliceblue;
}
#odMap-title {
  position: absolute;
  font-size: 19px;
  top: 2%;
  left: 2%;
  width: 98%;
  height: 10%;
  color: white;
}
#odMap {
  left: 50%;
  transform: translate3d(10%, 4%, 0);
}
#odMap :hover {
  cursor: pointer;
}

/* right-chart的动画 */
@keyframes fade-in-right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@-webkit-keyframes fade-in-right {
  /*针对webkit内核*/
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* left-chart的动画 */
@keyframes fade-in-left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@-webkit-keyframes fade-in-left {
  /*针对webkit内核*/
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
<script>
import * as L from 'leaflet';
import * as d3 from 'd3';
import Circos from 'circos';
import circleData from '../assets/data/city_new.json';
import myCloud from '@/assets/js/myCloud.js';
import syzuobiao from '../assets/data/syzuobiao.json';
import odata from '../assets/data/od_map.json';
import cloud_words from '../assets/data/word_cloud.json';
//import useclip from "../assets/js/d3clip";
export default {
  name: 'analysis',
  data() {
    return {
      showBar: 0,
      showString: 0,
      currentIndex: -1,
      myTimer: null, //轮播计数器
      map: null,
      circleData,
      color: [
        '#63b2ee',
        '#76da91',
        '#f89588',
        '#7cd6cf',
        '#9192ab',
        '#7898e1',
        '#efa666',
        '#eddd86',
        '#9987ce',
        '#63b2ee',
        '#76da91',
      ],
      svg: null,
      syzuobiao,
      drawer: false,
      dd: [],
      unit: '',
      nam: ['综合区', '餐饮娱乐区', '居住生活区', '企业商务区'],
      wordList: '',
      bounds: '',
      timeChoose: [
        { id: '0', label: '0', color: '#6633CC', len: 60 },
        { id: '1', label: '1', color: '#66CCFF', len: 60 },
        { id: '2', label: '2', color: '#6633CC', len: 60 },
        { id: '3', label: '3', color: '#66CCFF', len: 60 },
        { id: '4', label: '4', color: '#6633CC', len: 60 },
        { id: '5', label: '5', color: '#66CCFF', len: 60 },
        { id: '6', label: '6', color: '#6633CC', len: 60 },
        { id: '7', label: '7', color: '#66CCFF', len: 60 },
        { id: '8', label: '8', color: '#6633CC', len: 60 },
        { id: '9', label: '9', color: '#66CCFF', len: 60 },
        { id: '10', label: '10', color: '#6633CC', len: 60 },
        { id: '11', label: '11', color: '#66CCFF', len: 60 },
        { id: '12', label: '12', color: '#6633CC', len: 60 },
        { id: '13', label: '13', color: '#66CCFF', len: 60 },
        { id: '14', label: '14', color: '#6633CC', len: 60 },
        { id: '15', label: '15', color: '#66CCFF', len: 60 },
        { id: '16', label: '16', color: '#6633CC', len: 60 },
        { id: '17', label: '17', color: '#66CCFF', len: 60 },
        { id: '18', label: '18', color: '#6633CC', len: 60 },
        { id: '19', label: '19', color: '#66CCFF', len: 60 },
        { id: '20', label: '20', color: '#6633CC', len: 60 },
        { id: '21', label: '21', color: '#66CCFF', len: 60 },
        { id: '22', label: '22', color: '#6633CC', len: 60 },
        { id: '23', label: '23', color: '#66CCFF', len: 60 },
      ],

      fluent: [
        { block_id: '0', start: 0, end: 60, value: 27408 },
        { block_id: '1', start: 0, end: 60, value: 21591 },
        { block_id: '2', start: 0, end: 60, value: 10889 },
        { block_id: '3', start: 0, end: 60, value: 8294 },
        { block_id: '4', start: 0, end: 60, value: 8297 },
        { block_id: '5', start: 0, end: 60, value: 10934 },
        { block_id: '6', start: 0, end: 60, value: 13647 },
        { block_id: '7', start: 0, end: 60, value: 10783 },
        { block_id: '8', start: 0, end: 60, value: 16730 },
        { block_id: '9', start: 0, end: 60, value: 22347 },
        { block_id: '10', start: 0, end: 60, value: 24640 },
        { block_id: '11', start: 0, end: 60, value: 19254 },
        { block_id: '12', start: 0, end: 60, value: 16654 },
        { block_id: '13', start: 0, end: 60, value: 16297 },
        { block_id: '14', start: 0, end: 60, value: 19119 },
        { block_id: '15', start: 0, end: 60, value: 16379 },
        { block_id: '16', start: 0, end: 60, value: 22112 },
        { block_id: '17', start: 0, end: 60, value: 24488 },
        { block_id: '18', start: 0, end: 60, value: 24575 },
        { block_id: '19', start: 0, end: 60, value: 24565 },
        { block_id: '20', start: 0, end: 60, value: 27095 },
        { block_id: '21', start: 0, end: 60, value: 21986 },
        { block_id: '22', start: 0, end: 60, value: 29906 },
        { block_id: '23', start: 0, end: 60, value: 33016 },
      ],
    };
  },
  methods: {
    getWordCloud(wordList) {
      let wordOption = {
        wordList,
        size: [400, 280], // 盒子的宽高
        svgElement: this.$refs.wordCloudBox, //使用ref选择节点
      };
      myCloud(wordOption, this.getArticleList);
    },
    drawBar() {
      var that = this;
      //地铁
      // 初始化echarts实例
      let chart1 = this.$echarts.init(document.getElementById('pie_echarts'));
      // 绘制图表
      var option = null;
      option = {
        title: {
          text: '地区子功能分块',
          textStyle: {
            color: '#ffffff',
          },
        },
        tooltip: { trigger: 'item', formatter: '{b}:  ({d}%)' },
        grid: {
          top: '20%',
        },
        color: [
          '#63b2ee',
          '#76da91',
          '#f89588',
          '#7cd6cf',
          '#9192ab',
          '#7898e1',
          '#efa666',
          '#eddd86',
          '#9987ce',
          '#63b2ee',
          '#76da91',
        ],
        series: [
          {
            type: 'pie',
            radius: [0, '60%'],
            data: that.dd,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(128, 128, 128, 0.5)',
              },
            },
            /*
              labelLine: {
                normal: {
                  show: false // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              },
              label: {
                normal: {
                  position: "inner", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                  // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                  // {a}指series.name  {b}指series.data的name
                  // {c}指series.data的value  {d}%指这一部分占总数的百分比
                  formatter: "{b}"
                }
              }*/
          },
        ],
      };

      that.currentIndex = -1;

      function play() {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        chart1.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: that.currentIndex,
        });
        that.currentIndex = (that.currentIndex + 1) % dataLen;
        // 高亮当前图形
        chart1.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: that.currentIndex,
        });
        // 显示 tooltip
        chart1.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: that.currentIndex,
        });
      }

      that.myTimer = null;
      that.myTimer = setInterval(play, 1000);

      if (option && typeof option === 'object') {
        chart1.setOption(option, true);
      }

      setTimeout(function() {
        window.addEventListener('resize', function() {
          chart1.resize();
        });
      }, 200);
    },
    draw_od() {
      let that = this;
      var circosText = new Circos({
        container: '#odMap',
        width: 430,
        height: 400,
        zoom: true,
      });

      var gieStainColor = {
        gpos100: 'rgb(0,0,0)',
        gpos: 'rgb(0,0,0)',
        gpos75: 'rgb(130,130,130)',
        gpos66: 'rgb(160,160,160)',
        gpos50: 'rgb(200,200,200)',
        gpos33: 'rgb(210,210,210)',
        gpos25: 'rgb(200,200,200)',
        gvar: 'rgb(220,220,220)',
        gneg: 'rgb(255,255,255)',
        acen: 'rgb(217,47,39)',
        stalk: 'rgb(100,127,164)',
        select: 'rgb(135,177,255)',
      };

      circosText
        .layout(this.timeChoose, {
          innerRadius: 400 / 2 - 30,
          outerRadius: 400 / 2 - 20,
          labels: {
            position: 'center',
            display: true,
            size: 14,
            color: '#fff',
            radialOffset: 15,
          },
          ticks: {
            display: false,
            labelDenominator: 1000000,
          },
        })
        .histogram('fluent', this.fluent, {
          innerRadius: 0.35,
          outerRadius: 0.95,
          color: 'OrRd',
        })
        .render();
      let g = d3.select('.cs-layout').selectAll('g');
      // 布局转化数据
      g.on('click', function(d) {
        that.drawString(d.id);
        that.showString = 1;
      });
    },
    drawString(id) {
      let that = this;
      d3.select('.right-chart-middle')
        .selectAll('svg')
        .remove();
      let population = [
        [10, 9, 1, 7],
        [10, 2, 3, 3],
        [2, 4, 3, 2],
        [9, 2, 0, 1],
      ];
      let width = 300;
      let height = 280;
      let innerRadius = Math.min(width, height) * 0.25;
      let color = d3.scaleOrdinal(d3.schemeCategory10);
      let ribbon = d3.ribbon().radius(innerRadius);
      let arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 20);
      let chord = d3
        .chord()
        .padAngle(0.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);
      const svg = d3
        .select('#chart-string')
        .append('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('font-size', 8)
        .attr('font-family', 'sans-serif')
        .style('width', '100%')
        .style('height', '100%');

      const chords = chord(
        odata['od'][id].slice(0, 4).map(item => item.slice(0, 4))
      );

      const group = svg
        .append('g')
        .selectAll('g')
        .data(chords.groups)
        .join('g');

      group
        .append('path')
        .attr('fill', d => that.color[d.index])
        .attr('stroke', d => that.color[d.index])
        .attr('d', arc)
        .on('mouseover', function(e) {
          d3.selectAll('.' + 'poli' + e.index)
            .transition()
            .duration(600)
            .attr('stroke-width', 9);
        })
        .on('mouseout', function(e) {
          d3.selectAll('.' + 'poli' + e.index)
            .transition()
            .duration(600)
            .attr('stroke-width', 1);
        });

      group
        .append('text')
        .attr('fill', 'white')
        .each(d => {
          d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr('dy', '.35em')
        .attr(
          'transform',
          d => `
        rotate(${(d.angle * 180) / Math.PI - 90})
        translate(${innerRadius + 26})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `
        )
        .attr('text-anchor', d => (d.angle > Math.PI ? 'end' : null))
        .text(d => that.nam[d.index]);

      svg
        .append('g')
        .attr('fill-opacity', 0.67)
        .selectAll('path')
        .data(chords)
        .join('path')
        .attr('fill', d => that.color[d.source.index])
        .attr('d', ribbon);
    },
  },
  mounted() {
    var polygonClip = require('../assets/js/d3-polygon-clip').polygonClip;
    //useclip(d3);
    var that = this;
    let wordList = [];
    this.getWordCloud(wordList);
    this.map = L.map('analysis-map', {
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
        attribution: 'ArcGIS',
      }
    ).addTo(this.map);
    var voronoi = d3.voronoi().extent([
      [41.08805847, 122.3507919],
      [42.50167847, 123.9822388],
    ]);
    var jsonCircles = [];
    var dataset = [];
    circleData.forEach(function(d) {
      //console.log(d.class);

      jsonCircles.push({
        x_axis: d.coordinate[1],
        y_axis: d.coordinate[0],
        vector: d.vector,
        class: d.class,
        text: d.text,
      });
      dataset.push([d.coordinate[1], d.coordinate[0]]);
    });
    var data = voronoi(dataset).polygons();

    var lg = L.polygon(syzuobiao, {
      color: 'gray',
      fillColor: 'black',
      fillOpacity: 0.1,
      interactive: false,
    }).addTo(that.map);
    //that.map.fitBounds(lg);

    data.forEach(function(d, e) {
      var dson = d;

      var $dson = [];
      for (var j = 0; j < dson.length; j++) {
        $dson.push([dson[j][0], dson[j][1]]);
      }
      //var max = d3.polygonHull(that.syzuobiao);

      //newdson.clip(that.syzuobiao.slice());
      //console.log(polygonClip(that.syzuobiao, d3.polygonHull($dson)));

      //console.log($dson == newdson);

      var po = L.polygon(
        polygonClip(d3.polygonHull(that.syzuobiao), d3.polygonHull($dson)),
        {
          color: 'white',
          fillColor: that.color[jsonCircles[e].class],
          fillOpacity: 0.3,
          weight: 1,
          className: 'poli' + jsonCircles[e].class,
        }
      ).addTo(that.map);
      po.on('click', function() {
        that.dd = [];
        Object.keys(circleData[e]['percent']).forEach(function(item) {
          var ddx = {
            value: circleData[e]['percent'][item],
            name: item,
          };
          that.dd.push(ddx);
        });

        // 比较函数
        function compare(property) {
          return function(obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value1 - value2; // 升序
          };
        }

        that.dd = that.dd.sort(compare('value')); //排序

        d3.select('.left-chart-middle')
          .selectAll('svg')
          .remove();
        // let wordList = jsonCircles[e].percent;
        // that.getWordCloud(wordList);
        let wordList = [...cloud_words[jsonCircles[e]['class']]];

        that.getWordCloud(
          wordList.map(function(item) {
            return {
              text: item,
              size: parseInt(Math.random() * 15 + 8),
            };
          })
        );

        clearInterval(that.myTimer); // 清除计时器
        that.drawBar();
        that.showBar = 1;
      });
    });
    this.draw_od();
  },
};
</script>
