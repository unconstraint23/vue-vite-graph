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
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load("/src/assets/door/color.jpg");
const doorAplhaTexture = textureLoader.load("/src/assets/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "/src/assets/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/src/assets/door/height.jpg");

// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("/src/assets/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("/src/assets/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("/src/assets/door/normal.jpg");

// const doorColorTexture = textureLoader.load("/src/assets/door/color.jpg");
// const texture = textureLoader.load("/src/assets/door/minecraft.png");
// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter;
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.y = 0.5
// 设置旋转的原点
// doorColorTexture.center.set(0.5, 0.5);
// doorColorTexture.rotation = Math.PI / 4 
// doorColorTexture.repeat.set(2, 3)
// // 设置纹理重复的模式
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// doorColorTexture.wrapT = THREE.RepeatWrapping;
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
// 材质
const basicMaterial = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  // opacity: 0.3,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  roughness: 1,
  roughnessMap: roughnessTexture,
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
});
// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);
basicMaterial.side = THREE.DoubleSide;
const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);
const plane = new THREE.Mesh(
  planeGeometry,
  basicMaterial
);
plane.position.set(3, 0, 0);
scene.add(plane);

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