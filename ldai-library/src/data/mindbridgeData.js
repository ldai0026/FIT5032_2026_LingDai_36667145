export const resourceRows = [
  {
    id: 'anxiety-toolkit',
    title: 'Anxiety grounding toolkit',
    type: 'Self-help',
    topic: 'Anxiety',
    audience: 'Young adults',
    status: 'Published',
    description: 'Short exercises for moments when anxiety feels difficult to manage.',
  },
  {
    id: 'safe-conversation',
    title: 'Starting a safe conversation',
    type: 'Carer guide',
    topic: 'Family support',
    audience: 'Carers',
    status: 'Published',
    description: 'Guidance for family members who want to support someone respectfully.',
  },
  {
    id: 'counselling-pathway',
    title: 'Low-cost counselling pathway',
    type: 'Service',
    topic: 'Counselling',
    audience: 'Members',
    status: 'Published',
    description: 'A plain-English description of intake, eligibility, and referral options.',
  },
  {
    id: 'peer-checklist',
    title: 'Online group readiness checklist',
    type: 'Peer support',
    topic: 'Community',
    audience: 'Members',
    status: 'Review',
    description: 'Questions to consider before joining a moderated peer support space.',
  },
  {
    id: 'urgent-help-plan',
    title: 'Urgent help preparation plan',
    type: 'Safety plan',
    topic: 'Crisis preparation',
    audience: 'All users',
    status: 'Published',
    description: 'A private checklist for warning signs, trusted contacts, and immediate options.',
  },
  {
    id: 'staff-referral-map',
    title: 'Referral readiness map',
    type: 'Staff resource',
    topic: 'Referral',
    audience: 'Staff',
    status: 'Published',
    description: 'A staff-facing overview for matching support needs with suitable referral paths.',
  },
]

export const outreachRows = [
  { id: 'oc-001', name: 'Maya Chen', email: 'maya@example.org', pathway: 'Counselling', status: 'Follow-up due', lastContact: '2026-08-03' },
  { id: 'oc-002', name: 'Alex Morgan', email: 'alex@example.org', pathway: 'Peer support', status: 'Scheduled', lastContact: '2026-08-02' },
  { id: 'oc-003', name: 'Priya Shah', email: 'priya@example.org', pathway: 'Carer guide', status: 'New', lastContact: '2026-08-01' },
  { id: 'oc-004', name: 'Liam Patel', email: 'liam@example.org', pathway: 'Referral', status: 'Scheduled', lastContact: '2026-07-30' },
  { id: 'oc-005', name: 'Jordan Lee', email: 'jordan@example.org', pathway: 'Safety plan', status: 'Follow-up due', lastContact: '2026-07-29' },
]

export const serviceLocations = [
  { id: 'svc-1', name: 'MindBridge Community Hub', address: '11 Swanston Street, Melbourne VIC', type: 'Counselling', coordinates: [144.9633, -37.8136] },
  { id: 'svc-2', name: 'Northside Peer Support', address: '180 Bell Street, Preston VIC', type: 'Peer support', coordinates: [144.995, -37.743] },
  { id: 'svc-3', name: 'Carer Connect Centre', address: '95 High Street, Prahran VIC', type: 'Carer support', coordinates: [144.994, -37.852] },
]
