const webpack = require('webpack');
const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: './js_sequencer.js', // 入力元のファイル名(エントリポイント)
    output: {
        filename: 'bundle.js' // 出力先のファイル名
    },
    resolve: {
        alias: {
            // トラックボール
            'three/TrackballControls': path.join(__dirname, 'node_modules/three/examples/js/controls/TrackballControls.js'),
            // 物体ドラッグ
            'three/DragControls': path.join(__dirname, 'node_modules/three/examples/js/controls/DragControls.js'),
            //// カメラ制御
            //'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'THREE': 'three/build/three'
        })
    ]
}
