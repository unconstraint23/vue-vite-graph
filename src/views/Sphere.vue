<template>
    <div>
     
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import block from '../assets/block.jpg'
import waterBg from '../assets/water-bg.jpg'
import displacement from '../assets/displacement.png'
import space from '../assets/space-textrue.jpeg'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
/**
 * 设置一个物体的材质纹理的时候，如设置灰度属性，属性值都是名字+map
 */
onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
    const cubeTextrueLoader = new THREE.CubeTextureLoader()
    // 贴图必须宽高相等
    const envMapTextrue = cubeTextrueLoader.setPath("./src/").load(["assets/space-textrue.jpeg","assets/space-textrue.jpeg","assets/space-textrue.jpeg","assets/space-textrue.jpeg","assets/space-textrue.jpeg","assets/space-textrue.jpeg"])
    // blockTexture.offset.x = 0.5
    // blockTexture.offset.y = 0.5
   
    const spherGeometry = new THREE.SphereGeometry(1, 20, 20)
    // 标准材质
    const cubeMeterial = new THREE.MeshStandardMaterial({
      envMap: envMapTextrue,
        metalness: 0.8, //金属光泽
      roughness: 0.1,
    })

    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(spherGeometry, cubeMeterial)
    const rbgeLoader = new RGBELoader()
    rbgeLoader.loadAsync("./src/assets/snow.hdr").then(textrue => {
        textrue.mapping = THREE.EquirectangularReflectionMapping
        scene.background = textrue
    })
    scene.add(cube)
    // scene.background = envMapTextrue
    scene.environment = envMapTextrue
//     const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);

// const plane = new THREE.Mesh(planeGeometry, cubeMeterial);
// plane.position.set(2, 0, 0);

// scene.add(plane);

// // 给平面设置第二组UV
// planeGeometry.setAttribute(
//     "uv2",
//     new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
// );

    
    // 灯光
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

// const point = new THREE.PointLight(0xffffff)
// //设置点光源位置，改变光源的位置
// point.position.set(400, 200, 300)
// scene.add(point)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
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