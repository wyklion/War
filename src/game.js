
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var MyGame = drogon.Class.extend({
    ctor: function () {
        this.scene = new BABYLON.Scene(engine);

        this.init();
        //this.load();
    },
    //load: function(){
    //    var scope = this;
    //    var assetsManager = new BABYLON.AssetsManager(this.scene);
    //    assetsManager.addMeshTask("1","", "res/female_walk/","female_walk.babylon");
    //    assetsManager.onTaskSuccess = function(task){};
    //    assetsManager.onFinish = function (tasks) {
    //        scope.init();
    //    };
    //    assetsManager.load();
    //},
    init:function(){
        var scope = this;

        var alpha = -Math.PI/2, beta = 1.5, radius = 25, x = 0, y = 5, z = 0;
        // Attach camera to canvas inputs
        this.scene.activeCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", alpha,beta,radius, new BABYLON.Vector3.Zero(), this.scene);
        this.cameraTarget = new BABYLON.Vector3(0,8,0);
        this.scene.activeCamera.target = this.cameraTarget;
        this.scene.activeCamera.attachControl(canvas);

        //this.lamp = new BABYLON.PointLight("lamp", new BABYLON.Vector3(0, 15, -10), this.scene);
        //this.lamp.diffuse = new BABYLON.Color3(1,1,1);
        //this.lamp.specular = new BABYLON.Color3(1, 1, 1);
        //this.lamp.intensity = 20;
        //
        //// Skybox
        //this.skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this.scene);
        //var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        //skyboxMaterial.backFaceCulling = false;
        //this.skybox.material = skyboxMaterial;
        ////Fog
        //this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        //this.scene.fogDensity = 0.02;
        //this.scene.fogColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        //
        ////female
        //this.female = this.scene.getMeshByID("female");
        //this.female.position.y += 7;
        //this.female.rotation.y = 0;//Math.PI;
        //
        //this.bip = this.scene.getSkeletonByName("Bip01");
        //this.scene.beginAnimation(this.bip, 0, 32, true, 1.0);

        engine.runRenderLoop(function(){
            scope.scene.render();
        });
        drogon.director.getScheduler().scheduleUpdate(this, 0, false);
    },
    update:function(dt){
    },
});


var start = function(){
    new MyGame();
}

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

