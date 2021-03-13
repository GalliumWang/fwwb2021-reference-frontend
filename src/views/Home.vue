<template>
  <div id="home">
    <section class="canvas-wrap">
      <div id="canvas" class="gradient">
        <p class="cover-text">交通时空大数据分析挖掘系统</p>
        <p
          class="cover-text"
          style="font-size: 2em; position: absolute; transform: translate(-50%, -20%);"
        >Traffic Big-Data Analysis and Mining System</p>
        <el-button round id="enterBtn" @click="Enter">
          continue
          <i class="el-icon-d-arrow-right"></i>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script>
import $ from 'jquery';
import * as THREE from 'three';
import { renderable } from '../assets/js/projector';
import { sprite } from '../assets/js/canvas-renderer';
export default {
  name: 'home',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      SEPARATION: 200,
      AMOUNTX: 1,
      AMOUNTY: 1,
    };
  },

  mounted() {
    sprite(THREE);
    renderable(THREE);

    this.init();
    this.animate();

    var colors = new Array(
      [62, 35, 255],
      [60, 255, 60],
      [255, 35, 98],
      [45, 175, 230],
      [255, 0, 255],
      [255, 128, 0]
    );

    //

    var step = 0;
    //color table indices for:
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0, 1, 2, 3];

    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient() {
      if ($ === undefined) return;

      var c0_0 = colors[colorIndices[0]];
      var c0_1 = colors[colorIndices[1]];
      var c1_0 = colors[colorIndices[2]];
      var c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;
      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      var color1 = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')';

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      var color2 = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';

      $('.gradient')
        .css({
          background:
            '-webkit-gradient(linear, left top, right top, from(' +
            color1 +
            '), to(' +
            color2 +
            '))',
        })
        .css({
          background:
            '-moz-linear-gradient(left, ' +
            color1 +
            ' 0%, ' +
            color2 +
            ' 100%)',
        });

      step += gradientSpeed;
      if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] =
          (colorIndices[1] +
            Math.floor(1 + Math.random() * (colors.length - 1))) %
          colors.length;
        colorIndices[3] =
          (colorIndices[3] +
            Math.floor(1 + Math.random() * (colors.length - 1))) %
          colors.length;
      }
    }

    setInterval(updateGradient, 10);
  },
  methods: {
    init() {
      var container,
        separation = 1000,
        amountX = 50,
        amountY = 50,
        color = 0xffffff,
        particles,
        particle;

      container = document.getElementById('canvas');

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.z = 100;

      this.scene = new THREE.Scene();

      this.renderer = new THREE._CanvasRenderer({ alpha: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0x000000, 0); // canvas background color
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      var PI2 = Math.PI * 2;
      var material = new THREE.SpriteCanvasMaterial({
        color: color,
        opacity: 0.5,
        program: function(context) {
          context.beginPath();
          context.arc(0, 0, 0.5, 0, PI2, true);
          context.fill();
        },
      });

      var geometry = new THREE.Geometry();

      /*
       *   Number of particles
       */
      for (var i = 0; i < 150; i++) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 10 + 600);
        particle.scale.x = particle.scale.y = 5;

        this.scene.add(particle);

        geometry.vertices.push(particle.position);
      }

      /*
       *   Lines
       */

      var line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: color, opacity: 0.5 })
      );
      this.scene.add(line);

      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      document.addEventListener('touchstart', this.onDocumentTouchStart, false);
      document.addEventListener('touchmove', this.onDocumentTouchMove, false);

      //

      window.addEventListener('resize', this.onWindowResize, false);
    },
    onWindowResize() {
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove(event) {
      this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
      this.mouseY = (event.clientY - this.windowHalfY) * 0.2;
    },
    onDocumentTouchStart(event) {
      if (event.touches.length > 1) {
        event.preventDefault();

        this.mouseX = (event.touches[0].pageX - this.windowHalfX) * 0.7;
        this.mouseY = (event.touches[0].pageY - this.windowHalfY) * 0.7;
      }
    },
    onDocumentTouchMove(event) {
      if (event.touches.length == 1) {
        event.preventDefault();

        this.mouseX = event.touches[0].pageX - this.windowHalfX;
        this.mouseY = event.touches[0].pageY - this.windowHalfY;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.render();
    },
    render() {
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.1;
      this.camera.position.y +=
        (-this.mouseY + 200 - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);

      this.renderer.render(this.scene, this.camera);
    },
    Enter() {
      this.$router.push({
        path: '/map/stationary',
      });
      window.location.reload();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
#home {
  background-color: #fff;
  margin: 0px;
  width: 100%;
  height: 100%;
  /*overflow: hidden;*/
  font-family: arial;
  color: #fff;
}

#canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #1a1724;
}
.canvas-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
div.canvas-content {
  position: relative;
  z-index: 2000;
  color: #fff;
  text-align: center;
  padding-top: 30px;
}
.cover-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -110%);
  font-size: 3.5em;
}
#enterBtn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%);
}
</style>
