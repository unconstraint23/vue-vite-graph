<template>
  <div class="home">
    <div ref="containerRef" class="container">
       
      </div>

    <div class="home-content">
      <div class="home-content-title">
        <h1>汽车展示与选配</h1>
      </div>
      <h2>选择车身颜色</h2>
      <div class="select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          :key="index"
          @click="selectColor(index)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>

      <h2>选择贴膜材质</h2>
      <div class="select">
        <div
          class="select-item"
          v-for="(item, index) in materials"
          :key="index"
          @click="selectMaterial(index)"
        >
          <div class="select-item-text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
    
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

import { Water } from 'three/examples/jsm/objects/Water.js'
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const containerRef = ref<any>(null)
  let colors = ["red", "blue", "green", "gray", "orange", "purple"]
  let materials = [
  { name: "磨砂", value: 1 },
  { name: "冰晶", value: 0 },
];
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbfc,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
})
const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbfe,
  metalness: 1,
  roughness: 0.1,
});
const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
});
  const selectColor = (index: number) => {
  bodyMaterial.color.set(colors[index]);
  frontMaterial.color.set(colors[index]);
  hoodMaterial.color.set(colors[index]);
  wheelsMaterial.color.set(colors[index]);
  // glassMaterial.color.set(colors[index]);
};
const selectMaterial = (index: number) => {
  bodyMaterial.clearcoatRoughness = materials[index].value;
  frontMaterial.clearcoatRoughness = materials[index].value;
  hoodMaterial.clearcoatRoughness = materials[index].value;
};
onMounted(() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 2, 6)
    // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();

  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  gltfLoader.setDRACOLoader(dracoLoader)
  dracoLoader.setDecoderPath("./src/public/draco/gltf/");
  gltfLoader.load("/src/assets/bmw/bmw01.glb", (gltf) => {
    const bmw = gltf.scene
    bmw.traverse((child: any) => {
        
        if(child.isObject3D) {
          if(child.name.includes("轮毂")) {
            child.material = wheelsMaterial
          }
          // 车身
          if(child.name.includes("Mesh002")) {
            child.material = bodyMaterial
          }
          if(child.name.includes("前脸")) {
            child.material = frontMaterial;
          }
          if(child.name.includes("引擎盖_1")) {
            child.material = hoodMaterial
          }
          if(child.name.includes("挡风玻璃")) {
            child.material = glassMaterial;
          }
        }
    })
    scene.add(bmw);
  })
 // 添加网格地面
 const gridHelper = new THREE.GridHelper(10, 10);
  
  scene.add(gridHelper);
 
 // 初始化渲染器 抗锯齿
const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
     // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  renderer.setClearColor("#000");
  scene.background = new THREE.Color("#ccc")
  scene.environment = new THREE.Color("#ccc") as any
   // 添加灯光
   const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 0, 10);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  const light5 = new THREE.DirectionalLight(0xffffff, 1);
  light5.position.set(0, 10, 0);
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
  light6.position.set(5, 10, 0);
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
  light7.position.set(0, 10, 5);
  scene.add(light7);
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
  light8.position.set(0, 10, -5);
  scene.add(light8);
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
  light9.position.set(-5, 10, 0);
  scene.add(light9);
const render = (time?: any) => {
 
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
   window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
   }) 
    render()
   containerRef.value.appendChild(renderer.domElement)
}) 

</script>
<style>
.container {
    width: 100%;
    height: 100vh;
}
* {
  margin: 0;
  padding: 0;
}

.home-content {
  position: fixed;
  top: 0;
  right: 20px;
}

.select-item-color {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}
.select-item {
  text-decoration-line: underline;
  color: #bfe;
  cursor: pointer;
  margin-right: 20px;
}
.select {
  display: flex;
}
</style>