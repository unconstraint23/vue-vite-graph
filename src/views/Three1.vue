<template>
    <div>

    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
    })
    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染尺寸的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
    function render(time?: any) {
        
        let t = ((time ?? 0) / 1000) % 5
        cube.position.x = t
        
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
    render()
}) 

</script>