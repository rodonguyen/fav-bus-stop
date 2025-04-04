import React, { useState } from 'react';
import supabase from '../supabase/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the login link!');
      onClose(); // Close the modal after successful login request
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        alert(error.message);
      }
      // No need to set loading to false on success as the page will redirect
    } catch (error) {
      setLoading(false);
      alert('Error signing in with Google');
      console.error(error);
    }
  };

  return (
    <>
      <input 
        type="checkbox" 
        id="auth-modal" 
        className="modal-toggle" 
        checked={isOpen} 
        onChange={onClose}
        aria-label="Toggle authentication modal" 
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Login to Fav Bus Stop</h3>
          
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full flex items-center justify-center gap-2 mt-4 mb-2"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Sign in with Google
          </button>
          
          <div className="divider">Or</div>
          
          <p className="py-2">Sign in via magic link with your email below</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? <span>Loading...</span> : <span>Send magic link</span>}
            </button>
          </form>
          
          <div className="modal-action">
            <button onClick={onClose} className="btn">Close</button>
          </div>
        </div>
      </div>
    </>
  );
} 

export default AuthModal;