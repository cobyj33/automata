import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    // eslint-disable-next-line no-use-before-define
    appType: "spa",
    base: "/automata/",
    build: {
        sourcemap: true
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
        reporter: ['text', 'html'],
        exclude: [
            'node_modules/',
            'src/setupTests.ts',
        ]
        }
    },
});
