import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Chart from '../views/Chart.vue';
import Map from '../views/Map.vue';
import Analysis from '../components/Analysis.vue';
import Metro from '../components/Metro.vue';
import Predict from '../components/Predict';
import Development from '../components/Development';

import Test from '../views/Test';
import Routes from '../components/Routes.vue';
import Heat from '../components/Heat.vue';
import Station from '../components/Station.vue';
import Stationary from '../components/Stationary.vue';
import Gether from '../components/Gether.vue';
import Report from '../views/Report.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/report',
    name: 'report',
    component: Report,
  },
  {
    path: '/map',
    name: 'map',
    component: Map,
    redirect: '/map/Stationary',
    children: [
      {
        path: '/map/analysis',
        name: 'analysis',
        component: Analysis,
      },
      {
        path: '/map/station',
        name: 'station',
        component: Station,
      },
      {
        path: '/map/heat',
        name: 'heat',
        component: Heat,
      },
      {
        path: '/map/stationary',
        name: 'stationary',
        component: Stationary,
      },
      {
        path: '/map/metro',
        name: 'metro',
        component: Metro,
      },
      {
        path: '/map/predict',
        name: 'predict',
        component: Predict,
      },
      {
        path: '/map/routes',
        name: 'routes',
        component: Routes,
      },
      {
        path: '/map/develop',
        name: 'develop',
        component: Development,
      },
      {
        path: '/map/gether',
        name: 'gether',
        component: Gether,
      },
    ],
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
