export default interface Person {
	name: string;
	height: string;
	mass: string;
	birth_year: string;
	// don't think this is a good pattern to use string | number.
	// from Data point of view this should be always a number, once the number cannot be calculated
	// it should be NaN (which is number as wll).
	// the UI component should decide how to show this to the User, eg. imagine you are making multi-language interface:
	// data will keep language independent 'NaN' and each component will translate this to target language
	age: string | number;
	liked: boolean;
	url: string;
}
