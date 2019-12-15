window.addEventListener('DOMContentLoaded', init);

function init()
{
    const width = 960;
    const height = 540;
    
    const mouse = new THREE.Vector2();

    const canvas = document.querySelector('#sequencer');

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // Create scene
    const scene = new THREE.Scene();

    // Create camera 
    const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2);
    camera.position.set(500, 500, 700);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create Tile
    const tile_list = [];
    const tile_geometry = new THREE.BoxBufferGeometry(45, 25, 45);

    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            const tile_material = new THREE.MeshStandardMaterial({
                color: 0x2299ff
            });
            const tile = new THREE.Mesh(tile_geometry, tile_material);
            tile.position.x = (i-10)*50;
            tile.position.y = 0;
            tile.position.z = (j-10)*50;
            scene.add(tile);

            tile_list.push(tile);
        }
    }

    const cube_material = new THREE.MeshStandardMaterial({
        color: 0x2299ff
    });
    const cube = new THREE.Mesh(tile_geometry, cube_material);
    cube.position.x = 0;
    cube.position.y = 30;
    cube.position.z = 0;
    scene.add(cube);

    // 平行光源
    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(500, 300, 500);
    scene.add(light);

    const raycaster = new THREE.Raycaster();

    canvas.addEventListener('mousemove', handleMouseMove);

    // 初回実行
    tick();

    function handleMouseMove()
    {
        const element = event.currentTarget;

        // position of mouse on canvas
        const x = event.clientX - element.offsetLeft;
        const y = event.clientY - element.offsetTop;
        // width and height of canvas
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        // position of mouse ([-1, 1])
        mouse.x = (x / w) * 2 - 1;
        mouse.y = -(y / h) * 2 + 1;
	}

    function tick() {
        // raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(tile_list);
        tile_list.map((mesh) => {
            if (intersects.length > 0 && mesh === intersects[0].object) {
                // make yellow 
                mesh.material.color.setHex(0xffff00);
            } else {
                // default color
                mesh.material.color.setHex(0x2299ff);
            }
        });

        // rendering
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

