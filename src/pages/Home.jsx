import ResumeForm from '../components/ResumeForm/ResumeForm';
import logo from '../assets/resumeAppLogo.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-3 sm:mb-4">
              <img 
                src={logo} 
                alt="Resume Form Logo" 
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain animate-fadeIn"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-2">
              Resume Form
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-600 px-2">
              Create and submit your professional resume
            </p>
          </div>
        </div>
      </header>
      <main className="py-4 sm:py-6 md:py-8">
        <ResumeForm />
      </main>
    </div>
  );
};

export default Home;

