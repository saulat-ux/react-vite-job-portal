import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function MainPage() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [editingJob, setEditingJob] = useState(null); // Track the job being edited
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const authToken = localStorage.getItem("authToken");

  // Function to handle modal open and close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditingJob(null); // Reset the editing job when modal is closed
    setOpen(false);
  };

  // Fetch job posts when the component loads
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_JOB_POSTS_URL}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setJobs(response.data);
      } catch (err) {
        setError("Error fetching job posts. Please try again later.");
      }
    };

    fetchJobs();
  }, [authToken]);

  // Function to create a new job post
  const createJob = async () => {
    try {
      const newJobData = {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_JOB_POSTS_URL}`,
        newJobData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Add the newly created job to the list
      setJobs([...jobs, response.data]);

      // Reset the form and close the modal
      setNewJob({ title: "", description: "", location: "" });
      handleClose();
    } catch (err) {
      setError("Error creating job post. Please try again later.");
    }
  };

  // Function to update an existing job post
  const updateJob = async (id) => {
    try {
      const updatedJobData = {
        title: editingJob.title,
        description: editingJob.description,
        location: editingJob.location,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_JOB_POSTS_URL}${id}/`,
        updatedJobData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Update the job in the list
      setJobs(jobs.map((job) => (job.id === id ? response.data : job)));
      setEditingJob(null); // Reset the editing job
    } catch (err) {
      setError("Error updating job post. Please try again later.");
    }
  };

  // Function to delete a job post
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_JOB_POSTS_URL}${id}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setJobs(jobs.filter((job) => job.id !== id)); // Remove the deleted job from the list
    } catch (err) {
      setError("Error deleting job post. Please try again later.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Job Portal
      </Typography>

      {/* Button to open modal */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create New Job
        </Button>
      </Box>

      {/* Modal for creating or editing a job */}
      <Modal
        open={open || !!editingJob}
        onClose={handleClose}
        aria-labelledby="job-modal"
        aria-describedby="job-form"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {editingJob ? "Edit Job" : "Create a New Job"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Job Title"
            value={editingJob ? editingJob.title : newJob.title}
            onChange={(e) =>
              editingJob
                ? setEditingJob({ ...editingJob, title: e.target.value })
                : setNewJob({ ...newJob, title: e.target.value })
            }
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Description"
            value={editingJob ? editingJob.description : newJob.description}
            onChange={(e) =>
              editingJob
                ? setEditingJob({ ...editingJob, description: e.target.value })
                : setNewJob({ ...newJob, description: e.target.value })
            }
            multiline
            rows={4}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Location"
            value={editingJob ? editingJob.location : newJob.location}
            onChange={(e) =>
              editingJob
                ? setEditingJob({ ...editingJob, location: e.target.value })
                : setNewJob({ ...newJob, location: e.target.value })
            }
            variant="outlined"
          />
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            {editingJob ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateJob(editingJob.id)}
              >
                Save Changes
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={createJob}>
                Create Job
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Display Job Posts */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
        }}
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {job.location}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditingJob(job); // Set the job to be edited
                    handleOpen();
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteJob(job.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="h6" color="text.secondary">
            You have no jobs created.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MainPage;
