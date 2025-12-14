import ApplicationForm from './Application'
export default function Register()
{
    return (
<div className='flex flex-col justify-center items-center bg-gray-100 p-4 shadow-sm' >{/* Card */}
<div className="flex items-center justify-between w-2/3 mb-10 bg-gray-200 p-6 rounded-2xl">
  {/* Left side */}
  <div>
    <h1 className="text-lg font-semibold">Registration</h1>
    <p className="text-gray-600">Complete your application for university registration</p>
  </div>
  
  {/* Right side badge */}
  <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
    Application In Progress
  </span>
</div>

{/* Separate section below the card */}
<div className='w-2/3'>
<ApplicationForm/>
</div>

   
</div>
    );
}