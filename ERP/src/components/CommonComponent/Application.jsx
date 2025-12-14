import { useState } from "react";
import PersonalInfo from './PersonalInfo';
import AcademicDetails from './Academic';
import ReviewSubmit from './SubmitApp';
import Head from './HeadinRegister.jsx';
import Counter from './Counter.jsx';
import axios from "axios";

export default function ApplicationForm() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        isRequested: "false",
        academics: {
            course: "",
            semester: "1",
            sgpa: [],
            tenthSchool: "",
            tenthPercent: "",
            twelfthSchool: "",
            twelfthPercent: ""
        }
    });

    const validateStep = () => {
        if (step === 1) {
            const { fullname, email, phone, dob, gender, address,isRequested } = formData;
            if (!fullname || !email || !phone || !dob || !gender || !address || !profilePic || !isRequested) {
                setError("⚠️ Please fill all required Personal Info fields and upload a profile picture!");
                return false;
            }
            const phoneRegex = /^[1-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                setError("⚠️ Please enter a valid 10-digit phone number, and it should not start with 0.");
                return false;
            }
        } else if (step === 2) {
            const { course, semester, sgpa, tenthSchool, tenthPercent, twelfthSchool, twelfthPercent } = formData.academics;
            if (!course || !semester || !tenthSchool || !tenthPercent || !twelfthSchool || !twelfthPercent) {
                setError("⚠️ Please fill all required Academic Details fields!");
                return false;
            }
            if (Number(semester) > 1 && sgpa.length < semester - 1) {
                setError("⚠️ Please enter SGPA for all previous semesters!");
                return false;
            }
        }
        setError("");
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        console.log("Attempting submission...");
        if (validateStep()) {
            setIsSubmitting(true);
            setError("");
            setSuccess("");

            try {
                const data = new FormData();
                
                data.append("fullname", formData.fullname);
                data.append("email", formData.email);
                data.append("phone", formData.phone);
                data.append("dob", formData.dob);
                data.append("gender", formData.gender);
                data.append("address", formData.address);
                data.append("isRequested", formData.isRequested);

                data.append("course", formData.academics.course);
                data.append("semester", formData.academics.semester);
                data.append("tenthSchool", formData.academics.tenthSchool);
                data.append("tenthPercent", formData.academics.tenthPercent);
                data.append("twelfthSchool", formData.academics.twelfthSchool);
                data.append("twelfthPercent", formData.academics.twelfthPercent);

                formData.academics.sgpa.forEach((item) => {
                    data.append("sgpa", item);
                });

                if (profilePic) {
                    data.append("profilePic", profilePic);
                }

                const response = await axios.post(
                    `api/student/apply`,
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess("✅ Application submitted successfully!");
                    console.log("Application submitted:", response.data.data);
                } else {
                    setError(response.data.message || "Submission failed.");
                }
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.message || "An error occurred on the server.");
                    console.error("Server Error:", err.response.data);
                } else if (err.request) {
                    setError("No response from server. Check your backend.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
                console.error("Submission Error:", err);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-md bg-white max-w-3xl mx-auto">
            <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-lg font-semibold">Application Progress</h1>
                    <Counter />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <Head name="Personal Info" step={step} index={1} />
                    <Head name="Academic Details" step={step} index={2} />
                    <Head name="Review & Submit" step={step} index={3} />
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-2 bg-oklch(74.6% 0.16 232.661) rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-6">
                {step === 1 && (
                    <>
                        <PersonalInfo formData={formData} setFormData={setFormData} setProfilePic={setProfilePic} />
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    </>
                )}
                {step === 2 && (
                    <>
                        <AcademicDetails formData={formData} setFormData={setFormData} />
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    </>
                )}
                {step === 3 && (
                    <ReviewSubmit
                        formData={formData}
                        profilePic={profilePic}
                        isSubmitted={!!success}
                    />
                )}
            </div>
            <div className="flex justify-between mt-6">
                {step > 1 && (
                    <button onClick={prevStep} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Previous
                    </button>
                )}
                {step < 3 ? (
                    <button onClick={nextStep} className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
                        Next Step
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 flex items-center gap-1"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                )}
            </div>
            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>
    );
}