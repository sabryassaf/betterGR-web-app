'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, fetchWithAuth, getUserId } from '@/lib/auth';
import { courseService } from '@/services/courses';

interface Course {
  id: string;
  name: string;
  semester: string;
  description?: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getStudentCourses();
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Received courses data:', data);
        
        // Check if we have courses in the expected format
        if (data && data.courses && Array.isArray(data.courses)) {
          // Log each course with its ID to verify uniqueness
          console.log('Courses array length:', data.courses.length);
          data.courses.forEach((course: Course, index: number) => {
            console.log(`Course ${index}:`, course);
            if (!course.id) {
              console.error(`Course at index ${index} is missing an ID:`, course);
            }
          });
          
          // Check for duplicate IDs
          const ids = data.courses.map((course: Course) => course.id);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.error('Duplicate course IDs detected:', ids);
            // Find the duplicates
            const seen = new Set();
            const duplicates = ids.filter((id: string) => {
              const isDuplicate = seen.has(id);
              seen.add(id);
              return isDuplicate;
            });
            console.error('Duplicate IDs:', duplicates);
          }
          
          // The courses array now contains complete course objects
          setCourses(data.courses);
        } else {
          console.error('Unexpected response format:', data);
          setError('Received unexpected data format from server');
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="space-y-6">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">Semester: {course.semester}</p>
              {course.description && (
                <p className="text-sm text-gray-600 mt-2">{course.description}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            No courses available.
          </div>
        )}
      </div>
    </div>
  );
}
