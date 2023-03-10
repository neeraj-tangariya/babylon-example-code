/// <reference path="./babylon.d.ts" />

const canvas = document.getElementById("canvas");
const nextBtn = document.querySelectorAll(".changeMesh");

const imgList = {
  midnight_shoes: "midnight_shoes.glb",
  beach_shoes: "beach_shoes.glb",
  black_shoes: "black_shoes.glb",
};

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;

var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

var file_name = "midnight_shoes.glb";

var createScene = function () {
  // Creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // Create a camera
  var camera = new BABYLON.ArcRotateCamera(
    "camera",
    4.3787,
    0.7962,
    0.4550,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.upperRadiusLimit = 0.5;
  camera.lowerRadiusLimit = 0.25;
  camera.minZ = 0.01;
  // Attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Use asset Manager to load the asset
  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask(
    "shoe task",
    "",
    "./assets/scenes/",
    file_name
  );
  meshTask.onSuccess = function (task) {
    task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
    // scene.debugLayer.show({ embedMode: true });
    // scene.debugLayer.select(task.loadedMeshes[0], "VARIANTS");
  };
  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.render();
    });
  };
  assetsManager.load();

  // BABYLON.SceneLoader.ImportMesh("", "./assets/scenes/", "midnight_shoes.glb", scene, function (newMeshes, particleSystems, skeletons) {
  //     var mesh = newMeshes[0];
  // });

  return scene;
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};

initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});

// next Btn clicked
nextBtn.forEach((elem) => {
  elem.addEventListener("click", function (e) {
    file_name = imgList[e.target.title];
    window.scene = createScene();
  });
});
