<template>
  
    <div ref="containerRef" class="container">
     
  </div>
     

   
 
    
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import zp2 from '../assets/robot/zp2.mp4'

const containerRef = ref<any>(null)
  const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 1.5, 6)
     // 初始化渲染器 抗锯齿
const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
// 设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
    // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 设置控制器阻尼
  controls.enableDamping = true;





onMounted(() => {
    

    // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
let rgbeLoader = new RGBELoader();
rgbeLoader.load("/src/assets/robot/sky12.hdr",(texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
})
// 添加光阵
let video = document.createElement("video");
  video.src = zp2;
  video.loop = true;
  video.muted = true;
  video.play();
  let videoTexture = new THREE.VideoTexture(video)
  const videoGeoPlane = new THREE.PlaneGeometry(8, 4.5)
  const videoMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaMap: videoTexture
  })
  const videoMesh = new THREE.Mesh(videoGeoPlane,videoMaterial)
  videoMesh.position.set(0, 0.2, 0)
  videoMesh.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(videoMesh)
  // 添加镜面反射
  let reflectorGeometry = new THREE.PlaneGeometry(100, 100);
  let reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x332222,
  });
  reflectorPlane.rotation.x = -Math.PI / 2;
  scene.add(reflectorPlane);
 // 添加直线光
 let light1 = new THREE.DirectionalLight(0xffffff, 0.3);
  light1.position.set(0, 10, 10);
  let light2 = new THREE.DirectionalLight(0xffffff, 0.3);
  light1.position.set(0, 10, -10);
  let light3 = new THREE.DirectionalLight(0xffffff, 0.8);
  light1.position.set(10, 10, 10);
  scene.add(light1, light2, light3);
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  gltfLoader.setDRACOLoader(dracoLoader)
  dracoLoader.setDecoderPath("./src/public/draco/gltf/");
  gltfLoader.load("/src/assets/robot/robot.glb", (gltf) => {
    const obj = gltf.scene
    obj.traverse((child: any) => {
    if (child.name === "Plane") {
      child.visible = false;
    }
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
    scene.add(obj);
  })





     
  renderer.setClearColor("#000");
  
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
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}
</style>