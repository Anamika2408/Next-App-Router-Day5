import { NextResponse } from "next/server";
import fs from "fs/promises"; 
import path from "path";

const filePath = path.join(process.cwd(), "data", "records.json");

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const teacherId = parseInt(id, 10); 
    const data = await fs.readFile(filePath, "utf-8");
    const records = JSON.parse(data);
    const teacher = records.teachers.find((t) => t.id === teacherId);
    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }
    const studentsUnderTeacher = records.students.filter((s) => s.teacherId === teacherId);

    return NextResponse.json({ success: true, teacher, students: studentsUnderTeacher }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return NextResponse.json(
      { success: false, message: "Error fetching students", error: error.message },
      { status: 500 }
    );
  }
}
