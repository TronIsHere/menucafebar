export async function sendCustomerOtp(phone: string, code: string): Promise<void> {
  console.log(`[Customer Club OTP] Send ${code} to ${phone}`);

  const smsApiKey = process.env.SMS_API_KEY;
  if (!smsApiKey) return;

  // Kavenegar example — swap with your SMS provider
  // await fetch(`https://api.kavenegar.com/v1/${smsApiKey}/verify/lookup.json?receptor=${phone}&token=${code}&template=verify`)
}
