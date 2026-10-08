# Security Specification for AI Email Threat Detection

## 1. Data Invariants
1. A User profile document (`/users/{userId}`) can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. A User profile read is restricted strictly to the user itself (`isOwner(userId)`).
3. An EmailScan document (`/emailScans/{scanId}`) must have `userId == request.auth.uid`. No user may submit scans attributed to another user.
4. An EmailScan can only be read, listed, updated, or deleted by the user who owns it (`resource.data.userId == request.auth.uid`).
5. Query Enforcer: Collections cannot be read or listed openly. List operations must enforce `resource.data.userId == request.auth.uid`.

## 2. The Dirty Dozen Payloads (Designed to Break Identity & Integrity)
1. **Unauthenticated Read Users**: An anonymous unauthenticated client requesting `/users/victim_123` -> PERMISSION_DENIED.
2. **Cross-Tenant User Profile Read**: User `attacker_abc` trying to get `/users/victim_123` -> PERMISSION_DENIED.
3. **User Profile Impersonation Create**: User `attacker_abc` trying to write `{ id: 'victim_123', email: 'spoofed@corp.com' }` to `/users/victim_123` -> PERMISSION_DENIED.
4. **EmailScan Owner Forgery**: User `attacker_abc` submitting an EmailScan with `userId: 'victim_123'` to `/emailScans/scan_999` -> PERMISSION_DENIED.
5. **Cross-User Scan Read**: User `attacker_abc` requesting `/emailScans/scan_victim_1` where `userId: 'victim_123'` -> PERMISSION_DENIED.
6. **Cross-User Scan List Scraping**: Attacker listing `/emailScans` without filtering by their own `userId` -> PERMISSION_DENIED.
7. **Malicious Document ID Injection**: Attempting to write to `/emailScans/../../evil` or ID with illegal characters -> PERMISSION_DENIED.
8. **Shadow Field Injection**: Writing an EmailScan with extra arbitrary fields not conforming to the schema -> PERMISSION_DENIED.
9. **Tampering with Scan Ownership**: Attempting to update existing scan's `userId` from `attacker_abc` to `victim_123` -> PERMISSION_DENIED.
10. **Unauthenticated Scan Creation**: Unauthenticated request trying to write to `/emailScans/scan_1` -> PERMISSION_DENIED.
11. **Negative Risk Score Injection**: Submitting an EmailScan with invalid negative or out-of-range riskScore -> PERMISSION_DENIED.
12. **Cross-User Scan Deletion**: User `attacker_abc` attempting to delete `/emailScans/scan_victim_1` -> PERMISSION_DENIED.
