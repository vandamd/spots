import type { OpeningSlot } from '@/lib/types'

type ScheduleMap = Record<string, OpeningSlot[]>

const CLOSED: OpeningSlot['closes'] = 'Closed'
const ALL_DAY: OpeningSlot['closes'] = '24/7'

export const STUDY_SPACE_HOURS: ScheduleMap = {
  'Senate House Study Centre': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: '18:00' },
  ],
  'Geographical Sciences': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  Physics: [
    { label: 'Mon-Fri', closes: '17:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Biomedical School': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: '17:00' },
  ],
  'Arts and Social Sciences Library': [
    { label: 'All days', closes: ALL_DAY },
  ],
  Chemistry: [
    { label: 'Mon-Fri', closes: '17:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  "Queen's Building": [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: '17:00' },
  ],
  'The Richmond Building': [
    { label: 'Mon-Fri', closes: '23:00' },
    { label: 'Sat', closes: '22:00' },
    { label: 'Sun', closes: '22:00' },
  ],
  'Beacon House Study Centre': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: '22:00' },
  ],
  'Wills Memorial Building': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: '17:00' },
  ],
  'The Hawthorns': [
    { label: 'Mon-Fri', closes: '22:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  Education: [
    { label: 'Mon-Fri', closes: '18:45' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Veterinary Sciences Library': [
    { label: 'All days', closes: ALL_DAY },
  ],
}

export const TEACHING_SPACE_HOURS: ScheduleMap = {
  'Ada Lovelace Building': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'AIMS Conference Centre': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Arts Complex': [
    { label: 'Mon & Thu', closes: '19:00' },
    { label: 'Tue & Wed', closes: '21:00' },
    { label: 'Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Berkeley Square, 35': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Berkeley Square, 8-10': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Canynge Hall': [
    { label: 'Mon-Fri', closes: '17:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  Chemistry: [
    { label: 'Mon-Fri', closes: '19:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Cotham House': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Drama Building': [
    { label: 'Mon-Fri', closes: '19:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Fry Building': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'The Hawthorns': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Ivy Gate Building': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Life Sciences Building': [
    { label: 'Mon-Fri', closes: '19:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Merchant Venturers Building': [
    { label: 'Mon-Fri', closes: '21:45' },
    { label: 'Sat-Sun', closes: '17:30' },
  ],
  "Queen's Building": [
    { label: 'Mon-Fri', closes: '21:15' },
    { label: 'Sat-Sun', closes: '17:30' },
  ],
  'The Richmond Building': [
    { label: 'Mon-Fri', closes: '23:00' },
    { label: 'Sat', closes: '22:00' },
    { label: 'Sun', closes: '22:00' },
  ],
  'Southwell Street, 32': [
    { label: 'Mon-Thu', closes: '19:30' },
    { label: 'Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  "31-37 St Michael's Hill - Park Place": [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'St George\'s Hall': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  "30/32 Tyndall's Park Road": [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Victoria Rooms': [
    { label: 'Mon-Thu', closes: '21:15' },
    { label: 'Fri', closes: '19:15' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Whiteladies Road, 1-5': [
    { label: 'Mon-Fri', closes: '19:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Wills Memorial Building': [
    { label: 'Mon-Fri', closes: '21:30' },
    { label: 'Sat', closes: '17:00' },
    { label: 'Sun', closes: '18:00' },
  ],
  '12 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '43 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '21 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '15 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '3 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '10 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '9 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '7 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Arts - 5 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Arts - 11 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Arts - 13 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Arts - 19 Woodland Road': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Law - 8/10 Berkeley Square': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Langford - Pearson Building': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Langford - Winscombe Building': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Humanities Hub': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '1-5 Whiteladies Road': [
    { label: 'Mon-Fri', closes: '19:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '17-21 Park Row (Drama)': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '4 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '3 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '6 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '7 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '10 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  '11 Priory Road': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Priory Road Complex': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Geographical Sciences': [
    { label: 'Mon-Fri', closes: '18:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Physics': [
    { label: 'Mon-Fri', closes: '19:00' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Biomedical School': [
    { label: 'Mon-Fri', closes: '18:30' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Education': [
    { label: 'Mon-Fri', closes: '18:45' },
    { label: 'Sat-Sun', closes: CLOSED },
  ],
  'Veterinary Sciences Library': [
    { label: 'All days', closes: ALL_DAY },
  ],
}

export function getOpeningHours(buildingName: string, hasStudySpaces: boolean): OpeningSlot[] | null {
  if (hasStudySpaces) {
    return STUDY_SPACE_HOURS[buildingName] ?? null
  }

  return TEACHING_SPACE_HOURS[buildingName] ?? null
}

const DAY_SEQUENCE = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
type DayCode = typeof DAY_SEQUENCE[number]

function standardizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/monday/g, 'mon')
    .replace(/tuesday/g, 'tue')
    .replace(/wednesday/g, 'wed')
    .replace(/thursday/g, 'thu')
    .replace(/friday/g, 'fri')
    .replace(/saturday/g, 'sat')
    .replace(/sunday/g, 'sun')
    .replace(/\band\b/g, ',')
    .replace(/&/g, ',')
    .replace(/\//g, '-')
    .replace(/\sto\s/g, '-')
    .replace(/\s+/g, '')
}

function dayIndex(token: string): number | null {
  const normalized = token.slice(0, 3)
  const idx = DAY_SEQUENCE.indexOf(normalized as DayCode)
  return idx === -1 ? null : idx
}

function expandLabel(label: string): number[] {
  const normalized = standardizeLabel(label)

  if (normalized.includes('all')) {
    return DAY_SEQUENCE.map((_, index) => index)
  }

  const segments = normalized.split(',').filter(Boolean)
  const days = new Set<number>()

  segments.forEach((segment) => {
    if (segment.includes('-')) {
      const [startToken, endToken] = segment.split('-')
      const startIdx = dayIndex(startToken)
      const endIdx = dayIndex(endToken)
      if (startIdx === null || endIdx === null) return

      let current = startIdx
      while (true) {
        days.add(current)
        if (current === endIdx) break
        current = (current + 1) % DAY_SEQUENCE.length
      }
      return
    }

    const idx = dayIndex(segment)
    if (idx !== null) {
      days.add(idx)
    }
  })

  return Array.from(days)
}

export function isOpenAt(hours: OpeningSlot[] | null, date: Date): boolean | null {
  if (!hours || hours.length === 0) return null

  const dayIndexForDate = (date.getDay() + 6) % 7

  for (const slot of hours) {
    const applicableDays = expandLabel(slot.label)
    if (!applicableDays.includes(dayIndexForDate)) continue

    if (slot.closes === 'Closed') return false
    if (slot.closes === '24/7') return true

    const [hourStr, minuteStr = '0'] = slot.closes.split(':')
    const closingDate = new Date(date)
    closingDate.setHours(Number(hourStr), Number(minuteStr), 0, 0)

    return date.getTime() <= closingDate.getTime()
  }

  return null
}

export function getClosingDate(hours: OpeningSlot[] | null, date: Date): Date | null {
  if (!hours || hours.length === 0) return null

  const dayIndexForDate = (date.getDay() + 6) % 7

  for (const slot of hours) {
    const applicableDays = expandLabel(slot.label)
    if (!applicableDays.includes(dayIndexForDate)) continue

    if (slot.closes === 'Closed') {
      return new Date(date)
    }

    if (slot.closes === '24/7') {
      return null
    }

    const [hourStr, minuteStr = '0'] = slot.closes.split(':')
    const closingDate = new Date(date)
    closingDate.setHours(Number(hourStr), Number(minuteStr), 0, 0)
    return closingDate
  }

  return null
}
