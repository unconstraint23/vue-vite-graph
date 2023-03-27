<template>
    <div>
      <h2>
        {{ percentage }}
      </h2>
      <div ref="containerRef" class="container">
    </div>
    </div>
    

   
 
    
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import * as CANNON from "cannon-es";
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";

const containerRef = ref<any>(null)
  let percentage = ref(30);

gsap.to(percentage, {
  duration: 1,
  value: 100,
  ease: "linear",
  repeat: -1,
  onUpdate: () => {
    percentage.value = Math.floor(percentage.value);
  },
});
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030311);
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(4, 2, 0)
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

 const textrue = new THREE.TextureLoader()
 textrue.load("/src/assets/football/outdoor.jpg",(texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境纹理
  scene.background = texture;
  scene.environment = texture;
  scene.backgroundBlurriness = 0.3;
})
// 添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 50, 0);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 500;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.bias = -0.00008;
spotLight.intensity = 2;
scene.add(spotLight);
// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)
let ball: { position: { copy: (arg0: CANNON.Vec3) => void; }; quaternion: { copy: (arg0: CANNON.Quaternion) => void; }; }, ballBody: CANNON.Body;
const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader()
  gltfLoader.setDRACOLoader(dracoLoader)
  dracoLoader.setDecoderPath("./src/public/draco/gltf/")
  gltfLoader.load("/src/assets/football/playground02.glb", (gltf) => {
    const obj = gltf.scene
    obj.traverse((child: any) => {
      if (child.isMesh && child.name.search(/Solid/) == -1) {
        child.castShadow = true;
        child.receiveShadow = true;
        // trimesh类型
        const trimesh = new CANNON.Trimesh(
          child.geometry.attributes.position.array,
          child.geometry.index.array
        )
        // 创建刚体
      const trimeshBody = new CANNON.Body({
        mass: 0,
        shape: trimesh,
      });
        // 获取世界位置和旋转给到物理世界
        trimeshBody.position.copy(child.getWorldPosition(new THREE.Vector3()));
        trimeshBody.quaternion.copy(
          child.getWorldQuaternion(new THREE.Quaternion())
        );
        // 添加刚体到物理世界
        world.addBody(trimeshBody);
        if (child.name == "door") {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          opacity: 0,
          transparent: true,
        });
      }
      }
      if (child.name == "Soccer_Ball") {
      ball = child;
      // 创建球体
      const ballShape = new CANNON.Sphere(0.15);
      // 创建刚体
      ballBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 15, 0),
        shape: ballShape,
      });
      // 添加刚体到物理世界
      world.addBody(ballBody);
      }
      setTimeout(() => {
      ballBody.position.set(0, 15, 0);
      ballBody.velocity.set(0, 0, 0);
      ballBody.angularVelocity.set(0, 0, 0);
    }, 1000);
    })
    scene.add(obj)
  })
  let clock = new THREE.Clock();
const render = (time?: any) => {
   let delta = clock.getDelta();
    world.step(delta);
    if (ball && ballBody) {
      ball.position.copy(ballBody.position);
      ball.quaternion.copy(ballBody.quaternion);
    }
       renderer.render(scene, camera) 
       controls.update()
       requestAnimationFrame(render)
    }
   window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
   }) 
    render()
   containerRef.value.appendChild(renderer.domElement)
   let isClick = false;
window.addEventListener("click", () => {
  if (isClick) return;
  isClick = true;
  ballBody.applyForce(
    new CANNON.Vec3(
      -10 * percentage.value,
      6 * percentage.value,
      (Math.random() - 0.5) * percentage.value
    ),
    ballBody.position
  );
  setTimeout(() => {
    isClick = false;
    ballBody.position.set(0, 15, 0);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
  }, 3000);
});
  
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
h2 {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  color: #fff;
}
</style>