import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner, Badge, Alert } from 'react-bootstrap';

const PredictiveSuggestions = () => {
  const patientId = 48; // or get from auth/session
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [risk, setRisk] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSuggestion = () => {
    setLoading(true);
    setMessage('');
    setError('');

    axios.post(`http://localhost:5000/api/predictive-suggestions/${patientId}`)
      .then(res => {
        const { risk, suggestion } = res.data;
        setRisk(risk);
        setSuggestion(suggestion);
        setMessage('Suggestion updated successfully.');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch predictive suggestion.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary mb-4">Your Predictive Health Suggestions</h3>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Generating suggestions...</p>
        </div>
      )}

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {suggestion && (
        <Card className="shadow-lg p-4 border-0">
          <h5>
            Risk Level:{" "}
            <Badge bg={risk === "High Risk" ? "danger" : "success"}>{risk}</Badge>
          </h5>

          <hr />

          <div className="mt-3">
            <h6 className="text-primary">Diet Plan</h6>
            <p>{suggestion.diet}</p>
          </div>

          <div className="mt-3">
            <h6 className="text-primary">Exercise Plan</h6>
            <p>{suggestion.exercise}</p>
          </div>

          <div className="mt-3">
            <h6 className="text-primary">Lifestyle Tips</h6>
            <p>{suggestion.lifestyle}</p>
          </div>

          
          <div className="text-end mt-4">
            <Button variant="outline-primary" onClick={fetchSuggestion}>
              Recalculate Suggestion
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PredictiveSuggestions;
