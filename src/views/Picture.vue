<template>
  <div ref="containerRef">

  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { onMounted, ref } from "vue";
    const containerRef = ref()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
// 设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
    // 添加控制器
//   const controls = new OrbitControls(camera, renderer.domElement);

  // 设置控制器阻尼
//   controls.enableDamping = true;
//   controls.autoRotateSpeed = 0.5;
//   controls.autoRotate = false;

  // 加载纹理
const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("/assets/cat.jpg");
// const depthTexture = textureLoader.load("/assets/cat_depth.jpg");

const texture = textureLoader.load("/src/assets/picture/build.jpg");
const depthTexture = textureLoader.load("/src/assets/picture/build_depth.jpg");
    // 创建平面
    const geometry = new THREE.PlaneGeometry(19.2, 12);
// const material = new THREE.MeshBasicMaterial({ map: texture });
// 鼠标坐标
const mouse = new THREE.Vector2();

// 着色器材质
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: texture },
    uDepthTexture: { value: depthTexture },
    uMouse: { value: mouse },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec4 color = texture2D(uTexture, vUv);
      vec4 depth = texture2D(uDepthTexture, vUv);
      float depthValue = depth.r;
      float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
      float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
      vec4 newColor = texture2D(uTexture, vec2(x, y));
      gl_FragColor = newColor;
    }
  `,
});
const render = () => {
    material.uniforms.uMouse.value = mouse;
  material.uniforms.uTime.value = performance.now() / 1000;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
    onMounted(() => {
    

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
        containerRef.value.appendChild(renderer.domElement)
        render()
    })
</script>

<style>

</style>