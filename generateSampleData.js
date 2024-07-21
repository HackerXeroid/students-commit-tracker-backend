const mongoose = require("mongoose");
const faker = require("faker");

const User = require("./models/UserModel");
const Assignment = require("./models/AssignmentModel");
const Submission = require("./models/SubmissionModel");

const generateData = async () => {
  try {
    const students = [];
    for (let i = 0; i < 50; i++) {
      const student = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "student",
      });
      await student.save();
      students.push(student);
    }

    const assignments = [];
    for (let i = 0; i < 10; i++) {
      const assignment = new Assignment({
        title: `Assignment ${i + 1}`,
        description: faker.lorem.sentence(),
        dueDate: faker.date.future(),
      });

      await assignment.save();
      assignments.push(assignment);
    }

    const submissions = [];
    for (let i = 0; i < 1000; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const assignment =
        assignments[Math.floor(Math.random() * assignments.length)];

      const submission = new Submission({
        student: student._id,
        assignment: assignment._id,
        submissionDate: faker.date.between(assignment.dueDate, new Date()),
        githubLink: `https://github.com/${student.name.replace(
          " ",
          ""
        )}/assignment-${assignment._id}`,
        score: faker.datatype.number({
          min: 0,
          max: 100,
        }),
        feedback: faker.lorem.sentence(),
      });

      await submission.save();
      submissions.push(submission);
    }
    console.log(`Generated ${students.length} students`);
    console.log(`Generated ${assignments.length} assignments`);
    console.log(`Generated ${submissions.length} submissions`);
  } catch (err) {
    console.error("Error generating data:", err);
  } finally {
    mongoose.disconnect();
  }
};

module.exports = { generateData };
