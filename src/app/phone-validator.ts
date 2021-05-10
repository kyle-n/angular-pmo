import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

async function isValidUSNumber(number: string): Promise<boolean> {
  try {
    const usNumber = phoneUtil.parse(number, 'US');
    return phoneUtil.isValidNumberForRegion(usNumber, 'US');
  } catch {
    return false;
  }
}

export default isValidUSNumber;
