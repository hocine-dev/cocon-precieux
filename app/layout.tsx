import type { Metadata, Viewport } from "next"; // Import Viewport
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

// The new Viewport export
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C9A74D" },
    { media: "(prefers-color-scheme: dark)", color: "#C9A74D" },
  ],
  width: 'device-width',
  initialScale: 1,
};

// The corrected Metadata export (without themeColor)
export const metadata: Metadata = {
  metadataBase: new URL("https://cocon-precieux.fr"),
  title: "Cocon Précieux - Baume multi-usage naturel, végan, bio, made in France",
  description:
    "Le Baume Précieux : soin naturel multi-usage, 100% végan, 97% naturel, fabriqué en France. Hydrate, apaise, sublime la peau. Livraison rapide.",
  keywords:
    "baume naturel, cosmétique bio, soin multi-usage, végan, made in France, hydratation, peau sensible, cocon précieux, baume précieux, cosmétique naturel, beauté française, livraison rapide",
  authors: [{ name: "Cocon Précieux" }],
  creator: "Cocon Précieux",
  publisher: "Cocon Précieux",
  robots: "index, follow",
  alternates: {
    canonical: "https://cocon-precieux.fr/",
    languages: {
      'fr': 'https://cocon-precieux.fr/',
      'en': 'https://cocon-precieux.fr/en',
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cocon-precieux.fr/",
    siteName: "Cocon Précieux",
    title: "Cocon Précieux - Baume multi-usage naturel, végan, bio, made in France",
    description:
      "Le Baume Précieux : soin naturel multi-usage, 100% végan, 97% naturel, fabriqué en France. Hydrate, apaise, sublime la peau.",
    images: [
      {
        url: "https://cocon-precieux.fr/image1.webp",
        width: 1200,
        height: 630,
        alt: "Cocon Précieux - Le Baume Précieux",
      },
      {
        url: "https://cocon-precieux.fr/logo.png",
        width: 512,
        height: 512,
        alt: "Cocon Précieux Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocon Précieux - Baume multi-usage naturel, végan, bio, made in France",
    description: "Le Baume Précieux : soin naturel multi-usage, 100% végan, 97% naturel, fabriqué en France.",
    images: ["https://cocon-precieux.fr/image1.webp"],
    site: "@cocon_precieux",
  },
  generator: 'Hocine Dev',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      {/* The <head> tag here is not needed. 
        Next.js will automatically populate the head with your metadata exports.
        We remove the manual meta tags and structured data scripts from here.
        The favicon can also be handled by Next.js by placing favicon.ico in the /app directory.
      */}
      <head>
        {/* These manual meta tags are now handled by the `viewport` export and should be removed */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /> */}
        {/* <meta name="theme-color" content="#C9A74D" /> */}

        {/* Structured Data for SEO - This part is fine to keep */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cocon Précieux",
              url: "https://cocon-precieux.fr",
              logo: "https://cocon-precieux.fr/logo.png",
              description: "Cosmétiques naturels et soins bio fabriqués en France",
              address: {
                "@type": "PostalAddress",
                addressCountry: "FR",
              },
              sameAs: ["https://instagram.com/cocon_precieux"],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Le Baume Précieux",
              description: "Baume multi-usage naturel aux 8 ingrédients essentiels, 100% végan, 97% naturel",
              brand: {
                "@type": "Brand",
                name: "Cocon Précieux",
              },
              offers: {
                "@type": "Offer",
                price: "25",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                seller: {
                  "@type": "Organization",
                  name: "Cocon Précieux",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                reviewCount: "127",
              },
              image: [
                "https://cocon-precieux.fr/image1.webp",
                "https://cocon-precieux.fr/logo.png"
              ],
              sku: "CP-BAUME-001",
              gtin13: "1234567890123",
              url: "https://cocon-precieux.fr/produit",
              category: "Cosmétiques naturels",
              review: [
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Marie" },
                  reviewRating: { "@type": "Rating", ratingValue: "5" },
                  reviewBody: "Un baume exceptionnel, ma peau est transformée !"
                }
              ]
            }),
          }}
        />

        {/* WebSite structured data for Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://cocon-precieux.fr/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://cocon-precieux.fr/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}