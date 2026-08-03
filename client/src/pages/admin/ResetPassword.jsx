import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { KeyRound } from 'lucide-react';
import { resetPassword } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Field, Input, Button, Banner } from '../../components/admin/Ui';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its token.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { admin } = await resetPassword(token, password);
      setDone(true);
      // Log the admin straight in with their new password.
      await login(admin.email, password);
      setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err) {
      setError(err.message || 'Could not reset your password');
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
          <h1 className="font-display text-xl text-navy-800">Set a New Password</h1>
          <p className="text-sm text-navy-500 mt-1">Choose a new password for your admin account</p>
        </div>

        {error && (
          <div className="mb-4">
            <Banner type="error">{error}</Banner>
          </div>
        )}
        {done && !error && (
          <div className="mb-4">
            <Banner type="success">Password reset. Signing you in…</Banner>
          </div>
        )}

        {!done && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="New Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </Field>
            <Field label="Confirm Password">
              <Input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Resetting…' : 'Reset Password'}
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