const courseSemesters = {
  "B.Tech CSE": 8,
  "B.Tech IT": 8,
  "B.Tech Civil": 8,
  "BCA": 6,
  "BBA": 6,
  "B.Com": 6,
  "B.Pharm": 8,
};

export const isValidCourseSemester = (course, semester) => {
  if (!courseSemesters[course]) {
    return {
      valid: false,
      message: "Invalid course selected",
    };
  }

  const maxSem = courseSemesters[course];
  if (semester < 1 || semester > maxSem) {
    return {
      valid: false,
      message: `${course} has only ${maxSem} semesters. You entered semester ${semester}.`,
    };
  }

  return { valid: true };
};
