export interface ScamExampleItem {
  id: string;
  title: string;
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium';
  riskScore: number;
  platform: 'SMS' | 'WhatsApp' | 'Telegram' | 'Banking' | 'Email';
  senderDisplay: string;
  messageText: string;
  detectedUrl?: string;
  explanation: string;
  screenshotMockBg: string;
}

export const SCAM_EXAMPLES: ScamExampleItem[] = [
  {
    id: 'bank-kyc-alert',
    title: 'Fake Bank KYC Alert',
    category: 'Bank / Payment Scam',
    riskLevel: 'Critical',
    riskScore: 94,
    platform: 'SMS',
    senderDisplay: 'SBI-ALERT (Spoofed)',
    messageText: 'Dear SBI Customer, your bank account #XXXX4910 has been BLOCKED today due to incomplete PAN KYC. Click immediately to update documents: http://sbi-kyc-verify-portal.xyz to prevent total asset suspension.',
    detectedUrl: 'http://sbi-kyc-verify-portal.xyz',
    explanation: 'Classic smishing impersonating State Bank of India. Uses threatening language and lookalike domain to harvest net-banking login credentials and OTPs.',
    screenshotMockBg: 'from-blue-900/60 to-slate-900/90',
  },
  {
    id: 'otp-reversal-scam',
    title: 'OTP Verification Theft',
    category: 'OTP / Credential Scam',
    riskLevel: 'Critical',
    riskScore: 98,
    platform: 'WhatsApp',
    senderDisplay: '+1 (800) 492-8114 (Fake Security Desk)',
    messageText: 'Your Google Account verification code is 849-201. An unauthorized sign-in was attempted from Moscow. If this was NOT you, reply immediately with this 6-digit OTP code to cancel the login attempt.',
    detectedUrl: '',
    explanation: 'Social engineering reversal tactic. Attackers trigger a real Google OTP prompt and trick the victim into replying with the code to steal the account.',
    screenshotMockBg: 'from-emerald-950/60 to-slate-900/90',
  },
  {
    id: 'parcel-customs-fee',
    title: 'Fake Parcel Delivery Fee',
    category: 'Courier Smishing',
    riskLevel: 'High',
    riskScore: 88,
    platform: 'SMS',
    senderDisplay: 'FedEx-Express',
    messageText: 'FedEx: Your shipment #FX-99410 cannot be delivered due to an unpaid customs redelivery charge of $2.49. Please settle fee and confirm address: http://fedx-customs-track.top/pay before 6 PM.',
    detectedUrl: 'http://fedx-customs-track.top/pay',
    explanation: 'Exploits high parcel delivery volumes. The micro-charge lure ($2.49) lowers victim suspicion and captures full credit card numbers and CVV codes.',
    screenshotMockBg: 'from-purple-950/60 to-slate-900/90',
  },
  {
    id: 'lottery-winner-lure',
    title: 'International Lottery Winner',
    category: 'Advance Fee Fraud',
    riskLevel: 'High',
    riskScore: 82,
    platform: 'Telegram',
    senderDisplay: 'UK National Lottery Board',
    messageText: 'CONGRATULATIONS! Your mobile number was drawn as the 1st prize winner of $1,500,000 in the International Mega Draw 2026. Contact Claims Officer Mrs. Sandra on Telegram @MegaClaims_Official with your passport copy to claim.',
    detectedUrl: 'https://t.me/MegaClaims_Official',
    explanation: 'Classic Nigerian 419 / advance fee fraud. Requires the victim to pay escalating "clearance fees" or "taxes" before receiving non-existent winnings.',
    screenshotMockBg: 'from-amber-950/60 to-slate-900/90',
  },
  {
    id: 'fake-part-time-job',
    title: 'Part-Time Work From Home Job',
    category: 'Job / Placement Scam',
    riskLevel: 'Critical',
    riskScore: 91,
    platform: 'WhatsApp',
    senderDisplay: '+91 98412 88410 (HR Placement)',
    messageText: 'Earn ₹2,000 - ₹5,000 daily working 30 mins from your phone! Simple task: like YouTube videos and rate Google Maps locations. First task payout ₹500 immediately. Join our HR team: https://t.me/GlobalTask_HR55',
    detectedUrl: 'https://t.me/GlobalTask_HR55',
    explanation: 'Task scam syndicate. Starts with tiny payouts to build trust, then lures victims into transferring tens of thousands into fake prepaid "VIP recharge tasks".',
    screenshotMockBg: 'from-teal-950/60 to-slate-900/90',
  },
  {
    id: 'crypto-vip-trading',
    title: 'Guaranteed Crypto Returns',
    category: 'Investment Scam',
    riskLevel: 'Critical',
    riskScore: 95,
    platform: 'Telegram',
    senderDisplay: 'Binance VIP Signals Official',
    messageText: 'Guaranteed 450% return in 48 hours with our AI Arbitrage Bot! Deposit 0.05 BTC and receive 0.225 BTC automatically into your wallet. 100% risk-free audited smart contract. Send deposit to: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    detectedUrl: '',
    explanation: 'Pig-butchering and Ponzi scheme pattern. Promises impossible guaranteed yields, absconding with all cryptocurrency deposits permanently.',
    screenshotMockBg: 'from-orange-950/60 to-slate-900/90',
  },
  {
    id: 'whatsapp-account-deletion',
    title: 'Fake WhatsApp Support Alert',
    category: 'Social Media Impersonation',
    riskLevel: 'High',
    riskScore: 86,
    platform: 'WhatsApp',
    senderDisplay: 'WhatsApp Official Helpdesk',
    messageText: 'WhatsApp Security Warning: Multiple users reported your account for policy violations. To cancel automated permanent deletion within 12 hours, verify phone number here: http://wa-security-verification.cfd/auth',
    detectedUrl: 'http://wa-security-verification.cfd/auth',
    explanation: 'Impersonates official messaging service staff. Uses fear of losing chat history and contacts to drive victim to a fake QR or session hijacking portal.',
    screenshotMockBg: 'from-green-950/60 to-slate-900/90',
  },
  {
    id: 'electricity-bill-disconnection',
    title: 'Urgent Electricity Disconnection',
    category: 'Utility Scam',
    riskLevel: 'Critical',
    riskScore: 92,
    platform: 'SMS',
    senderDisplay: 'POWER-DEPT',
    messageText: 'URGENT: Your power supply will be DISCONNECTED tonight at 9:30 PM from main substation because your previous month bill was not updated. Immediately contact executive officer at 9876543210 to avoid penalty.',
    detectedUrl: '',
    explanation: 'High-frequency utility fraud. Panic-inducing countdown drives victims to call rogue number and install remote-access apps (AnyDesk/TeamViewer).',
    screenshotMockBg: 'from-red-950/60 to-slate-900/90',
  },
];
