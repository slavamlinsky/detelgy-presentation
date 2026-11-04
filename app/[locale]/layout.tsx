import { notFound } from 'next/navigation';
import { DocumentLayout } from '@/components/document-layout';
import { localeDefinition } from '@/lib/locales.mjs';
export { metadata } from '@/components/document-layout';
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}) {
  const {locale}=await params;
  if (!localeDefinition(locale)) notFound();
  return <DocumentLayout locale={locale}>{children}</DocumentLayout>;
}
