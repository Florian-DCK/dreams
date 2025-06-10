import Card from '../card';
import Review from './review';
import { useState } from 'react';
import { ArrowDown10, ArrowUp01 } from 'lucide-react';

export default function DetailsReviews({
	className = '',
	usersReviews,
}: {
	className?: string;
	usersReviews?: any[];
}) {
	const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

	const sortedReviews =
		usersReviews && Array.isArray(usersReviews)
			? [...usersReviews].sort((a, b) =>
					sortOrder === 'desc' ? b.note - a.note : a.note - b.note
			  )
			: usersReviews;

	return (
		<div className={`space-y-4 ${className}`}>
			<div className="flex justify-between items-center">
				{usersReviews &&
					Array.isArray(usersReviews) &&
					usersReviews.length > 1 && (
						<button
							onClick={() =>
								setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
							}
							className="flex items-center gap-2 px-3 py-1 text-sm bg-card/50 hover:bg-card/70 rounded-lg border transition-colors">
							<span>Trier par note</span>
							{sortOrder === 'desc' ? (
								<ArrowDown10 size={16} />
							) : (
								<ArrowUp01 size={16} />
							)}
						</button>
					)}
			</div>

			{sortedReviews &&
				(Array.isArray(sortedReviews) ? (
					sortedReviews.length > 0 ? (
						<div className="space-y-4">
							{sortedReviews.map((review, index) => (
								<Review
									key={`${review.username}-${review.note}-${index}`}
									username={review.username}
									note={review.note}
									review={review.review}
									className="p-4 bg-card/30 rounded-lg border-muted/20 hover:bg-card/40 transition-colors"
								/>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								Aucun avis disponible pour ce livre.
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								Soyez le premier à partager votre opinion !
							</p>
						</div>
					)
				) : (
					<Review
						username={sortedReviews.username}
						note={sortedReviews.note}
						review={sortedReviews.review}
						className="p-4 bg-card/30 rounded-lg border-muted/20"
					/>
				))}
		</div>
	);
}
