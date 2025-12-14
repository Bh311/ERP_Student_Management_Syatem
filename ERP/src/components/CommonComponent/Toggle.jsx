import React from "react";

export default function Toggle({
    role,
    setRole,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
}) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-8 w-[400px]">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                {role === "admin" ? "Admin Login" : "Student Login"}
            </h2>
            {error && (
                <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label className="mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-gray-200"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1">Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-oklch(80.8% 0.114 19.571) text-black border border-black py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                {role === "admin" ? (
                    <>
                        Login as Admin.{" "}
                        <button type="button" onClick={() => setRole("student")} className="text-blue-600 hover:underline">
                            Switch to Student
                        </button>
                    </>
                ) : (
                    <>
                        Login as Student.{" "}
                        <button type="button" onClick={() => setRole("admin")} className="text-blue-600 hover:underline">
                            Switch to Admin
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}