const Assignment = require('../models/AssignmentModel'); // Ensure this path is correct

// Get all assignments
async function getAssignments(req, res) {
  try {
    // Fetch assignments from the database
    const assignments = await Assignment.find().sort({ createdAt: -1 });

    // Modify the assignment objects to include an 'id' field instead of '_id'
    const assignmentsWithId = assignments.map(assignment => ({
      id: assignment._id.toString(), // Convert _id to a string and assign it to id
      title: assignment.title,
      description: assignment.description,
      totalScore: assignment.totalScore,
      dueDate: assignment.dueDate,
    }));

    // Send the modified assignments array as a JSON response
    res.status(200).json(assignmentsWithId);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments', error: err.message });
  }
}

// Create a new assignment
async function createAssignment(req, res) {
  try {
    const { title, description, totalScore, dueDate } = req.body;

    // Validate required fields
    if (!title || !dueDate || !totalScore || !dueDate) {
      return res.status(400).json({ message: 'Oops... You missed something.' });
    }

    const newAssignment = new Assignment({
      title,
      description,
      totalScore,
      dueDate,
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating assignment', error: err.message });
  }
}

// Edit an existing assignment
async function editAssignment(req, res) {
  try {
    const assignmentId = req.params.id;
    const updateData = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(assignmentId, updateData, { new: true });

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating assignment', error: err.message });
  }
}

// Delete an assignment
async function deleteAssignment(req, res) {
  try {
    const assignmentId = req.params.id;

    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting assignment', error: err.message });
  }
}

module.exports = { getAssignments, createAssignment, editAssignment, deleteAssignment };
