// src/components/Scene/ChestHotspot.jsx
// Chest interaction zone on the patient.
// Wraps Hotspot with chest-specific position and labeling.

import Hotspot from './Hotspot';

export default function ChestHotspot({ onInteract, color = '#FF1744' }) {
  return (
    <group position={[0, 0, -3.2]}>
      <Hotspot
        position={[0, 0.31, 0.12]}
        color={color}
        label="Interact\nChest"
        hotspotType="chest"
        onInteract={onInteract}
        labelOffset={[0, 0.3, 0]}
      />
    </group>
  );
}
