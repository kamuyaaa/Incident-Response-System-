/**
 * 3D asset design tokens — aligned with app design system.
 * Use these in all R3F/drei components for consistent look.
 */
export const colors3d = {
  bg: '#faf8f5',
  surface: '#f5f2ed',
  subtle: '#efebe6',
  ink: '#1c1917',
  inkSecondary: '#57534e',
  inkTertiary: '#78716c',
  emergency: '#dc2626',
  emergencyEmissive: '#dc2626',
  white: '#ffffff',
  // Soft accents for vehicles/buildings (stylized)
  ambulance: '#e0f2fe',
  ambulanceDark: '#0d9488',
  fire: '#fef3c7',
  fireDark: '#d97706',
  police: '#e0e7ff',
  policeDark: '#4f46e5',
  building: '#f5f2ed',
  buildingRoof: '#e7e5e4',
};

/** Material presets: soft, clean, low metallic */
export const materials = {
  soft: { roughness: 0.85, metalness: 0.08 },
  softEmissive: (color, intensity = 0.2) => ({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.5,
    metalness: 0.2,
  }),
  beacon: {
    color: colors3d.emergency,
    emissive: colors3d.emergencyEmissive,
    emissiveIntensity: 0.35,
    roughness: 0.4,
    metalness: 0.25,
  },
};
