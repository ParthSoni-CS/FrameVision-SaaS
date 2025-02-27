"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, LoginSchema} from "~/schemas/auth";
import Link from "next/link";
import { registerUser } from "~/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sign } from "crypto";

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginSchema) {
        try{
            setLoading(true);

            // Sign In after registration
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (!signInResult?.error) {
                router.push("/");
            }
            else {
                setError(signInResult.error === "CredentialsSignin"? "Invalid email or password" : "Something went wrong. Please try again later.");
            }

        }
        catch(error) {
            setError("Something went wrong. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="flex h-16 items-center justify-between border-b border-gray-200 px-10">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-800 text-white">FV</div>
                    <span className="text-lg font-medium">Frame Vision</span>
                </div>
            </nav>
            
            <main className="flex h-[calc(100vh - 4rem)] justify-center items-center">
                <div className="w-full max-w-md space-y-8 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    {...form.register("email")}
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none"
                                />
                                {
                                    form.formState.errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
                                    )
                                }
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    {...form.register("password")}
                                    type="password"
                                    placeholder="********"
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none"
                                />
                                {
                                    form.formState.errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>
                                    )
                                }
                            </div>
                        </div>
                        <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                               {loading ? "Signing In..." : "Sign In"}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account? <Link className="font-medium text-gray-800 hover:text-gray-700" href="/signup">Sign up</Link>  
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}