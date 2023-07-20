<template>
  <div ref="canvas" class="canvas">
    <!-- <canvas ref="canvas" id="webgl">浏览器不支持canvas，请切换浏览器重试</canvas>     -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import {City} from '../utils/city'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const canvas = ref<any>();
onMounted(() => {
  initCity();
});
const initCity = () => {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(1000, 500, 100);
  scene.add(camera);

  // 添加相机控件
  const controls = new OrbitControls(camera, canvas.value);
  // 是否有惯性
  controls.enableDamping = true;
  // 是否可以缩放
  controls.enableZoom = false;
  // 最近和最远距离
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  // 开启右键拖动
  controls.enablePan = true;

  // 添加灯光
  scene.add(new THREE.AmbientLight(0xadadad));
  const directionLight = new THREE.DirectionalLight(0xffffff);
  directionLight.position.set(0, 0, 0);
  scene.add(directionLight);
  const city = new City(scene, camera, controls);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  const start = () => {
    city.start()
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(start)
  }
  start()
  // 创建渲染器
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // 设置场景颜色
  renderer.setClearColor(new THREE.Color(0x000), 1);
 
  canvas.value.appendChild(renderer.domElement);
  // 渲染场景

};
</script>

<style scoped></style>
