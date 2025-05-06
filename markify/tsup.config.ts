import * as process from 'node:process'
import * as path from 'node:path'
import { dirname } from 'node:path'
import { Buffer } from 'node:buffer'
import { defineConfig } from 'tsup'
import { resolve } from 'path'
import swc, { JscConfig } from '@swc/core'
import type { JscTarget } from '@swc/types'

import tsConfig from './tsconfig.json'

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  shims: true,
  plugins: [
    {
      name: 'override-swc',
      esbuildOptions: (options) => {
        const plugin = options.plugins?.find((p) => p.name === 'swc')
        if (plugin) {
          // Original Source:
          // https://github.com/egoist/tsup/blob/49c11c3073ce977a01c84e7848fc070d5de0a652/src/esbuild/swc.ts#L14-L67
          // Reason: tsup does not provide a way to modify 'jsc' config
          plugin.setup = (build) => {
            // Force esbuild to keep class names as well
            build.initialOptions.keepNames = true

            build.onLoad({ filter: /\.[jt]sx?$/ }, async (args: any) => {
              const isTs = /\.tsx?$/.test(args.path)

              const jsc: JscConfig = {
                parser: {
                  syntax: isTs ? 'typescript' : 'ecmascript',
                  decorators: true,
                },
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                },
                baseUrl: path.resolve(dirname.toString(), tsConfig.compilerOptions.baseUrl || '.'),  // this was missing
                paths: tsConfig.compilerOptions.paths,  // this was missing
                keepClassNames: true,
                target: (tsConfig.compilerOptions.target || 'es2022').toLowerCase() as JscTarget,
              }

              const result = await swc.transformFile(args.path, {
                jsc,
                sourceMaps: true,
                configFile: false,
                swcrc: false,
              })

              let code = result.code
              if (result.map) {
                const map: { sources: string[] } = JSON.parse(result.map)
                // Make sure sources are relative path
                map.sources = map.sources.map((source) => {
                  return path.isAbsolute(source)
                    ? path.relative(path.dirname(args.path), source)
                    : source
                })
                code += `//# sourceMappingURL=data:application/json;base64,${Buffer.from(
                  JSON.stringify(map),
                ).toString('base64')}`
              }
              return {
                contents: code,
              }
            })
          }
        }
      },
    },
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '/* markify - https://github.com/thiagobarbosa/markify-ts */',
    }

    // Configure path aliases for esbuild
    options.alias = {
      '@': resolve(process.cwd())
    }
  },
  outDir: 'dist',
})