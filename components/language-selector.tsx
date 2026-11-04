'use client';
import { Globe2 } from 'lucide-react';
import { localeDefinitions } from '@/lib/locales.mjs';
import { localeNavigationUrl } from '@/lib/presentation-playback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function LanguageSelector({ locale, slideId, index, label }: {
  locale: string; slideId: string; index: number; label: string;
}) {
  return <div className="language-selector" data-no-slide-advance>
    <Select value={locale} onValueChange={value => {
      if (value !== locale) window.location.assign(localeNavigationUrl(new URL(window.location.href), value, slideId, index));
    }}>
      <SelectTrigger aria-label={label}>
        <Globe2 size={16} aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent data-no-slide-advance>
        {localeDefinitions.filter(option => option.enabled).map(option =>
          <SelectItem key={option.code} value={option.code} textValue={option.name}>
            <span lang={option.code}>{option.name}</span>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  </div>;
}
