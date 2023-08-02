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



 


  const planeGeometry = new THREE.PlaneGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -10, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
plane.castShadow = true;
scene.add(plane)

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);

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
// 物理世界创建地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// 当质量为0的时候，可以使得物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
// 地面位置
floorBody.position.set(0, -10, 0);
// 旋转地面的位置
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);


const clock = new THREE.Clock()

const cubeArr = [];
//设置物体材质
const cubeWorldMaterial = new CANNON.Material("cube");

function createCube() {
  // 创建立方体和平面
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);
  // 创建物理cube形状
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  // 创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    //   小球质量
    mass: 1,
    //   物体材质
    material: cubeWorldMaterial,
  });
  cubeBody.applyLocalForce(
    new CANNON.Vec3(100, 0, 0), //添加的力的大小和方向
    new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
  );

  // 将物体添加至物理世界
  world.addBody(cubeBody);
  // 添加监听碰撞事件
  // function HitEvent(e) {
  //   // 获取碰撞的强度
  //     console.log("hit", e);
  //   const impactStrength = e.contact.getImpactVelocityAlongNormal();
  //   console.log(impactStrength);
   
  // }
  // cubeBody.addEventListener("collide", HitEvent);
  cubeArr.push({
    mesh: cube,
    body: cubeBody,
  });
}

setInterval(() => {
    createCube()
}, 1000);

  const render = () => {
      let deltaTime = clock.getDelta();         
      world.step(1 / 120, deltaTime)
      // sphere.position.copy(sphereBody.position)
      cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position);
    // 设置渲染的物体跟随物理的物体旋转
    item.mesh.quaternion.copy(item.body.quaternion);
  });
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