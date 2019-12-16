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
    camera.position.set(500, 700, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create Tile
    const tile_list = new Array(16);
    for(let y = 0; y < 16; y++)
    {
        tile_list[y] = new Array(4).fill(null);
    }

    const tile_geometry = new THREE.BoxBufferGeometry(45, 45, 45);

    var note_table = new Array(16);
    for(let y = 0; y < 16; y++)
    {
        note_table[y] = new Array(4).fill(false);
    }

    for(let i = 0; i < 16; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            const tile_material = new THREE.MeshStandardMaterial({
                color: 0x0000ff
            });
            const tile = new THREE.Mesh(tile_geometry, tile_material);
            tile.position.x = (i-8)*50;
            tile.position.y = 0;
            tile.position.z = (j-2)*50;
            scene.add(tile);

            tile_list[i][j] = tile;
        }
    }

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
        // raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(tile_list.flat());
        if(intersects.length > 0) {
            for(let i = 0; i < 16; i++) {
                for(let j = 0; j < 4; j++) {
                    if (tile_list[i][j] === intersects[0].object) {
                        if(note_table[i][j] == false) {
                            note_table[i][j] = true;
                            tile_list[i][j].material.color.setHex(0xffff00);
                        } else {
                            note_table[i][j] = false;
                            tile_list[i][j].material.color.setHex(0x0000ff)
                        }
                    }
                }
            }
        }
    }

    function tick() {
        // raycast
        raycaster.setFromCamera(mouse, camera);
        var flatten = tile_list.flat();
        const intersects = raycaster.intersectObjects(flatten);
        if(intersects.length > 0) {
            for(let i = 0; i < 16; i++) {
                for(let j = 0; j < 4; j++) {
                    if(note_table[i][j] == true)
                        continue;

                    if (tile_list[i][j] === intersects[0].object) {
                        // make yellow 
                        tile_list[i][j].material.color.setHex(0x777700);
                    } else {
                        // default color
                        tile_list[i][j].material.color.setHex(0x0000ff);
                    }
                }
            }
        }

        // Trackball
        trackball.update();

        // rendering
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

