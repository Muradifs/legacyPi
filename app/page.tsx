// app/page.tsx
import LegacyPiVault from '@/components/legacy-pi-logo'; // ako imaš logo komponentu
// ili ako je glavna komponenta u lib/ ili components/
import LegacyPiApp from '@/lib/pi-legacy-vault'; // prilagodi prema imenu tvog fajla

export default function Home() {
  return (
    <>
      <LegacyPiApp />
    </>
  );
}