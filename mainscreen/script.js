

var canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var bottomBoard;
var textureBottomBoard;
var messageText;
var messageBox;
var creatureMesh = [];
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, 10), scene);
    var camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 20, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var cameraLimit;
    cameraLimit = 5.8 - (window.outerWidth / window.outerHeight);
    if (cameraLimit < 3.6) {
        cameraLimit = 4;
    }
    console.log(cameraLimit);
    // camera.lowerRadiusLimit = cameraLimit;
    camera.radius = cameraLimit;
    camera.beta = BABYLON.Tools.ToRadians(80);
    // camera.upperBetaLimit = BABYLON.Tools.ToRadians(80);
    // camera.alpha = (-Math.PI / 2) + 2.2;
    // camera.upperAlphaLimit = (-Math.PI / 2) + 2.2;
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(1, -0.5, 0.5); // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-2, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(2, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.1;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 1;
    particleSystem.maxLifeTime = 1;

    // Emission rate
    particleSystem.emitRate = 200;

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(3, 1.5, -3);
    particleSystem.direction2 = new BABYLON.Vector3(-3, 1.5, 3);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 3;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.0003;

    //Start the particle system
    particleSystem.start();

    bottomBoard = BABYLON.CreatePlane("bottomBoard", { width: 0.35, height: 0.35 }, scene);

    bottomBoard.rotation.y = 180;
    textureBottomBoard = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(bottomBoard);
    messageText = new BABYLON.GUI.TextBlock();
    messageBox = new BABYLON.GUI.Rectangle();
    messageBox.thickness = 0;
    messageText.fontSize = '250';
    messageText.color = 'white';
    messageText.fontFamily = 'Times New Roman';
    //underwater music
    var music = new BABYLON.Sound("bgMusic", "assets/sounds/background.wav", scene, null, { loop: true, autoplay: true });

    //Loading Of Meshes
    BABYLON.SceneLoader.ImportMesh("", "assets/", "Ocean.glb", scene, function (meshes) {
        setTimeout(function () {
            document.getElementsByTagName('section')[0].remove();
        }, 3000);
    });

    setTimeout(() => {
        BABYLON.SceneLoader.ImportMesh("", "assets/", "ClownFish_Default.glb", scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(-0.5, 0.5, -1.5);
            animatefish(meshes[0], scene, "FuguFish");

        });
    }, 2000);


    setTimeout(() => {
        BABYLON.SceneLoader.ImportMesh("", "assets/", "Fugu_Glb_V001.glb", scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(-1, 0, -1);
            console.log(meshes[0].rotation);
            animatefish(meshes[0], scene, "FuguFish");
        });
    }, 14000);

    setTimeout(() => {
        BABYLON.SceneLoader.ImportMesh("", "assets/", "Lamp_Glb_V002.glb", scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(-1, 0.5, -1.3);
            animatefish(meshes[0], scene, "Lamp");


        });
    }, 6000);

    //setTimeout(() => {
    //     BABYLON.SceneLoader.ImportMesh("", "assets/", "Octopus_Glb_V001.glb", scene, function (meshes) {
    //         meshes[0].position = new BABYLON.Vector3(1.5, 0.5, -1);
    //         animatefish(meshes[0], scene, 'Fish');
    //     });
    // }, 12000);

    setTimeout(() => {
        BABYLON.SceneLoader.ImportMesh("", "assets/", "SeaHorse_Glb_V005.glb", scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(0.5, 1, -1.5);
            animatefish(meshes[0], scene, 'SeaHorse');
        });
    }, 1000);


    moveActiveCamera(scene, {
        radius: cameraLimit - 1,
        alpha: 1,
        beta: BABYLON.Tools.ToRadians(70),
    })


    return scene;
};

//For Camera Movement
const FROM_FRAME = 0;
const TO_FRAME = 100;
var animnumber = 2;
function moveActiveCamera(scene, {
    radius,
    alpha,
    beta
}) {
    const camera = scene.activeCamera;
    camera.animations = [
        createAnimation({
            property: "radius",
            from: camera.radius,
            to: radius,
        }),
        createAnimation({
            property: "beta",
            from: simplifyRadians(camera.beta),
            to: beta,
        }),
        createAnimation({
            property: "alpha",
            from: simplifyRadians(camera.alpha),
            to: alpha,
        }),
    ];
    scene.beginAnimation(camera, FROM_FRAME, TO_FRAME, false, 1, () => {
        if (animnumber) {
            if (animnumber == 1) moveActiveCamera(scene, {
                radius: 4 - 1,
                alpha: 1,
                beta: BABYLON.Tools.ToRadians(70),
            })

            if (animnumber == 2) moveActiveCamera(scene, {
                radius: 4,
                alpha: (-Math.PI / 2) + 2.2,
                beta: BABYLON.Tools.ToRadians(80),
            })

            if (animnumber == 3) moveActiveCamera(scene, {
                radius: 4 - 0.5,
                alpha: (-Math.PI / 2) + 1.8,
                beta: BABYLON.Tools.ToRadians(65),
            })
            animnumber++;
            if (animnumber > 3) {
                animnumber = 1;
            }
        }

    });
}

const FRAMES_PER_SECOND = 2;

function createAnimation({ property, from, to }) {
    const ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    const animation = BABYLON.Animation.CreateAnimation(
        property,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        FRAMES_PER_SECOND,
        ease
    );
    animation.setKeys([
        {
            frame: 0,
            value: from,
        },
        {
            frame: 100,
            value: to,
        },
    ]);
    return animation;
}

function simplifyRadians(radians) {
    const simplifiedRadians = radians % (2 * Math.PI);

    return simplifiedRadians < 0
        ? simplifiedRadians + BABYLON.Tools.ToRadians(360)
        : simplifiedRadians;
}

//For Fish Movement in the scene
function animatefish(meshes, scene, type) {
    var frameRate = 1;
    switch (type) {
        case 'Fish': frameRate = 1.2;
            break;
        case 'SeaHorse': frameRate = 1.5;
            break;
        case 'Lamp': frameRate = 0.7;
            break;
    }

    //Animation for movement and rotation
    const movement = new BABYLON.Animation("movement", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const rotation = new BABYLON.Animation("rotation", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    rotation.setEasingFunction(ease);

    const keyFrames = []; //for movement animation
    const keyFrames1 = []; //for rotation animation

    keyFrames.push({
        frame: 0,
        value: meshes.position.z
    });

    keyFrames.push({
        frame: 20,
        value: 1
    });

    keyFrames.push({
        frame: 40,
        value: meshes.position.z
    });

    keyFrames1.push({
        frame: 0,
        value: new BABYLON.Vector3(0, 160, 0)
    });

    keyFrames1.push({
        frame: 18,
        value: new BABYLON.Vector3(0, 160, 0)
    });
    keyFrames1.push({
        frame: 20,
        value: new BABYLON.Vector3(0, 163, 0)
    });
    keyFrames1.push({
        frame: 38,
        value: new BABYLON.Vector3(0, 163, 0)
    });
    keyFrames1.push({
        frame: 40,
        value: new BABYLON.Vector3(0, 160, 0)
    });

    movement.setKeys(keyFrames);
    rotation.setKeys(keyFrames1);

    meshes.animations.push(rotation);
    meshes.animations.push(movement);

    scene.beginAnimation(meshes, 0, 40, true, 1);
}
var fishCount = 0;
var gameCount = 0;
var creaturePos = [
    { x: 0.3, y: 0.7, z: -1 }, { x: 0.3, y: 0.3, z: -1 }, { x: 0.7, y: 0, z: -1 },
    { x: 0.7, y: 0.6, z: -1 }, { x: 1.1, y: 0, z: -1 }, { x: 1.1, y: 0.6, z: -1.5 },
    { x: 1.5, y: 0, z: -1.5 }, { x: 1.5, y: 0.6, z: -1.5 }, { x: 1.1, y: 1, z: -1.5 },
    { x: 1.5, y: 1, z: -1.5 }
]


function createCreature(data) {
    var meshToLoad = data.data.creatureName + ".glb";
    bottomBoard.isVisible = true;
    messageText.text = "Hi Friend!";
    messageBox.addControl(messageText);
    textureBottomBoard.addControl(messageBox);
    console.log(">>>>>>>><<<<<<<<", fishCount, creaturePos.length - 1);
    if (fishCount > 9) {
        fishCount = 0;
        gameCount = 1;
    }

    if (gameCount > 0) {
        if ((gameCount - 1) > 9) {
            gameCount = 0;
        }
        else {
            creatureMesh[gameCount - 1].dispose();
            gameCount++;
        }
    }
    console.log('here is the values', fishCount, gameCount);

    if (fishCount < creaturePos.length) {
        console.log("POSITION >>><<<>>>", creaturePos[0].x, creaturePos[0].y, creaturePos[0].z);
        BABYLON.SceneLoader.ImportMesh("", "assets/", meshToLoad, scene, function (meshes) {
            meshes[0].position = new BABYLON.Vector3(creaturePos[fishCount].x, creaturePos[fishCount].y, creaturePos[fishCount].z);
            console.log(meshes[0].position, "This is the position");

            creatureMesh[fishCount] = meshes[0];
            bottomBoard.position = new BABYLON.Vector3(creaturePos[fishCount].x, creaturePos[fishCount].y + 0.5, creaturePos[fishCount].z);

            for (var i = 1; i < meshes.length; i++) {
                for (var j = 0; j < data.data.colorObj.length; j++) {
                    if (meshes[i].name.includes(":")) {
                        let part = meshes[i].name.split(":");
                        // console.log(part[part.length-1], data.data.colorObj[j].meshId);
                        if (part[part.length - 1] === data.data.colorObj[j].meshId) {
                            console.log(">>>>>>>>>>", part)
                            var color = creatingMat(data.data.colorObj[j].meshColor);
                            meshes[i].material = color
                        }
                    } else {
                        if (meshes[i].name === data.data.colorObj[j].meshId) {
                            var color = creatingMat(data.data.colorObj[j].meshColor);
                            meshes[i].material = color
                        }
                    }
                }
            }
            fishCount++;
            setTimeout(() => {
                bottomBoard.isVisible = false;
                animatefish(meshes[0], scene, "Lamp");
            }, 5000);
        });

    }


}

function creatingMat(hex) {

    var myMaterial = new BABYLON.StandardMaterial("redMat", scene);
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16),
        myMaterial.emissiveColor = new BABYLON.Color3(r / 255, g / 255, b / 255);
    myMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    console.log("COLORCODE", hex);
    return myMaterial;
}


var engine;
try {
    engine = createDefaultEngine();
} catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}
if (!engine) throw 'engine should not be null.';
scene = createScene();
sceneToRender = scene

engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



