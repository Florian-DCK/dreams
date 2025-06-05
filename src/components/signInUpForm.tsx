import { useEffect } from 'react';
import Button from './button';

export default function SignInUpForm({
	RegisterAction,
	LoginAction,
	registerState,
	loginState,
	registerPending,
	loginPending,
}: {
	RegisterAction: any;
	LoginAction: any;
	registerState: any;
	loginState: any;
	registerPending: boolean;
	loginPending: boolean;
}) {
	useEffect(() => {
		const switchers = document.querySelectorAll('.switcher');
		switchers.forEach((item) => {
			item.addEventListener('click', function () {
				switchers.forEach((item) =>
					item.parentElement.classList.remove('is-active')
				);
				this.parentElement.classList.add('is-active');
			});
		});
	}, []);

	return (
		<section className="forms-section">
			<div className="forms">
				<div className="form-wrapper is-active w-96">
					<button type="button" className="switcher switcher-login">
						Connexion
						<span className="underline"></span>
					</button>
					<form action={LoginAction} className="form form-login">
						<fieldset>
							{loginState?.error?.email && (
								<p className="text-red-400 ">{loginState.error.email}</p>
							)}
							<div className="input-block">
								<label htmlFor="login-email">E-mail</label>
								<input id="login-email" name="email" type="email" required />
							</div>
							{loginState?.error?.password && (
								<p className="text-red-400 ">{loginState.error.password}</p>
							)}
							<div className="input-block">
								<label htmlFor="login-password">Mot de passe</label>
								<input
									id="login-password"
									name="password"
									type="password"
									required
								/>
							</div>
						</fieldset>
						<Button type="submit" className="" disabled={loginPending}>
							{loginPending ? 'Connexion...' : 'Se connecter'}
						</Button>
					</form>
				</div>
				<div className="form-wrapper w-96">
					<button type="button" className="switcher switcher-signup">
						Inscription
						<span className="underline"></span>
					</button>
					<form action={RegisterAction} className="form form-signup">
						<fieldset>
							{registerState?.error?.username && (
								<p className="text-red-400 ">{registerState.error.name}</p>
							)}
							<div className="input-block">
								<label htmlFor="signup-username">Nom d'utilisateur</label>
								<input
									id="signup-username"
									name="username"
									type="text"
									required
								/>
							</div>
							{registerState?.error?.email && (
								<p className="text-red-400 ">{registerState.error.email}</p>
							)}
							<div className="input-block">
								<label htmlFor="signup-email">E-mail</label>
								<input id="signup-email" name="email" type="email" required />
							</div>

							{registerState?.error?.password && (
								<div>
									<p className="text-red-400">Le mot de passe</p>
									<ul>
										{registerState.error.password.map((error, index) => (
											<li key={index} className="text-red-400 ">
												{error}
											</li>
										))}
									</ul>
								</div>
							)}
							<div className="input-block">
								<label htmlFor="signup-password">Mot de passe</label>
								<input
									id="signup-password"
									name="password"
									type="password"
									required
								/>
							</div>
						</fieldset>
						<Button type="submit" className="" disabled={registerPending}>
							{registerPending ? 'Inscription...' : "S'inscrire"}
						</Button>
					</form>
				</div>
			</div>
		</section>
	);
}
