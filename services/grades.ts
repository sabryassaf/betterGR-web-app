import { fetchWithAuth } from '@/lib/auth';
import { getUserId } from '@/lib/auth';
import { getSemester } from '@/lib/utils';

export interface Grade {
  student_id: string;
  semester: string;
  courses: CourseGrade[];
}

export interface CourseGrade {
  course_id: string;
  exams: ExamGrade[];
  homework: HomeworkGrade[];
}

interface ExamGrade {
  type: string;
  grade: number;
}

interface HomeworkGrade {
  hw_number: number;
  grade: number;
}

export const gradesService = {
  getStudentSemesterGrades: async () => {
    return fetchWithAuth(`/grades/${getUserId()}/${getSemester()}`);
  },

  getStudentCourseGrades: (courseId: string) =>{
    return fetchWithAuth(`/grades/${getUserId()}/${courseId}`);
  },
};