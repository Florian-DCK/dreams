import Bookshelf from '@/components/bookshelf';
import Book from '@/components/book';
import Tag from '@/components/tag';

export default function Home() {
	return (
		<div className="flex flex-col h-full">
			<div className='mt-2 space-y-2'>
				<Bookshelf className="">
					<Book backgroundImage="book1.png" url='/book1' />
					<Book backgroundImage="book2.png" url='/book2' />
					<Book backgroundImage="book3.png" url='/book3' />
					<Tag text="Ma PAL" className="absolute z-10 mb-2 -bottom-[34px]" />
				</Bookshelf>
				<Bookshelf>
					<Book backgroundImage="book4.png" url='/book4' />
					<Book backgroundImage="book5.png" url='/book5' />
					<Book backgroundImage="book2.png" url='/book2' />
					<Book backgroundImage="book3.png" url='/book3' />
					<Book backgroundImage="book1.png" url='/book1' />
					<Book backgroundImage="book4.png" url='/book4' />
					<Tag
						text="Les livres que j'ai lû"
						className="absolute z-10 mb-2 -bottom-[34px]"
					/>
				</Bookshelf>
			</div>
		</div>
	);
}
