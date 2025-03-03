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

// Match the actual API response structure from the protobuf definition
export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt?: string;
}

// API response type for announcements
interface ApiAnnouncement {
  AnnouncementID?: string;
  AnnouncementTitle?: string;
  AnnouncementContent?: string;
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
    try {
      const response = await courseService.getStudentCourses();
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.courses || !Array.isArray(data.courses)) {
        throw new Error('Invalid course data received');
      }
      
      // Use the courses array that contains complete objects
      const courses = data.courses as StudentCourse[];
      
      // Collect announcements with better error handling
      const allAnnouncements: Announcement[] = [];
      
      await Promise.all(
        courses.map(async (course: StudentCourse) => {
          try {
            console.log(`Fetching announcements for course: ${course.id} (${course.name})`);
            const response = await fetchWithAuth(`/courses/${course.id}/announcements`);
            
            if (!response.ok) {
              console.error(`Failed to fetch announcements for course ${course.id}: ${response.status}`);
              return;
            }
            
            const data = await response.json();
            console.log(`Announcements data for course ${course.id}:`, data);
            
            // Check if data has the correct structure
            if (data && data.announcements && Array.isArray(data.announcements)) {
              // Transform each announcement to match our interface
              const courseAnnouncements = data.announcements.map((announcement: ApiAnnouncement, index: number) => {
                return {
                  id: announcement.AnnouncementID || `${course.id}-announcement-${index}`,
                  courseId: course.id,
                  title: announcement.AnnouncementTitle || 'Untitled Announcement',
                  content: announcement.AnnouncementContent || '',
                  createdAt: new Date().toISOString()
                };
              });
              
              allAnnouncements.push(...courseAnnouncements);
            }
          } catch (error) {
            console.error(`Error fetching announcements for course ${course.id}:`, error);
          }
        })
      );
      
      return allAnnouncements;
    } catch (error) {
      console.error('Error in getAllAnnouncements:', error);
      return [];
    }
  },

  // Course Materials
  getCourseMaterials: (courseId: string) => 
    fetchWithAuth(`/courses/${courseId}/courseMaterials`),
};