
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        emptyOutDir: true,
        optimizeDeps: {
            exclude: ['cesium']
        },
        lib: {
            formats: ['es', 'umd','iife'],
            entry: resolve(__dirname,'./src/cesium-sensor-volumes.js'),
            name: 'CesiumSensorVolumesEs'
        },
        rollupOptions: {
            external: ['cesium'],
            output: {
                globals: {
                    cesium: 'Cesium'
                }
            }
        }
    }
});