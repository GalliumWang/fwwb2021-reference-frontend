<template>
  <div id="gether">
    <div id="gether-map" class="map"></div>
    <div :class="doubleheat">
      <div id="heat-map1"></div>
      <div id="heat-map2"></div>
    </div>
    <div :class="control" @click="close()">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
import $ from 'jquery';
import congestion from '../assets/data/congestion.json';
import geo from '../assets/data/shenyang.json';
import shenyang_geo from '../assets/data/syzuobiao.json';
import heatData from '../../static/json/heatmap.json';
export default {
  name: 'Gether',
  data() {
    return {
      doubleheat: 'double-heat-hid',
      map: null,
      heatmap1: null,
      heatmap2: null,
      control: 'control-hid',
      data: [
        0.176042,
        0.096146,
        0.076414,
        0.334734,
        0.132583,
        0.135422,
        0.060884,
        0.768601,
        0.230771,
        0.07572,
        0.210855,
        0.090938,
        0.094296,
        0.290368,
        0.093755,
        0.099166,
        0.429278,
        0.962314,
        0.43833,
        0.244464,
        0.550621,
        0.173093,
        0.103659,
        0.0773,
        0.265913,
        0.099811,
        0.076164,
        0.3154,
        0.146557,
        0.108531,
        0.421608,
        0.120872,
        0.061825,
        0.101988,
        0.095364,
        0.365022,
        0.096741,
        0.095962,
        0.06409,
        0.300409,
        0.102083,
        0.134949,
        0.535842,
        0.224584,
        0.227262,
        0.28274,
        0.11842,
        0.062601,
        0.103968,
        0.088054,
        0.069683,
        0.141973,
        0.106082,
        0.135513,
        0.09906,
        0.099516,
        0.31927,
        0.097133,
        0.08595,
        0.067532,
        0.096042,
        0.09789,
        0.059053,
        0.11167,
        0.137408,
        0.109005,
        0.365752,
        0.179085,
        0.135975,
        0.199275,
        0.144186,
        0.053961,
        0.088226,
        0.09218,
        0.059777,
        0.125663,
        0.136192,
        0.121279,
        0.146825,
        0.267907,
        0.113706,
        0.09266,
        0.105833,
        0.130221,
        0.09695,
        0.078355,
        0.067088,
        0.093888,
        0.096131,
        0.152373,
        0.072957,
        0.095516,
        0.091731,
        0.14403,
        0.113989,
        0.089659,
        0.089808,
        0.085082,
        0.057542,
        0.09864,
        0.091152,
        0.066592,
        0.20529,
        0.12785,
        0.077798,
        0.071004,
        0.094316,
        0.088963,
        0.054368,
        0.091964,
        0.095114,
        0.071649,
        0.076153,
        0.150208,
        0.15751,
        0.065801,
        0.087791,
        0.100653,
        0.121987,
        0.161462,
        0.096507,
        0.093314,
        0.075191,
        0.07723,
        0.091846,
        0.095587,
        0.053434,
        1.017331,
        1.458327,
        0.120566,
        0.107582,
        0.139082,
        0.112224,
        0.159757,
        0.252278,
        0.161521,
        0.124628,
        0.080985,
        0.634034,
        0.248268,
        0.20864,
        0.14324,
        0.174345,
        0.165649,
        0.116201,
        0.119975,
        0.133551,
        0.138756,
        0.128587,
        0.171464,
        1.328931,
        0.318976,
        0.436703,
        0.109017,
        0.1716,
        0.324534,
        0.258161,
        0.20793,
        0.169164,
        0.191496,
        0.125737,
        0.320198,
        0.272419,
        0.222312,
        0.247595,
        0.192478,
        0.134997,
        0.152271,
      ],
      already: 1,
      websock: null,
      color_comput: null,
      color_lineasr: null,
      region_flag: true,
      region_info_flag: false,
      show_circle_flag: false,
      show_time_flag: false,
      radius: 0.002,
      heatMapLayer1: null,
      heatMapLayer2: null,
      heatMapData1: [],
      heatMapDate2: [],
      max: 100,
      websockHeat: null,
    };
  },
  created() {},
  mounted() {
    this.map = L.map('gether-map', {
      minZoom: 3,
      maxZoom: 14,
      center: [41.8, 123.38333],
      zoom: 10,
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
    this.heatmap1 = L.map('heat-map1', {
      minZoom: 3,
      maxZoom: 14,
      center: [41.8, 123.38333],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
    });
    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.heatmap1);
    this.heatmap2 = L.map('heat-map2', {
      minZoom: 3,
      maxZoom: 14,
      center: [41.8, 123.38333],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
    });
    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.heatmap2);

    let that = this;

    this.map.addEventListener('zoom', function(e) {
      let zoom = e.sourceTarget._animateToZoom;
      console.log(zoom);

      if (zoom <= 11) {
        that.region_flag = true;
        that.region_info_flag = false;
        that.show_circle_flag = false;
        that.show_time_flag = false;
        d3.selectAll($('.region_info')).style('display', 'none');
        that.control = 'control-hid';
        that.doubleheat = 'double-heat-hid';
      } else if (zoom === 12) {
        that.region_flag = true;
        that.region_info_flag = true;
        that.show_circle_flag = false;
        that.show_time_flag = false;
        d3.selectAll($('.region_info')).style('display', 'block');
        d3.selectAll($('.circle')).remove();
        that.control = 'control-hid';
        that.doubleheat = 'double-heat-hid';
      } else if (zoom === 13) {
        that.drawConstruction();
        that.region_flag = true;
        that.region_info_flag = true;
        that.show_circle_flag = true;
        that.show_time_flag = false;
        d3.selectAll($('.time_svg')).remove();
        d3.selectAll($('.region_info')).style('display', 'block');
        d3.selectAll($('.region')).style('display', 'block');
        d3.selectAll($('.road')).style('display', 'block');
        d3.selectAll($('.bg')).style('display', 'block');
        that.control = 'control-hid';
        that.doubleheat = 'double-heat-hid';
      }
      if (zoom === 14) {
        that.region_flag = false;
        that.region_info_flag = false;
        that.show_circle_flag = false;
        that.show_time_flag = true;
        d3.selectAll($('.circle')).remove();
        d3.selectAll($('.region_info')).style('display', 'none');
        d3.selectAll($('.region')).style('display', 'none');
        d3.selectAll($('.road')).style('display', 'none');
        d3.selectAll($('.bg')).style('display', 'none');
        that.drawTime();
        that.already = 0;
      } else {
        if (that.already) {
          return;
        } else {
          d3.selectAll('.leaflet-zoom-hide').remove();
          that.drawConstruction();
          that.already = 1;
        }
      }
    });

    let a = d3.color('#D0FF51');
    let b = d3.color('#F32727');
    this.color_comput = d3.interpolate(a, b);
    this.color_lineasr = d3
      .scaleLinear()
      .domain([0, 3])
      .range([0, 1]);
    let polygon = L.polygon(shenyang_geo, {
      stroke: false,
      fill: true,
      fillColor: '#D3EE4E',
      fillOpacity: 0.5,
      className: 'bg',
    }).addTo(this.map);

    this.initWebSocket();
    this.initWebSocketHeat();
  },
  methods: {
    close() {
      this.doubleheat = 'double-heat-hid';
      this.control = 'control-hid';
    },
    drawConstruction() {
      let that = this;
      congestion.forEach(function(item) {
        let circle = L.circle(item.location, {
          radius: 1000,
          className: 'circle',
        }).addTo(that.map);
      });
    },
    setHeatMapLayer() {
      var config1 = {
        radius: 0.003,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLconfigocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      };
      var config2 = {
        radius: this.radius,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLconfigocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      };

      this.heatMapLayer1 = new HeatmapOverlay(config1);
      this.heatMapLayer1.addTo(this.heatmap1);

      this.heatMapLayer2 = new HeatmapOverlay(config2);
      this.heatMapLayer2.addTo(this.heatmap2);
      this.heatMapLayer1.setData({
        data: heatData,
        max: this.max,
      });
      this.heatMapLayer2.setData({
        data: heatData,
        max: this.max,
      });
    },
    drawTime() {
      let that = this;
      d3.selectAll('circle').remove();
      let svg = d3
        .select(this.map.getPanes().overlayPane)
        .append('svg')
        .attr('class', 'time_svg');
      // .style('z-index', '999');
      let hg = svg.append('g').attr('class', 'leaflet-zoom-hide');
      let radialLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
      let segmentLabels = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ];
      let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      };
      let innerRadius = 5,
        numSegments = 24,
        segmentHeight = 20;

      let ir = function(d, i) {
        return innerRadius + Math.floor(i / numSegments) * segmentHeight;
      };
      let or = function(d, i) {
        return (
          innerRadius +
          segmentHeight +
          Math.floor(i / numSegments) * segmentHeight
        );
      };
      let sa = function(d, i) {
        return (i * 2 * Math.PI) / numSegments;
      };
      let ea = function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numSegments;
      };
      let accessor = function(d) {
        return d;
      };
      let domain = d3.extent(this.data, accessor);
      let range = ['white', 'red'];
      let color = d3
        .scaleLinear()
        .domain(domain)
        .range(range);
      congestion.forEach(function(item, k) {
        let g = hg
          .append('g')
          .classed('circular-heat', true)
          .attr(
            'transform',
            'translate(' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).x
              ) +
              ',' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).y
              ) +
              ')'
          );

        g.selectAll('path')
          .data(that.data)
          .enter()
          .append('path')
          .attr(
            'd',
            d3
              .arc()
              .innerRadius(ir)
              .outerRadius(or)
              .startAngle(sa)
              .endAngle(ea)
          )
          .attr('fill', function(d) {
            return color(accessor(d));
          })
          .style('pointer-events', 'auto')
          .style('cursor', 'pointer')
          .on('click', function(e, i) {
            that.control = 'control';
            that.doubleheat = 'double-heat';
            console.log(e, i, item, k);
            // that.heatmap1.resize();
            that.heatmap1.flyTo(
              L.latLng(item.location[0], item.location[1]),
              13
            );
            that.heatmap2.flyTo(
              L.latLng(item.location[0], item.location[1]),
              13
            );
            that.setHeatMapLayer();
          });

        let lsa = 0.01; //Label start angle
        let labels = hg
          .append('g')
          .classed('labels', true)
          .classed('radial', true)
          .attr(
            'transform',
            'translate(' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).x
              ) +
              ',' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).y
              ) +
              ')'
          );

        labels
          .selectAll('def')
          .data(radialLabels)
          .enter()
          .append('def')
          .append('path')
          .attr('id', function(d, i) {
            return 'radial-label-path-' + '-' + i;
          })
          .attr('d', function(d, i) {
            let r = innerRadius + (i + 0.2) * segmentHeight;
            return (
              'm' +
              r * Math.sin(lsa) +
              ' -' +
              r * Math.cos(lsa) +
              ' a' +
              r +
              ' ' +
              r +
              ' 0 1 1 -1 0'
            );
          });

        labels
          .selectAll('text')
          .data(radialLabels)
          .enter()
          .append('text')
          .append('textPath')
          .attr('xlink:href', function(d, i) {
            return '#radial-label-path-' + '-' + i;
          })
          .style('font-size', 0.6 * segmentHeight + 'px')
          .text(function(d) {
            return d;
          });

        //Segment labels
        let segmentLabelOffset = 2;
        let r =
          innerRadius +
          Math.ceil(that.data.length / numSegments) * segmentHeight +
          segmentLabelOffset;
        labels = hg
          .append('g')
          .classed('labels', true)
          .classed('segment', true)
          .attr(
            'transform',
            'translate(' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).x
              ) +
              ',' +
              parseInt(
                that.map.latLngToLayerPoint(
                  L.latLng(item.location[0], item.location[1])
                ).y
              ) +
              ')'
          );

        labels
          .append('def')
          .append('path')
          .attr('id', 'segment-label-path')
          .attr('d', 'm0 -' + r + ' a' + r + ' ' + r + ' 0 1 1 -1 0');

        labels
          .selectAll('text')
          .data(segmentLabels)
          .enter()
          .append('text')
          .append('textPath')
          .attr('xlink:href', '#segment-label-path')
          .attr('startOffset', function(d, i) {
            return (i * 100) / numSegments + '%';
          })
          .style('fill', 'white')
          .text(function(d) {
            return d;
          });
      });
      let transform = d3geo.geoTransform({
        point: function(x, y) {
          let point = that.map.latLngToLayerPoint(new L.latLng(y, x));
          this.stream.point(point.x, point.y);
        },
      });
      let path = d3geo.geoPath().projection(transform);
      that.map.on('move', reset);
      // this.map.on('zoom', adjust);
      reset();
      function reset() {
        var bounds = path.bounds(geo),
          topLeft = bounds[0],
          bottomRight = bounds[1];
        svg
          .attr('width', bottomRight[0] - topLeft[0])
          .attr('height', bottomRight[1] - topLeft[1])
          .style('left', topLeft[0] + 'px')
          .style('top', topLeft[1] + 'px');
        hg.attr(
          'transform',
          'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')'
        );
      }
    },
    initWebSocket() {
      let that = this;
      // 打开一个 web socket
      if (!this.websock) {
        this.websock = new WebSocket(
          'ws://121.199.31.210:8000/chat/api/get_traffic_congestion_data'
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
      let data = JSON.parse(e.data);
      if (this.region_flag) {
        this.drawRoad([data.highway, data.road]);
        this.drawRegion([data.region, data.business]);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log('断开连接');
    },

    initWebSocketHeat() {
      let that = this;
      // 打开一个 web socket
      if (!this.websockHeat) {
        this.websockHeat = new WebSocket(
          'ws://121.199.31.210:8000/chat/get_geo_data/100'
        );

        this.websockHeat.onmessage = this.websocketonmessageHeat;
        this.websockHeat.onopen = this.websocketonopenHeat;
        this.websockHeat.onerror = this.websocketonerrorHeat;
        this.websockHeat.onclose = this.websocketcloseHeat;
        this.overHeat = () => {
          this.websockHeat.close();
          this.websockHeat.onclose = function(e) {
            console.log(e);
            console.log('关闭');
          };
        };
      }
    },
    websocketonopenHeat() {
      //连接建立之后执行send方法发送数据
      let actions = { test: '12345' };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerrorHeat() {
      //连接建立失败重连

      this.initWebSocketHeat();
      console.log('重连');
    },
    websocketonmessageHeat(e) {
      //数据接收
      console.log(JSON.parse(e.data));
      this.heatMapLayer1.setData({
        data: JSON.parse(e.data).data,
        max: this.max,
      });
      this.heatMapLayer2.setData({
        data: JSON.parse(e.data).data,
        max: this.max,
      });
    },
    websocketsendHeat(Data) {
      //数据发送
      this.websockHeat.send(Data);
    },
    websocketcloseHeat(e) {
      //关闭
      console.log('断开连接');
    },

    drawRoad(roadData) {
      let that = this;
      let res = [];
      for (let j = 0; j < roadData.length; j++) {
        let d = roadData[j];
        for (let k = 0; k < d.length; k++) {
          let coords = [];
          for (let i = 0; i < d[k].coords.length; i++) {
            coords.push([d[k].coords[i].lat, d[k].coords[i].lon]);
          }
          res.push([coords, d[k].index]);
        }
      }
      d3.selectAll($('.road')).remove();
      res.forEach(function(coord) {
        L.polyline(coord[0], {
          stroke: true,
          noClip: true,
          color: that.color_comput(that.color_lineasr(coord[1])),
          className: 'road',
        }).addTo(that.map);
      });
    },
    drawRegion(regionData) {
      let that = this;
      let res = [];
      for (let j = 0; j < regionData.length; j++) {
        let d = regionData[j];
        for (let i = 0; i < d.length; i++) {
          let coords = [];
          for (let k = 0; k < d[i].coords[0].length; k++) {
            let temp = [];
            for (let l = 0; l < d[i].coords[0][k].length; l++) {
              temp.push([
                d[i].coords[0][k][l]['lat'],
                d[i].coords[0][k][l]['lon'],
              ]);
            }
            coords.push(temp);
          }
          res.push([coords, d[i].index, j]);
        }
      }
      d3.selectAll($('.region')).remove();
      res.forEach(function(coord) {
        let class_name = '';
        if (coord[2] === 0) {
          class_name = 'region';
        } else {
          class_name = 'region_info';
        }

        L.polygon(coord, {
          stroke: true,
          color: '#fff',
          fill: true,
          fillColor: that.color_comput(that.color_lineasr(coord[1])),
          className: class_name,
          fillOpacity: 0.5,
        }).addTo(that.map);
        if (coord[2] === 1 && !that.region_info_flag) {
          d3.selectAll($('.region_info')).style('display', 'none');
        }
      });
    },
  },
  beforeDestroy() {
    this.over();
    this.overHeat();
  },
};
</script>

<style scoped>
#gether {
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
.double-heat {
  position: absolute;
  right: 1%;
  width: 40vh;
  height: 80vh;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 10;
  top: 200px;
  background-color: rgba(7, 11, 32, 0.8);
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: flex-end;
  transition: all 0.6s;
}
.double-heat-hid {
  position: absolute;
  right: -50%;
  width: 40vh;
  height: 80vh;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 10;
  top: 200px;
  background-color: rgba(7, 11, 32, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  transition: all 0.6s;
}
.double-heat > div {
  border: solid 3px #2a4053;
  border-radius: 2px;
  width: 40vh;
  height: 40vh;
  margin: -1px;
  transition: all 0.6s;
}
.double-heat-hid > div {
  border: solid 3px #2a4053;
  border-radius: 2px;
  width: 40vh;
  height: 39.99vh;
  margin: -1px;
  transition: all 0.6s;
}
.control {
  right: 1%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  position: absolute;
  width: 4vh;
  height: 4vh;
  top: 200px;
  display: flex;
  background-color: rgba(7, 11, 32, 0.8);
  z-index: 500;
  font-size: 4vh;
  cursor: pointer;
  transition: all 0.6s;
}
.control-hid {
  right: -50%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  position: absolute;
  width: 4vh;
  height: 4vh;
  top: 200px;
  display: flex;
  background-color: rgba(7, 11, 32, 0.8);
  z-index: 500;
  font-size: 4vh;
  cursor: pointer;
  transition: all 0.6s;
}
</style>
