export const BREEDS = ['ross', 'cobb', 'aa_plus'] as const

export type Breed = (typeof BREEDS)[number]

export const BREED_LABELS: Record<Breed, string> = {
  ross: 'Ross',
  cobb: 'Cobb',
  aa_plus: 'AA Plus',
}

/**
 * Standard bodyweight in grams. The array index is the age in days,
 * so index 0 is hatch day and index 44 is the last day in the table.
 */
export const STANDARD_WEIGHTS_GRAMS: Record<Breed, readonly number[]> = {
  ross: [
    44, 62, 81, 102, 125, 151, 181, 213, 249, 288, 330, 376, 425, 477, 533, 592, 655, 720, 789, 860,
    935, 1012, 1092, 1174, 1258, 1345, 1434, 1524, 1616, 1710, 1805, 1901, 1999, 2097, 2196, 2296,
    2396, 2496, 2597, 2697, 2798, 2898, 2998, 3097, 3197,
  ],
  cobb: [
    42, 55, 71, 90, 112, 138, 168, 202, 240, 283, 330, 382, 440, 503, 570, 639, 711, 786, 864, 945,
    1029, 1116, 1205, 1296, 1390, 1486, 1583, 1682, 1783, 1886, 1989, 2094, 2200, 2306, 2413, 2521,
    2629, 2738, 2846, 2954, 3062, 3170, 3278, 3384, 3490,
  ],
  aa_plus: [
    44, 61, 79, 100, 123, 148, 177, 209, 244, 283, 325, 370, 419, 471, 527, 586, 648, 714, 782, 854,
    928, 1006, 1085, 1168, 1252, 1339, 1428, 1518, 1611, 1704, 1799, 1895, 1992, 2090, 2188, 2287,
    2386, 2486, 2585, 2684, 2784, 2882, 2981, 3079, 3176,
  ],
}

export const MAX_AGE_DAYS = STANDARD_WEIGHTS_GRAMS.ross.length - 1
