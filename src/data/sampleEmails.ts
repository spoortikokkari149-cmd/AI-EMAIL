export interface SampleEmailItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  badgeColor: string;
  description: string;
  rawEml: string;
}

export const SAMPLE_EMAILS: SampleEmailItem[] = [
  {
    id: 'phishing-m365',
    name: 'Microsoft 365 Account Suspension',
    category: 'Phishing',
    badge: 'Critical Phish',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-950/40',
    description: 'Fake security alert threatening account termination within 24 hours with spoofed sender and credential harvesting link.',
    rawEml: `Received: from mail-relay.untrusted-servers.xyz (mail-relay.untrusted-servers.xyz [198.51.100.42])
    by mx.corporate-gateway.com with ESMTP id 88A9F1B24
    for <employee@enterprise-corp.com>; Tue, 06 Oct 2026 14:22:10 -0700
Authentication-Results: mx.corporate-gateway.com;
    spf=fail (sender IP 198.51.100.42 is not allowed for domain microsoft.com);
    dkim=fail header.i=@m1crosoft-auth-alert.xyz;
    dmarc=fail (p=reject) header.from=microsoft.com
Return-Path: <bounce-daemon@untrusted-servers.xyz>
From: "Microsoft 365 Security Team" <security-noreply@microsoft.com>
Reply-To: <credentials-helpdesk@m1crosoft-auth-alert.xyz>
To: <employee@enterprise-corp.com>
Subject: URGENT: Your Microsoft 365 Account Will Be Suspended Within 24 Hours
Date: Tue, 06 Oct 2026 14:21:45 -0700
Message-ID: <20261006142145.49821.sec@m1crosoft-auth-alert.xyz>
MIME-Version: 1.0
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #222;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 25px; border-radius: 8px;">
    <h2 style="color: #d83b01;">Microsoft Security Alert: Account Deactivation Pending</h2>
    <p>Dear Valued User,</p>
    <p>We detected multiple unauthorized login attempts originating from an unrecognized IP address in Bucharest, Romania. To safeguard your enterprise data, your <strong>Microsoft 365 Enterprise License</strong> has been scheduled for permanent suspension within <strong>24 hours</strong>.</p>
    <p>Immediate action is required. You must re-authenticate your identity and retain access to your mailbox and OneDrive storage:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://office365-verify-portal.click/login?session=92837482" style="background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
        Verify Your Microsoft Credentials Now
      </a>
    </div>
    <p style="font-size: 12px; color: #666;">If you fail to complete identity validation before 11:59 PM today, all company emails and linked SharePoint documents will be irreversibly archived.</p>
    <p style="font-size: 11px; color: #999;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052.</p>
  </div>
</body>
</html>`,
  },
  {
    id: 'bec-wire-transfer',
    name: 'Executive Wire Transfer (CEO Fraud)',
    category: 'BEC Fraud',
    badge: 'High Risk BEC',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    description: 'Impersonates company CEO requesting an off-the-books confidential wire transfer with altered Reply-To header.',
    rawEml: `Received: from public-webmail-relay.net (public-webmail-relay.net [203.0.113.88])
    by mx.enterprise-corp.com with ESMTP id 9B3C2A109
    for <finance-controller@enterprise-corp.com>; Mon, 05 Oct 2026 09:15:33 -0700
Authentication-Results: mx.enterprise-corp.com;
    spf=softfail (sender IP 203.0.113.88);
    dkim=none;
    dmarc=none
Return-Path: <exec-private-desk@public-webmail-relay.net>
From: "Jonathan Davis (CEO)" <jdavis-ceo-corp@gmail.com>
Reply-To: <wire-settlement-desk@direct-bankpay.top>
To: <finance-controller@enterprise-corp.com>
Subject: Confidential: Urgent Wire Settlement for Project Titan ($78,500)
Date: Mon, 05 Oct 2026 09:14:50 -0700
Message-ID: <CEO-URGENT-98124@public-webmail-relay.net>
MIME-Version: 1.0
Content-Type: text/plain; charset="UTF-8"

Hi Sarah,

I am currently in an all-day executive board meeting and cannot take phone calls. 

We are finalizing the confidential acquisition for Project Titan today, and our legal partner requires an immediate deposit of $78,500 before 1:00 PM EST to execute the NDA agreement.

Please process this wire transfer immediately from our primary operations account. Do not discuss this with the rest of the finance team yet as this is strictly confidential and under SEC quiet period.

Reply directly to this email and I will send you the beneficiary routing and SWIFT instructions right away.

Confirm as soon as you see this.

Best regards,

Jonathan Davis
Chief Executive Officer
Enterprise Global Holdings Inc.`,
  },
  {
    id: 'malware-invoice-attachment',
    name: 'Malicious Invoice & Trojan Payload',
    category: 'Malware Carrier',
    badge: 'Trojan Carrier',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    description: 'Fake billing notification containing dangerous executable masquerading as a PDF invoice and IP-based malicious link.',
    rawEml: `Received: from compromised-vps.buzz (compromised-vps.buzz [192.0.2.145])
    by mx.enterprise-corp.com with ESMTP id 12FF88390
    for <accounting@enterprise-corp.com>; Sun, 04 Oct 2026 18:02:11 -0700
Authentication-Results: mx.enterprise-corp.com;
    spf=fail;
    dkim=fail;
    dmarc=fail
Return-Path: <billing@compromised-vps.buzz>
From: "QuickBooks Online Invoicing" <quickbooks-billing@intuit-notices.buzz>
Reply-To: <dropsite@45.33.32.156>
To: <accounting@enterprise-corp.com>
Subject: Overdue Invoice INV-2026-99412 - Immediate Settlement Notice
Date: Sun, 04 Oct 2026 18:01:20 -0700
Message-ID: <INV-PAYMENT-481920@compromised-vps.buzz>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="====_BOUNDARY_SECURITY_TEST_001_===="

--====_BOUNDARY_SECURITY_TEST_001_====
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html>
<body>
  <h3>Invoice INV-2026-99412 Past Due</h3>
  <p>Our records show your subscription balance of $4,890.00 is outstanding.</p>
  <p>Please review the attached invoice breakdown or download your ledger copy immediately via our direct billing mirror: <a href="http://45.33.32.156/invoice_download.php">Download Official PDF Copy</a>.</p>
  <p>Failure to settle within 48 hours will result in collection proceedings.</p>
</body>
</html>

--====_BOUNDARY_SECURITY_TEST_001_====
Content-Type: application/x-msdownload; name="Invoice_INV_2026_99412.pdf.scr"
Content-Disposition: attachment; filename="Invoice_INV_2026_99412.pdf.scr"
Content-Transfer-Encoding: base64

TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAA2AAAAA4fug4AtAnNIbgBTM0hVGhpcyBwcm9ncmFtIGNhbm5vdCBiZSBydW4gaW4gRE9TIG1v
ZGUuDQ0KJAAAAAAAAABQRQAATAEDAAAAAA==

--====_BOUNDARY_SECURITY_TEST_001_====--`,
  },
  {
    id: 'legitimate-github',
    name: 'Legitimate GitHub Security Advisory',
    category: 'Clean Email',
    badge: 'Verified Clean',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    description: 'Standard authentic notification from GitHub with valid cryptographic DKIM signatures, SPF pass, and reputable domains.',
    rawEml: `Received: from out-1.smtp.github.com (out-1.smtp.github.com [192.30.252.192])
    by mx.enterprise-corp.com with ESMTP id 44B12C39A
    for <developer@enterprise-corp.com>; Sat, 03 Oct 2026 11:20:00 -0700
Authentication-Results: mx.enterprise-corp.com;
    spf=pass (sender IP 192.30.252.192 is allowed for domain github.com);
    dkim=pass header.i=@github.com header.s=s20250108;
    dmarc=pass (p=reject) header.from=github.com
Return-Path: <noreply@github.com>
From: "GitHub Notifications" <notifications@github.com>
Reply-To: <noreply@github.com>
To: <developer@enterprise-corp.com>
Subject: [GitHub] Security advisory for dependency in your repository
Date: Sat, 03 Oct 2026 11:19:35 -0700
Message-ID: <github/security-advisories/20261003111935@github.com>
MIME-Version: 1.0
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #24292f; line-height: 1.5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d0d7de; border-radius: 6px;">
    <h3 style="margin-top: 0;">Dependabot alert for your repository</h3>
    <p>Dependabot detected a low-severity vulnerability in one of your dependencies:</p>
    <ul>
      <li><strong>Package:</strong> lodash (npm)</li>
      <li><strong>Affected versions:</strong> &lt; 4.17.21</li>
      <li><strong>Patched version:</strong> 4.17.21</li>
    </ul>
    <p>You can review details and merge the automated pull request at:</p>
    <p><a href="https://github.com/enterprise-corp/security-repo/security/dependabot" style="color: #0969da;">https://github.com/enterprise-corp/security-repo/security/dependabot</a></p>
    <hr style="border: none; border-top: 1px solid #d0d7de; margin: 24px 0;" />
    <p style="font-size: 12px; color: #57606a;">GitHub, Inc. &bull; 88 Colin P Kelly Jr St &bull; San Francisco, CA 94107</p>
  </div>
</body>
</html>`,
  },
];
