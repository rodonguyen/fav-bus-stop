import React, { useState } from 'react';
import supabase from './supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Auth: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
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
          <p className="py-4">Sign in via magic link with your email below</p>
          
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

export default Auth;