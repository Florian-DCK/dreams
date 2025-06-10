import Stars from '../stars';
import { User } from 'lucide-react';

export default function Review({
	className = '',
	username = 'Unknown',
	note = null,
	review = '',
}: {
	className?: string;
	username?: string;
	note?: number | null;
	review?: string;
}) {
	return (
		<div
			className={`p-4 bg-card/30 rounded-lg border border-muted/20 hover:bg-card/40 transition-colors ${className}`}>
			<div className="flex items-start gap-4">
				<div className="flex items-center gap-2 min-w-0 flex-shrink-0">
					<User className="text-primary" size={16} />
					<span className="text-sm font-medium text-foreground truncate">
						{username}
					</span>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							{note !== null ? (
								<Stars
									className="text-yellow-500"
									note={note}
									editable={false}
								/>
							) : (
								<span className="text-xs text-muted-foreground">
									Note non fournie
								</span>
							)}
						</div>
					</div>

					<p className="text-sm text-muted-foreground leading-relaxed">
						{review || 'Aucun avis fourni.'}
					</p>
				</div>
			</div>
		</div>
	);
}
