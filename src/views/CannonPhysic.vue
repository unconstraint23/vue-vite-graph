<template>
    <div ref="containerRef">

    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { onMounted, ref } from "vue";
import * as CANNON from "cannon-es";

    const containerRef = ref()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 300)
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({antialias: true,logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = false;
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff
});

const spherGeometry = new THREE.SphereGeometry(1, 20, 20)
    // 标准材质
    const cubeMeterial = new THREE.MeshStandardMaterial()

    // 根据几何体和材质创建物体
    const sphere = new THREE.Mesh(spherGeometry, cubeMeterial)
    sphere.castShadow = true
    scene.add(sphere)

  const planeGeometry = new THREE.PlaneGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -5, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
plane.castShadow = true;
scene.add(plane)



// // 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true
// 阴影贴图模糊度
directionalLight.shadow.radius = 20
// 设置阴影贴图的分辨率
directionalLight.shadow.mapSize.set(4096,4096)

// 设置平行光投射相机的属性
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
// directionalLight.shadow.camera.top = 5
// directionalLight.shadow.camera.bottom = -5
// directionalLight.shadow.camera.left = -5
// directionalLight.shadow.camera.right = -5

scene.add(directionalLight);


// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);

// 创建物理小球形状
const sphereShape = new CANNON.Sphere(1);

//设置物体材质
const sphereWorldMaterial = new CANNON.Material("sphere");

// 创建物理世界的物体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  //   小球质量
  mass: 1,
  //   物体材质
  material: sphereWorldMaterial,
});

// 将物体添加至物理世界
world.addBody(sphereBody);

const clock = new THREE.Clock()

  const render = () => {
      let deltaTime = clock.getDelta();         
      world.step(1 / 120, deltaTime)
      sphere.position.copy(sphereBody.position)
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