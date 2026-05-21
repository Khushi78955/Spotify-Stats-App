import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AudioSphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const greenLight = new THREE.PointLight(0x1db954, 2, 20);
    greenLight.position.set(5, 5, 5);
    scene.add(greenLight);
    const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 20);
    purpleLight.position.set(-5, -3, 5);
    scene.add(purpleLight);

    // Icosahedron sphere
    const geo = new THREE.IcosahedronGeometry(2.2, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1db954,
      wireframe: true,
      emissive: 0x1db954,
      emissiveIntensity: 0.15,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200 * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const camTarget = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      mesh.scale.setScalar(1 + Math.sin(t * 0.8) * 0.015);
      camTarget.x += (mouse.x * 0.5 - camTarget.x) * 0.05;
      camTarget.y += (mouse.y * 0.3 - camTarget.y) * 0.05;
      camera.position.x = camTarget.x;
      camera.position.y = camTarget.y;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
