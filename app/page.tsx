"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  Leaf,
  Award,
  Shield,
  Facebook,
  Instagram,
} from "lucide-react";
import { motion } from "@/components/FramerClient";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer"; 

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF6ED]">
      {/* Header modernisé */}
      <Header />

      {/* Hero Section */}
     <section className="relative min-h-[90vh] flex flex-col lg:flex-row overflow-hidden">
  {/* Fond en dégradé */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#F7E0D8]/30 to-[#E6D2B5]/20"></div>

  {/* ---- CONTENEUR IMAGE ---- */}
  {/* Sur mobile: en haut (order-1) | Sur desktop: à droite (lg:order-2) */}
  <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-[90vh] order-1 lg:order-2">
    <Image
      src="/produit.webp"
      alt="Le baume précieux dans son environnement"
      fill
      className="object-cover object-center"
      priority
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  </div>

  {/* ---- CONTENEUR TEXTE ---- */}
  {/* Sur mobile: en bas (order-2) | Sur desktop: à gauche (lg:order-1) */}
  <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center order-2 lg:order-1 px-6 py-12 md:p-12">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl text-center lg:text-left"
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-800 mb-6 leading-tight">
        Un soin qui apaise,
        <br />
        <span className="text-[#A07C2C]">un geste d'amour</span>
        <br />
        pour la peau
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
        Un baume multi-usage naturel, composé de seulement 8 ingrédients
        essentiels, soigneusement sélectionnés pour leur efficacité. Riche,
        fondant et sensoriel, il hydrate, apaise et sublime la peau tout en
        douceur.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
        <Button
          size="lg"
          className="bg-[#A07C2C] hover:bg-[#C9A74D] text-white px-8 py-6 text-lg rounded-full focus:ring-2 focus:ring-[#A07C2C] focus:ring-offset-2"
          asChild
        >
          <Link href="/produit">Découvrir le baume</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="text-[#A07C2C] hover:bg-[#F7E0D8]/50 px-8 py-6 text-lg focus:ring-2 focus:ring-[#A07C2C] focus:ring-offset-2"
        >
          <Link href="#story">Mon histoire</Link>
        </Button>
      </div>
    </motion.div>
  </div>
</section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Leaf, title: "100% Végan", desc: "Formules respectueuses" },
            {
              icon: Award,
              title: "97% d'ingrédients naturels",
              desc: "Dont 62% certifiés bio",
            },
            {
              icon: Heart,
              title: "Made in France 🇫🇷",
              desc: "Fabrication artisanale",
            },
            {
              icon: Shield,
              title: "Certifié ISO 22716",
              desc: "Bonnes Pratiques de Fabrication",
            },
          ].map((benefit) => (
            // Using a unique key like the title is better than index
            <motion.div
              key={benefit.title}
              variants={fadeInUp}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F7E0D8] to-[#E6D2B5] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-[#C9A74D]" />
              </div>
              <h2 className="font-semibold text-gray-800 mb-2">
                {benefit.title}
              </h2>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-[#C9A74D]" />
              <span>Conforme aux normes européennes</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Heart className="w-4 h-4 text-[#C9A74D]" />
              <span>Non testé sur les animaux</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Leaf className="w-4 h-4 text-[#C9A74D]" />
              <span>Formules testées et validées</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-[#C9A74D]" />
              <span>Conforme aux BPF (bonnes pratiques de fabrication)</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section
        id="story"
        className="py-20 bg-gradient-to-br from-[#F7E0D8]/20 to-[#E6D2B5]/10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-6">
                Mon histoire
              </h2>
              <div className="w-20 h-1 bg-[#C9A74D] mx-auto mb-8"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Cocon Précieux est né d'un besoin simple mais essentiel :
                  offrir à la peau une parenthèse de douceur, loin des produits
                  chimiques, agressifs ou impersonnels.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Notre mission ? Créer des soins naturels, sensoriels et
                  bienveillants, conçus comme un vrai rituel cocooning, pour
                  prendre soin de soi avec tendresse.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Chaque baume est fabriqué en petite série, avec amour,
                  exigence et authenticité, pour garantir une qualité
                  irréprochable et une expérience unique.
                </p>

                <div className="bg-gradient-to-r from-[#F7E0D8]/30 to-[#E6D2B5]/20 rounded-2xl p-6">
                  <h3 className="font-serif text-xl text-[#C9A74D] mb-3">
                    Ce qui rend Cocon Précieux unique ?
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Un soin qui ne fait pas que nourrir... Il réconforte, il
                    apaise, il célèbre la beauté simple.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    Cocon Précieux, c'est plus qu'un produit : c'est une
                    intention, un geste d'amour pour la peau.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative aspect-square"
              >
                <Image
                  src="/image2.webp"
                  alt="Fabrication artisanale du baume précieux"
                  fill
                  className="rounded-2xl shadow-lg object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white" id="Values">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-6">
              Mes valeurs
            </h2>
            <div className="w-20 h-1 bg-[#C9A74D] mx-auto"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "Naturel & Sain",
                desc: "Des formules courtes, transparentes, sans compromis.",
                icon: Leaf,
              },
              {
                title: "Douceur & Bien-être",
                desc: "Un moment rien qu'à vous, pour reconnecter à l'essentiel.",
                icon: Heart,
              },
              {
                title: "🇫🇷 Fabrication Française",
                desc: "En laboratoire, à taille humaine et avec passion.",
                icon: Award,
              },
              {
                title: "Élégance & Sensorialité",
                desc: "Un soin qui parle à la peau... et au cœur.",
                icon: Star,
              },
            ].map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-[#FDFBF6] to-[#F7E0D8]/30">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C9A74D] to-[#D9C1A3] rounded-full flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="font-semibold text-[#C9A74D] text-xl">
                        {value.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {value.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
          </motion.div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-[#E6D2B5]/10 to-[#D9C1A3]/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-6">
              Elles nous font confiance
            </h2>
            <div className="w-20 h-1 bg-[#C9A74D] mx-auto"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Marie L.",
                text: "Un baume magique ! Ma peau n'a jamais été aussi douce. Je l'utilise partout : visage, mains, et même sur les pointes de mes cheveux.",
                rating: 5,
              },
              {
                name: "Sophie D.",
                text: "Enfin un produit naturel qui tient ses promesses. L'odeur est divine et la texture parfaite. Je recommande à 100% !",
                rating: 5,
              },
              {
                name: "Camille R.",
                text: "Je suis conquise par ce baume multi-usage. Il est parfait pour ma routine minimaliste et ma peau sensible. Un vrai coup de cœur.",
                rating: 5,
              },
            ].map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg bg-white">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-[#C9A74D] text-[#C9A74D]"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic flex-grow">
                      "{testimonial.text}"
                    </p>
                    <p className="font-semibold text-[#C9A74D] text-right">
                      — {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C9A74D]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white text-[#C9A74D] border border-[#C9A74D] shadow-lg px-6 py-3 text-base font-semibold animate-pulse">
              🎁 Offre exclusive : un cadeau pour les 28 premières
              commandes&nbsp;!
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Prête à découvrir votre nouveau rituel beauté ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Un soin minimaliste pour un maximum de bienfaits Polyvalent et
              efficace, ce baume s’adapte à tous les besoins : visage, corps,
              pointes de cheveux, mains, lèvres, après-soleil, et barbe.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-sm mx-auto">
              <div className="text-4xl font-bold text-[#FFF] mb-2 drop-shadow">
                25€
                <span className="text-base font-normal text-[#F7E0D8]">
                  {" "}(livraison offerte dès 2 produits)
                </span>
              </div>
              <p className="text-[#F7E0D8] text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16V6a1 1 0 011-1h13a1 1 0 011 1v10m-1 4a2 2 0 100-4 2 2 0 000 4zm-10 0a2 2 0 100-4 2 2 0 000 4zm10-4H7m10 0V6m0 10v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2" /></svg>
                Livraison : 5,25€ pour 1 produit, offerte dès 2 produits !
              </p>
            </div>

            <Button
              size="lg"
              className="bg-white text-[#A07C2C] hover:bg-gray-100 px-10 py-7 text-lg rounded-full focus:ring-2 focus:ring-[#A07C2C] focus:ring-offset-2"
              asChild
            >
              <Link href="/produit">Commander mon baume</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer/>
     
    </div>
  );
}
