import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface Portal3DProps {
  portalData?: {
    freq?: number;
    stability?: number;
    power?: number;
    energy?: number;
    safety_status?: boolean;
  };
  title: string;
}

const Portal3D: React.FC<Portal3DProps> = ({ portalData, title }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 300 / 200, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(300, 200)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16)
    const spheres: THREE.Mesh[] = []

    const positions = [
      { x: 0, y: 0, z: 0 },      // Center
      { x: 1, y: 0, z: 0 },      // Right
      { x: -1, y: 0, z: 0 },     // Left
      { x: 0.5, y: 0.866, z: 0 }, // Top right
      { x: -0.5, y: 0.866, z: 0 }, // Top left
      { x: 0, y: -0.866, z: 0 }   // Bottom
    ]

    positions.forEach((pos, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: index === 0 ? 0x00ff00 : 0x0066ff,
        emissive: index === 0 ? 0x002200 : 0x001122,
        shininess: 100
      })
      
      const sphere = new THREE.Mesh(sphereGeometry, material)
      sphere.position.set(pos.x, pos.y, pos.z)
      spheres.push(sphere)
      scene.add(sphere)
    })

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x444444 })
    positions.forEach((pos, i) => {
      if (i === 0) return // Skip center sphere connections for now
      
      const points = [
        new THREE.Vector3(0, 0, 0), // Center
        new THREE.Vector3(pos.x, pos.y, pos.z)
      ]
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      scene.add(line)
    })

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      scene.rotation.y += 0.01
      
      if (portalData) {
        const energyIntensity = Math.min((portalData.energy || 0) / 10000, 1)
        const stabilityColor = portalData.safety_status ? 0x00ff00 : 0xff0000
        
        spheres.forEach((sphere, index) => {
          const material = sphere.material as THREE.MeshPhongMaterial
          if (index === 0) {
            material.color.setHex(stabilityColor)
            material.emissive.setHex(stabilityColor).multiplyScalar(0.1)
          } else {
            const blueIntensity = 0x0066ff + Math.floor(energyIntensity * 0x004400)
            material.color.setHex(blueIntensity)
            material.emissive.setHex(0x001122).multiplyScalar(energyIntensity)
          }
        })
      }
      
      renderer.render(scene, camera)
    }
    
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [portalData])

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-400 font-semibold">{title}</div>
      <div 
        ref={mountRef} 
        className="border border-gray-600 rounded bg-gray-800"
        style={{ width: '300px', height: '200px' }}
      />
      <div className="text-xs text-gray-500">
        Six-Sphere Portal Configuration
      </div>
    </div>
  )
}

export default Portal3D
