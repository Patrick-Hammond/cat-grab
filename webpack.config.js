const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const AssetsWebpackPlugin = require('../logic-incubator/packages/lib/scripts/assets/webpack-plugin');

// logic-incubator's lib package is compiled from source, straight out of its checkout
// beside this one - the same folder tsconfig.json's "@logic-incubator/lib/*" path points at.
const LOGIC_INCUBATOR = path.resolve(__dirname, '../logic-incubator/packages');
const NODE_MODULES = path.resolve(__dirname, 'node_modules');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const outputPath = path.resolve(__dirname, 'dist');

  return {
    context: __dirname,
    entry: './src/main.ts',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    target: ['web', 'es5'],
    devServer: {
      static: false,
      hot: true,
      port: 4200,
      open: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Cat Grab',
        template: path.join(LOGIC_INCUBATOR, 'lib/html/index.template')
      }),
      // Builds the asset bundles (see assets.config.json) before each compile - and when art changes, under the dev server.
      new AssetsWebpackPlugin({ configPath: path.resolve(__dirname, 'assets.config.json') }),
      new CopyWebpackPlugin({
        patterns: [
          // What the asset build produced: manifest.json and the bundles' atlases and fonts.
          { from: path.resolve(__dirname, '.assets/public'), to: 'assets' },
          { from: path.join(LOGIC_INCUBATOR, 'lib/html/index.styles.css'), to: 'index.styles.css' }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          // logic-incubator's source resolves its packages from this project's node_modules,
          // not its own: a second copy of pixi.js in the bundle breaks the renderer.
          include: LOGIC_INCUBATOR,
          resolve: { modules: [NODE_MODULES] }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          type: 'asset/resource'
        },
        {
          test: /\.(vert|frag)$/,
          type: 'asset/source'
        }
      ]
    },
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, 'tsconfig.json') })
      ],
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map[query]',
      path: outputPath,
      // Relative, like AssetPath, so the build runs from whatever path it's hosted under.
      publicPath: 'auto',
      clean: true
    },
    // This is a canvas game; a large single bundle is expected.
    performance: { hints: false }
  };
};
