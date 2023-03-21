<template>
    <div ref="containerRef">
       
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import videoSrc from '../assets/textures/sky.mp4'
import { Water } from 'three/examples/jsm/objects/Water.js'
// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
const containerRef = ref<any>(null)
const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.set(-50, 50, 130)
    // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
    scene.add(camera)
// 初始化渲染器 抗锯齿
const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.outputEncoding = THREE.sRGBEncoding
    
const render = (time?: any) => {
    water.material.uniforms['time'].value += 2.0 / 60.0;
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
// 水面
    const waterGeometry = new THREE.CircleGeometry(300, 64)
    const water = new Water(waterGeometry, {
        textureHeight: 1024,
        textureWidth: 1024,
        waterColor: 0xeeeeff,
        waterNormals: new THREE.TextureLoader().load('./src/assets/textures/water/Water_2_M_Normal.jpg', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
    })
    water.position.y = 3;
// 水面旋转至水平
water.rotation.x = -Math.PI / 2;
onMounted(() => {
    

   
   

   const skySphere = new THREE.SphereGeometry(1000, 60, 60)
   const skyMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("./src/assets/textures/sky.jpg")
   })
   skySphere.scale(1, 1, -1)
   const sky = new THREE.Mesh(skySphere, skyMaterial)
   scene.add(sky)
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const video = document.createElement("video")
    video.src = videoSrc
    video.loop = true
    window.addEventListener("click", () => {
        if(video.paused) {
            video.play()
            skyMaterial.map = new THREE.VideoTexture(video)
            skyMaterial.map.needsUpdate = true
        }
    })
    // 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
scene.add(light);
    // 载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./src/assets/hdr/050.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
    scene.add(water)
    const controls = new OrbitControls(camera, renderer.domElement)
   // 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader();
// 实例化draco载入库
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./src/public/draco/gltf/");
dracoLoader.preload();
// 添加draco载入库
loader.setDRACOLoader(dracoLoader);
loader.load("/src/assets/models/island2.glb", (gltf) => {
    console.log(gltf.scene)
  scene.add(gltf.scene);
},xhr => {
    console.log(xhr)
},err => {
    console.log(err)
});
    
    render()
  
}) 

</script>