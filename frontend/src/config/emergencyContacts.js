import { Shield, Ambulance, Flame, HeartHandshake, Building2 } from 'lucide-react';

export const EMERGENCY_CONTACTS = [
  {
    id: 'police',
    name: 'Police Emergency',
    label: 'Immediate police assistance',
    phone: '999',
    icon: Shield,
    tone: 'critical',
  },
  {
    id: 'ambulance',
    name: 'Ambulance Dispatch',
    label: 'Medical response and transport',
    phone: '999',
    icon: Ambulance,
    tone: 'success',
  },
  {
    id: 'fire',
    name: 'Fire Response',
    label: 'Fire and rescue operations',
    phone: '999',
    icon: Flame,
    tone: 'warning',
  },
  {
    id: 'redcross',
    name: 'Kenya Red Cross',
    label: 'Humanitarian support and triage',
    phone: '1199',
    icon: HeartHandshake,
    tone: 'tracking',
  },
  {
    id: 'county',
    name: 'County Emergency Line',
    label: 'County coordination desk',
    phone: '+254700000000',
    icon: Building2,
    tone: 'neutral',
  },
];

