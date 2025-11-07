import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <LoginForm
      onSubmit={(email, password) => {
        console.log("Login:", { email, password });
        setLocation("/");
      }}
      onForgotPassword={() => console.log("Forgot password")}
    />
  );
}
