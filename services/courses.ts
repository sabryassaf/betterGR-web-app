import { fetchWithAuth, getUserId } from '@/lib/auth';
import { Course_title } from './students';

export interface Course {
  id: string;
  name: string;
  description: string;
  semester: string;
  staff: string[];
  students: string[];
  homework: string[];
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface AnnouncementResponse {
  announcement: string;
  course_id: string;
}

export const courseService = {
  getCourse: (id: string) => 
    fetchWithAuth(`/courses/${id}`),

  getCourseStudents: (id: string) => 
    fetchWithAuth(`/courses/${id}/students`),

  getCourseStaff: (id: string) => 
    fetchWithAuth(`/courses/${id}/staff`),

  // Announcements
  getCourseAnnouncements: (courseId: string) => 
    fetchWithAuth(`/courses/${courseId}/announcements`),

  getAnnouncement: (courseId: string, announcementId: string) => 
    fetchWithAuth(`/courses/${courseId}/announcements/${announcementId}`),

  getStudentCourses: async () => {
    return fetchWithAuth(`/courses/students/${getUserId()}`);
  },

  getAllAnnouncements: async (): Promise<AnnouncementResponse[]> => {
    const response = await courseService.getStudentCourses();
    const courses = await response.json() as Course_title[];
    const announcements = await Promise.all(
      courses.map(async course => {
        console.log(course.id);
        const response = await fetchWithAuth(`/courses/${course.id}/announcements`);
        return response.json();
      })
    );
    return announcements.flat();
  },

  // Course Materials
  getCourseMaterials: (courseId: string) => 
    fetchWithAuth(`/courses/${courseId}/courseMaterials`),
};