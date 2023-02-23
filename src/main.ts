import { createApp } from 'vue'
import "normalize.css";
import router from './router/index'
import App from './App.vue'

const app = createApp(App)
app.use(router).mount('#app')
