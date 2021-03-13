<template>
  <div id="metro">
    <div id="metro-map" class="map"></div>
    <div class="left-chart-up" id="sub-chart"></div>
    <div class="left-chart-down" id="funnel-chart"></div>
    <div class="right-chart-up"></div>
    <div class="right-chart-middle" id="tinymap"></div>
    <div id="location">
      <el-button type="info" icon="el-icon-location" circle @click="selectLocation"></el-button>
    </div>
    <div class="control">
      <div style="padding:15px">
        <h3>当前站点：{{ tmpitem }}</h3>
      </div>
      <el-button @click="select()">{{ mode }}</el-button>
      <!-- <el-button @click="analys()">分析</el-button> -->
      <el-select
        style="margin-left: 20px;margin-right:20px;"
        v-model="value"
        multiple
        collapse-tags
        :multiple-limit="4"
        placeholder="请选择"
        id="select"
      >
        <el-option v-for="(item, i) in nameArray" :key="i" :label="item" :value="item" id="option"></el-option>
      </el-select>

      <el-button @click="judgeArray()">画图</el-button>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3';
import * as d3geo from 'd3-geo';
import * as L from 'leaflet';
import $ from 'jquery';
import busIcon from '../assets/css/images/bus.png';
import geo from '../assets/data/shenyang.json';
// import metrodata from '../assets/data/new_final4.json';
import metrodata from '../assets/data/congestion.json';
import shenyang_geo from '../assets/data/syzuobiao.json';
import FreeDraw, { CREATE, EDIT, DELETE, NONE } from '../assets/js/FreeDraw';
export default {
  name: 'Metro',
  data() {
    return {
      map: '',
      tinymap: '',
      mode: '选取',
      modeitem: {
        route_adj: '单乘可达',
        second_route_adj: '二度可达',
        walkable: '邻接站点',
      },
      tmpnode: {},
      tmpmode: '',
      tinyMode: 0,
      tmpitem: '未选择',
      color: ['#00f9ff', '#fe000b', '#beff00', '#8c00ff'],
      polygon: [],
      points: [],
      draw: false,
      freeDraw: '',
      nameArray: [],
      value: [],
      percents: [],
      chineseTrans: [],
      alreadyChosen: false,
      index_list: [],
    };
  },
  methods: {
    select() {
      if (!this.alreadyChosen) {
        this.$message({
          message: '请先在小地图上使用放大镜点击区域',
          type: 'warning',
        });
        return;
      }
      var that = this;
      if (that.draw) {
        that.freeDraw.mode(NONE);
        that.draw = false;
        that.mode = '选取';
      } else {
        that.freeDraw.mode(CREATE | DELETE);
        that.draw = true;
        that.mode = '取消选取';
      }
    },
    async analys() {
      var that = this;
      // if (this.polygon.length === 0) {
      //   this.$message({
      //     message: '请先使用选取功能选取点集',
      //     type: 'warning',
      //   });
      //   return;
      // }

      that.value = [];
      const {
        data: res,
      } = await this.$http.post(
        'http://localhost:8080/chat/api/is_points_in_polygon',
        { points: this.points, polygon: this.polygon }
      );
      console.log(res);
      that.nameArray = res.data;
    },

    selectLocation() {
      var blueIcon = L.icon({
        iconUrl: busIcon,
        iconSize: [60, 60],
      });
      this.tinyMode = 1;
      let that = this;

      this.tinymap.on('click', function(e) {
        if (that.tinyMode) {
          that.alreadyChosen = true;
          let center = e.latlng;
          that.map.flyTo(center, 15);
          document.getElementsByClassName('leaflet-marker-pane')[0].innerHTML =
            '';
          that.points = [];
          Object.keys(metrodata).forEach(function(item) {
            let t = metrodata[item];

            // L.latLng(e.latlng.lat, e.latlng.lng).distanceTo(
            //   L.latLng(t["location"][0], t["location"][1])
            // )
            if (
              L.latLng(t['location'][0], t['location'][1]).distanceTo(center) <
              1700
            ) {
              that.points.push([t['location'][0], t['location'][1], item]);
              let mark = L.marker(t['location'], {
                icon: blueIcon,
                // draggable:true,
                riseOnHover: true,
              })
                .addTo(that.map)
                .bindPopup(item);
              // .openPopup();
              mark.on('click', function() {
                if (that.tmpitem !== item) {
                  that.tmpitem = item;
                  that.tmpnode = t;
                  that.index_list = [
                    t.second_route_adj.length,
                    t.second_route_adj.length + t.route_adj.length,
                    t.second_route_adj.length +
                      t.route_adj.length +
                      t.walkable.length,
                  ];

                  d3.select(that.tinymap.getPanes().overlayPane)
                    .select('svg')
                    .selectAll('path')
                    .remove();
                  d3.selectAll($('.new_svg')).remove();
                  var svg = d3
                    .select(that.tinymap.getPanes().overlayPane)
                    .append('svg')
                    .style('opacity', '0.4')
                    .attr('class', 'new_svg');
                  var g = svg.append('g').attr('class', 'leaflet-zoom-hide');
                  g.append('path')
                    .attr('id', 'geo')
                    .attr('d', function() {
                      var res = 'M';
                      for (let i = 0; i < shenyang_geo.length; i++) {
                        let xy = that.tinymap.latLngToLayerPoint(
                          L.latLng(shenyang_geo[i][0], shenyang_geo[i][1])
                        );
                        res += xy.x + ' ' + xy.y + 'L';
                      }
                      return res;
                    })
                    .attr('stroke-width', '0')
                    .attr('fill', '#7209b7');
                  g.selectAll('circle')
                    .data(
                      t.second_route_adj.concat(t.route_adj).concat(t.walkable),
                      function(d) {
                        return d;
                      }
                    )
                    .enter()
                    .append('circle')
                    .attr('cx', function(d) {
                      return that.tinymap.latLngToLayerPoint(
                        L.latLng(
                          metrodata[d].location[0],
                          metrodata[d].location[1]
                        )
                      ).x;
                    })
                    .attr('cy', function(d) {
                      return that.tinymap.latLngToLayerPoint(
                        L.latLng(
                          metrodata[d].location[0],
                          metrodata[d].location[1]
                        )
                      ).y;
                    })
                    .attr('r', 10)
                    .attr('stroke-width', '0')
                    .attr('fill', function(d, i) {
                      if (i < that.index_list[0]) {
                        return that.color[0];
                      } else if (i < that.index_list[1]) {
                        return that.color[1];
                      } else if (i < that.index_list[2]) {
                        return that.color[2];
                      }
                    });
                  var transform = d3geo.geoTransform({
                    point: function(x, y) {
                      var point = that.tinymap.latLngToLayerPoint(
                        new L.LatLng(y, x)
                      );
                      this.stream.point(point.x, point.y);
                    },
                  });
                  let path = d3geo.geoPath().projection(transform);

                  that.tinymap.on('move', reset);
                  that.tinymap.on('zoom', adjust);
                  reset();
                  adjust();

                  function adjust() {
                    d3.selectAll('circle')
                      .attr('cx', function(d) {
                        return that.tinymap.latLngToLayerPoint(
                          L.latLng(
                            metrodata[d].location[0],
                            metrodata[d].location[1]
                          )
                        ).x;
                      })
                      .attr('cy', function(d) {
                        return that.tinymap.latLngToLayerPoint(
                          L.latLng(
                            metrodata[d].location[0],
                            metrodata[d].location[1]
                          )
                        ).y;
                      });
                    d3.selectAll($('#geo')).attr('d', function() {
                      var res = 'M';
                      for (let i = 0; i < shenyang_geo.length; i++) {
                        let xy = that.tinymap.latLngToLayerPoint(
                          L.latLng(shenyang_geo[i][0], shenyang_geo[i][1])
                        );
                        res += xy.x + ' ' + xy.y + 'L';
                      }
                      return res;
                    });
                  }

                  function reset() {
                    var bounds = path.bounds(geo),
                      topLeft = bounds[0],
                      bottomRight = bounds[1];
                    svg
                      .attr('width', bottomRight[0] - topLeft[0])
                      .attr('height', bottomRight[1] - topLeft[1])
                      .style('left', topLeft[0] + 'px')
                      .style('top', topLeft[1] + 'px');
                    g.attr(
                      'transform',
                      'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')'
                    );
                    adjust();
                  }

                  // that.tmpnode["second_route_adj"].forEach(function(d) {
                  //   let j = metrodata[d];
                  //   if (j) {
                  //     let dot = L.circle([...j["location"]], {
                  //       radius: 100,
                  //       fillColor: that.color[2],
                  //       color: that.color[2]
                  //     }).addTo(that.tinymap);
                  //     // dot.on("click", function(e) {
                  //     //   L.popup()
                  //     //     .setLatLng(e.latlng)
                  //     //     .setContent(
                  //     //       "二度可达站点：" +
                  //     //         d +
                  //     //         "  位置为：" +
                  //     //         e.latlng.toString()
                  //     //     )
                  //     //     .openOn(that.tinymap);
                  //     // });
                  //   }
                  // });
                  // that.tmpnode["route_adj"].forEach(function(d) {
                  //   let j = metrodata[d];

                  //   if (j) {
                  //     let dot = L.circle([...j["location"]], {
                  //       radius: 100,
                  //       fillColor: that.color[1],
                  //       color: that.color[1]
                  //     }).addTo(that.tinymap);
                  //     // dot.on("click", function(e) {
                  //     //   L.popup()
                  //     //     .setLatLng(e.latlng)
                  //     //     .setContent(
                  //     //       "单程可达站点：" +
                  //     //         d +
                  //     //         "  位置为：" +
                  //     //         e.latlng.toString()
                  //     //     )
                  //     //     .openOn(that.tinymap);
                  //     // });
                  //   }
                  // });
                  // that.tmpnode["adj"].forEach(function(d) {
                  //   let j = metrodata[d];
                  //   if (j) {
                  //     let dot = L.circle([...j["location"]], {
                  //       radius: 100,
                  //       fillColor: that.color[0],
                  //       color: that.color[0]
                  //     }).addTo(that.tinymap);
                  //     // dot.on("click", function(e) {
                  //     //   L.popup()
                  //     //     .setLatLng(e.latlng)
                  //     //     .setContent(
                  //     //       "邻接站点：" +
                  //     //         d +
                  //     //         "  位置为：" +
                  //     //         e.latlng.toString()
                  //     //     )
                  //     //     .openOn(that.tinymap);
                  //     // });
                  //   }
                  // });

                  // let arr = Object.keys(metrodata);
                  // let arr1 = [...that.tmpnode["adj"]];
                  // let arr2 = [...that.tmpnode["route_adj"]];
                  // let arr3 = [...that.tmpnode["second_route_adj"]];

                  // for (var i = arr.length - 1; i > 0; i--) {
                  //   var a = arr[i];
                  //   for (var j = arr1.length - 1; j > 0; j--) {
                  //     var b = arr1[j];
                  //     if (a === b) {
                  //       arr.splice(i, 1);
                  //       arr1.splice(j, 1);
                  //       break;
                  //     }
                  //   }
                  // }
                  // for (var i = arr.length - 1; i > 0; i--) {
                  //   var a = arr[i];
                  //   for (var j = arr2.length - 1; j > 0; j--) {
                  //     var b = arr2[j];
                  //     if (a === b) {
                  //       arr.splice(i, 1);
                  //       arr2.splice(j, 1);
                  //       break;
                  //     }
                  //   }
                  // }
                  // for (var i = arr.length - 1; i > 0; i--) {
                  //   var a = arr[i];
                  //   for (var j = arr3.length - 1; j > 0; j--) {
                  //     var b = arr3[j];
                  //     if (a === b) {
                  //       arr.splice(i, 1);
                  //       arr3.splice(j, 1);
                  //       break;
                  //     }
                  //   }
                  // }

                  // arr.forEach(function(d) {
                  //   let j = metrodata[d];
                  //   if (j) {
                  //     let dot = L.circle([...j["location"]], {
                  //       radius: 100,
                  //       fillColor: that.color[3],
                  //       color: that.color[3]
                  //     }).addTo(that.tinymap);
                  //     // dot.on("click", function(e) {
                  //     //   L.popup()
                  //     //     .setLatLng(e.latlng)
                  //     //     .setContent(
                  //     //       "不可达站点：" +
                  //     //         d +
                  //     //         "  位置为：" +
                  //     //         e.latlng.toString()
                  //     //     )
                  //     //     .openOn(that.tinymap);
                  //     // });
                  //   }
                  // });
                }
              });
            }
          });

          that.tinyMode = 0;
        }
      });
    },
    judgeArray() {
      let that = this;
      if (this.value.length === 0) {
        this.$message({
          message: '请选择要进行画图的点',
          type: 'warning',
        });
        return;
      }
      this.$http
        .post('http://localhost:8080/chat/api/draw_funnel', {
          names: this.value,
        })
        .then(res => {
          console.log(res.data.data);
          let temp = Object.keys(res.data.data).map((item, i) => {
            return {
              id: i,
              name: that.modeitem[item],
              value: new Number(res.data.data[item] * 100).toFixed(2),
            };
          });
          that.percents = temp;
          that.drawFunnel();
        });

      this.drawBar();
    },

    drawBar() {
      var that = this;
      //地铁
      // 初始化echarts实例
      let chart1 = this.$echarts.init(document.getElementById('sub-chart'));
      // 绘制图表
      chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          containLabel: true,
        },
        legend: {
          y: 'bottom',
          data: ['邻接站点', '单乘可达', '二度可达', '不可达'],
          textStyle: {
            color: 'white',
          },
        },

        xAxis: {
          type: 'category',
          data: [...that.value],
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
            name: '邻接站点',
            type: 'bar',
            stack: '总量',
            data: [
              ...that.value.map(item => metrodata[item]['walkable'].length),
            ],
            color: that.color[0],
          },
          {
            name: '单乘可达',
            type: 'bar',
            stack: '总量',
            data: [
              ...that.value.map(item => metrodata[item]['route_adj'].length),
            ],
            color: that.color[1],
          },
          {
            name: '二度可达',
            type: 'bar',
            stack: '总量',
            data: [
              ...that.value.map(
                item => metrodata[item]['second_route_adj'].length
              ),
            ],
            color: that.color[2],
          },
          {
            name: '不可达',
            type: 'bar',
            stack: '总量',
            data: [
              ...that.value.map(
                item =>
                  Object.keys(metrodata).length -
                  metrodata[item]['second_route_adj'].length
              ),
            ],
            color: that.color[3],
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          chart1.resize();
        });
      }, 200);

      chart1.on('mouseover', function(e) {
        that.map.flyTo(metrodata[e.name].location, 15);
        L.popup()
          .setLatLng(metrodata[e.name].location)
          .setContent(e.name)
          .openOn(that.map);
      });
    },

    drawFunnel() {
      let that = this;
      let funnelChart = this.$echarts.init(
        document.getElementById('funnel-chart')
      );
      funnelChart.setOption({
        toolbox: {
          feature: {
            dataView: { readOnly: true },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: that.percents.map(item => item.name),
          textStyle: {
            color: 'white',
          },
          y: 'bottom',
        },
        grid: {
          containLabel: true,
        },
        series: [
          {
            name: '实际',
            type: 'funnel',
            left: '5%',
            width: '90%',
            maxSize: '90%',
            label: {
              position: 'inside',

              formatter: '{b}',
              color: '#fff',
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: function(params) {
                  return (
                    params.data.name +
                    ':' +
                    that.percents[params.data.id].value +
                    '%'
                  );
                },
              },
            },
            itemStyle: {
              opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2,
            },
            smooth: true,
            data: that.percents.map(function(item) {
              return {
                name: item.name,
                value: Math.sqrt(item.value),
                id: item.id,
              };
            }),
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          funnelChart.resize();
        });
      }, 200);
    },
  },
  mounted() {
    var that = this;
    this.map = L.map('metro-map', {
      minZoom: 6,
      maxZoom: 15,
      center: [41.8, 123.48333],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
    });
    this.freeDraw = new FreeDraw({
      mode: NONE,
    });

    this.freeDraw.on('markers', function(event) {
      that.polygon = event.latLngs;
      that.analys();
    });

    this.map.addLayer(this.freeDraw);

    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.map);
    this.tinymap = L.map('tinymap', {
      minZoom: 6,
      maxZoom: 12,
      center: [41.793216, 123.424605],
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857,
      // dragging: false,
      // doubleClickZoom: false
    });

    L.tileLayer(
      'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '高德',
      }
    ).addTo(this.tinymap);

    Object.keys(metrodata).forEach(item => {
      let t = metrodata[item];

      let dot = L.circle(t['location'].reverse(), {
        radius: 50,
      }).addTo(this.tinymap);
    });
  },
};
</script>
<style scoped>
#metro {
  height: 100%;
  position: relative;
}
.el-button {
  background-color: #345f93;
  color: white;
}
.el-select {
  background-color: #345f93;
  color: white;
}
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 2;
}
.control {
  display: flex;
  width: 57%;
  height: 8%;
  justify-content: center;
  align-items: center;
  position: absolute;
  /* top: 1%; */
  top: 16%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  /* background-color: rgba(7, 11, 32, 0.8); */
}
.left-chart-up {
  position: absolute;
  left: 1%;
  width: 20%;
  height: 40%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  box-sizing: border-box;
  padding-bottom: 1%;
  z-index: 100;
  top: 11%;
  /* top: 1%; */
  /* background-color: rgba(7, 11, 32, 0.8); */
}
.left-chart-down {
  position: absolute;
  left: 1%;
  width: 20%;
  height: 45%;
  /* border: solid 3px #2a4053; */
  /* border-radius: 2px; */
  box-sizing: border-box;
  padding-bottom: 1%;
  z-index: 100;
  top: 53%;
  /* background-color: rgba(7, 11, 32, 0.8); */
}
#location {
  position: absolute;
  right: 10%;
  bottom: 35%;
  z-index: 100;
}
.right-chart-middle {
  position: absolute;
  right: 1%;
  width: 20%;
  height: 32%;
  border: solid 3px #2a4053;
  border-radius: 2px;
  z-index: 100;
  bottom: 2%;
  background-color: rgba(7, 11, 32, 0.8);
}
.map.mode-create {
  cursor: crosshair;
}
.leaflet-line {
  stroke: aqua;
}
</style>

<style>
#select {
  background-color: #245b96 !important;
}
#option {
  background-color: rgba(0, 25, 46, 0.3) !important;
}
.el-select-dropdown__empty {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
.el-select-dropdown {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
.el-select-dropdown__wrap {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
.el-select-dropdown__wrap ul {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
.el-select-dropdown__wrap ul li {
  background-color: rgba(0, 25, 46, 0.3) !important;
  color: aliceblue !important;
}
</style>
