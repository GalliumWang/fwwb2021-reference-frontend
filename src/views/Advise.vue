<template>
  <div id="heatMap">
    <div class="map" id="map" style="z-index:1"></div>
    <div class="chart" id="chart">
      <div class="pie_echarts" id="pie_echarts"></div>
    </div>
  </div>
</template>

<script>
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import heat from '../../static/json/heatmap.json';
export default {
  name: 'advise',
  data() {
    return {
      heat: [],
      heatMapData: [],
      heatMapLayer: null,
    };
  },
  mounted() {
    this.heat = heat;
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
        zoom: 12,
        center: [41.80998572925369, 123.38456623432836],
        crs: L.CRS.EPSG3857,
      });

      L.tileLayer(
        'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        {
          subdomains: ['1', '2', '3', '4'],
          attribution: '高德',
        }
      ).addTo(this.map);

      var config = {
        radius: 0.02,
        maxOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count',
      };

      this.heatMapLayer = new HeatmapOverlay(config);
      this.heatMapLayer.addTo(this.map);
      this.heatMapLayer.setData({
        max: 10,
        data: this.heat,
      });

      console.log(this.heat);
    },
  },
};
</script>
