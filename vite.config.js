import { defineConfig } from "vite"
import {resolve} from 'path'


export default defineConfig({

    build: {
        emptyOutDir: true,
        lib: {
            formats: ['cjs','es','umd','iife'],
            entry: resolve(__dirname,'src/cesium-sensor-volumes.js'),
            name: 'CesiumSensorVolumes',
            fileName: 'cesium-sensor-volumes'
        },
        rollupOptions: {
            external: ['cesium'],
            output: {
                globals: {
                    cesium: 'Cesium'
                }
            }
        },
        minify: true
    }
})
