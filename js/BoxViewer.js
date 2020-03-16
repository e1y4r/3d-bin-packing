import { Box, Container, Vector3D } from './BinPackingSolver.js'

class RenderableBox extends Box {
    constructor(color, viewer, width, height, depth) {
        super(width, height, depth);
        this.color = color;
        var material = new THREE.MeshStandardMaterial({
            color: color,
            opacity: 0.9,
            metalness: 0.2,
            roughness: 1,
            transparent: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh = new THREE.Mesh(geometry, material);

        viewer.scene.add(this.mesh);
        viewer.boxes.push(this);
    }

    set visible(v) {
        this.mesh.visible = !!v;
    }

    updateMesh() {
        this.mesh.scale.x = this.size.x;
        this.mesh.scale.y = this.size.y;
        this.mesh.scale.z = this.size.z;
        this.mesh.position.x = this.position.x + this.size.x / 2;
        this.mesh.position.y = this.position.y + this.size.y / 2;
        this.mesh.position.z = this.position.z + this.size.z / 2;
    }
}
class RenderableContainer extends Container {
    constructor(viewer, width, height, depth) {
        super(width, height, depth);

        // add mesh to scene
        var material = new THREE.LineBasicMaterial({ color: 0xdfdfdf });
        var geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));

        this.mesh = new THREE.LineSegments(geometry, material);

        this.viewer = viewer;
        viewer.scene.add(this.mesh);
        viewer.container = this;
    }

    changeSize(width, height, depth) {
        this.size = new Vector3D(width, height, depth);
        this.mesh.scale.x = this.size.x;
        this.mesh.scale.y = this.size.y;
        this.mesh.scale.z = this.size.z;
        this.mesh.position.x = this.size.x / 2;
        this.mesh.position.y = this.size.y / 2;
        this.mesh.position.z = this.size.z / 2;
        // camera looks at center
        this.viewer.controls.target.set(this.size.x / 2, this.size.y / 2, this.size.z / 2);
    }
}

class BoxViewer {
    _setupLight(scene) {
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
        var directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        var directionalLight3 = new THREE.DirectionalLight(0xFFFFFF, 0.9);

        // set directionalLights to random places
        directionalLight1.position.set(3, 4, 5);
        directionalLight2.position.set(-3, 4, -5);
        directionalLight3.position.set(2, 5, 4);

        // (0, 0, 0) to target directionalLights at
        var origin = new THREE.Object3D();

        // target directionalLights to origin
        directionalLight1.target = origin;
        directionalLight2.target = origin;
        directionalLight3.target = origin;

        scene.add(ambientLight);
        scene.add(directionalLight1);
        scene.add(directionalLight2);
        scene.add(directionalLight3);
    }

    constructor(canvas) {
        this.canvas = canvas;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        this.scene = new THREE.Scene();

        // setup camera
        this.camera = new THREE.PerspectiveCamera(50, this.renderer.getSize().width / this.renderer.getSize().height);
        this.camera.position.x = 11;
        this.camera.position.z = 9;
        this.camera.position.y = 7;

        // setup OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.5;
        this.controls.enableZoom = true;

        this._setupLight(this.scene);

        this.boxes = [];
    }

    update() {
        this.boxes.forEach(b => b.updateMesh());

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

}
export { BoxViewer, RenderableBox, RenderableContainer }