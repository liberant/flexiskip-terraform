export const TYPE_PERCENTAGE = 'percentage';
export const TYPE_FLAT = 'flat';
export const TYPE_EXTRA = 'extra';
export const TYPE_FREE = 'free';

const types = [
  TYPE_PERCENTAGE,
  TYPE_FLAT,
  TYPE_EXTRA,
  TYPE_FREE,
];

export const typeOptions = [
  { label: 'Percentage', value: TYPE_PERCENTAGE },
  { label: 'Exact Amount', value: TYPE_FLAT },
  { label: 'Extra', value: TYPE_EXTRA },
  { label: 'Free', value: TYPE_FREE },
];

export default types;
