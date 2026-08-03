import { useState } from 'react';
import { Link } from 'react-router';
import { KeyRound } from 'lucide-react';
import { forgotPassword } from '../../api/client';
import { Field, Input, Button, Banner } from '../../components/admin/Ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-marigold-100 text-marigold-500 flex items-center justify-center mb-3">
            <KeyRound size={22} />
          </div>
          <h1 className="font-display text-xl text-navy-800">Reset Your Password</h1>
          <p className="text-sm text-navy-500 mt-1">Enter your admin email to get a reset link</p>
        </div>

        {error && (
          <div className="mb-4">
            <Banner type="error">{error}</Banner>
          </div>
        )}

        {done ? (
          <Banner type="success">
            If an account exists for that email, a reset link has been sent. It expires in 1 hour and can only be used once.
          </Banner>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swastikcollege.edu.np"
              />
            </Field>
            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <p className="text-xs text-navy-400 text-center mt-6">
          <Link to="/admin/login" className="text-marigold-500 font-medium">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}