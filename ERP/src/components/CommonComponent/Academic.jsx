export default function AcademicDetails({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      academics: { ...prev.academics, [name]: value }
    }));
  };

  const currentSemester = Number(formData.academics.semester) || 1;
  const sgpaCount = Math.max(currentSemester - 1, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Academic Details</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Course */}
        <div className="flex flex-col">
          <label className="mb-1">
            Course <span className="text-red-600">*</span>
          </label>
          <input
            name="course"
            value={formData.academics.course}
            onChange={handleChange}
            placeholder="Course (e.g., B.Tech CSE)"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>

        {/* Semester */}
        <div className="flex flex-col">
          <label className="mb-1">
            Semester <span className="text-red-600">*</span>
          </label>
          <input
            name="semester"
            type="number"
            min="1"
            max="8"
            value={formData.academics.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>

        {/* SGPA Inputs */}
        {sgpaCount > 0 && (
          <div className="flex flex-col col-span-2">
            <label className="mb-1">
              SGPA<span className="text-gray-500"></span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: sgpaCount }).map((_, i) => (
                <input
                  key={i}
                  type="number"
                 
                  min="0"
                  max="10"
                  value={formData.academics.sgpa[i] || ""}
                  onChange={(e) => {
                    let val = parseFloat(e.target.value) || 0;
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    const newSgpa = [...(formData.academics.sgpa || [])];
                    newSgpa[i] = val;
                    setFormData(prev => ({
                      ...prev,
                      academics: { ...prev.academics, sgpa: newSgpa }
                    }));
                  }}
                  placeholder={`Semester ${i + 1} SGPA`}
                  className="w-full p-2 rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* 10th Details */}
        <h3 className="col-span-2 font-semibold mt-4">10th Details</h3>
        <div className="flex flex-col">
          <label className="mb-1">
            School Name <span className="text-red-600">*</span>
          </label>
          <input
            name="tenthSchool"
            value={formData.academics.tenthSchool}
            onChange={handleChange}
            placeholder="School Name"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">
            Percentage <span className="text-red-600">*</span>
          </label>
          <input
            name="tenthPercent"
            type="number"
            step="1"
            min="0"
            max="100"
            value={formData.academics.tenthPercent}
            onChange={handleChange}
            placeholder="Percentage"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>

        {/* 12th Details */}
        <h3 className="col-span-2 font-semibold mt-4">12th Details</h3>
        <div className="flex flex-col">
          <label className="mb-1">
            School Name <span className="text-red-600">*</span>
          </label>
          <input
            name="twelfthSchool"
            value={formData.academics.twelfthSchool}
            onChange={handleChange}
            placeholder="School Name"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">
            Percentage <span className="text-red-600">*</span>
          </label>
          <input
            name="twelfthPercent"
            type="number"
            step="1"
            min="0"
            max="100"
            value={formData.academics.twelfthPercent}
            onChange={handleChange}
            placeholder="Percentage"
            className="w-full p-2 rounded bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
}
