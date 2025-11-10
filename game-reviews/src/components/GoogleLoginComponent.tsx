import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginComponent() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    const res = await fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await res.json();

    login(data.token);
    navigate("/");
  };

  const handleError = () => {
    console.log("Fallo el login con Google");
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
