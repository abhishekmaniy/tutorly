import { CoursePage } from "@/components/course-page"

export default function Course({ params }: { params: { id: string } }) {
  return <CoursePage courseId={params.id} />
}
