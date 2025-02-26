import { NextResponse } from "next/server";
import fs from "fs/promises"; 
import path from "path";

const filePath = path.join(process.cwd(), "data", "records.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const records = JSON.parse(data);
    return NextResponse.json({ success: true, students: records.students || [] }, { status: 200 });
  } catch (error) {
    console.error("Error reading student data:", error.message);
    return NextResponse.json(
      { success: false, message: "Error reading student data", error: error.message },
      { status: 500 }
    );
  }
}
