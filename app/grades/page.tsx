'use client';

import { useEffect, useState } from 'react';
import { CourseGrades } from '@/components/grades/course-grades';
import { gradesService, SingleGrade } from '@/services/grades';

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
        const response = await gradesService.getStudentSemesterGrades();
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch grades: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw grades data:', data);
        
        // Check if the data contains grades array from the gRPC response
        if (data && data.grades && Array.isArray(data.grades)) {
          // Transform the flat list of grades into a grouped format by course
          const courseMap = new Map<string, StudentCourseGrades>();
          
          data.grades.forEach((grade: SingleGrade) => {
            if (!courseMap.has(grade.courseID)) {
              courseMap.set(grade.courseID, {
                course_id: grade.courseID,
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
          console.log('No grades data found in response or invalid format:', data);
          setGrades([]);
        }
      } catch (err) {
        console.error('Error fetching grades:', err);
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