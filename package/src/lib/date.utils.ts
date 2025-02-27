export function getDates(startDate: Date, stopDate: Date) {
	let dateArray = new Array();
	let currentDate = startDate;
	while (currentDate <= stopDate) {
		let date = new Date(currentDate);
		dateArray.push(date);
		currentDate = addNoOfDays(currentDate, 1);
	}
	return dateArray;
}

export function addNoOfDays(date: Date, days: number) {
	let _date = new Date(date)
	_date.setDate(_date.getDate() + days);
	return _date;
}

export function subtractNoOfDays(date: Date, days: number) {
	let _date = new Date(date)
	_date.setDate(_date.getDate() - days);
	return _date;
}

export function getMMDDYYYYFormat(date: Date) {
	const yyyy = date.getFullYear().toString();
	const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based         
	const dd = (date.getDate()).toString();
	return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
}

export function getMMDDYYYYFormatWithHiphen(date: Date) {
	const yyyy = date.getFullYear().toString();
	const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based         
	const dd = (date.getDate()).toString();
	return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + '-' + yyyy;
}

export function getSystemDateTimeMMDDYYYY_HHMMFormat(): string {
	const systemDateTime = new Date();
	const month = (systemDateTime.getMonth() + 1).toString().padStart(2, '0');
	const day = systemDateTime.getDate().toString().padStart(2, '0');
	const year = systemDateTime.getFullYear().toString();
	let hours = systemDateTime.getHours();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	const formattedHours = hours.toString().padStart(2, '0');
	const minutes = systemDateTime.getMinutes().toString().padStart(2, '0');
	return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
}

export function getSystemDateTimeYYYYMMDD_HHMMFormat(date: string | number | Date): string {
	const systemDateTime = date === "" ? new Date() : new Date(date);
	const month = (systemDateTime.getMonth() + 1).toString().padStart(2, '0');
	const day = systemDateTime.getDate().toString().padStart(2, '0');
	const year = systemDateTime.getFullYear().toString();
	let hours = systemDateTime.getHours();
	const formattedHours = hours.toString().padStart(2, '0');
	const minutes = systemDateTime.getMinutes().toString().padStart(2, '0');
	return `${year}-${month}-${day}T${formattedHours}:${minutes}`;
}


export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}