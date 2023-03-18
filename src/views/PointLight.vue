<template>
    <div>
     
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import * as dat from 'dat.gui';




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

 
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);

    const plane = new THREE.Mesh(planeGeometry, cubeMeterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true
    scene.add(plane);


    const point = new THREE.PointLight(0xffbfa,1)
    //设置点光源位置，改变光源的位置
    point.position.set(2, 2, 2)
    scene.add(point)
    const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({color: 0xff000}))
    smallBall.position.set(2, 2, 2)
    scene.add(smallBall)
    smallBall.add(point)
    gui.add(point.position, "x").min(-10).max(10).step(0.01)
    gui.add(point, "distance").min(0).max(5).step(0.01)
    gui.add(point, "decay").min(0).max(5).step(0.01)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add(axesHelper);
    const clock = new THREE.Clock()
    function render(time?: any) {
        let times = clock.getElapsedTime()
        smallBall.position.x = Math.sin(times) * 3
        smallBall.position.z = Math.cos(times) * 3
        smallBall.position.y = 2 + Math.sin(times * 5)
        controls.update() 
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
    render()
  
}) 

</script>