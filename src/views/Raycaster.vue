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
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  
  const textureLoader = new THREE.TextureLoader();
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});
// 1000立方体
let cubeArr = [];
for (let i = -5; i < 5; i++) {
  for (let j = -5; j < 5; j++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i, j, z);
      scene.add(cube);
      cubeArr.push(cube);
    }
  }
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

// 监听鼠标的位置
window.addEventListener("click", (event) => {
  //   console.log(event);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  let result = raycaster.intersectObjects(cubeArr);
  //   console.log(result);
  //   result[0].object.material = redMaterial;
  result.forEach((item) => {
    item.object.material = redMaterial;
  });
});


// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟

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