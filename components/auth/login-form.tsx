'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLoading } from '@/lib/loading-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { loginValidator } from "@/validator/login.validator"
import { LoadingOverlay } from '../ui/loading-overlay';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = loginValidator.validate({ email, password });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      toast.error(messages);
      return;
    }

    showLoading("Logging you in...");
    try {
      await login(email, password);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "Login failed");
    } finally {
      hideLoading();
    }

  };



  const handleSendVerificationCode = () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Mock sending verification code
    const mockUsers = ['admin@example.com', 'employee@example.com'];
    if (mockUsers.includes(resetEmail)) {
      toast.success('If your email is found in our system, you will receive a verification code shortly');
    } else {
      toast.success('If your email is found in our system, you will receive a verification code shortly');
    }
    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Team</h2>
          <p className="text-gray-500">Enter your credentials to continue</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" type="submit">
              Sign in
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot your password?
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a verification code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleSendVerificationCode}
            >
              Send Verification Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <LoadingOverlay isVisible={loading} message="Taking you in...." />
    </div>
  );
}