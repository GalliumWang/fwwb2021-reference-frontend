<template>
  <div id="report">
    <el-carousel
      height="100vh"
      direction="vertical"
      :autoplay="false"
      trigger="click"
      @change="((pre, next) => {change(pre, next, index)})"
    >
      <el-carousel-item>
        <div class="front-page">
          <div class="front-page-img"></div>
          <div class="front-page-up">
            <div>
              <h1>交通可视化挖掘系统数据报告</h1>
            </div>
            <div>
              <h3>BY:TEAM奥励给</h3>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="second-page">
          <div class="index">目录</div>
          <div class="items">
            <div class="item">
              <div class="icon">01</div>
              <h2>流量监控</h2>
            </div>

            <div class="item">
              <div class="icon">02</div>
              <h2>居民出行标签统计</h2>
            </div>
            <div class="item">
              <div class="icon">03</div>
              <h2>出行建议</h2>
            </div>
          </div>
          <div class="second-footer"></div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="third-page">
          <div class="third-page-img"></div>
          <div class="third-page-up">
            <div class="third-page-header">
              <h1>2020年5月28日数据报表</h1>
            </div>
            <div class="leftup background" id="district"></div>
            <div class="middleup background" id="pie"></div>
            <div class="rightup background" id="max">
              <div class="title">
                <b>每日最大流量时间点</b>
              </div>
              <el-table :data="maxData" stripe style="width: 90%;top:10%">
                <el-table-column fixed="left" prop="data" label="日期" min-width="150"></el-table-column>
                <el-table-column prop="time" fixed="right" label="时间点" min-width="120"></el-table-column>
              </el-table>
            </div>
            <div class="leftdown background" id="chartmorning">
              <div class="title">
                <b>当日城市早高峰拥堵路段排名</b>
              </div>
              <el-table :data="tableData" stripe style="position:absolute; width: 90%;top:10%;">
                <el-table-column prop="index" label="排名" min-width="70" fixed="left"></el-table-column>
                <el-table-column prop="road" label="道路"></el-table-column>
                <el-table-column prop="num" label="拥堵指数" min-width="90" fixed="right"></el-table-column>
              </el-table>
            </div>
            <div class="rightdown background" id="chartnight">
              <div class="title">
                <b>当日城市晚高峰拥堵路段排名</b>
              </div>
              <el-table
                :data="tableDataNight"
                stripe
                style="position:absolute; width: 90%;top:10%;"
              >
                <el-table-column prop="index" label="排名" min-width="70" fixed="left"></el-table-column>
                <el-table-column prop="road" label="道路"></el-table-column>
                <el-table-column prop="num" label="拥堵指数" min-width="90" fixed="right"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style scoped>
#report {
  height: 100%;
  position: relative;
}
.title {
  position: absolute;
  font-size: 18px;
  font-weight: 2000;
  left: 50%;
  top: 2%;
  transform: translateX(-50%);
  color: #00213d;
}
.front-page {
  position: relative;
  height: 100%;
}
.third-page {
  position: relative;
  height: 100%;
}
.second-page {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(7, 30, 56);
}
.third-page-up {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: #00213d;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.front-page-img {
  position: absolute;
  width: 100%;
  background-image: url('../assets/ShenyangNight.jpg');

  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.front-page-up {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(32, 32, 32, 0.7);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.front-page-up div {
  font-size: 3vh;
}
.item h2 {
  font-size: 5vh;
}
.second-footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 15%;
  background-image: url('../assets/city.png');
}
.index {
  left: 4%;
  top: 4%;
  font-size: 3vh;
  position: absolute;
}
.item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.icon {
  background-color: blueviolet;
  padding: 3px;
  margin: 20px;
}
.control {
  left: 4%;
  top: 4%;
  font-size: 3vh;
  font-weight: 600;
  position: absolute;
  color: darkslateblue;
}
.background {
  background-color: #eeeeee;
  border-radius: 10px;
}
.third-page-header {
  position: absolute;
  top: 0.5vh;
  left: 0vh;
  width: 100%;
  text-align: center;
}
.leftup {
  position: absolute;
  height: 40vh;
  width: 32vw;
  left: 5vw;
  top: 7vh;
}
.middleup {
  position: absolute;
  height: 40vh;
  width: 32vw;
  right: 28vw;
  top: 7vh;
}
.rightup {
  position: absolute;
  height: 40vh;
  width: 20vw;
  right: 5vw;
  top: 7vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
.leftdown {
  position: absolute;
  height: 45vh;
  width: 43vw;
  left: 5vw;
  bottom: 4vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
.rightdown {
  position: absolute;
  height: 45vh;
  width: 43vw;
  right: 5vw;
  bottom: 4vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
.el-table th.is-leaf {
  background: #f9f9f9;
  border-bottom: none;
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
</style>

<style>
.el-table th {
  background-color: #908eab !important;
  color: white;
}
</style>

<script>
import circleData from '../assets/data/city_new.json';
export default {
  data() {
    return {
      name: ['综合区', '餐饮娱乐区', '居住生活区', '企业商务区'],
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
      tableData: [
        {
          index: '1',
          road: '长江街',
          num: '2.33',
        },
        {
          index: '2',
          road: '怒江街',
          num: '2.25',
        },
        {
          index: '3',
          road: '崇山中路',
          num: '2.17',
        },
        {
          index: '4',
          road: '黄河南大街',
          num: '2.03',
        },
        {
          index: '5',
          road: '保工北街',
          num: '1.97',
        },
        {
          index: '6',
          road: '兴工北街',
          num: '1.95',
        },
        {
          index: '7',
          road: '热闹路',
          num: '1.94',
        },
        {
          index: '8',
          road: '哈尔滨路',
          num: '1.91',
        },
        {
          index: '9',
          road: '昆山中路',
          num: '1.9',
        },
        {
          index: '10',
          road: '重工南街',
          num: '1.89',
        },
      ],
      tableDataNight: [
        {
          index: '1',
          road: '长江街',
          num: '2.88',
        },
        {
          index: '2',
          road: '哈尔滨路',
          num: '2.71',
        },
        {
          index: '3',
          road: '三好街',
          num: '2.7',
        },
        {
          index: '4',
          road: '五爱街',
          num: '2.5',
        },
        {
          index: '5',
          road: '青年大街',
          num: '2.43',
        },
        {
          index: '6',
          road: '怒江街',
          num: '2.31',
        },
        {
          index: '7',
          road: '南五马路',
          num: '2.31',
        },
        {
          index: '8',
          road: '和平南大街',
          num: '2.23',
        },
        {
          index: '9',
          road: '兴华北街',
          num: '2.22',
        },
        {
          index: '10',
          road: '重工南街',
          num: '1.98',
        },
      ],
      maxData: [
        {
          data: '2020-5-22',
          time: '13-14',
        },
        {
          data: '2020-5-23',
          time: '13-14',
        },
        {
          data: '2020-5-24',
          time: '15-16',
        },
        {
          data: '2020-5-25',
          time: '16-17',
        },
        {
          data: '2020-5-26',
          time: '11-12',
        },
        {
          data: '2020-5-27',
          time: '17-18',
        },
        {
          data: '2020-5-28',
          time: '17-18',
        },
      ],
    };
  },
  mounted() {
    this.drawDistrict();
    this.drawPie();
  },
  methods: {
    drawDistrict() {
      var that = this;
      var district = this.$echarts.init(document.getElementById('district'));
      // var _dis = [0, 0, 0, 0];
      // circleData.forEach(function(item) {
      //   _dis[item.class]++;
      // });
      district.setOption({
        title: {
          text: '当日城市分区流量情况统计',
          left: 'center',
          top: '2%',
        },
        tooltip: {
          trigger: 'item',
        },
        grid: {
          top: '10%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: that.name,
          axisLine: {
            lineStyle: {},
          },
        },
        yAxis: {
          type: 'value',
          name: '流动数',
          axisLine: {
            lineStyle: {},
          },
        },
        series: [
          {
            type: 'bar',
            data: [382310, 532360, 753120, 715640],
            itemStyle: {
              normal: {
                color: function(params) {
                  return that.color[params.dataIndex];
                },
              },
            },
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          district.resize();
        });
      }, 200);
    },
    drawPie() {
      var that = this;
      var pie = this.$echarts.init(document.getElementById('pie'));
      pie.setOption({
        title: {
          text: '当日公共交通人次情况(单位：万人次)',
          left: 'center',
          top: '1%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['地铁', '公交车(IC卡)', '单车'],
        },
        series: [
          {
            name: '公共交通人次情况(单位：万人次)',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  return that.color[params.dataIndex + 3];
                },
              },
            },
            data: [
              { value: 97.9, name: '地铁' },
              { value: 141.1, name: '公交车(IC卡)' },
              { value: 101.9, name: '单车' },
            ],
          },
        ],
      });
      setTimeout(function() {
        window.addEventListener('resize', function() {
          pie.resize();
        });
      }, 200);
    },
    change(pre, next, index) {
      console.log(pre, next, index);
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center';
    },
    rowClass({ row, rowIndex }) {
      return 'text-align:center';
    },
  },
};
</script>

