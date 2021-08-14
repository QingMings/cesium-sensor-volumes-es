
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        emptyOutDir: true,
        optimizeDeps: {
            exclude: ['cesium']
        },
        lib: {
            formats: ['es', 'umd'],
            entry: resolve(__dirname,'./lib/cesium-sensor-volumes.js'),
            name: 'cesium-sensor-volumes'
        },
        rollupOptions: {
            external: ['cesium']
        }
    }
});