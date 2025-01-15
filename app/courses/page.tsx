'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, fetchWithAuth, getUserId } from '@/lib/auth';

interface Course {
  id: string;
  name: string;
  semester: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login...');
      router.push('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const userId = getUserId();
        console.log('Fetching courses for user:', userId);
        if (!userId) {
          throw new Error('Student ID not found');
        }

        const url = `${API_URL}/api/students/${userId}`;
        console.log('Making request to:', url);
        const response = await fetchWithAuth(url);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Received courses:', data);
        setCourses(data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [API_URL, router]);

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
        {Array.isArray(courses) && courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">{course.name}</p>
              <p className="text-sm text-muted-foreground">Semester: {course.semester}</p>
            </div>
          </div>
        ))}
        {(!courses || courses.length === 0) && (
          <div className="text-center text-muted-foreground">
            No courses available.
          </div>
        )}
      </div>
    </div>
  );
}
