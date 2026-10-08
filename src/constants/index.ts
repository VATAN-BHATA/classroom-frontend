export const DEPARTMENT = [
  'CS', 'Maths', 'English'
];

// MAP OVER THESE TO PRESENT IN THE RIGHT FORMAT

export const DEPARTMENT_OPTIONS = DEPARTMENT.map((dept => ({

  value: dept,
  label: dept,
})));