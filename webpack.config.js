const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'production',
    entry: './js_sequencer.js', // 入力元のファイル名(エントリポイント)
    output: {
        filename: 'bundle.js' // 出力先のファイル名
    },
    resolve: {
        alias: {
            // Tone
            'tone': path.join(__dirname, 'node_modules/tone/build/Tone.js'),
            // トラックボール
            'three/TrackballControls': path.join(__dirname, 'node_modules/three/examples/js/controls/TrackballControls.js'),
            // 物体ドラッグ
            'three/DragControls': path.join(__dirname, 'node_modules/three/examples/js/controls/DragControls.js'),
            //// カメラ制御
            //'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            'THREE': 'three/build/three.js'
        }),
        new webpack.ProvidePlugin({
            'Tone': 'tone/build/Tone.js'
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: true,
                output: {
                    comments: false,
                    beautify: false
                }
            }
        })]
    }
}
