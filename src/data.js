export const CATEGORIES = ['Urgent', 'Routine', 'Preventive']
export const AVAILABILITY_DELAY = 600
export const SERVICES = [
  { id: 1, name: 'Urgent minor injury', category: 'Urgent', who: 'Nurse Dlamini', slots: 3, blurb: 'Same-day triage for cuts, sprains and minor burns.' },
  { id: 2, name: 'Fever and infection review', category: 'Urgent', who: 'Dr Pillay', slots: 4, blurb: 'Nurse-led assessment for fever, cough or infection.' },
  { id: 3, name: 'General check-up', category: 'Routine', who: 'Nurse Mokoena', slots: 6, blurb: '30 minutes with a nurse practitioner.' },
  { id: 4, name: 'Blood pressure monitoring', category: 'Routine', who: 'Nurse Naidoo', slots: 2, blurb: 'Regular readings and medication review.' },
  { id: 5, name: 'Child immunisation', category: 'Preventive', who: 'Nurse Khumalo', slots: 5, blurb: 'Walk-in friendly. Quiet room available.' },
  { id: 6, name: 'Flu vaccination', category: 'Preventive', who: 'Nurse Botha', slots: 8, blurb: 'Ten-minute appointments, no referral needed.' },
]
/** Simulates a server call: odd ids lose a slot, even ids gain one. */
export const fetchAvailability = list =>
  new Promise(resolve => setTimeout(() => resolve(list.map(s => ({
    ...s, slots: s.id % 2 ? Math.max(0, s.slots - 1) : s.slots + 1 }))), AVAILABILITY_DELAY))
