import Card from '@/components/card';
import Stars from '../stars';
import { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Globe, Lock, MessageSquare } from 'lucide-react';

export default function Notes({
	className = '',
	onReviewChange,
	onRatingChange,
	note = 0,
	userReview = '',
	setIsPublic,
	isPublic,
	initialReview,
	initialRating,
	isAlreadyReviewed = false,
}: {
	className?: string;
	onReviewChange?: (review: string) => void;
	onRatingChange?: (rating: number) => void;
	setIsPublic?: (isPublic: boolean) => void;
	note?: number;
	userReview?: string;
	isPublic?: boolean;
	initialReview?: string;
	initialRating?: number;
	isAlreadyReviewed?: boolean;
}) {
	const [review, setReview] = useState(initialReview || userReview || '');

	useEffect(() => {
		if (initialReview !== undefined) {
			setReview(initialReview);
		} else if (userReview) {
			setReview(userReview);
		}
	}, [initialReview, userReview]);

	const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newReview = e.target.value;
		setReview(newReview);
		if (onReviewChange) {
			onReviewChange(newReview);
		}
	};

	// Normaliser la valeur isPublic
	const normalizedIsPublic = isPublic === true || isPublic === 'Y';

	const handlePublicChange = (pressed: boolean) => {
		if (setIsPublic) {
			setIsPublic(pressed);
		}
	};

	console.log(initialRating, note);

	return (
		<Card className={`p-6 ${className}`}>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center">
					<h2 className="text-xl font-bold">Votre Avis</h2>
				</div>
				{isAlreadyReviewed ? (
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">Déjà noté</span>
						<Stars note={initialRating || note} editable={false} />
					</div>
				) : (
					<Stars
						onRatingChange={onRatingChange}
						note={initialRating || note}
						editable={true}
					/>
				)}
			</div>

			<div className="space-y-4">
				{/* Toggle de visibilité */}
				{setIsPublic && normalizedIsPublic !== undefined && (
					<div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
						<div className="flex items-center gap-3">
							{normalizedIsPublic ? (
								<Globe className="text-green-500" size={20} />
							) : (
								<Lock className="text-gray-500" size={20} />
							)}
							<div>
								<p className="text-sm font-medium">
									{normalizedIsPublic ? 'Avis public' : 'Avis privé'}
								</p>
								<p className="text-xs text-muted-foreground">
									{normalizedIsPublic
										? 'Visible par la communauté'
										: 'Visible par vous uniquement'}
								</p>
							</div>
						</div>
						<Toggle
							pressed={normalizedIsPublic}
							onPressedChange={handlePublicChange}
							aria-label="Rendre l'avis public ou privé"
							variant="default"
							className="rounded-lg">
							{normalizedIsPublic ? <Globe size={16} /> : <Lock size={16} />}
						</Toggle>
					</div>
				)}

				{/* Zone de texte */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-muted-foreground">
						Votre commentaire
					</label>
					<textarea
						name="notes"
						id="notes"
						className="w-full min-h-[120px] p-3 bg-card/50 border border-muted rounded-lg resize-none focus:border-primary outline-none transition-colors"
						placeholder={
							isAlreadyReviewed
								? 'Vous avez déjà donné votre avis sur ce livre'
								: 'Partagez vos impressions sur cette œuvre...'
						}
						value={initialReview || review}
						onChange={handleReviewChange}
						disabled={isAlreadyReviewed}
					/>
				</div>
			</div>
		</Card>
	);
}
