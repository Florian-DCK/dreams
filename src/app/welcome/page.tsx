'use client';
import Card from '@/components/card';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import {
	BookOpen,
	Star,
	Users,
	Palette,
	TrendingUp,
	Heart,
	Sparkles,
	ArrowRight,
	CheckCircle,
} from 'lucide-react';

export default function Welcome() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
			<div className="container mx-auto px-4 py-8 space-y-12">
				{/* Hero Section */}
				<div className="text-center py-12 animate-fade-in">
					<div className="flex items-center justify-center mb-6">
						<Sparkles className="text-primary mr-3 animate-pulse" size={40} />
						<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-slide-up">
							Dreams
						</h1>
						<Sparkles
							className="text-purple-500 ml-3 animate-pulse"
							size={40}
						/>
					</div>
					<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
						Votre journal de lecture créatif qui transforme chaque livre en une
						aventure unique
					</p>
					<Button
						onClick={() => router.push('/login')}
						className="bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-400/90 hover:to-purple-700 px-8 py-4 text-lg gap-3 animate-slide-up animation-delay-400 hover:scale-105 transition-all duration-300 items-center">
						Découvrir Dreams
						<ArrowRight
							size={20}
							className="transition-transform group-hover:translate-x-1 "
						/>
					</Button>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-blue-600/5 animate-slide-up animation-delay-100 hover:scale-105 hover:-translate-y-2">
						<BookOpen
							className="text-blue-500 mx-auto mb-4 transition-transform hover:scale-110"
							size={48}
						/>
						<h3 className="text-lg font-bold mb-2">Organisez vos lectures</h3>
						<p className="text-sm text-muted-foreground">
							Créez des bibliothèques personnalisées et suivez votre pile à lire
						</p>
					</Card>

					<Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 animate-slide-up animation-delay-200 hover:scale-105 hover:-translate-y-2">
						<Star
							className="text-yellow-500 mx-auto mb-4 transition-transform hover:scale-110 hover:rotate-12"
							size={48}
						/>
						<h3 className="text-lg font-bold mb-2">Notez et critiquez</h3>
						<p className="text-sm text-muted-foreground">
							Partagez vos impressions et découvrez de nouveaux coups de cœur
						</p>
					</Card>

					<Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-purple-600/5 animate-slide-up animation-delay-300 hover:scale-105 hover:-translate-y-2">
						<Palette
							className="text-purple-500 mx-auto mb-4 transition-transform hover:scale-110"
							size={48}
						/>
						<h3 className="text-lg font-bold mb-2">
							Exprimez votre créativité
						</h3>
						<p className="text-sm text-muted-foreground">
							Créez des œuvres artistiques inspirées de vos lectures
						</p>
					</Card>

					<Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-500/10 to-green-600/5 animate-slide-up animation-delay-400 hover:scale-105 hover:-translate-y-2">
						<TrendingUp
							className="text-green-500 mx-auto mb-4 transition-transform hover:scale-110"
							size={48}
						/>
						<h3 className="text-lg font-bold mb-2">Suivez vos progrès</h3>
						<p className="text-sm text-muted-foreground">
							Visualisez vos statistiques de lecture et vos accomplissements
						</p>
					</Card>
				</div>

				{/* Main Feature */}
				<Card className="p-8 md:p-12 animate-fade-in-up animation-delay-600">
					<div className="flex flex-col lg:flex-row items-center gap-8">
						<div className="flex-1 space-y-6">
							<div className="flex items-center gap-3">
								<Heart className="text-red-500 animate-pulse" size={32} />
								<h2 className="text-3xl font-bold">
									Une communauté de passionnés
								</h2>
							</div>
							<p className="text-lg text-muted-foreground">
								Rejoignez une communauté de lecteurs créatifs qui partagent vos
								passions. Découvrez de nouveaux livres, échangez vos impressions
								et laissez libre cours à votre imagination.
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-3 animate-slide-right animation-delay-800">
									<CheckCircle className="text-green-500" size={20} />
									<span>Bibliothèques personnalisées</span>
								</div>
								<div className="flex items-center gap-3 animate-slide-right animation-delay-900">
									<CheckCircle className="text-green-500" size={20} />
									<span>Critiques et notes</span>
								</div>
								<div className="flex items-center gap-3 animate-slide-right animation-delay-1000">
									<CheckCircle className="text-green-500" size={20} />
									<span>Statistiques détaillées</span>
								</div>
								<div className="flex items-center gap-3 animate-slide-right animation-delay-1100">
									<CheckCircle className="text-green-500" size={20} />
									<span>Créations artistiques</span>
								</div>
							</div>
						</div>
						<div className="flex-shrink-0">
							<img
								src="library.jpg"
								className="w-80 h-80 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500 animate-fade-in animation-delay-700"
								alt="Bibliothèque Dreams"
							/>
						</div>
					</div>
				</Card>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 animate-bounce-in animation-delay-800 hover:scale-105 transition-transform duration-300">
						<Users className="text-primary mx-auto mb-3" size={40} />
						<div className="text-3xl font-bold mb-2 counter-animation">
							1000+
						</div>
						<p className="text-muted-foreground">Lecteurs actifs</p>
					</Card>
					<Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 animate-bounce-in animation-delay-900 hover:scale-105 transition-transform duration-300">
						<BookOpen className="text-blue-500 mx-auto mb-3" size={40} />
						<div className="text-3xl font-bold mb-2 counter-animation">
							50k+
						</div>
						<p className="text-muted-foreground">Livres recensés</p>
					</Card>
					<Card className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 animate-bounce-in animation-delay-1000 hover:scale-105 transition-transform duration-300">
						<Palette className="text-purple-500 mx-auto mb-3" size={40} />
						<div className="text-3xl font-bold mb-2 counter-animation">5k+</div>
						<p className="text-muted-foreground">Créations partagées</p>
					</Card>
				</div>

				{/* CTA Section */}
				<Card className="p-8 text-center bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-fade-in-up animation-delay-1200">
					<h2 className="text-3xl font-bold mb-4">
						Prêt à commencer votre aventure littéraire ?
					</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Rejoignez Dreams dès aujourd'hui et transformez votre façon de vivre
						la lecture. Créez, partagez, découvrez !
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							onClick={() => router.push('/login')}
							className="bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-400/90 hover:to-purple-700 px-8 py-4 text-lg gap-3 group hover:scale-105 transition-all duration-300 items-center">
							S'inscrire gratuitement
							<ArrowRight
								size={20}
								className="transition-transform group-hover:translate-x-1"
							/>
						</Button>
						<Button
							onClick={() => router.push('/login')}
							className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg hover:scale-105 transition-all duration-300">
							Se connecter
						</Button>
					</div>
				</Card>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slide-up {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slide-right {
					from {
						opacity: 0;
						transform: translateX(-30px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes bounce-in {
					0% {
						opacity: 0;
						transform: scale(0.3);
					}
					50% {
						transform: scale(1.05);
					}
					70% {
						transform: scale(0.9);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.8s ease-out;
				}
				.animate-slide-up {
					animation: slide-up 0.8s ease-out;
				}
				.animate-slide-right {
					animation: slide-right 0.6s ease-out;
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out;
				}
				.animate-bounce-in {
					animation: bounce-in 0.6s ease-out;
				}

				.animation-delay-100 {
					animation-delay: 0.1s;
				}
				.animation-delay-200 {
					animation-delay: 0.2s;
				}
				.animation-delay-300 {
					animation-delay: 0.3s;
				}
				.animation-delay-400 {
					animation-delay: 0.4s;
				}
				.animation-delay-600 {
					animation-delay: 0.6s;
				}
				.animation-delay-700 {
					animation-delay: 0.7s;
				}
				.animation-delay-800 {
					animation-delay: 0.8s;
				}
				.animation-delay-900 {
					animation-delay: 0.9s;
				}
				.animation-delay-1000 {
					animation-delay: 1s;
				}
				.animation-delay-1100 {
					animation-delay: 1.1s;
				}
				.animation-delay-1200 {
					animation-delay: 1.2s;
				}
			`}</style>
		</div>
	);
}
