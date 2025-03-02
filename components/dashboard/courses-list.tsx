"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/auth';
import { studentService } from "@/services/students";
import { courseService } from "@/services/courses";

interface Course {
  id: string;
  name: string;
  semester: string;
  description?: string;
}

export function CoursesList() {
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
        console.log('Received courses data in CoursesList:', data);
        
        // Check if we have courses in the expected format
        if (data && data.courses && Array.isArray(data.courses)) {
          // Log each course with its ID to verify uniqueness
          console.log('Courses array length in CoursesList:', data.courses.length);
          data.courses.forEach((course: Course, index: number) => {
            console.log(`Course ${index} in CoursesList:`, course);
            if (!course.id) {
              console.error(`Course at index ${index} is missing an ID in CoursesList:`, course);
            }
          });
          
          // Check for duplicate IDs
          const ids = data.courses.map((course: Course) => course.id);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.error('Duplicate course IDs detected in CoursesList:', ids);
          }
          
          // The courses array now contains complete course objects
          setCourses(data.courses);
        } else {
          console.error('Unexpected response format:', data);
          setError('Failed to process course data');
          setCourses([]);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="text-center">Loading courses...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-base">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Semester: {course.semester}
                  </p>
                  {course.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No courses available
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
