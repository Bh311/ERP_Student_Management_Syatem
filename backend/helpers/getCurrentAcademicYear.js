const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = (currentYear % 100) + 1;
  return `${currentYear}-${nextYear.toString().padStart(2, '0')}`;
};

export default getCurrentAcademicYear;