'use client';
import { createContext } from 'react';
import useNewLibraryModal from './newLibraryModal';
import useAddToLibraryModal from './addToLibraryModal';
import { Dispatch, SetStateAction } from 'react';

export const NewLibraryModalContext = createContext<{
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
	setIsOpen: () => {},
});

export const AddToLibraryModalContext = createContext<{
	openModal: (bookId: string, note?: number, review?: string, customTitle?: string, isPublic?: boolean) => void;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
	openModal: () => {},
	setIsOpen: () => {},
});

export default function ModalProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	const { setIsOpen: setNewLibraryIsOpen, NewLibraryModal } = useNewLibraryModal();
	const { openModal: openAddToLibraryModal, setIsOpen: setAddToLibraryIsOpen, AddToLibraryModal } = useAddToLibraryModal();

	return (
		<NewLibraryModalContext.Provider value={{ setIsOpen: setNewLibraryIsOpen }}>
			<AddToLibraryModalContext.Provider value={{ openModal: openAddToLibraryModal, setIsOpen: setAddToLibraryIsOpen }}>
				<NewLibraryModal />
				<AddToLibraryModal />
				{children}
			</AddToLibraryModalContext.Provider>
		</NewLibraryModalContext.Provider>
	);
}
