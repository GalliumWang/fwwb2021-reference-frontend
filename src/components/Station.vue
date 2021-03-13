<template>
  <div id="station">
    <div id="station-map" class="map"></div>
    <div class="left-chart-up"></div>
    <div class="left-chart-middle"></div>
    <div class="right-chart-up"></div>
    <div class="right-chart-middle"></div>
    <div class="chart-down"></div>
  </div>
</template>

<script>
import * as L from 'leaflet';
export default {
  
  name: 'Station',
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.map = L.map('station-map', {
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
    // this.drawBar();
  },
  methods: {
    // drawBar() {
    //   //地铁
    //   // 初始化echarts实例
    //   let chart1 = this.$echarts.init(
    //     document.getElementById("sub-chart"),
    //     "dark"
    //   );
    //   // 绘制图表
    //   chart1.setOption({
    //     title: { text: "地铁站驻留情况" },
    //     tooltip: {},
    //     grid: {
    //       bottom: 80
    //     },
    //     xAxis: {
    //       data: [
    //         "于洪广场",
    //         "五里河",
    //         "太原街",
    //         "南市场",
    //         "怀远门",
    //         "淮河街沈医二院",
    //         "青年公园",
    //         "岐山路",
    //         "青年大街",
    //         "东中街"
    //       ],
    //       axisLabel: {
    //         interval: 0,
    //         rotate: 40
    //       }
    //     },
    //     yAxis: {
    //       splitLine: {
    //         show: true,
    //         lineStyle: {
    //           color: "#979797"
    //         }
    //       }
    //     },
    //     toolbox: {
    //       show: true,
    //       feature: {
    //         dataZoom: {
    //           yAxisIndex: "none"
    //         },
    //         magicType: { type: ["line", "bar"] },
    //         saveAsImage: {}
    //       }
    //     },
    //     series: [
    //       {
    //         name: "人数",
    //         type: "bar",
    //         data: [20, 100, 103, 86, 96, 51, 26, 8, 86, 96]
    //       }
    //     ]
    //   });
    //   //公交
    //   // 初始化echarts实例
    //   let chart2 = this.$echarts.init(
    //     document.getElementById("bus-chart"),
    //     "dark"
    //   );
    //   // 绘制图表
    //   chart2.setOption({
    //     title: { text: "公交站驻留情况" },
    //     tooltip: {},
    //     xAxis: {
    //       data: [
    //         "肇工街北一路",
    //         "南十一路齐贤街",
    //         "珠江街华山路站",
    //         "昆山路宠物市场",
    //         "怀塔湾家乐福",
    //         "市交通技术学校东站",
    //         "储备局站",
    //         "桃仙机场T3航站楼",
    //         "市文化宫站",
    //         "西塔东站"
    //       ],
    //       axisLabel: {
    //         interval: 0,
    //         rotate: 40
    //       }
    //     },
    //     yAxis: {
    //       splitLine: {
    //         show: true,
    //         lineStyle: {
    //           color: "#979797"
    //         }
    //       }
    //     },
    //     grid: {
    //       left: 60,
    //       bottom: 80
    //     },
    //     itemStyle: {
    //       // 设置扇形的颜色sss
    //       color: "#ffd04b",
    //       shadowBlur: 200,
    //       shadowColor: "rgba(0, 0, 0, 0.5)"
    //     },
    //     toolbox: {
    //       show: true,
    //       feature: {
    //         dataZoom: {
    //           yAxisIndex: "none"
    //         },
    //         magicType: { type: ["line", "bar"] },
    //         saveAsImage: {}
    //       }
    //     },
    //     series: [
    //       {
    //         name: "人数",
    //         type: "bar",
    //         data: [20, 8, 86, 96, 100, 96, 51, 26, 103, 86]
    //       }
    //     ]
    //   });
    // }
  },
};
</script>

<style scoped>
#station {
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
  width: 420px;
  height: 32%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  top: 21%;
  background-color: rgba(7, 11, 32, 0.8);
}
.left-chart-middle {
  position: absolute;
  left: 1%;
  width: 420px;
  height: 32%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  top: 55%;
  background-color: rgba(7, 11, 32, 0.8);
}
.right-chart-up {
  position: absolute;
  right: 1%;

  width: 420px;
  height: 32%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  top: 21%;
  background-color: rgba(7, 11, 32, 0.8);
}
.right-chart-middle {
  position: absolute;
  right: 1%;
  width: 420px;
  height: 32%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  top: 55%;
  background-color: rgba(7, 11, 32, 0.8);
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
</style>
