import { fetchWithAuth, getUserId } from '@/lib/auth';
import { getSemester } from '@/lib/utils';

export interface SingleGrade {
  semester: string;
  gradeID: string;
  studentID: string;
  courseID: string;
  gradeType: string;
  itemID: string;
  gradeValue: string;
  gradedBy: string;
  comments: string;
}

export interface Grade {
  student_id: string;
  semester: string;
  courses: CourseGrade[];
}

export interface CourseGrade {
  course_id: string;
  exams: ExamGrade[];
  homeworks: HomeworkGrade[];
}

export interface ExamGrade {
  type: string;
  grade: string;
}

export interface HomeworkGrade {
  hw_number: string;
  grade: string;
}

export const gradesService = {
  getStudentSemesterGrades: async () => {
    const semester = getSemester();
    const studentId = getUserId();
    return fetchWithAuth(`/grades/${semester}/${studentId}`);
  },

  getStudentCourseGrades: async (courseId: string) => {
    const semester = getSemester();
    const studentId = getUserId();
    return fetchWithAuth(`/grades/${semester}/${studentId}/${courseId}`);
  },
};