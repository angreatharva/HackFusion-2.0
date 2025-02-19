import { useState } from "react";
import BudgetTracker from "../components/BudgetTracker";

const Budget = () => {
  const [proofs, setProofs] = useState([]);  // State to handle uploaded proofs

  const handleProofUpload = (newProof) => {
    // Handle the logic for uploading the proof and updating state
    setProofs((prevProofs) => [...prevProofs, newProof]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">💰 Budget & Sponsorship</h1>
      <BudgetTracker onProofUpload={handleProofUpload} proofs={proofs} />
    </div>
  );
};

export default Budget;
