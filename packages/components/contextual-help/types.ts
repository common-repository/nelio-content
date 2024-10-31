export type State = {
	readonly mode: 'contact-form' | 'questions';
	readonly email: string;
	readonly description: string;
	readonly isTicketSubmitting: boolean;
	readonly submissionStatus: 'none' | 'error' | 'success';
};

export type Submission = {
	readonly email: string;
	readonly description: string;
	readonly success: () => void;
	readonly error: () => void;
};
