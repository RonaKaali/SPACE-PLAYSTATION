"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Controller Body
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.8,
      roughness: 0.4,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Controller Grips
    const gripGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.5, 32);
    const gripMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.4,
    });
    
    const leftGrip = new THREE.Mesh(gripGeometry, gripMaterial);
    leftGrip.position.set(-0.8, -0.6, 0);
    leftGrip.rotation.z = Math.PI / 8;
    
    const rightGrip = new THREE.Mesh(gripGeometry, gripMaterial);
    rightGrip.position.set(0.8, -0.6, 0);
    rightGrip.rotation.z = -Math.PI / 8;

    // D-pad
    const dpadGroup = new THREE.Group();
    const dpadHGeo = new THREE.BoxGeometry(0.7, 0.2, 0.1);
    const dpadVGeo = new THREE.BoxGeometry(0.2, 0.7, 0.1);
    const dpadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5, roughness: 0.6 });
    const dpadH = new THREE.Mesh(dpadHGeo, dpadMaterial);
    const dpadV = new THREE.Mesh(dpadVGeo, dpadMaterial);
    dpadGroup.add(dpadH);
    dpadGroup.add(dpadV);
    dpadGroup.position.set(-0.7, 0.2, 0.26);
    
    // Buttons (glowing)
    const buttonGroup = new THREE.Group();
    const btnGeo = new THREE.CircleGeometry(0.1, 16);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xff9500, emissive: 0xff9500, emissiveIntensity: 2 });
    const btn1 = new THREE.Mesh(btnGeo, btnMat);
    btn1.position.set(0.7, 0.3, 0.26);
    const btn2 = new THREE.Mesh(btnGeo, btnMat);
    btn2.position.set(1.0, 0, 0.26);
    buttonGroup.add(btn1, btn2);

    // Group all parts
    const controller = new THREE.Group();
    controller.add(body, leftGrip, rightGrip, dpadGroup, buttonGroup);
    scene.add(controller);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const orangeLight = new THREE.PointLight(0xff9500, 3, 10);
    orangeLight.position.set(-2, 2, 2);
    scene.add(orangeLight);

    const goldLight = new THREE.PointLight(0xFFD700, 2, 10);
    goldLight.position.set(2, -2, 3);
    scene.add(goldLight);


    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controller.rotation.y += 0.005;
      controller.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
        if (currentMount) {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
