// import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'

export default {
    plugins:
    [
        // restart({ restart: [ '../public/**', ] }), // Restart server on static file change
        glsl() // Handle shader files
    ]
}