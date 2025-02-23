import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import { motion } from "framer-motion";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const ApplicationForm = ({ onApplicationSubmit }) => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the unique tab identifier
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    // If token does not exist, navigate to login page
    if (!token) {
      navigate("/");
    } else {
      // Set the user info (name, role) into the state
      setUserInfo({ name, role });
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    contactNo: "",
    type: "Event Organization",
    eventName: "",
    requestedBudget: "",
    justification: "",
    supportingDoc: "",
  });

  const [token, setToken] = useState("");

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedToken = localStorage.getItem(`authToken_${tabId}`);

    if (!storedToken) {
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, supportingDoc: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized: Please log in again.");

    try {
      await axios.post(
        "http://localhost:8000/api/applications",
        { ...formData, priority: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Application submitted successfully!");
      setFormData({
        studentName: "",
        email: "",
        contactNo: "",
        type: "Event Organization",
        eventName: "",
        requestedBudget: "",
        justification: "",
        supportingDoc: "",
      });

      if (onApplicationSubmit) {
        onApplicationSubmit();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <Container className="mt-5">
      <Sidebar userInfo={userInfo} />

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0 p-4 rounded-4">
              <h2 className="text-center mb-4 fw-bold text-primary">
                📜 Submit Application
              </h2>

              <Form onSubmit={handleSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>👤 Student Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📧 Email ID</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📞 Contact No</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📌 Application Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="Event Organization">
                          🎉 Event Organization
                        </option>
                        <option value="Budget Request">
                          💰 Budget Request
                        </option>
                        <option value="Sponsorship">🤝 Sponsorship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>📌 Event/Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>💵 Requested Budget</Form.Label>
                      <Form.Control
                        type="number"
                        name="requestedBudget"
                        value={formData.requestedBudget}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>✍️ Justification/Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="justification"
                        rows={3}
                        value={formData.justification}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>📎 Upload Supporting Document</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 shadow-sm"
                >
                  🚀 Submit Application
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={10} lg={8}>
          <Card className="shadow-sm rounded-4">
            <Card.Body>
              <h4 className="text-center mb-4 fw-bold text-secondary">
                📋 Application Overview
              </h4>
              <Table bordered hover responsive className="text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData).map(([key, value]) => (
                    <tr key={key}>
                      <td className="fw-bold">{key}</td>
                      <td>{value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationForm;
