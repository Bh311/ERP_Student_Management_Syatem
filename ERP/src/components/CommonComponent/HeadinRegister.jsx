export default function Head({ name, step, index }) {
  // Default gray
  let bgColor = "bg-gray-200 text-gray-700"; 

  if (step === index) {
    bgColor = "bg-[oklch(74.6%_0.16_232.661)] text-white"; // current step
  } else if (step > index) {
    bgColor = "bg-[oklch(74.6%_0.16_232.661)] text-white"; // completed step
  }

  return (
    <div className={`p-2 rounded-lg text-center font-semibold ${bgColor}`}>
      {name}
    </div>
  );
}
