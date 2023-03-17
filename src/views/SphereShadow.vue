<template>
    <div>
     
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import * as dat from 'dat.gui';


/**
 * 灯光阴影： 
 * 1、材质要满足能够对光照有反应
 * 2、设置渲染器开启阴影计算  renderer.shadowMap.enabled = true
 * 3、设置光照投射阴影  directionalLight.castShadow = true
 * 4、设置物体投射阴影  sphere.castShadow = true
 * 5、设置物体接受阴影  plane.receiveShadow = true
 * 
 */
onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
    const gui = new dat.GUI();

    // 贴图必须宽高相等
    
    // blockTexture.offset.x = 0.5
    // blockTexture.offset.y = 0.5
   
    const spherGeometry = new THREE.SphereGeometry(1, 20, 20)
    // 标准材质
    const cubeMeterial = new THREE.MeshStandardMaterial()

    // 根据几何体和材质创建物体
    const sphere = new THREE.Mesh(spherGeometry, cubeMeterial)
    sphere.castShadow = true
    scene.add(sphere)

    // scene.background = envMapTextrue
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);

const plane = new THREE.Mesh(planeGeometry, cubeMeterial);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane);

// // 给平面设置第二组UV
// planeGeometry.setAttribute(
//     "uv2",
//     new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
// );

    
    // 灯光
// const light = new THREE.AmbientLight(0xffffff);
// scene.add(light);

// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const helper = new THREE.DirectionalLightHelper(directionalLight, 5 );
directionalLight.position.set(5, 5, 5);
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
scene.add(helper)
gui.add(directionalLight.shadow.camera, "near").min(0).max(10).step(0.1).onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
})
// const point = new THREE.PointLight(0xffffff)
// //设置点光源位置，改变光源的位置
// point.position.set(400, 200, 300)
// scene.add(point)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(axesHelper);
    function render(time?: any) {
        
        // let t = ((time ?? 0) / 1000) % 5
        // cube.position.x = t
        
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
    render()
  
}) 

</script>