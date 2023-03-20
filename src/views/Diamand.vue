<template>
    <div ref="containerRef" class="container">
       
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


onMounted(() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.set(1.5, 1, 1.5)
    // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
 
   const loader = new THREE.TextureLoader()
   const bgTexture = loader.load("./public/assets/050.jpg");
  bgTexture.mapping = THREE.EquirectangularRefractionMapping;

  scene.background = bgTexture;
  scene.environment = bgTexture;
  // 添加环境光
  const ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/public/model/bear.gltf", (gltf) => {
    console.log(gltf.scene.children[0])
    const model: any = gltf.scene.children[0]
    model.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: bgTexture,
      refractionRatio: 0.7,
      reflectivity: 0.99,
    });

    scene.add(model);
  })

 
 // 初始化渲染器 抗锯齿
const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
     // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
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
</style>