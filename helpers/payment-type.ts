export const bulans = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
export const BULAN_KELAS_LULUSAN = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4];
export const BULAN_KELAS_NAIKAN = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

export const findNthTerm = (a, d, n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum = sum + a;
    a = a + d;
  }
  return sum;
};
