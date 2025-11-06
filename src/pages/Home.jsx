import ResumeForm from '../components/ResumeForm/ResumeForm';
import logo from '../assets/resumeApp_logo.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <img 
                src={logo} 
                alt="Resume Form Logo" 
                className="h-20 w-20 md:h-24 md:w-24 object-contain animate-fadeIn"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Resume Form
            </h1>
            <p className="mt-3 text-lg text-gray-600">Create and submit your professional resume</p>
          </div>
        </div>
      </header>
      <main className="py-8">
        <ResumeForm />
      </main>
    </div>
  );
};

export default Home;

