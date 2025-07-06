"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLoading } from "@/lib/loading-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { loginValidator } from "@/validator/login.validator";
import { LoadingOverlay } from "../ui/loading-overlay";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useUserStore } from "@/store/userStore";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserSession } = useUserStore();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const { error } = loginValidator.validate({ email, password });

  //   if (error) {
  //     const messages = error.details.map((d) => d.message).join(", ");
  //     toast.error(messages);
  //     return;
  //   }

  //   showLoading("Logging you in...");

  //   try {
  //     await login(email, password);
  //     toast.success("Login successful");
  //     router.push("/dashboard");
  //   } catch (error) {
  //     toast.error("Login failed");
  //   } finally {
  //     // setLoading(false);
  //     hideLoading();
  //   }
  // };

  const handleSendVerificationCode = () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Mock sending verification code
    const mockUsers = ["admin@example.com", "employee@example.com"];
    if (mockUsers.includes(resetEmail)) {
      toast.success(
        "If your email is found in our system, you will receive a verification code shortly"
      );
    } else {
      toast.success(
        "If your email is found in our system, you will receive a verification code shortly"
      );
    }
    setShowForgotPassword(false);
    setResetEmail("");
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log(values, "valll");
    // const res = await login(values?.email, values?.password);
    // if(res){
    //   toast.success("Login successful");
    // setUserSession({
    //   accessToken: res?.login?.token || "",
    //   user: res?.login?.user!,
    // });
    // }else{
    //   toast.error("Login failed");
    // }
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={"Email..."}
                      className={`input-field ${
                        error?.message ? "error-field" : ""
                      }`}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="*****"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="error-message" />
                </FormItem>
              )}
            />

            <p className="paragraph-2 text-primary-900 hover:text-primary text-right flex justify-end">
              <span
                className="cursor-pointer"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </span>
            </p>

            <Button size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : " Sign in"}
            </Button>
          </form>
        </Form>
        {/* <form onSubmit={handleSubmit}>
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
        </form> */}
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
            <Button className="w-full" onClick={handleSendVerificationCode}>
              Send Verification Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <LoadingOverlay isVisible={loading} message="Taking you in...." />
    </div>
  );
}
