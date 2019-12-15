window.addEventListener('DOMContentLoaded', init);

function init()
{
    const width = 960;
    const height = 540;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#sequencer')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // Create scene
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2);
    camera.position.set(500, 500, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create Tile
    const tile_material = new THREE.MeshStandardMaterial({
        color: 0x2299ff,
        roughness: 0.1,
        metalness: 0.2
    });
    const tile_geometry = new THREE.BoxGeometry(45, 45, 45);

    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            const tile = new THREE.Mesh(tile_geometry, tile_material);
            tile.position.x = (i-10)*50;
            tile.position.y = 0;
            tile.position.z = (j-10)*50;
            scene.add(tile);
        }
    }

    const cube = new THREE.Mesh(tile_geometry, tile_material);
    cube.position.x = 0;
    cube.position.y = 50;
    cube.position.z = 0;
    scene.add(cube);

    // 平行光源
    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(500, 300, 500);
    scene.add(light);

    // 初回実行
    tick();

    function tick() {
        requestAnimationFrame(tick);

        // レンダリング
        renderer.render(scene, camera);
    }
}

