<template>
    <div>
      <div id="bigScreen">
    <div class="header">智慧园区可视平台</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <h3>
            <span>热气球控制</span>
          </h3>
          <h1 @click="toggleAction(0)" class="activeBtn">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置热气球以横穿园区的动画显示</span>
          </h1>
          <h1 @click="toggleAction(1)" class="activeBtn">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置热气球以环绕园区进行运动</span>
          </h1>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent">
          <h3>
            <span>相机控制</span>
          </h3>
          <h1 @click="toggleCamera('default')" class="activeBtn">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>默认的相机视角</span>
          </h1>
          <h1 @click="toggleCamera('carcamera_Orientation')" class="activeBtn">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>设置相机追随汽车导览园区</span>
          </h1>
          <h1 @click="toggleCamera('rightcamera_Orientation')" class="activeBtn">
            <img class="icon" src="../assets/bg/bar.svg" alt="" />
            <span>查看汽车司机视角</span>
          </h1>

          <div class="footerBorder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent list">
          <h3>
            <span>切换园区观览模式</span>
          </h3>
          <ul>
            <li @click="toggleControls('Orbit')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 轨道观览 </span>
                </div>
              </h1>
              <p>可以锁定目标建筑和园区进行轨道式360°查看</p>
            </li>
            <li @click="toggleControls('Fly')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 飞行观览 </span>
                </div>
              </h1>
              <p>可以使用飞行模式进行园区进行观览</p>
            </li>
            <li @click="toggleControls('FirstPerson')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" alt="" />
                  <span> 第一人称 </span>
                </div>
              </h1>
              <p>可以使用第一人称模式进行园区进行观览</p>
            </li>
          </ul>

          <div class="footerBorder"></div>
        </div>
      </div>
    </div>
  </div>
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

import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import Garden from '../garden/garden'
import eventHub from "@/utils/eventHub";
    const containerRef = ref<any>(null)
    const currentCamera = ref<any>()
    const currentControl = ref<any>()
        const axesHelper = new THREE.AxesHelper(5);
        const clock = new THREE.Clock();
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
     const toggleAction = (index: number) => {
      eventHub.emit("actionClick", index);
     }
    const toggleCamera = (key: string) => {
      
      currentCamera.value = garden.cameraModule[key]
      
      
    }

    const toggleControls = (key: string) => {
      let controls: any
      
      if(key === "Orbit") {
         controls = new OrbitControls(currentCamera.value, renderer.domElement);
          // 设置控制器阻尼
          controls.enableDamping = true;
          // controls.maxPolarAngle = Math.PI / 2;
          // controls.minPolarAngle = 0;
      } else if(key === "Fly") {
       controls = new FlyControls(
        currentCamera.value,
        renderer.domElement
      );
      controls.movementSpeed = 100;
      controls.rollSpeed = Math.PI / 30;
    
      } else {
        controls = new FirstPersonControls(
          currentCamera.value,
          renderer.domElement
      );
      controls.movementSpeed = 100;
    
      controls.lookSpeed = 0.5;
      }
      currentControl.value = controls
    }
      let garden: any
    onMounted(() => {
    
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(1000, 1000, 1000)
    currentCamera.value = camera
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

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
     // 添加控制器
  const controls = new OrbitControls(currentCamera.value, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  currentControl.value = controls
  renderer.setClearColor("#000");

  const createMesh = () => {
    garden = new Garden(scene,camera)
  }
  
  createMesh()

  const render = () => {
    const time = clock.getDelta();
    
       garden.update(time)
   
    renderer.render(scene, currentCamera.value);
    currentControl.value.update(time)
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
#bigScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 200;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}
.activeBtn {
  color: #bfe;
  cursor: pointer;
}
.header {
  /* width: 1920px;
        height: 100px; */

  width: 19.2rem;
  height: 1rem;
  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 0.4rem;
}

.main {
  flex: 1;
  width: 19.2rem;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.right {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.cityEvent {
  position: relative;
  width: 3.5rem;
  /* height: 3rem; */
  margin-bottom: 0.5rem;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
  pointer-events: auto;
}

.cityEvent::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}
.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 3.5rem;
  height: 0.4rem;
}
.footerBorder::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

.cityEvent h1 span {
  flex: 1;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.25rem;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}
.cityEvent li.active p {
  color: red;
}
.container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>