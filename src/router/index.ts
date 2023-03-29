import {createRouter,createWebHashHistory} from 'vue-router'
const routes = [
    {
        path: '/pixi',
      
         component: () => import("../views/Pixi.vue"),
       
    },
    {
        path: '/game',
      
         component: () => import("../views/Game.vue"),
        
    },
    {
        path: '/three1',
      
         component: () => import("../views/Three1.vue"),
        
    },
    {
        path: '/meshStand',
      
         component: () => import("../views/MeshStand.vue"),
        
    },
    {
        path: '/sphere',
      
         component: () => import("../views/Sphere.vue"),
        
    },
    {
        path: '/sphereShadow',
      
         component: () => import("../views/SphereShadow.vue"),
        
    },
    {
        path: '/point',
      
         component: () => import("../views/PointLight.vue"),
        
    },
    {
        path: '/living',
      
         component: () => import("../views/Living3D.vue"),
        
    },
    {
        path: '/island',
      
         component: () => import("../views/Islands.vue"),
        
    },
    {
        path: '/diamand',
      
         component: () => import("../views/Diamand.vue"),
        
    },
    {
        path: '/bmw',
      
         component: () => import("../views/Bmw.vue"),
        
    },
    {
        path: '/christmas',
      
         component: () => import("../views/Christmas.vue"),
        
    },
    {
        path: '/robot',
      
         component: () => import("../views/Robot.vue"),
        
    },
    {
        path: '/earth',
      
         component: () => import("../views/Earth.vue"),
        
    },
    {
        path: '/football',
      
         component: () => import("../views/FootBall.vue"),
        
    },
    {
        path: '/missile',
      
         component: () => import("../views/Missile.vue"),
        
    },
    {
        path: '/pic',
      
         component: () => import("../views/Picture.vue"),
        
    },
    { path: '/', redirect: '/pixi' }

]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
export default router

