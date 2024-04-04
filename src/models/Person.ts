export interface PersonDto{
	name?: string;
	height?: string;
	mass?: string;
	birth_year?: string;
	// age: number;
	// liked: boolean;
	url?: string;
}

export interface ResponseDto {
	count?: number,
	results?: PersonDto[]
}

export interface PersonModel extends Required<PersonDto>{
	// name: string;
	// height: string;
	// mass: string;
	// birth_year: string;
	// age: number;
	liked: boolean;
	// url: string;
}
