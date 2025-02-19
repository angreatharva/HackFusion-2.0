import { useState } from "react";

function EditForm({ app, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({ ...app });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(app._id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 rounded"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 p-2 rounded text-white">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 p-2 rounded text-white">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditForm;
