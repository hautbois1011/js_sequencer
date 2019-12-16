const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, initAudioContext);
function initAudioContext(){
  document.removeEventListener(eventName, initAudioContext);
  // wake up AudioContext
  ctx.resume();
}

import 'three/DragControls';
import 'three/TrackballControls';
import './toneblock.js';

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
    camera.position.set(500, 700, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create Tile
    const tile_list = [];
    const tile_geometry = new THREE.BoxBufferGeometry(45, 45, 45);

    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            const tile_material = new THREE.MeshStandardMaterial({
                color: 0x0000ff
            });
            const tile = new THREE.Mesh(tile_geometry, tile_material);
            tile.position.x = (i-10)*50;
            tile.position.y = 0;
            tile.position.z = (j-10)*50;
            scene.add(tile);

            tile_list.push(tile);
        }
    }

    // test cube
    var cubes = [];
    const cube_material = new THREE.MeshStandardMaterial({
        color: 0xff0000
    });
    const cube = new THREE.Mesh(tile_geometry, cube_material);
    cube.position.x = 0;
    cube.position.y = 30;
    cube.position.z = 0;
    scene.add(cube);
    cubes.push(cube);

    // Ambient Light
    const ambi_light = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambi_light);

    // 平行光源
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 700, 0);
    scene.add(light);

    const raycaster = new THREE.Raycaster();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    // Drag controls
    // var controls = new THREE.DragControls(cubes, camera, renderer.domElement);
    // controls.addEventListener('drag', onCubeDrag);
    // controls.addEventListener('dragstart', onCubeDrugStart);
    // controls.addEventListener('dragend', onCubeDragEnd);

    // Trackball controls]
    var trackball = new THREE.TrackballControls(camera, renderer.domElement);
    trackball.rotateSpeed = 1.0;
    trackball.zoomSpeed = 1.2;
    trackball.panSpeed = 0.8;

    tick();

    function handleMouseMove()
    {
        var element = event.currentTarget;

        // position of mouse on canvas
        var mouse_x = event.clientX - element.offsetLeft;
        var mouse_y = event.clientY - element.offsetTop;
        // width and height of canvas
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        // position of mouse ([-1, 1])
        mouse.x = (mouse_x / w) * 2 - 1;
        mouse.y = -(mouse_y / h) * 2 + 1;
	}

    function handleMouseDown()
    {
    }

    // function onCubeDrag(event)
    // {
    //     event.object.position.y = 30;
    // }
    //
    // function onCubeDrugStart(event)
    // {
    //     event.object.material.emissive.set(0xaaaaaa);
    //     // position of mouse on canvas
    //     event.object.position.x = mouse_x;
    //     event.object.position.z = mouse_y;
    // }
    //
    // function onCubeDragEnd(event)
    // {
    //     event.object.material.emissive.set(0x000000);
    //
    //     var orig_x = event.object.position.x;
    //     var orig_z = event.object.position.z;
    //     event.object.position.x = Math.round(orig_x/50) * 50;
    //     event.object.position.z = Math.round(orig_z/50) * 50;
    // }

    function tick() {
        // raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(tile_list);
        tile_list.map((mesh) => {
            if (intersects.length > 0 && mesh === intersects[0].object) {
                // make yellow 
                mesh.material.color.setHex(0xaaaa00);
            } else {
                // default color
                mesh.material.color.setHex(0x0000ff);
            }
        });

        // Trackball
        trackball.update();

        // rendering
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

