# Active Directory practice lab - v4.1

This is an interactive browser simulation of Active Directory Domain Services (AD DS), not a Windows Server installation. No accounts, credentials, domain joins, directory servers or live SIEM feeds are created. Use fictional names. No passwords are collected or stored. It works without starting UDS, Wazuh or Docker when the static app is served/cached.

## Start-to-finish exercise

1. Open **Active Directory lab**. Check isolated network, static address/DNS and time synchronization, then **Prepare mock domain**. The fixed teaching domain is `ad.tpol.test`; DC1 uses `192.168.56.10`. These are lab examples, not changes to your PC.
2. Create each OU: **People**, **Groups**, **Workstations**. OUs organize objects and provide administrative/policy boundaries; a user OU does not grant document access.
3. Create **GG-Radio-Readers**, choosing **Global** scope and **Security** category. Distribution is rejected for this access-control exercise.
4. Enter a fictional display name and logon name, choose People, and select the mock temporary-credential option. Review the summary, then **Finish: create mock user**. The user starts enabled and must complete a simulated password change.
5. Add the user to **GG-Radio-Readers**. Domain Admins is intentionally rejected as excessive privilege for reading Radio Briefs.
6. Choose DC1 DNS and join the fictional workstation **RADIO-01**. Public DNS alone cannot resolve this private mock domain. The simulation marks the mock restart complete; it never restarts Windows.
7. Test sign-in using **Issued mock credential**, then complete the required mock password change. No actual password is entered. Wrong-credential attempts demonstrate a three-attempt lockout (this lab's choice, not an AD default).
8. Try reading Radio Briefs: expected **allowed**. Try editing it: expected **denied**. Onboarding is complete only after both tests. This simplifies Windows access evaluation; real access includes share/NTFS ACLs, group nesting, deny entries and the active user token.
9. Disable the account and test a **new** sign-in: expected denial. Disabling real AD accounts does not forcibly end all existing sessions. Enable to restore, unlock if necessary, or reset the mock credential and repeat first sign-in. Resetting a credential and unlocking an account are separate operations.

The inventory and activity panel update after every action. On reload, saved setup remains but the mock sign-in session ends. Export creates a JSON exercise record; it contains fictional metadata and activity, never a password. Reset clears only this AD exercise. Existing lessons and notes keep their original storage keys.

## Windows reference commands

Each step has a collapsible command explanation. They are teaching references for a separately planned Windows Server environment with appropriate delegated permissions. They are not executed by this app. The domain/addresses must be adapted to an isolated real lab before use. Installing AD DS, promoting a forest and joining a client can change a server or restart a computer. Do not apply the example commands to your everyday PC just to use the simulator.

For actual onboarding, use the approved request, confirm identity/job need, choose the right OU and role groups, create the account under domain password policy, deliver a temporary credential securely, require an initial change when appropriate, and verify both permitted and prohibited actions. Record approval and ownership. The mock exercise approximates the workflow rather than Windows security internals.

## Scope boundaries

- No Kerberos tickets, LDAP requests, Group Policy engine, replication or Windows event IDs are generated.
- No Entra ID tenant, Keycloak federation or Wazuh connector is configured.
- AD-related arrows in the deployment overview are **planned** integration paths, not installed feeds.
- Single-user practice scenario; Reset begins a new scenario. There is no bulk directory importer.
- No actual password-policy evaluator: the credential selector represents the result of authentication.

## Microsoft references (reviewed 11 October 2026)

- AD DS installation: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-
- Manage accounts in ADUC: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage-user-accounts-in-windows-server
- New-ADUser: https://learn.microsoft.com/en-us/powershell/module/activedirectory/new-aduser
- New-ADGroup: https://learn.microsoft.com/en-us/powershell/module/activedirectory/new-adgroup
- Add-Computer: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/add-computer?view=powershell-5.1
- Set-ADAccountPassword: https://learn.microsoft.com/en-us/powershell/module/activedirectory/set-adaccountpassword
