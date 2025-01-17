import { fetchWithAuth, getUserId } from '@/lib/auth';

export interface Student {
  id: string;
  enrolled_courses: Course[];
}

interface Course {
  id: string;
  grade: number;
}

export const studentService = {
  getStudentCourses: () => 
    fetchWithAuth(`/students/${getUserId()}`),
};
