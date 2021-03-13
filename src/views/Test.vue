<template>
  <div id="predict">
    <div class="middle">
      <div :class="transportClass" id="transport"></div>

      <el-button :class="buttonClass" icon="el-icon-search" circle @click="backTransportClass()"></el-button>
      <div :class="predictClass" id="pd"></div>
      <div :class="timeClass" id="ts"></div>
    </div>
    <div :class="asideClass">
      <div class="ph" id="trend"></div>
      <div class="ph" id="daily"></div>
      <div class="ph" id="weekly"></div>
    </div>
  </div>
</template>
<style>
#predict {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #2c3e50;
  overflow: hidden;
}
.middle {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}
.ph {
  position: relative;
  padding: 10px;
  margin: 15px;
  width: 95%;
  height: 30%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
}
.transport-large {
  position: absolute;
  overflow: hidden;
  width: 90%;
  bottom: 10%;
  left: 5%;
  height: 80%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
}
.transport-tiny {
  position: absolute;
  overflow: hidden;
  width: 20%;
  height: 20%;
  bottom: 5%;
  left: 5%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
}

.predict-show {
  position: absolute;
  width: 20%;
  height: 20%;
  top: 5%;
  left: 5%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
  overflow: hidden;
}
.predict-hidden {
  position: absolute;
  width: 20%;
  height: 20%;
  top: -50%;
  left: 5%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
  overflow: hidden;
}
.button-show {
  position: absolute;
  left: 30%;
  bottom: 15%;
  transition: all 0.6s;
}
.button-hidden {
  position: absolute;
  left: 30%;
  bottom: 15%;
  display: none;
  transition: all 0.6s;
}

.time-show {
  position: absolute;
  height: 40%;
  top: 30%;
  left: 10%;
  width: 60%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
}
.time-hidden {
  position: absolute;
  height: 40%;
  top: 30%;
  left: -100%;
  width: 60%;
  border: solid 1px #436983;
  border-radius: 2px;
  box-shadow: #3b5d74 0px 0px 10px 5px inset;
  transition: all 0.6s;
}
.aside-hidden {
  position: absolute;
  right: -50%;
  background-color: #2c3e50;
  width: 20%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.aside-show {
  position: absolute;
  right: 0%;
  background-color: #2c3e50;
  width: 20%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<script>
import * as L from "leaflet";
import * as d3 from 'd3';
import * as d3geo from "d3-geo";
import { usecurve } from "../assets/js/leaflet.curve";
import compo from "../assets/data/component.json";
import timeData from "../assets/data/ts_result.json";
import od from "../assets/data/od_map.json";
import geo from "../assets/data/shenyang.json"
import markerIcon from "../assets/css/images/person-icon.png";
export default {
  name: "predict",
  data() {
    return {
      transportClass: "transport-large",
      predictClass: "predict-hidden",
      timeClass: "time-hidden",
      asideClass: "aside-hidden",
      buttonClass: "button-hidden",
      map: "",
      pd: "",
      od_data: new Array(),
    };
  },
  mounted() {
    usecurve(L);
    useMovingMarker(L);
    console.log(compo);

    let that = this;
    this.drawTransport();
    this.pd = L.map("pd", {
      minZoom: 3,
      maxZoom: 14,
      center: [48.8567, 2.3508],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      crs: L.CRS.EPSG3857
    });

    L.tileLayer(
      "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      {
        subdomains: ["1", "2", "3", "4"],
        attribution: "高德"
      }
    ).addTo(this.pd);
    var blueIcon = L.icon({
        iconUrl: markerIcon,
        iconSize: [20, 36],
        iconAnchor: [13, 21]
      });
  },
  methods: {
    changeTransportClass() {
      this.transportClass = "transport-tiny";
      this.predictClass = "predict-show";
      this.timeClass = "time-show";
      this.asideClass = "aside-show";
      this.buttonClass = "button-show";
      this.drawWeeklyLine();
      this.drawDailyLine();
      this.drawTrendLine();
      this.drawTime();
    },
    backTransportClass() {
      this.transportClass = "transport-large";
      this.predictClass = "predict-hidden";
      this.timeClass = "time-hidden";
      this.asideClass = "aside-hidden";
      this.buttonClass = "button-hidden";
    },
    drawWeeklyLine() {
      let weeklychart = this.$echarts.init(document.getElementById("weekly"));
      weeklychart.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        series: [
          {
            data: compo.weekly,
            type: "line"
          }
        ]
      });
      setTimeout(function() {
        window.addEventListener("resize", function() {
          weeklychart.resize();
        });
      }, 200);
    },
    drawDailyLine() {
      let dailychart = this.$echarts.init(document.getElementById("daily"));
      dailychart.setOption({
        xAxis: {
          type: "category",
          data: new Array(24).fill(0).map(function(d, i) {
            return i + 1;
          }),
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        series: [
          {
            data: compo.daily,
            type: "line"
          }
        ]
      });
      setTimeout(function() {
        window.addEventListener("resize", function() {
          dailychart.resize();
        });
      }, 200);
    },
    drawTrendLine() {
      let trendchart = this.$echarts.init(document.getElementById("trend"));
      trendchart.setOption({
        xAxis: {
          type: "category",
          data: new Array(compo.trend.length)
            .fill(Date.parse("2016/1/1"))
            .map(function(d, i) {
              return (
                new Date(d + i * 3600000).getMonth() +
                1 +
                "月" +
                new Date(d + i * 3600000).getDate() +
                "日"
              );
            }),
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        series: [
          {
            data: compo.trend,
            type: "line"
          }
        ]
      });
      setTimeout(function() {
        window.addEventListener("resize", function() {
          trendchart.resize();
        });
      }, 200);
    },
    drawTime() {
      let timechart = this.$echarts.init(document.getElementById("ts"));
      let base = -timeData.reduce(function(min, val) {
        return Math.floor(Math.min(min, val.l));
      }, Infinity);
      timechart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#ccc",
              borderColor: "#aaa",
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,

              color: "#222"
            }
          },
          formatter: function(params) {
            return params[2].name + "<br />" + params[2].value;
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: timeData.map(function(item) {
            return item.date;
          }),
          axisLabel: {
            formatter: function(value, idx) {
              var date = new Date(value);
              return idx === 0
                ? value
                : [date.getMonth() + 1, date.getDate()].join("-");
            }
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            formatter: function(val) {
              return val - base;
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return (params.value - base).toFixed(1);
              }
            }
          },
          splitNumber: 3,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "white" //更改坐标轴颜色
            }
          }
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: "L",
            type: "line",
            data: timeData.map(function(item) {
              return item.l + base;
            }),
            lineStyle: {
              opacity: 0
            },
            stack: "confidence-band",
            symbol: "none"
          },
          {
            name: "U",
            type: "line",
            data: timeData.map(function(item) {
              return item.u - item.l;
            }),
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              color: "#ccc"
            },
            stack: "confidence-band",
            symbol: "none"
          },
          {
            type: "line",
            data: timeData.map(function(item) {
              return item.value + base;
            }),
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
              color: "#c23531"
            },
            showSymbol: false
          }
        ]
      });
      setTimeout(function() {
        window.addEventListener("resize", function() {
          timechart.resize();
        });
      }, 200);
    },
    drawTransport() {
        function adjust(){
            d3.selectAll("path")
                .attr("d", function(d){
                let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)), dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)), x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                return "M"+ x1y1.x + "," + x1y1.y +" Q" + dxdy.x + ","+ dxdy.y + " " + x2y2.x + "," + x2y2.y
            })
            d3.selectAll("animateMotion")
                    .attr("path", function(d){
                            let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)), dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)), x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                            return "M"+ 0 + "," + 0 +" Q" + (dxdy.x - x2y2.x) + ","+ (dxdy.y - x2y2.y) + " " + (x1y1.x - x2y2.x) + "," + (x1y1.y - x2y2.y)
                        })
            d3.selectAll("circle")
                    .attr("cx", function(d){
                        return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).x
                    })
                    .attr("cy", function(d){
                        return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).y
                    })
        }
        let colorseries = [
            "#ffffd9",
            "#edf8b1",
            "#c7e9b4",
            "#7fcdbb",
            "#41b6c4",
            "#1d91c0",
            "#225ea8",
            "#253494",
            "#081d58"
        ];
        this.map = L.map("transport", {
            minZoom: 3,
            maxZoom: 14,
            center: [41.8, 123.38333],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            crs: L.CRS.EPSG3857
        });
        this.map.on('zoom', adjust);
        
        L.tileLayer(
            "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            {
            subdomains: ["1", "2", "3", "4"],
            attribution: "高德"
            }
        ).addTo(this.map);
        let that = this;
        var blueIcon = L.icon({
            iconUrl: markerIcon,
            iconSize: [20, 36],
            iconAnchor: [13, 21]
        });
        var svg = d3.select(this.map.getPanes().overlayPane).append("svg")
        var g = svg.append("g").attr("class", "leaflet-zoom-hide");
        this.map.on('move', function(){
            
        })
        
        for (let i = 0; i < 73; i++) {
            let mark = L.marker(od.nodes[i].reverse(), {
                icon: blueIcon,
                // draggable:true,
                riseOnHover: true
                }).addTo(that.map);
            mark.on("click", function() {
                
                d3.select(that.map.getPanes().overlayPane)
                    .select("svg")
                    .selectAll("path")
                    .remove();
                d3.select(that.map.getPanes().overlayPane)
                    .select("svg")
                    .selectAll("circle")
                    .remove();
                d3.select(that.map.getPanes().overlayPane)
                    .select("svg")
                    .selectAll("animateMotion")
                    .remove();
                that.od_data = new Array()
                for (let j = 0; j < 73; j++) {
                    if (j === i){
                        continue
                    }
                    let x1 = od.nodes[j][0], y1 = od.nodes[j][1], x2 = od.nodes[i][0], y2 = od.nodes[i][1]
                    let dx = (x1 + x2) / 2 - (y1 - y2) / 4, dy = (y1 + y2) / 2 - (x2 - x1) / 4
                    that.od_data.push({"x1": x1, "y1": y1, "dx": dx, "dy": dy, "x2": x2, "y2": y2, "color": colorseries[od.od[0][i][j]]})
                }

                var feature = g.selectAll("path")
                        .data(that.od_data, function(d){
                            return d;
                        })
                        .enter()
                        .append("path")
                        .attr("d", function(d){
                            let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)), dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)), x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                            return "M"+ x2y2.x + "," + x2y2.y +" Q" + dxdy.x + ","+ dxdy.y + " " + x1y1.x + "," + x1y1.y
                        })
                        .on("click", function() {
                            that.changeTransportClass();
                            // alert("hee")
                        },true)
                        .style("fill", "none")
                        .style("stroke-linejoin", "round")
                        .style("stroke", function(d){
                            return d.color
                        })
                        .style("stroke-width", "4")
                        .style("opacity", "0.4")
                        .style("pointer-events","auto")
                        .style("cursor","pointer")
                        
                         

                g.selectAll("circle")
                    .data(that.od_data, function(d){
                        return d
                    })
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){
                        return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).x
                    })
                    .attr("cy", function(d){
                        return that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2)).y
                    })
                    .attr("r", "4.3")
                    .attr("fill", function(d){
                        return d.color
                    })
                    .style("opacity", "0.8")
                    .append("animateMotion")
                    .attr("dur", "5s")
                    .attr("fill", "freeze")
                    .attr("repeatCount", "indefinite")
                    .attr("path", function(d){
                            let x1y1 = that.map.latLngToLayerPoint(L.latLng(d.x1, d.y1)), dxdy = that.map.latLngToLayerPoint(L.latLng(d.dx, d.dy)), x2y2 = that.map.latLngToLayerPoint(L.latLng(d.x2, d.y2));
                            return "M"+ 0 + "," + 0 +" Q" + (dxdy.x - x2y2.x) + ","+ (dxdy.y - x2y2.y) + " " + (x1y1.x - x2y2.x) + "," + (x1y1.y - x2y2.y)
                        })

                    
                

                var transform = d3geo.geoTransform({point: function(x,y) {
                    var point = that.map.latLngToLayerPoint(new L.LatLng(y,x));
                    this.stream.point(point.x,point.y);
                }})
                let path = d3geo.geoPath().projection(transform);

                that.map.on("move", reset);
                reset();


                function reset() {
                    var bounds = path.bounds(geo),
                        topLeft = bounds[0],
                        bottomRight = bounds[1];
                    svg.attr("width", bottomRight[0] - topLeft[0])
                        .attr("height", bottomRight[1] - topLeft[1])
                        .style("left", topLeft[0] + "px")
                        .style("top", topLeft[1] + "px");
                    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
                    adjust()
                }
            });
        }
        


    }
    
  }
};
</script>
