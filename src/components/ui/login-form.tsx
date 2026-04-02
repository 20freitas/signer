'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
    return (
        <div className="flex min-h-[700px] w-full bg-white">
            <div className="w-full hidden md:inline-block relative overflow-hidden">
                <img className="absolute inset-0 h-full w-full object-cover" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" />
            </div>
        
            <div className="w-full flex flex-col items-center justify-center p-8">
        
                <form className="md:w-96 w-80 flex flex-col items-center justify-center">
                    <h2 className="text-4xl text-gray-900 font-black tracking-tight">Sign in</h2>
                    <p className="text-sm text-gray-500/90 mt-3 font-medium">Welcome back! Please sign in to continue</p>
        
                    <button type="button" className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full hover:bg-gray-500/20 transition-colors">
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
                    </button>
        
                    <div className="flex items-center gap-4 w-full my-5">
                        <div className="w-full h-px bg-gray-300/90"></div>
                        <p className="w-full text-nowrap text-xs uppercase tracking-widest font-black text-gray-400">or with email</p>
                        <div className="w-full h-px bg-gray-300/90"></div>
                    </div>
        
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                        </svg>
                        <input type="email" placeholder="Email id" className="bg-transparent text-gray-900 placeholder-gray-500/80 outline-none text-sm w-full h-full font-medium" required />                 
                    </div>
        
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                        </svg>
                        <input type="password" placeholder="Password" className="bg-transparent text-gray-900 placeholder-gray-500/80 outline-none text-sm w-full h-full font-medium" required />
                    </div>
        
                    <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                        <div className="flex items-center gap-2">
                            <input className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" id="checkbox" />
                            <label className="text-xs font-bold uppercase tracking-widest" htmlFor="checkbox">Remember me</label>
                        </div>
                        <a className="text-xs font-bold uppercase tracking-widest text-indigo-500 hover:underline" href="#">Forgot password?</a>
                    </div>
        
                    <button type="submit" className="mt-8 w-full h-12 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20">
                        Login
                    </button>
                    <p className="text-gray-500/90 text-[10px] font-black uppercase tracking-widest mt-6">
                        Don’t have an account? <Link className="text-indigo-500 hover:underline" href="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
