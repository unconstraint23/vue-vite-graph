<template>
    <div ref="containerRef">

    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { onMounted, ref } from "vue";

    const containerRef = ref()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  
  const textureLoader = new THREE.TextureLoader();


// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const createPoints = (url, size = 0.5) => {
  const particlesGeometry = new THREE.BufferGeometry();
const count = 1000;

// 设置缓冲区数组
const positions = new Float32Array(count * 3);
// 设置粒子顶点颜色
const colors = new Float32Array(count * 3);
// 设置顶点
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));


const texture = textureLoader.load(`/src/assets/particles/${url}.png`);

// 设置点材质
const pointsMaterial = new THREE.PointsMaterial({

    sizeAttenuation: true,
    depthWrite: false,
   vertexColors: true,
   blending: THREE.AdditiveBlending,
    map: texture,
    alphaMap: texture,
});
pointsMaterial.size = size;
pointsMaterial.color.set(0xfff000);
// // 相机深度而衰减
pointsMaterial.sizeAttenuation = true;

const points = new THREE.Points(particlesGeometry, pointsMaterial);

scene.add(points);
    return points
}

const points = createPoints("1", 1.5);
const points2 = createPoints("xh", 1);
const points3 = createPoints("xh", 2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
directionalLight.shadow.mapSize.set(4096, 4096);

// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;


scene.add(directionalLight);
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();
  const render = () => {
    let time = clock.getElapsedTime();
  points.rotation.x = time * 0.3;
  points2.rotation.x = time * 0.5;
  points2.rotation.y = time * 0.4;
  points3.rotation.x = time * 0.2;
  points3.rotation.y = time * 0.2;
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