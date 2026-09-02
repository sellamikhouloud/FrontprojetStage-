import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import { useAuth } from "../../components/Providers/AuthProvider";

import LoginIllustration from "../../assets/LoginIcon.svg";
import LoginIllustrationMob from "../../assets/LoginMob.svg";
import Wave from "../../assets/Vector3.svg";
import Vector from "../../assets/Vector.svg";
import Vector1 from "../../assets/Vector1.svg";
import Vector2 from "../../assets/Vector2.svg";
import WaveM from "../../assets/Vector4.svg";

const Login = () => {
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Separate errors for each field
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= AUTH =================

  const { login } = useAuth();

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setIdError("");
    setPasswordError("");

    // VALIDATION
    let hasError = false;

    // ID validation
    if (!adminID.trim()) {
      setIdError("Veuillez saisir votre identifiant.");
      hasError = true;
    }

    // Password validation
    if (!password) {
      setPasswordError("Veuillez saisir votre mot de passe.");
      hasError = true;
    }

    // Stop here if there are validation errors
    if (hasError) {
      return;
    }

    // LOGIN
    try {
      setLoading(true);

      console.log("================================");
      console.log("LOGIN");
      console.log("Username:", adminID);
      console.log("================================");

      const user = await login(
        adminID.trim(),
        password
      );

      console.log("LOGIN SUCCESS");
      console.log("User:", user);

      // Login successful
    if (user?.role === "admin") {
  navigate("/dashboard");
} else if (user?.role === "chef_coordinator") {
  navigate("/dashboardChef");
} else if (user?.role === "coordinator") {
  navigate("/dashboardCoor");
} else {
  setPasswordError("Rôle utilisateur non reconnu.");
}

    } catch (err) {
      console.error("================================");
      console.error("LOGIN ERROR");
      console.error("Error:", err);
      console.error("Response:", err.response);
      console.error("Request:", err.request);
      console.error("Message:", err.message);
      console.error("================================");

      // SERVER RESPONSE
      if (err.response) {
        const data = err.response.data;

        const message =
          data?.detail ||
          data?.message ||
          "Identifiant ou mot de passe incorrect.";

        setPasswordError(message);
      }

      // REQUEST SENT BUT NO RESPONSE
      else if (err.request) {
        setPasswordError(
          "Impossible de contacter le serveur."
        );
      }

      // OTHER ERROR
      else {
        setPasswordError(
          err.message ||
          "Une erreur est survenue."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">

      {/* =====================================================
          DESKTOP VERSION
      ===================================================== */}

      <div className="hidden md:block relative min-h-screen">

        {/* ================= TOP DECORATION ================= */}

        <div className="absolute top-0 left-0 w-full h-[110px]">

          <img
            src={Wave}
            alt=""
            className="absolute w-full h-[172px] object-fill"
          />

          <img
            src={Vector}
            alt=""
            className="absolute top-0 right-0 h-full"
          />

          <img
            src={Vector1}
            alt=""
            className="absolute top-0 right-0 h-full"
          />

          <img
            src={Vector2}
            alt=""
            className="absolute top-0 right-0 h-full"
          />

        </div>

        {/* ================= CONTENT ================= */}

        <div className="relative z-10 flex items-center justify-center min-h-screen mr-20">

          <div className="w-full max-w-[1220px] flex items-center justify-between px-12">

            {/* ================= ILLUSTRATION ================= */}

            <div className="w-[550px] flex justify-center ml-20 mt-20">

              <img
                src={LoginIllustration}
                alt="Login"
                className="w-[550px]"
              />

            </div>

            {/* ================= FORM ================= */}

            <div className="w-[384px] ml-30 mt-30">

              <h1 className="text-[34px] font-bold text-[#4E9F8A] pb-8">
                Log In
              </h1>

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >

                {/* ================= IDENTIFIANT ================= */}

                <InputField
                  label="Identifiant professionnel"
                  placeholder="Saisie de l'identifiant"
                  value={adminID}
                  setValue={setAdminID}
                  icon={<User size={18} />}
                  error={idError}
                  setError={setIdError}
                />

                {/* ================= PASSWORD ================= */}

                <InputField
                  label="Mot de passe"
                  placeholder="Saisie votre mot de passe"
                  value={password}
                  setValue={setPassword}
                  password
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={passwordError}
                  setError={setPasswordError}
                />

                {/* ================= BUTTON ================= */}

                <div className="pt-4">

                  <Button
                    title={
                      loading
                        ? "Connexion..."
                        : "Log In"
                    }
                    type="submit"
                    variant="primary"
                    noPadding={true}
                  />

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MOBILE VERSION
      ===================================================== */}

      <div className="md:hidden min-h-screen bg-white relative overflow-hidden">

        {/* ================= TOP WAVE ================= */}

        <div className="absolute top-0 left-0 w-full overflow-hidden">

          <img
            src={WaveM}
            alt=""
            className="w-full h-full object-cover pt-3"
          />

        </div>

        {/* ================= CONTENT ================= */}

        <div className="relative z-10 px-7 pt-9">

          {/* ================= TITLE ================= */}

          <h1 className="text-[34px] font-bold text-[#4E9F8A]">
            Log In
          </h1>

          {/* ================= ILLUSTRATION ================= */}

          <div className="flex justify-center mb-10">

            <img
              src={LoginIllustrationMob}
              alt="Login"
              className="w-[260px] h-auto"
            />

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================= IDENTIFIANT ================= */}

            <div>

              <label className="block text-[14px] font-medium mb-2">
                Identifiant professionnel
              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Saisie de l'identifiant"
                  value={adminID}
                  onChange={(e) => {
                    setAdminID(e.target.value);

                    // Remove error when user starts typing
                    if (e.target.value.trim()) {
                      setIdError("");
                    }
                  }}
                  className="
                    w-full
                    h-[36px]
                    rounded-[13px]
                    border
                    border-[#4E9F8A]
                    px-3
                    pr-9
                    text-[12px]
                    placeholder:text-[12px]
                    outline-none
                    focus:ring-2
                    focus:ring-[#4E9F8A]
                  "
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">

                  <User size={15} />

                </div>

              </div>

              {/* ID ERROR */}

              {idError && (
                <p className="text-red-500 text-xs mt-1">
                  {idError}
                </p>
              )}

            </div>

            {/* ================= PASSWORD ================= */}

            <div>

              <label className="block text-[14px] font-medium mb-2">
                Mot de passe
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Saisie votre mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    // Remove error when user starts typing
                    if (e.target.value) {
                      setPasswordError("");
                    }
                  }}
                  className="
                    w-full
                    h-[36px]
                    rounded-[13px]
                    border
                    border-[#4E9F8A]
                    px-3
                    pr-9
                    text-[12px]
                    placeholder:text-[12px]
                    outline-none
                    focus:ring-2
                    focus:ring-[#4E9F8A]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >

                  {showPassword ? (
                    <Eye size={15} />
                  ) : (
                    <EyeOff size={15} />
                  )}

                </button>

              </div>

              {/* PASSWORD ERROR */}

              {passwordError && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}

            </div>

            {/* ================= LOGIN BUTTON ================= */}

            <div className="pt-8">

              <Button
                title={
                  loading
                    ? "Connexion..."
                    : "Log In"
                }
                type="submit"
                variant="primary"
                noPadding={true}
              />

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   INPUT COMPONENT — DESKTOP
========================================================= */

const InputField = ({
  label,
  placeholder,
  value,
  setValue,
  icon,
  password = false,
  showPassword,
  setShowPassword,
  error,
  setError,
}) => {
  return (
    <div>

      {/* ================= LABEL ================= */}

      <label className="block mb-2 text-[18px] font-medium">
        {label}
      </label>

      {/* ================= INPUT ================= */}

      <div className="relative">

        <input
          type={
            password
              ? showPassword
                ? "text"
                : "password"
              : "text"
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);

            // Clear error when user starts typing
            if (
              password
                ? e.target.value
                : e.target.value.trim()
            ) {
              setError("");
            }
          }}
          className="
            w-full
            h-[45px]
            rounded-[15px]
            border
            border-[#4E9F8A]
            px-4
            pr-10
            text-[16px]
            outline-none
            focus:ring-2
            focus:ring-[#4E9F8A]
          "
        />

        {/* ================= ICON ================= */}

        {password ? (

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          >

            {showPassword ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}

          </button>

        ) : (

          <div
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          >
            {icon}
          </div>

        )}

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
};

export default Login;
