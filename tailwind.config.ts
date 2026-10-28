import type { Config } from 'tailwindcss';
export default { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { farm: { 50: '#f2f8ec', 100: '#e1efcf', 500: '#5a8e35', 600: '#467329', 700: '#355820', 900: '#1e351a' } } } }, plugins: [] } satisfies Config;
