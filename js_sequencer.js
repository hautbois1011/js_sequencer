import 'three/DragControls';
import 'three/TrackballControls';
import Tone from 'tone';

window.addEventListener('DOMContentLoaded', init);

const KIND = 4;
var BLOCK = 16;

//------------------------------------------------------------------

const synth0 = new Tone.MembraneSynth().toMaster();
const synth3 = new Tone.MetalSynth().toMaster();

function setLoop(synth, note_list, eventid_list)
{
    function playOneNote(time) {
        synth.triggerAttackRelease('32n', time);
    }

    for(let i = 0; i < note_list.length; i++) {
        if(eventid_list[i] != -1) {
            Tone.Transport.clear(eventid_list[i]);
            eventid_list[i] = -1;
        }
    }

    for(let i = 0; i < note_list.length; i++) {
        if(note_list[i] == 1 | note_list[i] == 3) {
            eventid_list[i] = Tone.Transport.schedule(playOneNote, i * Tone.Time('16n'));
        }
    }

    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = true;
}

//start/stop the transport
document.getElementById('play').addEventListener('click', e => {
    Tone.Transport.toggle();
});

// BPM changing
document.getElementById('bpm').addEventListener('change', e => {
    Tone.Transport.bpm.value = document.getElementById('bpm').value;
});

//-------------------------------------------------------------------

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
    camera.position.set(-400, 600, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create Tile
    const tile_list = new Array(KIND);
    for(let y = 0; y < KIND; y++)
    {
        tile_list[y] = new Array(BLOCK);
    }

    const eventid_list2 = new Array(KIND);
    for(let y = 0; y < KIND; y++)
    {
        eventid_list2[y] = new Array(BLOCK).fill(-1);
    }

    const tile_geometry = new THREE.BoxBufferGeometry(45, 45, 45);

    // note table:
    // 0: unselected & unlighted
    // 1: selected & unlighted
    // 2: unselected & lighted
    // 3: selected & lighted
    var note_table = new Array(KIND);
    for(let y = 0; y < KIND; y++)
    {
        note_table[y] = new Array(BLOCK).fill(0);
    }

    for(let i = 0; i < KIND; i++)
    {
        for(let j = 0; j < BLOCK; j++)
        {
            const tile_material = new THREE.MeshStandardMaterial({
                color: 0x0000ff
            });
            const tile = new THREE.Mesh(tile_geometry, tile_material);
            tile.position.x = (i-2)*50;
            tile.position.y = 0;
            tile.position.z = (j-8)*50;
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

    // Raycaster
    const raycaster = new THREE.Raycaster();

    // Trackball controls
    var trackball = new THREE.TrackballControls(camera, renderer.domElement);
    trackball.rotateSpeed = 1.0;
    trackball.zoomSpeed = 1.2;
    trackball.panSpeed = 0.8;

    // Event Registration
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    //----------------------------------------------------------------------------

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
            for(let i = 0; i < KIND; i++) {
                for(let j = 0; j < BLOCK; j++) {
                    if (tile_list[i][j] === intersects[0].object) {
                        if(note_table[i][j] == 0) {
                            note_table[i][j] = 1;
                        } else if(note_table[i][j] == 2) {
                            note_table[i][j] = 3;
                            // tile_list[i][j].material.color.setHex(0xff0000);
                        } else if(note_table[i][j] == 3) {
                            note_table[i][j] = 2;
                            // tile_list[i][j].material.color.setHex(0xdddddd);
                        } else {
                            note_table[i][j] = 0;
                            // tile_list[i][j].material.color.setHex(0x0000ff);
                        }
                    }
                }
            }
            setLoop(synth0, note_table[0], eventid_list2[0]);
            setLoop(synth3, note_table[3], eventid_list2[3]);
        }
    }

    function lighting(beat) {
        for(let i = 0; i < KIND; i++) {
            for(let j = 0; j < BLOCK; j++) {
                if(note_table[i][j] == 2) {
                    note_table[i][j] = 0;
                } else if(note_table[i][j] == 3) {
                    note_table[i][j] = 1;
                }
            }
        }

        for(let i = 0; i < KIND; i++) {
            if(note_table[i][beat] == 1) {
                note_table[i][beat] = 3;
            } else if(note_table[i][beat] == 0) {
                note_table[i][beat] = 2;
            }
        }

        // note_table.map(li => {console.log(li)});
    }

    var count = 0;
    function lightingSequence() {
        lighting(count);
        count++;
        if(count == BLOCK)
            count = 0;
    }

    // Updating every tick
    var tick_count = 0;
    function tick() {
        tick_count++;
        if(tick_count == 30) {
            tick_count = 0;
            lightingSequence();
        }

        // raycast
        raycaster.setFromCamera(mouse, camera);
        var flatten = tile_list.flat();
        const intersects = raycaster.intersectObjects(flatten);
        if(intersects.length > 0) {
            for(let i = 0; i < KIND; i++) {
                for(let j = 0; j < BLOCK; j++) {
                    if ((note_table[i][j] == 0 | note_table[i][j] == 2)
                            & tile_list[i][j] === intersects[0].object) {
                        tile_list[i][j].material.color.setHex(0x777700);
                    } else {
                        if(note_table[i][j] == 0) {
                            tile_list[i][j].material.color.setHex(0x0000ff);
                        } else if(note_table[i][j] == 1) {
                            tile_list[i][j].material.color.setHex(0xffff00);
                        } else if(note_table[i][j] == 2) {
                            tile_list[i][j].material.color.setHex(0xdddddd);
                        } else if(note_table[i][j] == 3) {
                            tile_list[i][j].material.color.setHex(0xff0000);
                        }
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

    tick();
}

