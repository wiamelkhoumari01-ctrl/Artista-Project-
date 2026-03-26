
import { motion } from "framer-motion";

export default function ScrollReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} // Un peu plus de mouvement vers le haut
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }} // Déclenche l'animation dès que le bord de la section apparaît
      transition={{ 
        duration: 0.9, 
        ease: [0.21, 0.47, 0.32, 0.98] // C'est une courbe "Bézier" pour un effet très organique
      }}
    >
      {children}
    </motion.div>
  );
}