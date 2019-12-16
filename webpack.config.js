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
        // 使用したいコントロールやレンダラを定義しておきます。(下記は一例です。使用しないものは除いておいてよいです)
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
        // THREE.Scene などの形式で three.js のオブジェクトを使用できるようにします。
        new webpack.ProvidePlugin({
            'THREE': 'three/build/three'
        })
    ]
}
