import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsData = assignments;
let commentsData = comments;

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ดูข้อมูลทั้งหมด และกำหนด Query Parameter

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentWithLimit = assignmentsData.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentWithLimit,
  });
});

// ดูข้อมูลแต่ละตัวโดยใช้ Endpoint Parameter

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentId = assignmentsData.filter((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (assignmentId.length === 0) {
    return res.status(404).json({
      message: "Assignment not found",
    });
  }

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentId[0],
  });
});

// สร้างข้อมูลบน Server

app.post("/assignments", (req, res) => {
  assignmentsData.push({
    id: assignmentsData[assignmentsData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
  });
});

// ลบข้อมูลบน Server แต่ละอันด้วย ID

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const newAssignmentData = assignmentsData.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  const originalLength = assignmentsData.length;

  if (newAssignmentData.length === originalLength) {
    return res.status(404).json({
      message: "Cannot delete, No data available!",
    });
  }

  assignmentsData = newAssignmentData;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

// แก้ไขข้อมูลบน Server

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  let assignmentIndex = assignmentsData.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (assignmentIndex === -1) {
    return res.status(404).json({
      message: "Cannot update, No data available!",
    });
  }

  assignmentsData[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    data: assignmentsData[assignmentIndex],
  });
});

// ดู Comment ของ Assignment นั้นๆด้วย ID

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const assignmentCommentId = assignmentsData.filter((item) => {
    return item.id === assignmentIdFromClient;
  });

  return res.json({
    message: "Complete fetching comments",
    data: assignmentCommentId,
  });
});

// เพิ่ม Comment เข้าไปใน Assignment นั้นๆด้วย ID

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  assignmentsData.push({
    id: assignmentsData[assignmentsData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: assignmentsData[assignmentIdFromClient],
  });
});
