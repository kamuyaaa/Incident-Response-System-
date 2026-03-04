export type ReportTypeId = 'medical' | 'crime' | 'natural' | 'road' | 'fire' | 'public' | 'other'

export const REPORT_TYPE_PLACEHOLDERS: Record<
  ReportTypeId,
  { description: string; casualties: string; location: string }
> = {
  medical: {
    description:
      'A person has collapsed near the entrance of TRM and is not responding. A small crowd has gathered, and we need medical assistance urgently.',
    casualties: 'Yes, 1 person',
    location: 'TRM, Thika Road',
  },
  crime: {
    description:
      'Suspicious activity and possible break-in in progress. Someone is attempting to force the rear door. Request immediate police presence.',
    casualties: 'No',
    location: 'Junction Mall, Ngong Road',
  },
  natural: {
    description:
      'Heavy flooding on the main road. Several vehicles stuck. Water level rising. Residents may need evacuation assistance.',
    casualties: 'Unknown',
    location: 'South C, Nairobi',
  },
  road: {
    description:
      'Multi-vehicle collision on the highway. At least two cars involved. Debris on the road. Traffic at a standstill.',
    casualties: 'Yes, 2 people injured',
    location: 'Mombasa Road, near JKIA turnoff',
  },
  fire: {
    description:
      'Smoke and flames visible from a residential building. Residents are evacuating. Fire appears to be spreading.',
    casualties: 'None reported yet',
    location: 'Westlands, Woodvale Grove',
  },
  public: {
    description:
      'Large crowd gathering, situation becoming tense. Possible public order issue. Request for crowd control and safety presence.',
    casualties: 'No',
    location: 'CBD, Kenyatta Avenue',
  },
  other: {
    description: 'Please describe the emergency in detail: what happened, when, and what help is needed.',
    casualties: 'If any, specify number',
    location: 'Exact address or landmark',
  },
}

export function getPlaceholders(type: string) {
  const id = (type in REPORT_TYPE_PLACEHOLDERS ? type : 'other') as ReportTypeId
  return REPORT_TYPE_PLACEHOLDERS[id]
}
