import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// vercel.json rewrites /faq to /faq.html in production; this does the same
// locally so the footer link behaves identically in dev, preview and prod
function extensionlessPages(routes) {
    const middleware = (req, _res, next) => {
        const path = req.url.split('?')[0]
        if (routes[path]) req.url = routes[path] + req.url.slice(path.length)
        next()
    }
    return {
        name: 'extensionless-pages',
        configureServer(server) { server.middlewares.use(middleware) },
        configurePreviewServer(server) { server.middlewares.use(middleware) },
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), extensionlessPages({ '/faq': '/faq.html' })],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                faq: resolve(__dirname, 'faq.html'),
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/.vs/**'],
        },
    },
})
