<template>
  <div id="development">
    <el-radio-group v-model="radio" class="switch" :change="change()">
      <el-radio-button label="1">规划热力图</el-radio-button>
      <el-radio-button label="2">总体规划图</el-radio-button>
    </el-radio-group>
    <div id="heat-map" class="map"></div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
import $ from 'jquery';
import heatData from '../../static/json/heatmap.json';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import highlight from '../assets/data/highlights.json';
import development_circle from '../assets/data/development_circle.json';
import geo from '../assets/data/shenyang.json';
import shenyang_geo from '../assets/data/syzuobiao.json';
import {
  BubbleSet,
  ShapeSimplifier,
  BSplineShapeGenerator,
  PointPath,
} from 'bubblesets-js';
export default {
  name: 'Development',
  data() {
    return {
      heatData,
      highlight,
      mypop: null,
      dataSet: [],
      normalColor: ['#1BBD8F', '#E8EBED', '#9bf6ff', '#E8EBED'],
      innerRadius: 25,
      outerRadius: 30,
      radius: 25,
      pie: d3.pie(),
      radio: 0,
      map: null,
    };
  },
  mounted() {
    let that = this;
    this.map = L.map('heat-map', {
      minZoom: 11,
      maxZoom: 11,
      center: [41.776177, 123.315697],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
    });
    this.mypop = L.popup();
    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.map);
    this.radio = '1';
    this.setHeatMapLayer();
    let polygon = L.polygon(shenyang_geo, {
      stroke: false,
      fill: true,
      fillColor: '#D3EE4E',
      fillOpacity: 0.5,
      className: 'bg',
    }).addTo(this.map);
    this.drawSvg();
    d3.selectAll($('#g')).style('display', 'none');
  },
  methods: {
    change() {
      let that = this;
      if (this.radio === 0) {
        return;
      }
      if (this.radio === '1') {
        that.map.setMinZoom(11);
        that.map.setMaxZoom(11);
        // that.map.flyTo(L.latLng(41.776177, 123.315697), 11);
        d3.selectAll($('.leaflet-zoom-hide')).style('display', 'block');
        d3.selectAll($('#g')).style('display', 'none');
        d3.selectAll($('.bg')).style('display', 'none');
      } else {
        that.map.setMinZoom(9);
        that.map.setMaxZoom(9);
        // that.map.flyTo(L.latLng(42.138968, 123.285828), 9);
        d3.selectAll($('.leaflet-zoom-hide')).style('display', 'none');
        d3.selectAll($('.bg')).style('display', 'block');
        d3.selectAll($('#g')).style('display', 'block');
      }
    },
    drawSvg() {
      function redraw() {
        document.getElementById('g').remove();
        // console.log(document.getElementById('g').childNodes);
        g = svg
          .append('g')
          .attr('class', 'leaflet-zoom-hide')
          .attr('id', 'g');
        if (that.radio === '1') {
          g.style('display', 'none');
        }
        let scale = 20 - that.map.getZoom();
        that.innerRadius = (Math.pow(2, 10) / Math.pow(2, scale)) * 25;
        that.outerRadius = 1.2 * that.innerRadius;
        that.radius = that.innerRadius;
        drawBubbleSet();
        drawCircle();
      }

      let that = this;

      let Color = ['#1BBD8F', '#E8EBED'];

      for (let i = 0, len = highlight.length; i < len; i++) {
        let temp = highlight[i];
        let res = [];
        res.push([[100 - temp.s_rank, temp.s_rank], temp.lat, temp.lng]);
        res.push([[100 - temp.s_rank, temp.s_rank], temp.lat, temp.lng]);
        res.push([[100 - temp.p_rank, temp.p_rank], temp.lat, temp.lng]);
        res.push([[100 - temp.p_rank, temp.p_rank], temp.lat, temp.lng]);
        that.dataSet.push(res);
      }

      let svg = d3.select(this.map.getPanes().overlayPane).append('svg');
      let g = svg
        .append('g')
        .attr('class', 'leaflet-zoom-hide')
        .attr('id', 'g');
      function drawCircle() {
        // let scale = 20 - that.map.getZoom();
        // that.innerRadius = (Math.pow(2, 10) / Math.pow(2, scale)) * that.radius;
        // that.outerRadius = 1.2 * that.innerRadius;
        let tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('display', 'none');

        g.selectAll('g')
          .data(highlight)
          .enter()
          .append('g')
          .attr('id', function(d, i) {
            return 'g' + i;
          })
          .attr('class', 'nanfu');

        let arc1 = d3
          .arc()
          .innerRadius(that.innerRadius)
          .outerRadius(that.outerRadius);
        let arc2 = d3
          .arc()
          .innerRadius(that.outerRadius)
          .outerRadius(2 * that.outerRadius - that.innerRadius);
        for (let j = 0; j < that.dataSet.length; j++) {
          d3.selectAll($('#g' + j))
            .append('circle')
            .attr('cx', function(d) {
              return that.map.latLngToLayerPoint(L.latLng(+d.lat, +d.lng)).x;
            })
            .attr('cy', function(d) {
              return that.map.latLngToLayerPoint(L.latLng(+d.lat, +d.lng)).y;
            })
            .attr('r', that.radius)
            .attr('fill', '#DEDEDE')
            .attr('opacity', '0.6')
            .attr('class', 'circle')
            .on('mouseover', function(d) {
              let s = 100 - d.s_rank;
              let p = d.p_rank;
              let x = d3.event.pageX;
              let y = d3.event.pageY + 30;
              that.mypop
                .setLatLng(L.latLng(+d.lat, +d.lng))
                .setContent(
                  '经度：' +
                    d.lng +
                    '纬度：' +
                    d.lat +
                    '<br>交通便利度超过' +
                    s +
                    '%的城区' +
                    '<br>繁华度超过' +
                    (100 - p) +
                    '%的城区'
                )
                .openOn(that.map);
            })
            .on('mouseout', function(d) {
              svg.selectAll('text').remove();
            });

          d3.selectAll($('#g' + j))
            .selectAll('path')
            .data(that.dataSet[j])
            .enter()
            .append('path')
            .attr('transform', function(data) {
              let xy = that.map.latLngToLayerPoint(
                L.latLng(+data[1], +data[2])
              );
              return 'translate(' + xy.x + ',' + xy.y + ')';
            })
            .attr('stroke-linecap', 'round')
            .attr('fill', function(data, i) {
              return that.normalColor[i];
            })
            .attr('d', function(data, i) {
              if (i < 2) {
                return arc1(that.pie(data[0])[i % 2]);
              }
              return arc2(that.pie(data[0])[i % 2]);
            });
        }
      }

      // BubbleSet
      function drawBubbleSet() {
        let bubbles = new BubbleSet();
        let rectanglesA = [];
        let rectanglesB = [];
        let pathA = g.append('path');
        let pathB = g.append('path');
        let debugFor = pathA;
        let width = 2 * that.outerRadius - that.innerRadius;
        let height = 2 * that.outerRadius - that.innerRadius;
        let pad = 2 * that.outerRadius - that.innerRadius;

        development_circle.forEach(point => {
          let cx = that.map.latLngToLayerPoint(L.latLng(+point.lat, +point.lng))
            .x;
          let cy = that.map.latLngToLayerPoint(L.latLng(+point.lat, +point.lng))
            .y;
          let elem = g
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', that.radius / 2.5);
          rectanglesB.push({
            x: cx - that.radius,
            y: cy - that.radius,
            width: width,
            height: height,
            elem: elem,
          });
          let list = bubbles.createOutline(
            BubbleSet.addPadding(rectanglesA, pad),
            BubbleSet.addPadding(rectanglesB, pad),
            null
          );
          let outline = new PointPath(list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
          ]);
          pathA
            .attr('d', outline)
            .attr('opacity', '0.5')
            .attr('fill', '#457b9d')
            .attr('stroke', 'black');
          list = bubbles.createOutline(
            BubbleSet.addPadding(rectanglesB, that.radius / 12),
            BubbleSet.addPadding(rectanglesA, that.radius),
            null
          );
          outline = new PointPath(list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
          ]);
          pathB
            .attr('d', outline)
            .attr('opacity', '0.5')
            .attr('fill', '#e63946')
            .attr('stroke', 'black');
        });

        highlight.forEach(point => {
          let cx = that.map.latLngToLayerPoint(L.latLng(+point.lat, +point.lng))
            .x;
          let cy = that.map.latLngToLayerPoint(L.latLng(+point.lat, +point.lng))
            .y;
          let elem = g
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('fill', 'none')
            .attr('r', that.radius);
          rectanglesA.push({
            x: cx - that.radius,
            y: cy - that.radius,
            width: width,
            height: height,
            elem: elem,
          });
          list = bubbles.createOutline(
            BubbleSet.addPadding(rectanglesA, pad),
            BubbleSet.addPadding(rectanglesB, pad),
            null
          );
          outline = new PointPath(list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
          ]);
          pathA
            .attr('d', outline)
            .attr('opacity', '0.5')
            .attr('fill', '#457b9d')
            .attr('stroke', 'black');
          let list = bubbles.createOutline(
            BubbleSet.addPadding(rectanglesB, that.radius / 12),
            BubbleSet.addPadding(rectanglesA, that.radius),
            null
          );
          let outline = new PointPath(list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
          ]);
          pathB
            .attr('d', outline)
            .attr('opacity', '0.5')
            .attr('fill', '#e63946')
            .attr('stroke', 'black');
        });
      }

      // svg 投影
      let transform = d3geo.geoTransform({
        point: function(x, y) {
          let point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        },
      });
      let path = d3geo.geoPath().projection(transform);

      // that.map.on('move', reset);
      that.map.on('zoom', reset);
      reset();
      function reset() {
        let bounds = path.bounds(geo),
          topLeft = bounds[0],
          bottomRight = bounds[1];
        svg
          .attr('width', bottomRight[0] - topLeft[0])
          .attr('height', bottomRight[1] - topLeft[1])
          .style('left', topLeft[0] + 'px')
          .style('top', topLeft[1] + 'px');
        redraw();
        g.attr(
          'transform',
          'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')'
        );
      }
    },
    //绘制热力图
    setHeatMapLayer() {
      let config = {
        radius: 0.035,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      };

      this.heatMapLayer = new HeatmapOverlay(config);
      this.heatMapLayer.setData({
        data: this.heatData,
        max: 50,
      });
      this.heatMapLayer.addTo(this.map);
    },
  },
};
</script>

<style scoped>
.switch {
  height: 70px;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 15%;
  z-index: 90;
  left: 5%;
}
#development {
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
.tooltip {
  position: fixed;
  top: 0px;
  left: 0px;
  padding: 5px;
  width: 120;
  height: auto;
  font-family: simsun;
  font-size: 14px;
  color: black;
  background-color: rgb(255, 255, 255);
  border-width: 2px solid rgb(255, 255, 255);
  z-index: 3;
  border-radius: 5px;
}
.tooltip:after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 20%;
  margin-left: -8px;
  width: 0;
  height: 0;
  border-bottom: 12px solid rgb(255, 255, 255);
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
  z-index: inherit;
}
</style>
