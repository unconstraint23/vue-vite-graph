<template>
    <div>
        <div ref="containerRef" class="container">
        
        </div>
    </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { OrbitControls } from 'three/addons/controls/OrbitControls';
import {MeshLine, modifyCityMaterial } from './utils/meshLine'
import FlyLine from './utils/flyLine';
import FlyLineShader from './utils/flyLineShader';
import LightWall from './utils/lightWall';
import LightRadar from './utils/lightRadar';
    const containerRef = ref<any>(null)
        const axesHelper = new THREE.AxesHelper(5);
    onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 50000 );
    camera.position.set(5, 10, 15)
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
  const gltfLoader = new GLTFLoader();
  const createMesh = () => {
    gltfLoader.load("/src/cityModel/city.glb", (gltf) => {
   
        gltf.scene.traverse((item: any) => {
            
            if(item.type === "Mesh") {
                const cityMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(0x0c0e33),
                   
            });
            item.material = cityMaterial;
            modifyCityMaterial(item)
            if (item.name == "Layerbuildings") {
                console.log(item)
            const meshLine = new MeshLine(item.geometry);
            const size = item.scale.x;
            console.log(meshLine)
            meshLine.mesh.scale.set(size, size, size);
            scene.add(meshLine.mesh);
        }
            }
        })
    scene.add(gltf.scene);

    
  })
  }
  const flyLine: any = new FlyLine();
    scene.add(flyLine.mesh);
    // const flyLineShader: any = new FlyLineShader();
    
    // scene.add(flyLineShader.mesh);
    const lightWall: any = new LightWall();
    scene.add(lightWall.mesh);

    const lightRadar: any = new LightRadar();
    scene.add(lightRadar.mesh);
  createMesh()
  const render = () => {
 
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