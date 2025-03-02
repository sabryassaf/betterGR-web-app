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

// Add a simpler interface for the course data returned by the getStudentCourses API
interface StudentCourse {
  id: string;
  name: string;
  semester: string;
  description?: string;
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

  getAllAnnouncements: async (): Promise<Announcement[]> => {
    const response = await courseService.getStudentCourses();
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.courses || !Array.isArray(data.courses)) {
      throw new Error('Invalid course data received');
    }
    
    // iterate over each course id and fetch the announcements.
    const announcements = await Promise.all(
      data.coursesIDs.map(async (courseID: string) => {
        console.log("here");
        const response = await fetchWithAuth(`/courses/${courseID}/announcements`);
        console.log("response: ", response);
        return response.json();
      })
    );
    return announcements.flat();
  },

  // Course Materials
  getCourseMaterials: (courseId: string) => 
    fetchWithAuth(`/courses/${courseId}/courseMaterials`),
};