<template>
    <div ref="containerRef">

    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { onMounted, ref } from "vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
    const containerRef = ref()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/src/assets/002.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
// 设置cube纹理加载器
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// const envMapTexture = cubeTextureLoader.load([
//   "/src/assets/1/px.jpg",
//   "/src/assets/1/nx.jpg",
//   "/src/assets/1/py.jpg",
//   "/src/assets/1/ny.jpg",
//   "/src/assets/1/pz.jpg",
//   "/src/assets/1/nz.jpg",
// ]);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
    // envMap: envMapTexture,
});
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// // 给场景添加背景
// scene.background = envMapTexture;
// // 给场景所有的物体添加默认的环境贴图
// scene.environment = envMapTexture;


// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 1, 10);
scene.add(directionalLight);
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
  const render = () => {
      renderer.render(scene, camera);
    controls.update()
  requestAnimationFrame(render);
}
  onMounted(() => {
    containerRef.value.appendChild(renderer.domElement)
        render()
  })
</script>

<style scoped>

</style>