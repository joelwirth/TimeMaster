import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const normalizeBasePath = (rawBasePath) => {
    if (!rawBasePath || rawBasePath === '/') {
        return '/';
    }

    const trimmed = rawBasePath.replace(/^\/+|\/+$/g, '');

    return trimmed.length ? `/${trimmed}/` : '/';
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const basePath = normalizeBasePath(env.APP_BASE_PATH);

    const outDir = basePath === '/'
        ? 'public/build'
        : `public${basePath}build`;

    return {
        base: basePath,
        build: {
            outDir,
            emptyOutDir: true,
            manifest: true,
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
