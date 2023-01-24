/// <reference path="./vendor/babylon.d.ts" />

// get our canvas
const canvas = document.getElementById("renderCanvas");

// create a BabylonJs engine
const engine = new BABYLON.Engine(canvas, true);

function createScene() {
  // create a scene
  const scene = new BABYLON.Scene(engine);

  // create a camera
  //   const camera = new BABYLON.FreeCamera(
  //     "camera",
  //     new BABYLON.Vector3(0, 0, -5),
  //     scene
  //   );

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -5,
    50,
    20,
    new BABYLON.Vector3(0, 0, -5),
    scene
  );

  camera.attachControl(canvas, true);

  // create a light
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // add background layer
  const layer = new BABYLON.Layer("layer", "./assets/sky_img.png", scene);

  // create a box
  const box = BABYLON.CreateBox("box", { size: 1 }, scene);
  box.rotation.x = 2;
  box.rotation.y = 3;

  // create a sphere
  const sphere = BABYLON.CreateSphere(
    "sphere",
    { segments: 32, diameter: 2 },
    scene
  );
  sphere.position = new BABYLON.Vector3(3, 0, 0);
  sphere.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

  // create plane
  const plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene);
  plane.position = new BABYLON.Vector3(-3, 0, 0);

  // create line
  const points = [
    new BABYLON.Vector3(2, 0, 0),
    new BABYLON.Vector3(2, 1, 0),
    new BABYLON.Vector3(2, 1, 1),
  ];
  const lines = BABYLON.MeshBuilder.CreateLines(
    "lines",
    {
      points: points,
    },
    scene
  );

  // create materials
  const material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  material.emissiveColor = new BABYLON.Color3(0, 1, 0);

  box.material = material;

  // material2
  const material2 = new BABYLON.StandardMaterial("material2", scene);
  material2.diffuseTexture = new BABYLON.Texture(
    "./assets/dark_rock.png",
    scene
  );

  sphere.material = material2;

//   scene.debugLayer.show({ embedMode: true });

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});
