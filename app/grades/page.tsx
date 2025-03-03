'use client';

import { useEffect, useState } from 'react';
import { CourseGrades } from '@/components/grades/course-grades';
import { gradesService, SingleGrade } from '@/services/grades';
import { courseService } from '@/services/courses';

interface ExamGrade {
  type: string;
  grade: string;
}

interface HomeworkGrade {
  homework_number: string;
  grade: string;
}

interface StudentCourseGrades {
  course_id: string;
  course_name?: string;
  exams: ExamGrade[];
  homeworks: HomeworkGrade[];
}

export default function GradesPage() {
  const [grades, setGrades] = useState<StudentCourseGrades[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        // Fetch both grades and courses
        const [gradesResponse, coursesResponse] = await Promise.all([
          gradesService.getStudentSemesterGrades(),
          courseService.getStudentCourses()
        ]);
        
        console.log('Grades Response status:', gradesResponse.status);
        console.log('Courses Response status:', coursesResponse.status);
        
        if (!gradesResponse.ok) {
          throw new Error(`Failed to fetch grades: ${gradesResponse.statusText}`);
        }
        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.statusText}`);
        }
        
        const gradesData = await gradesResponse.json();
        const coursesData = await coursesResponse.json();
        
        console.log('Raw grades data:', gradesData);
        console.log('Raw courses data:', coursesData);
        
        // Create a map of course IDs to course names
        const courseNameMap = new Map();
        if (coursesData && coursesData.courses && Array.isArray(coursesData.courses)) {
          coursesData.courses.forEach((course: { id: string, name: string }) => {
            courseNameMap.set(course.id, course.name);
          });
        }
        
        // Check if the data contains grades array from the gRPC response
        if (gradesData && gradesData.grades && Array.isArray(gradesData.grades)) {
          // Transform the flat list of grades into a grouped format by course
          const courseMap = new Map<string, StudentCourseGrades>();
          
          gradesData.grades.forEach((grade: SingleGrade) => {
            if (!courseMap.has(grade.courseID)) {
              courseMap.set(grade.courseID, {
                course_id: grade.courseID,
                course_name: courseNameMap.get(grade.courseID),
                exams: [],
                homeworks: []
              });
            }
            
            const courseData = courseMap.get(grade.courseID);
            if (!courseData) return;
            
            // Handle different grade types
            if (grade.gradeType.toLowerCase().includes('exam')) {
              courseData.exams.push({
                type: grade.gradeType,
                grade: grade.gradeValue
              });
            } else if (grade.gradeType.toLowerCase().includes('homework')) {
              courseData.homeworks.push({
                homework_number: grade.itemID,
                grade: grade.gradeValue
              });
            }
          });
          
          const formattedGrades = Array.from(courseMap.values());
          console.log('Transformed grades:', formattedGrades);
          setGrades(formattedGrades);
        } else {
          console.log('No grades data found in response or invalid format:', gradesData);
          setGrades([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load grades. Please try again later. ${err instanceof Error ? err.message : ''}`);
        setGrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading grades...</div>
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
      <h1 className="text-3xl font-bold mb-6">My Grades</h1>
      <div className="space-y-6">
        {Array.isArray(grades) && grades.length > 0 ? (
          grades.map((course) => (
            <CourseGrades key={course.course_id} course={course} />
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            No grades available.
          </div>
        )}
      </div>
    </div>
  );
}