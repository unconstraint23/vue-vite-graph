<template>
    <div ref="containerRef">
     
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import * as dat from 'dat.gui';
const containerRef = ref<any>(null)
const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
    
const render = (time?: any) => {
        
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }

onMounted(() => {
    


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

 
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);

    const plane = new THREE.Mesh(planeGeometry, cubeMeterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true
    scene.add(plane);

    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(axesHelper);
    
    
    render()
  
}) 

</script>