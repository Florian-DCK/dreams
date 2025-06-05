import { useEffect } from 'react';

export default function SignInUpForm({ RegisterAction, LoginAction }: { RegisterAction: any, LoginAction: any }) {
    useEffect(() => {
        const switchers = document.querySelectorAll('.switcher');
        switchers.forEach(item => {
            item.addEventListener('click', function() {
                switchers.forEach(item => item.parentElement.classList.remove('is-active'))
                this.parentElement.classList.add('is-active')
            })
        })
    }, [])
    

    return (
        <section className="forms-section">
            <div className="forms">
                <div className="form-wrapper is-active">
                <button type="button" className="switcher switcher-login">
                    Login
                    <span className="underline"></span>
                </button>
                <form action={LoginAction} className="form form-login">
                    <fieldset>
                    <legend>Please, enter your email and password for login.</legend>
                    <div className="input-block">
                        <label htmlFor="login-email">E-mail</label>
                        <input id="login-email" name="email" type="email" required />
                    </div>
                    <div className="input-block">
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" name="password" type="password" required />
                    </div>
                    </fieldset>
                    <button type="submit" className="btn-login">Login</button>
                </form>
                </div>
                <div className="form-wrapper">
                <button type="button" className="switcher switcher-signup">
                    Sign Up
                    <span className="underline"></span>
                </button>
                <form action={RegisterAction} className="form form-signup">
                    <fieldset>
                    <legend>Please, enter your email, password and password confirmation for sign up.</legend>
                    <div className="input-block">
                        <label htmlFor="signup-username">Username</label>
                        <input id="signup-username" name="username" type="text" required />
                    </div>
                    <div className="input-block">
                        <label htmlFor="signup-email">E-mail</label>
                        <input id="signup-email" name="email" type="email" required />
                    </div>
                    <div className="input-block">
                        <label htmlFor="signup-password">Password</label>
                        <input id="signup-password" name="password" type="password" required />
                    </div>
                    </fieldset>
                    <button type="submit" className="btn-signup">Sign Up</button>
                </form>
                </div>
            </div>
        </section>
    )
}

