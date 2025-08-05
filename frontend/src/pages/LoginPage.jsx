import { ShipWheelIcon } from 'lucide-react';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import { useThemeStore } from '../store/useThemestore';

const LoginPage = () => {
  const [loginData,setLoginData] = useState({
    email:"",
    password:"",
  });

  const {theme} = useThemeStore();
  // const queryClient = useQueryClient();
  // const {mutate:loginMutation, isPending, error} = useMutation({
  //   mutationFn: login,
  //   onSuccess: ()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  // });

  const {isPending, error, loginMutation } = useLogin();

  const handleLogin = (e)=>{
    e.preventDefault();
    loginMutation(loginData);
  }
  return (
    <div className='flex items-center justify-center p-4 sm:p-6' datatheme={theme}>
      <div className='border border-primary/25 flex flex-col md:flex-row w-full max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
      {/* Login form */}
        <div className='w-full md:w-1/2 p-4 sm:p-6 flex flex-col'>
        {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='text-primary size-9'/>
            <span>Streamify</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Welcome Back</h2>
                  <p className='text-sm opacity-70'>
                    <span>Sign in to your Account to continue your language journey</span>
                  </p>
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input 
                    type="email"
                    placeholder='hello@example.com' 
                    className='input input-bordered w-full'
                    value={loginData.email}
                    onChange={(e)=>setLoginData({...loginData, email:e.target.value})}
                    required
                    />
                  </div>

                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input 
                    type="password"
                    placeholder='your password' 
                    className='input input-bordered w-full'
                    value={loginData.password}
                    onChange={(e)=>setLoginData({...loginData, password:e.target.value})}
                    required
                    />
                  </div>

                  {/* Button */}

                  <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
                    {isPending ? (
                      <>
                      <span className='loading loading-spinner loading-xs'></span>
                      signing in...
                      </>
                    ) : (
                      "sign In"
                    )}
                  </button>

                  <div className='text-center mt-4'>
                    <p className='text-sm'>
                      Don't have an Account ? {" "}
                      <Link to="/signup" className='text-primary hover:underline'>Create One</Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
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
  )
}

export default LoginPage;
