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
import vertexShader from "../assets/missile/vertexShader.glsl";
import fragmentShader from '../assets/missile/fragmentShader.glsl'
import { SpriteMaterial } from 'three';
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
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = true;



onMounted(() => {
    

    // 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();


  
  
  
let mixer, dd: any, els, wkl, path, curvePath: THREE.CatmullRomCurve3;
// const dracoLoader = new DRACOLoader();
const loader = new GLTFLoader();

loader.load("/src/assets/missile/ew8.glb", (gltf) => {
  console.log(gltf);
  gltf.scene.traverse((child : any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  els = gltf.scene.children[0];
  path = gltf.scene.children[2] as any;
  // console.log(path);
  wkl = gltf.scene.children[1];
  dd = gltf.scene.children[3];
  scene.add(els, wkl, dd);

  // 根据点创建曲线
  const points = [];
  for (let i = path.geometry.attributes.position.count - 1; i >= 0; i--) {
    points.push(
      new THREE.Vector3(
        path.geometry.attributes.position.array[i * 3],
        path.geometry.attributes.position.array[i * 3 + 1],
        path.geometry.attributes.position.array[i * 3 + 2]
      )
    );
  }
  curvePath = new THREE.CatmullRomCurve3(points);
  // 设置载入的所有物体接收和投射阴影

  // 调用mixer控制动画
  // mixer = new THREE.AnimationMixer(dd);
  // const action = mixer.clipAction(gltf.animations[0]);
  // action.play();
});
  
    // 环境光;
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// 添加平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 10, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 添加另外一个平行光源
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// 创建平面添加到场景中
const planeGeometry = new THREE.PlaneGeometry(2, 2);
// 设置shader材质
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      // value: new THREE.Vector2(800, 800),
    },
    iTime: {
      value: 0,
    },
    iChannel0: {
      value: new THREE.TextureLoader().load("/src/assets/missile/ichannel0.png"),
    },
    iChannel1: {
      value: new THREE.TextureLoader().load("/src/assets/missile/ichannel1.png"),
    },
    iChannel2: {
      value: new THREE.TextureLoader().load("/src/assets/missile/ichannel2.png"),
    },
    iMouse: {
      value: new THREE.Vector2(0, 0),
    },
  },
  // vertexShader: vertexShader,
  // fragmentShader: fragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});

// 添加平面到场景
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
// 添加sprite
// 创建精灵材质
const params = {
  iTime: {
    value: 0,
  },
};

const spriteMaterial = new SpriteMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending,
});
spriteMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  };
  shader.uniforms.iTime = params.iTime;
  shader.uniforms.iChannel0 = {
    value: new THREE.TextureLoader().load("/src/assets/missile/ichannel0.png"),
  };
  shader.uniforms.iChannel1 = {
    value: new THREE.TextureLoader().load("/src/assets/missile/ichannel1.png"),
  };
  shader.uniforms.iChannel2 = {
    value: new THREE.TextureLoader().load("/src/assets/missile/ichannel2.png"),
  };
  shader.uniforms.iMouse = { value: new THREE.Vector2(0, 0) };
  console.log(shader.vertexShader);
  // shader.vertexShader = shader.vertexShader.replace(
  //   "#include <common>",
  //   `
  //   #include <common>
  //   varying vec2 vUv;
  //   `
  // );
  // shader.vertexShader = shader.vertexShader.replace(
  //   "#include <uv_vertex>",
  //   `
  //   #include <uv_vertex>
  //   vUv = uv;
  //   `
  // );
  // shader.fragmentShader = fragmentShader;
};
// const sprite = new THREE.Sprite(planeMaterial);
const sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(-5.5, 0.8, 0);
     
  renderer.setClearColor("#000");
  const clock = new THREE.Clock();

const render = () => {
  const delay = clock.getDelta();
  // 获取总共耗时
  const time = clock.getElapsedTime();
  let t = time % 5;
  t /= 5;
  // 通过curvePath获取曲线上的点
  if (curvePath) {
    const point = curvePath.getPointAt(t);

    // console.log(point);
    // 通过point设置模型dd位置
    // 获取点的切线
    const tangent = curvePath.getTangentAt(t);
    dd.position.set(point.x, point.y, point.z);
    // 设置模型的朝向
    if (t + 0.01 < 1) {
      const point1 = curvePath.getPointAt(t + 0.01);
      // console.log(point1);
      dd.lookAt(point1);
    }
    // oldPoint = point;

    // dd.lookAt(tangent);

    if (t > 0.95) {
      scene.add(sprite);
     
      
    }
  }
  params.iTime.value = t * 10;
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