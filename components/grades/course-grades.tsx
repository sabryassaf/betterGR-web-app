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
  exams?: ExamGrade[];
  homeworks?: HomeworkGrade[];
}

function GradeBar({ grade }: { grade: string }) {
  const percentage = parseInt(grade);
  return (
    <div className="flex items-center gap-4 flex-1 ml-4">
      <span className="font-medium w-16">{grade}%</span>
      <div className="h-full flex-1 bg-muted rounded-2xl overflow-hidden relative min-h-[10px]">
        <div 
          className="absolute inset-0 bg-[#39FFC4] transition-all duration-500 ease-out rounded-r-2xl"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function CourseGrades({ course }: { course: StudentCourseGrades }) {
  if (!course) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">
        {course.course_name || course.course_id}
      </h2>

      
      {/* Exams Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Exams</h3>
        <div className="space-y-2">
          {course.exams && course.exams.length > 0 ? (
            course.exams.map((exam, index) => (
              <div key={index} className="flex items-center h-10 bg-muted/50 rounded-md">
                <div className="w-48 px-3">
                  <span className="font-medium">{exam.type}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                  </span>
                </div>
                <GradeBar grade={exam.grade} />
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm p-2">No exam grades yet</div>
          )}
        </div>
      </div>

      {/* Homeworks Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Homeworks</h3>
        <div className="space-y-2">
          {course.homeworks && course.homeworks.length > 0 ? (
            course.homeworks.map((homework, index) => (
              <div key={index} className="flex items-center h-10 bg-muted/50 rounded-md">
                <div className="w-48 px-3">
                  <span className="font-medium">Homework {homework.homework_number}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                  </span>
                </div>
                <GradeBar grade={homework.grade} />
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm p-2">No homework grades yet</div>
          )}
        </div>
      </div>
    </div>
  );
} 