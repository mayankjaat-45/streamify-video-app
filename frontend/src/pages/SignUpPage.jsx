import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSignup from "../hooks/useSignup";
import { useThemeStore } from "../store/useThemeStore";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const {theme} = useThemeStore();
  // const queryClient = useQueryClient();

  // const {mutate:signupMutation, isPending ,error} = useMutation({
  //   mutationFn :signup,
  //   onSuccess: ()=>queryClient.invalidateQueries({queryKey:["authUser"] }),
  // });

  const { isPending,error, signupMutation} = useSignup();

  const handleSignUp = async(e) => {
    e.preventDefault();
    signupMutation(signupData);
  };
  return (
    <div
      className="min-h-min flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme={theme}>
      <div className="border border-primary/25 flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* signup Form Data */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {/* Error mESSAage */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamify and Start your Language learning Adventure!!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Enter Full Name..."
                      className="input input-bordered w-full"
                      value={signupData.fullname}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullname: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      placeholder="Enter Email..."
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      placeholder="Enter Password.."
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-sm opacity-70 mt-1">
                      Password must be atleat 6 characters long
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          primary policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                 {isPending ? ( 
                  <>
                  <span className="loading loading-spinner loading-xs">Loading....</span>
                  </>
                 ): (
                  "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Image part */}
        <div className="hidden md:flex w-full md:w-1/2 bg-primary/10 items-center justify-center ">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/Video call-bro.png" alt="" className="w-full h-full"/>
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with Language partner worldWide</h2>
              <p className="opacity-70">Practice Conversations, make friends, and improve your language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
