<template>
    <div>
        <div ref="containerRef" class="container">
        
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import Garden from '../garden/garden'
    const containerRef = ref<any>(null)
        const axesHelper = new THREE.AxesHelper(5);
       
     
    
      let garden: any
    onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(1000, 1000, 1000)
    const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    scene.add(light);
    scene.add(axesHelper)
    const textureCubeLoader = new THREE.CubeTextureLoader();
    const textureCube = textureCubeLoader.setPath("./src/assets/cubetexture/").load([
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    ]);

    scene.background = textureCube;
    scene.environment = textureCube;
        // 更新摄像头宽高比例
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像头投影矩阵
    camera.updateProjectionMatrix();
 // 初始化渲染器 抗锯齿
 const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
     // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  renderer.setClearColor("#000");

  const createMesh = () => {
    garden = new Garden(scene)
  }
  
  createMesh()
  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getDelta();
    
       garden.update(time)
   
    renderer.render(scene, camera);
    controls.update()
  requestAnimationFrame(render);
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

<style scoped lang="less">
.container {
    width: 100%;
    height: 100vh;
}
</style>