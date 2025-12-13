import React, { useState } from "react";
import { Button, TextField } from "../ui-components";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    loginApi({ userid, password }).then((resp) => {
      setAuth(resp?.data);
      localStorage.setItem("token", true);
      navigate("/");
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-5">
        {/* USER ID */}
        <TextField
          placeholder="Enter User ID"
          label="User ID"
          onChange={(e) => setUserid(e.target.value)}
        />

        {/* PASSWORD */}
        {/* PASSWORD */}
        <div className="relative">
          <TextField
            placeholder="Enter Password"
            label="Password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute 
              right-3 
              // top-1/2 
              translate-y-1/3 
              text-gray-500 
              hover:text-gray-700
            "
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <Button className="w-full" onClick={handleLogin} disabled = {!(userid && password)}>
          Login
        </Button>
      </div>
    </div>
  );
}
