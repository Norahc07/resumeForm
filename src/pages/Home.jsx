import ResumeForm from '../components/ResumeForm/ResumeForm';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="mt-2 text-gray-600">Create and submit your professional resume</p>
        </div>
      </header>
      <main>
        <ResumeForm />
      </main>
    </div>
  );
};

export default Home;

