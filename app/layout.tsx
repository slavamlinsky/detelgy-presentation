import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Detelgy Vision', description: 'Where expertise becomes opportunity. A vision for polygraph professionals.', robots: {index:false,follow:false}, icons:{icon:'/assets/favicon.svg'} };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
