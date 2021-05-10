import phoneUtil from 'google-libphonenumber';

async function isValidUSNumber(number: string): Promise<boolean> {
  const usNumber = phoneUtil.parse(number, 'US');
  return phoneUtil.isValidNumberForRegion(usNumber, 'US');
}
