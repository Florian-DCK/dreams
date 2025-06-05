'use client';
import { signUp, signIn } from "@/app/actions/auth";
import { useActionState } from "react";
import SignInUpForm from "@/components/signInUpForm";

export default function Register(){
    const [registerState, RegisterAction, RegisterPending] = useActionState(signUp, undefined);
    const [loginState, LoginAction, LoginPending] = useActionState(signIn, undefined);
    return (
        <SignInUpForm 
            RegisterAction={RegisterAction} 
            LoginAction={LoginAction} 
            registerState={registerState}
            loginState={loginState}
            registerPending={RegisterPending}
            loginPending={LoginPending}
        />
    )
}