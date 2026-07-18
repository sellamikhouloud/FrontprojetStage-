import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";

import Button from "../components/Button/Button";

import LoginIllustration from "../assets/LoginIcon.svg";
import LoginIllustrationMob from "../assets/LoginMob.svg";
import Wave from "../assets/Vector3.svg";
import Vector from "../assets/Vector.svg";
import Vector1 from "../assets/Vector1.svg";
import Vector2 from "../assets/Vector2.svg";
import WaveM from "../assets/Vector4.svg";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      adminID,
      password,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ================= DESKTOP VERSION ================= */}

      <div className="hidden md:block relative min-h-screen">

        {/* Top Decoration */}
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

        <div className="relative z-10 flex items-center justify-center min-h-screen mr-20">

          <div className="w-full max-w-[1220px] flex items-center justify-between px-12">

            {/* Illustration */}

            <div className="w-[550px] flex justify-center ml-20 mt-20">

              <img
                src={LoginIllustration}
                alt="Login"
                className="w-[550px]"
              />

            </div>

            {/* Form */}

            <div className="w-[384px] ml-30 mt-30">

              <h1 className="text-[34px] font-bold text-[#4E9F8A] pb-8">
                Log In
              </h1>

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >

                <InputField
                  label="Identifiant professionnel"
                  placeholder="Saisie de l'identifiant"
                  value={adminID}
                  setValue={setAdminID}
                  icon={<User size={18} />}
                />

                <InputField
                  label="Mot de passe"
                  placeholder="Saisie votre mot de passe"
                  value={password}
                  setValue={setPassword}
                  password
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <div className="pt-4">

                  <Button
                    title="Log In"
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

      {/* ================= MOBILE VERSION ================= */}

      <div className="md:hidden min-h-screen bg-white relative overflow-hidden">

        {/* Top Wave */}

        <div className="absolute top-0 left-0 w-full overflow-hidden">

          <img
            src={WaveM}
            alt=""
            className="w-full h-full object-cover pt-3"
          />

        </div>

        <div className="relative z-10 px-7 pt-9">

          {/* Title */}

          <h1 className="text-[34px] font-bold text-[#4E9F8A]">
            Log In
          </h1>

          {/* Illustration */}

          <div className="flex justify-center mb-10">

            <img
              src={LoginIllustrationMob}
              alt="Login"
              className="w-[260px] h-auto"
            />

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Identifiant */}

            <div>

              <label className="block text-[14px] font-medium mb-2">
                Identifiant professionnel
              </label>

              <div className="relative">

                <input
                  type="text"
                  placeholder="Saisie de l'identifiant"
                  value={adminID}
                  onChange={(e) => setAdminID(e.target.value)}
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

            </div>

            {/* Password */}

            <div>

              <label className="block text-[14px] font-medium mb-2">
                Mot de passe
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Saisie votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <Eye size={15} />
                  ) : (
                    <EyeOff size={15} />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}

            <div className="pt-8">

              <Button
                title="Log In"
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

/* ================= INPUT COMPONENT (Desktop Only) ================= */

const InputField = ({
  label,
  placeholder,
  value,
  setValue,
  icon,
  password = false,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div>

      <label className="block mb-2 text-[18px] font-medium">
        {label}
      </label>

      <div className="relative">

        <input
          type={
            password
              ? (showPassword ? "text" : "password")
              : "text"
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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

        {password ? (

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>

        ) : (

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>

        )}

      </div>

    </div>
  );
};

export default Login;