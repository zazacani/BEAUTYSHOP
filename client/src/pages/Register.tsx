import RegisterForm from "@/components/RegisterForm";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();

  return (
    <RegisterForm
      onSubmit={(name, email, password) => {
        console.log("Register:", { name, email, password });
        setLocation("/");
      }}
    />
  );
}
