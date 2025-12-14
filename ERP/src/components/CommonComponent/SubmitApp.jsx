export default function ReviewSubmit({ formData, profilePic, isSubmitted }) {
    const sgpaArray = (formData.academics?.sgpa || []).filter(
        (val) => val >= 0 && val <= 10
    );
    const cgpa = sgpaArray.length
        ? (sgpaArray.reduce((sum, val) => sum + Number(val), 0) / sgpaArray.length).toFixed(2)
        : "-";
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Full Name</label>
                    <p className="p-2 rounded bg-gray-200">{formData.fullname || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Email</label>
                    <p className="p-2 rounded bg-gray-200">{formData.email || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Phone</label>
                    <p className="p-2 rounded bg-gray-200">{formData.phone || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Date of Birth</label>
                    <p className="p-2 rounded bg-gray-200">{formData.dob || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Gender</label>
                    <p className="p-2 rounded bg-gray-200">{formData.gender || "-"}</p>
                </div>
                <div className="flex flex-col col-span-2">
                    <label className="mb-1 font-medium">Address</label>
                    <p className="p-2 rounded bg-gray-200">{formData.address || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Course</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.course || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Current Semester</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.semester || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">10th School</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.tenthSchool || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">10th Percentage</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.tenthPercent || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">12th School</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.twelfthSchool || "-"}</p>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">12th Percentage</label>
                    <p className="p-2 rounded bg-gray-200">{formData.academics?.twelfthPercent || "-"}</p>
                </div>
                {formData.academics?.sgpa?.length > 0 && (
                    <div className="flex flex-col col-span-2">
                        <label className="mb-1 font-medium">Previous Semesters SGPA</label>
                        <ul className="p-2 rounded bg-gray-200">
                            {formData.academics.sgpa.map((score, index) => (
                                <li key={index}>Semester {index + 1}: {score}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">CGPA</label>
                    <p className="p-2 rounded bg-gray-200">{cgpa}</p>
                </div>
                <div className="flex flex-col col-span-2 items-start mt-4">
                    <label className="mb-1 font-medium">Profile Picture</label>
                    {profilePic ? (
                        <img
                            src={URL.createObjectURL(profilePic)}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                        />
                    ) : (
                        <p className="text-gray-500">No profile picture uploaded.</p>
                    )}
                </div>
            </div>
            {isSubmitted && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="font-semibold mb-2">Application Status</h3>
                    <p className="p-2 rounded bg-gray-200">Application Submitted</p>
                    <p className="text-sm text-gray-600 mt-1">{formattedDate} at {formattedTime}</p>
                    <p className="mt-2 font-medium text-yellow-600">Under Review</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Your application is being reviewed by our admissions team. You will be notified once a decision is made.
                    </p>
                </div>
            )}
        </div>
    );
}