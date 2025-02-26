"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayTeachers, setDisplayTeachers] = useState(false);
  const [displayStudents, setDisplayStudents] = useState(false);

  async function fetchTeachers() {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher");
      const data = await res.json();
      if (data.success) setTeachers(data.teachers);
      setDisplayTeachers(true);
      setDisplayStudents(false);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch("/api/student");
      const data = await res.json();
      if (data.success) setStudents(data.students);
      setDisplayStudents(true);
      setDisplayTeachers(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudentsUnderTeacher(teacherId) {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/${teacherId}`);
      const data = await res.json();
      if (data.success) {
        setFilteredStudents(data.students);
        setSelectedTeacher(data.teacher);
      }
    } catch (error) {
      console.error("Error fetching students under teacher:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Teachers & Students Management</h1>
      <div className="button-group">
        <button onClick={fetchTeachers}>Show Teachers</button>
        <button onClick={fetchStudents}>Show Students</button>
      </div>

      {displayTeachers && (
        <div className="section">
          <h2>Available Teachers</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <ul>
              {teachers.map((teacher) => (
                <li key={teacher.id}>
                  <strong>{teacher.name}</strong> - {teacher.subject}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {displayStudents && (
        <div className="section">
          <h2>Available Students</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <ul>
              {students.map((student) => (
                <li key={student.id}>
                  <strong>{student.name}</strong> - Course: {student.course}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="selection-box">
        <label>Select a Teacher:</label>
        <select onChange={(e) => fetchStudentsUnderTeacher(e.target.value)}>
          <option value="">-- Choose a Teacher --</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.subject}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacher && (
        <div className="section">
          <h2>Students under {selectedTeacher.name}</h2>
          {loading ? (
            <p className="loading">Fetching students...</p>
          ) : filteredStudents.length > 0 ? (
            <ul>
              {filteredStudents.map((student) => (
                <li key={student.id}>
                  <strong>{student.name}</strong> - Course: {student.course}
                </li>
              ))}
            </ul>
          ) : (
            <p>No students found.</p>
          )}
        </div>
      )}
    </div>
  );
}
