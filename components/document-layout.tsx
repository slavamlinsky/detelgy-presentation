import type { Metadata } from 'next';
import '@/app/globals.css';
export const metadata: Metadata = { title: 'Detelgy Vision', description: 'Where expertise becomes opportunity. A vision for polygraph professionals.', robots: {index:false,follow:false}, icons:{icon:'/assets/favicon.svg'} };
export function DocumentLayout({children,locale}:{children:React.ReactNode;locale:string}) {
  return <html lang={locale}><body>{children}</body></html>;
}
