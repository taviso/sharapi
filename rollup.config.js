import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript'

export default [{
    input: {
        include: ['src/*.ts'],
        exclude: ['**/*.d.ts']
    },
    output: {
        file: 'dist/sharapi.js',
        format: 'system'
    },
    plugins: [
        multi(),
        typescript()
    ],
    context: 'global',
}]