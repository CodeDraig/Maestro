import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const rendererRoot = join(projectRoot, 'src', 'renderer');
const appVersion = process.env.VITE_APP_VERSION || process.env.npm_package_version || 'development';
const commitHash =
	process.env.VITE_COMMIT_HASH ||
	(process.env.VITE_APP_VERSION || '').match(/\b[0-9a-f]{8}\b/i)?.[0] ||
	'';
const crashReportingBuild = existsSync(join(projectRoot, 'dist', 'build-provenance.json'));
const requestedPort = Number.parseInt(process.env.VITE_PORT || '', 10);

export default defineConfig({
	root: rendererRoot,
	base: './',
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(appVersion),
		__COMMIT_HASH__: JSON.stringify(commitHash),
		__CRASH_REPORTING_BUILD__: JSON.stringify(crashReportingBuild),
	},
	server: {
		host: '127.0.0.1',
		port: Number.isFinite(requestedPort) ? requestedPort : 17173,
		strictPort: true,
	},
	cacheDir: join(projectRoot, 'node_modules', '.vite'),
	build: {
		outDir: join(projectRoot, 'dist', 'renderer'),
		emptyOutDir: true,
	},
});
