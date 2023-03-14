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
/**
 * 设置一个物体的材质纹理的时候，如设置灰度属性，属性值都是名字+map
 */
onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
    // 添加物体
    // 创建几何体
    const textureLoader = new THREE.TextureLoader()
    const blockTexture = textureLoader.load(block)
    const displacementTexture = textureLoader.load(displacement)
    const waterBgTexture = textureLoader.load(waterBg)
    const spaceBgTexture = textureLoader.load(space)
    // blockTexture.offset.x = 0.5
    // blockTexture.offset.y = 0.5
    displacementTexture.repeat.set(2,3)
    displacementTexture.wrapT = THREE.MirroredRepeatWrapping
    displacementTexture.wrapS = THREE.RepeatWrapping
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 200, 200)
    // const cubeMeterial = new THREE.MeshBasicMaterial({
    //   map: waterBgTexture,
    //   alphaMap: blockTexture,
    // aoMap: displacementTexture,
    // aoMapIntensity: 0.6,
    //  color: "#ff0",
    //  transparent: true,
    //     // metalness: 1, //金属光泽
    // //   roughness: 1,
    //   side: THREE.DoubleSide 
    // })
    // 标准材质
    const cubeMeterial = new THREE.MeshStandardMaterial({
      map: blockTexture,
    aoMap: displacementTexture,
        displacementMap: spaceBgTexture,
        displacementScale: 0.1,
        // metalness: 1, //金属光泽
      roughness: 1,
      side: THREE.DoubleSide 
    })

    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMeterial)
    console.log(cube)
    scene.add(cube)
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);

const plane = new THREE.Mesh(planeGeometry, cubeMeterial);
plane.position.set(2, 0, 0);

scene.add(plane);

// 给平面设置第二组UV
planeGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

    
    // 灯光
// const light = new THREE.AmbientLight(0xffffff);
// scene.add(light);

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