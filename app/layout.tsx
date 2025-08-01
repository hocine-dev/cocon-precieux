import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://xn--coconprcieux-heb.fr/"), 
  title: "Cocon Précieux - Soins Naturels & Cosmétiques Bio Made in France",
  description:
    "Découvrez Le Baume Précieux, un soin multi-usage naturel aux 8 ingrédients essentiels. 100% végan, 97% naturel, fabriqué en France. Hydrate, apaise et sublime votre peau.",
  keywords:
    "cosmétiques naturels, baume multi-usage, soins bio, made in France, végan, peau sensible, hydratation naturelle",
  authors: [{ name: "Cocon Précieux" }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C9A74D" }, 
    { media: "(prefers-color-scheme: dark)", color: "#C9A74D" },  
  ],
  creator: "Cocon Précieux",
  publisher: "Cocon Précieux",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cocon-precieux.fr",
    siteName: "Cocon Précieux",
    title: "Cocon Précieux - Soins Naturels & Cosmétiques Bio",
    description:
      "Un soin qui apaise, un geste d'amour pour la peau. Découvrez nos cosmétiques naturels fabriqués avec amour en France.",
    images: [
      {
        url: "/image1.jpg",
        width: 1200,
        height: 630,
        alt: "Cocon Précieux - Le Baume Précieux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocon Précieux - Soins Naturels Bio",
    description: "Un soin qui apaise, un geste d'amour pour la peau",
    images: ["/og-image.jpg"], // also resolves correctly
  },
  alternates: {
    canonical: "https://cocon-precieux.fr",
  },
  generator: 'Hocine Dev',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#C9A74D" />

        {/* Structured Data for SEO */}
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
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
