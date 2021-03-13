<template>
  <div id="predict">
    <div id="transport" class="map"></div>
    <div class="left-chart-up" id="trendbar"></div>
    <div class="left-chart-middle" id="dailybar"></div>
    <div class="left-chart-down" id="weeklybar"></div>
    <div class="right-chart-up" id="trend"></div>
    <div class="right-chart-middle" id="daily"></div>
    <div class="right-chart-down" id="weekly"></div>
    <div class="chart-down" id="ts"></div>
  </div>
</template>

<script>
import * as L from 'leaflet';
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
import { usecurve } from '../assets/js/leaflet.curve';
import compo from '../assets/data/component.json';
import timeData from '../assets/data/ts_result.json';
import od from '../assets/data/od_map.json';
import geo from '../assets/data/shenyang.json';
import markerIcon from '../assets/css/images/car.png';
export default {
  name: 'Predict',
  data() {
    return {
      map: null,
      pd: '',
      od_data: new Array(),
      svg: null,
      g: null,
      transform: null,
      blueIcon: L.icon({
        iconUrl: markerIcon,
        iconSize: [32, 36],
        iconAnchor: [13, 21],
      }),
      colorseries: [
        '#faf3dd',
        '#FCECC9',
        '#ffba08',
        '#eda13e',
        '#edf8b1',
        '#e39450',
        '#da8862',
        '#d07b74',
        '#c66f87',
        '#bc6299',
        '#b356ab',
        '#9f3dcf',
      ],
    };
  },
  mounted() {
    this.map = L.map('transport', {
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
    console.log(od);

    this.drawTransport();
  },
  methods: {
    adjust() {
      var that = this;
      that.g.selectAll('path').attr('d', function(d) {
        let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)),
          dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
          x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
        return (
          'M' +
          x1y1.x +
          ',' +
          x1y1.y +
          ' Q' +
          dxdy.x +
          ',' +
          dxdy.y +
          ' ' +
          x2y2.x +
          ',' +
          x2y2.y
        );
      });
      d3.selectAll('animateMotion').attr('path', function(d) {
        let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)),
          dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
          x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
        return (
          'M' +
          0 +
          ',' +
          0 +
          ' Q' +
          (dxdy.x - x2y2.x) +
          ',' +
          (dxdy.y - x2y2.y) +
          ' ' +
          (x1y1.x - x2y2.x) +
          ',' +
          (x1y1.y - x2y2.y)
        );
      });
      d3.selectAll('circle')
        .attr('cx', function(d) {
          return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).x;
        })
        .attr('cy', function(d) {
          return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).y;
        });
    },
    drawTransport() {
      let that = this;
      this.svg = d3.select(this.map.getPanes().overlayPane).append('svg');
      this.g = that.svg.append('g').attr('class', 'leaflet-zoom-hide');

      for (let i = 0; i < od.nodes.length; i++) {
        let mark = L.marker(od.nodes[i].reverse(), {
          icon: that.blueIcon,
          // draggable:true,
          riseOnHover: true,
        }).addTo(that.map);
        mark.on('click', function() {
          d3.select(that.map.getPanes().overlayPane)
            .select('svg')
            .selectAll('path')
            .remove();
          d3.select(that.map.getPanes().overlayPane)
            .select('svg')
            .selectAll('circle')
            .remove();
          d3.select(that.map.getPanes().overlayPane)
            .select('svg')
            .selectAll('animateMotion')
            .remove();
          that.od_data = new Array();
          for (let j = 0; j < od.nodes.length; j++) {
            if (j === i) {
              continue;
            }
            let x1 = od.nodes[j][0],
              y1 = od.nodes[j][1],
              x2 = od.nodes[i][0],
              y2 = od.nodes[i][1];
            let dx = (x1 + x2) / 2 - (y1 - y2) / 4,
              dy = (y1 + y2) / 2 - (x2 - x1) / 4;
            that.od_data.push({
              x1: x1,
              y1: y1,
              dx: dx,
              dy: dy,
              x2: x2,
              y2: y2,
              id: j,
              color: that.colorseries[od.od[0][i][j]],
            });
          }

          var feature = that.g
            .selectAll('path')
            .data(that.od_data, function(d) {
              return d;
            })
            .enter()
            .append('path')
            .attr('d', function(d) {
              let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)),
                dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
                x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
              return (
                'M' +
                x2y2.x +
                ',' +
                x2y2.y +
                ' Q' +
                dxdy.x +
                ',' +
                dxdy.y +
                ' ' +
                x1y1.x +
                ',' +
                x1y1.y
              );
            })
            .on(
              'click',
              function(d) {
                let j = d.id;
                that.changeTransportClass();
                d3.select(that.map.getPanes().overlayPane)
                  .select('svg')
                  .selectAll('path')
                  .remove();
                d3.select(that.map.getPanes().overlayPane)
                  .select('svg')
                  .selectAll('circle')
                  .remove();
                d3.select(that.map.getPanes().overlayPane)
                  .select('svg')
                  .selectAll('animateMotion')
                  .remove();
                that.od_data = [];
                let x1 = od.nodes[j][0],
                  y1 = od.nodes[j][1],
                  x2 = od.nodes[i][0],
                  y2 = od.nodes[i][1];
                let dx = (x1 + x2) / 2 - (y1 - y2) / 6,
                  dy = (y1 + y2) / 2 - (x2 - x1) / 6;
                that.od_data.push({
                  x1: x1,
                  y1: y1,
                  dx: dx,
                  dy: dy,
                  x2: x2,
                  y2: y2,

                  color: that.colorseries[od.od[0][i][j]],
                });
                var feature = that.g
                  .selectAll('path')
                  .data(that.od_data, function(d) {
                    return d;
                  })
                  .enter()
                  .append('path')
                  .attr('d', function(d) {
                    let x1y1 = that.map.latLngToLayerPoint(
                        L.latLng(d.x1, d.y1)
                      ),
                      dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
                      x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                    return (
                      'M' +
                      x2y2.x +
                      ',' +
                      x2y2.y +
                      ' Q' +
                      dxdy.x +
                      ',' +
                      dxdy.y +
                      ' ' +
                      x1y1.x +
                      ',' +
                      x1y1.y
                    );
                  })
                  .style('fill', 'none')
                  .style('stroke-linejoin', 'round')
                  .style('stroke', function(d) {
                    return d.color;
                  })
                  .style('stroke-width', '4')
                  .style('opacity', '0.6')
                  .style('pointer-events', 'auto')
                  .style('cursor', 'pointer');

                that.g
                  .selectAll('circle')
                  .data(that.od_data, function(d) {
                    return d;
                  })
                  .enter()
                  .append('circle')
                  .attr('cx', function(d) {
                    return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).x;
                  })
                  .attr('cy', function(d) {
                    return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).y;
                  })
                  .attr('r', '4.3')
                  .attr('fill', function(d) {
                    return d.color;
                  })
                  .style('opacity', '0.6')
                  .append('animateMotion')
                  .attr('dur', '5s')
                  .attr('fill', 'freeze')
                  .attr('repeatCount', 'indefinite')
                  .attr('path', function(d) {
                    let x1y1 = that.map.latLngToLayerPoint(
                        L.latLng(d.x1, d.y1)
                      ),
                      dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
                      x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                    return (
                      'M' +
                      0 +
                      ',' +
                      0 +
                      ' Q' +
                      (dxdy.x - x2y2.x) +
                      ',' +
                      (dxdy.y - x2y2.y) +
                      ' ' +
                      (x1y1.x - x2y2.x) +
                      ',' +
                      (x1y1.y - x2y2.y)
                    );
                  });

                that.transform = d3geo.geoTransform({
                  point: function(x, y) {
                    var point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
                    this.stream.point(point.x, point.y);
                  },
                });

                // alert("hee")
                that.reset();
                that.map.on('move', that.reset);
                that.map.on('zoom', that.reset);
              },
              true
            )

            .style('fill', 'none')
            .style('stroke-linejoin', 'round')
            .style('stroke', function(d) {
              return d.color;
            })
            .style('stroke-width', '4')
            .style('opacity', '0.6')
            .style('pointer-events', 'auto')
            .style('cursor', 'pointer');

          that.g
            .selectAll('circle')
            .data(that.od_data, function(d) {
              return d;
            })
            .enter()
            .append('circle')
            .attr('cx', function(d) {
              return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).x;
            })
            .attr('cy', function(d) {
              return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).y;
            })
            .attr('r', '4.3')
            .attr('fill', function(d) {
              return d.color;
            })
            .style('opacity', '0.6')
            .append('animateMotion')
            .attr('dur', '5s')
            .attr('fill', 'freeze')
            .attr('repeatCount', 'indefinite')
            .attr('path', function(d) {
              let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)),
                dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)),
                x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
              return (
                'M' +
                0 +
                ',' +
                0 +
                ' Q' +
                (dxdy.x - x2y2.x) +
                ',' +
                (dxdy.y - x2y2.y) +
                ' ' +
                (x1y1.x - x2y2.x) +
                ',' +
                (x1y1.y - x2y2.y)
              );
            });
          that.transform = d3geo.geoTransform({
            point: function(x, y) {
              var point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
              this.stream.point(point.x, point.y);
            },
          });

          that.reset();
          that.map.on('move', that.reset);
          that.map.on('zoom', that.reset);
        });
      }
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
    drawWeeklyLine() {
      let weeklychart = this.$echarts.init(document.getElementById('weekly'));
      let weeklybar = this.$echarts.init(document.getElementById('weeklybar'));
      weeklychart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            data: compo.weekly,
            type: 'line',
            color: '#2a9d8f',
          },
        ],
      });
      weeklybar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
        },
        grid: {
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,

          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: compo.weekly,
            color: '#76c8eb',
            // large: true,
            animationDelay: function(idx) {
              return idx * 10;
            },
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5;
        },
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          weeklychart.resize();
          weeklybar.resize();
        });
      }, 200);
    },
    drawDailyLine() {
      let dailychart = this.$echarts.init(document.getElementById('daily'));
      let dailybar = this.$echarts.init(document.getElementById('dailybar'));
      dailychart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: new Array(24).fill(0).map(function(d, i) {
            return i + 1;
          }),
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            data: compo.daily,
            type: 'line',
            color: '#2a9d8f',
          },
        ],
      });
      dailybar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
        },
        grid: {
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: new Array(24).fill(0).map(function(d, i) {
            return i + 1;
          }),

          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,

          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: compo.daily,
            color: '#76c8eb',
            // large: true,
            animationDelay: function(idx) {
              return idx * 10;
            },
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5;
        },
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          dailychart.resize();
          dailybar.resize();
        });
      }, 200);
    },
    drawTrendLine() {
      let trendchart = this.$echarts.init(document.getElementById('trend'));
      let trendbar = this.$echarts.init(document.getElementById('trendbar'));
      trendchart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: new Array(compo.trend.length)
            .fill(Date.parse('2016/1/1'))
            .map(function(d, i) {
              return (
                new Date(d + i * 3600000).getMonth() +
                1 +
                '月' +
                new Date(d + i * 3600000).getDate() +
                '日'
              );
            }),
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            data: compo.trend,
            type: 'line',
            color: '#2a9d8f',
          },
        ],
      });
      let time = new Array(compo.trend.length)
        .fill(Date.parse('2016/1/1'))
        .map(function(d, i) {
          return (
            new Date(d + i * 3600000).getMonth() +
            1 +
            '月' +
            new Date(d + i * 3600000).getDate() +
            '日'
          );
        });

      let obj = {};
      let temp = [];
      let ttm = [];
      time.forEach(function(item, i) {
        if (!obj[item]) {
          obj[item] = '1';
          ttm.push(item);
          temp.push(compo.trend[i]);
        }
      });
      console.log(obj);

      trendbar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
        },
        grid: {
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ttm,

          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          scale: true,
          max: 350,
          min: 300,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        series: [
          {
            type: 'bar',
            data: temp,
            color: '#76c8eb',
            // large: true,
            animationDelay: function(idx) {
              return idx * 10;
            },
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5;
        },
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          trendchart.resize();
          trendbar.resize();
        });
      }, 200);
    },
    drawTime() {
      let timechart = this.$echarts.init(document.getElementById('ts'));
      let base = -timeData.reduce(function(min, val) {
        return Math.floor(Math.min(min, val.l));
      }, Infinity);
      timechart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: '#222',
            },
          },
          formatter: function(params) {
            return params[2].name + '<br />' + params[2].value;
          },
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: timeData.map(function(item) {
            return item.date;
          }),
          axisLabel: {
            formatter: function(value, idx) {
              var date = new Date(value);
              return idx === 0
                ? value
                : [date.getMonth() + 1, date.getDate()].join('-');
            },
          },
          splitLine: {
            show: false,
          },
          boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        yAxis: {
          axisLabel: {
            formatter: function(val) {
              return val - base;
            },
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (params.value - base).toFixed(1);
              },
            },
          },
          splitNumber: 3,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'white', //更改坐标轴颜色
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
        series: [
          {
            name: 'L',
            type: 'line',
            data: timeData.map(function(item) {
              return item.l + base;
            }),
            lineStyle: {
              opacity: 0,
            },
            stack: 'confidence-band',
            symbol: 'none',
          },
          {
            name: 'U',
            type: 'line',
            data: timeData.map(function(item) {
              return item.u - item.l;
            }),
            lineStyle: {
              opacity: 0,
            },
            areaStyle: {
              color: '#ccc',
            },
            stack: 'confidence-band',
            symbol: 'none',
          },
          {
            type: 'line',
            data: timeData.map(function(item) {
              return item.value + base;
            }),
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
              color: '#c23531',
            },
            showSymbol: false,
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          timechart.resize();
        });
      }, 200);
    },

    changeTransportClass() {
      this.drawWeeklyLine();
      this.drawDailyLine();
      this.drawTrendLine();
      this.drawTime();
    },
  },
};
</script>

<style scoped>
#predict {
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
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 59%;
}
.left-chart-middle {
  position: absolute;
  left: 1%;
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 30%;
}
.left-chart-down {
  position: absolute;
  left: 1%;
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 1%;
}
.right-chart-up {
  position: absolute;
  right: 1%;
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 59%;
}
.right-chart-middle {
  position: absolute;
  right: 1%;
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 30%;
}
.right-chart-down {
  position: absolute;
  right: 1%;
  width: 23%;
  height: 27%;

  z-index: 100;
  bottom: 1%;
}
.chart-down {
  position: absolute;
  left: 25%;
  width: 50%;
  height: 27%;

  z-index: 100;
  bottom: 1%;
}
</style>
