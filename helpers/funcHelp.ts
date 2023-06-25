export const vBcaKodeGenerate = (detail) => {
  switch (detail.typeUang) {
    case 'Uang Kegiatan':
      return '2';
    case 'Uang Ujian':
      return '3';
    case 'Uang Daftar Ulang':
      return '4';
  }
};
