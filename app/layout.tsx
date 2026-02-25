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
        url: "https://cocon-precieux.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cocon Précieux - Baume multi-usages hydratant, nourrissant et protecteur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocon Précieux - Baume multi-usage naturel, végan, bio, made in France",
    description: "Le Baume Précieux : soin naturel multi-usage, 100% végan, 97% naturel, fabriqué en France.",
    images: ["https://cocon-precieux.fr/og-image.png"],
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
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
                priceValidUntil: "2026-12-31",
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingRate: {
                    "@type": "MonetaryAmount",
                    value: "5.25",
                    currency: "EUR"
                  },
                  shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "FR"
                  },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: {
                      "@type": "QuantitativeValue",
                      minValue: 1,
                      maxValue: 2,
                      unitCode: "d"
                    },
                    transitTime: {
                      "@type": "QuantitativeValue",
                      minValue: 2,
                      maxValue: 4,
                      unitCode: "d"
                    }
                  }
                },
                hasMerchantReturnPolicy: {
                  "@type": "MerchantReturnPolicy",
                  applicableCountry: "FR",
                  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                  merchantReturnDays: 14,
                  returnMethod: "https://schema.org/ReturnByMail",
                  returnFees: "https://schema.org/FreeReturn"
                },
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