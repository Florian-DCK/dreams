'use client';
import { createContext } from 'react';
import useNewLibraryModal from './newLibraryModal';
import useAddToLibraryModal from './addToLibraryModal';
import useEditLibraryModal from './editLibraryModal';
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

export const EditLibraryModalContext = createContext<{
	openModal: (library: { id: string; title: string; description: string; couleur: string }) => void;
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
	const { openModal: openEditLibraryModal, setIsOpen: setEditLibraryIsOpen, EditLibraryModal } = useEditLibraryModal();

	return (
		<NewLibraryModalContext.Provider value={{ setIsOpen: setNewLibraryIsOpen }}>
			<AddToLibraryModalContext.Provider value={{ openModal: openAddToLibraryModal, setIsOpen: setAddToLibraryIsOpen }}>
				<EditLibraryModalContext.Provider value={{ openModal: openEditLibraryModal, setIsOpen: setEditLibraryIsOpen }}>
					<NewLibraryModal />
					<AddToLibraryModal />
					<EditLibraryModal />
					{children}
				</EditLibraryModalContext.Provider>
			</AddToLibraryModalContext.Provider>
		</NewLibraryModalContext.Provider>
	);
}
