/**
 * @file src/app/landing/page.tsx
 * @description GetMenu Showcase Landing Page route.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { LandingPage } from '../../components/LandingPage';

export default function LandingRoute() {
  return <LandingPage />;
}
