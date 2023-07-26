<template>
    <div ref="containerRef">

    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { onMounted, ref } from "vue";

    const containerRef = ref()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  
  const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/src/assets/particles/1.png");

// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

// 示例代码
// const vertices = [];

// for ( let i = 0; i < 10000; i ++ ) {

// 	const x = THREE.MathUtils.randFloatSpread( 2000 );
// 	const y = THREE.MathUtils.randFloatSpread( 2000 );
// 	const z = THREE.MathUtils.randFloatSpread( 2000 );

// 	vertices.push( x, y, z );

// }

// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ) );

// const material = new THREE.PointsMaterial( { 
//   color: 0x888888,
//   // sizeAttenuation: true,
//   //   depthWrite: false,
//     size: 1,
//     map: particlesTexture,
//     alphaMap: particlesTexture,
//     // vertexColors: true,
// } );

// const points = new THREE.Points( geometry, material );

// scene.add( points );

const params = {
  count: 10000,
  size: 0.1,
  radius: 5,
  branch: 3,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);
const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  //   随机生成位置和
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    //   当前的点应该在哪一条分支的角度上
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);

    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3;

    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    // const randomX = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;
    // const randomY = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;
    // const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;

    positions[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positions[current + 1] = 0 + randomY;
    positions[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    // 混合颜色，形成渐变色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);

    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //   设置点材质
  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color),
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,

    map: particlesTexture,
    alphaMap: particlesTexture,
 
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();






const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
directionalLight.shadow.mapSize.set(4096, 4096);

// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;


scene.add(directionalLight);
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
  const render = () => {
      renderer.render(scene, camera);
    controls.update()
  requestAnimationFrame(render);
}
  onMounted(() => {
    containerRef.value.appendChild(renderer.domElement)
        render()
  })
</script>

<style scoped>

</style>