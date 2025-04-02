'use client';

import { SignOutButton } from '@clerk/nextjs';

export default function LogoutButton() {
  return (
    <SignOutButton>
      サインアウト
    </SignOutButton>
  );
}