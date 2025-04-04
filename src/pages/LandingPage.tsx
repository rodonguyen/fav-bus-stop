import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Auth from '../Auth';


const LandingPage: React.FC = () => {
  const { isDarkTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-12 p-8 lg:max-w-4xl lg:mx-auto relative">
          <h1 className="text-3xl font-bold">Fav Stop</h1>
          <div className="flex items-center">
            <ThemeToggle className="mr-4" />
            <button 
              onClick={handleLoginClick}
              className="btn btn-primary"
            >
              Login
            </button>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-screen h-[1px] bg-gradient-to-r from-transparent via-base-content/20 to-transparent"></div>
        </header>

        <main className="pb-8">
          <div className="hero min-h-[60vh]">
            <div className="hero-content flex-col lg:flex-row px-0">
              <div className="max-w-md p-6">
                <h1 className="text-5xl font-bold">One Place for all Your Stops</h1>
                <p className="py-2">
                  Keep track of your favorite bus stops and see real-time departure information.
                </p>
                <p className="pb-6 text-secondary">
                  Ever thought "I JUST WANT to know when my bus arrives"? This app is for you 👍
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={handleLoginClick}
                >
                  Get Started
                </button>
              </div>
              
              <div className={`card w-full max-w-md ${isDarkTheme ? 'bg-base-300' : 'bg-base-100'} shadow-xl ml-0 lg:ml-8`}>
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="text-center text-error w-[50%]">Other Apps</th>
                          <th className="text-center text-success w-[50%]">Fav Stop 🚌</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>❌ Complicated interface</span>
                            </div>
                          </td>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>✅ All you need for your <b>frequent routes</b></span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>❌ Laggggg</span>
                            </div>
                          </td>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>✅ Real-time departure info</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>❌ Too-many steps</span>
                            </div>
                          </td>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>✅ Know if your bus is <b>5-minute early</b></span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>❌ 90% features are untouched when you already know where you want to go</span>
                            </div>
                          </td>
                          <td className="align-top">
                            <div className="flex items-start">
                              <span>✅ One dashboard to rule them all!</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Auth isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
}

export default LandingPage; 