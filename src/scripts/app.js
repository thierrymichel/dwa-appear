// Import d'un `export default`
import header from './components/header';
// Import d'un `export named`
import { Gangsta } from './components/Gangsta';
// Exemple d'un petit "bus event" pour permettre à des modules de communiquer entre eux
// ou pour centraliser un seul type d'événement (resize, scroll, raf, …)
import ee from './utils/events';

// On attend que le DOM soit chargé
// Idéalement, on encapsulera tout ce qui suit de façcon plus propre (ça viendra par la suite)
document.addEventListener('DOMContentLoaded', () => {
  console.info('🔫 Gangsters!');
  // Init components
  header.init();

  // On se prépare à stocker les instances de Gangsta
  const gangsters = [];

  // Pour chaque élément de la liste, on crée une instance de Gangsta
  // qu'on stocke dans notre tableau pour utilisation ultérieure
  document
    .querySelectorAll('[data-component="gangsta"]')
    .forEach(el => {
      gangsters.push(new Gangsta(el));
    });

  // Exemple d'un écouteur de resize qui utilise notre bus event
  // Il faudrait récupérer la largeur/hauteur du viewport
  // éventuellement calculer le ratio
  // et passer tout ça en paramètres supplémentaires au "emit"
  window.addEventListener('resize', () => {
    ee.emit('resize');
    // ee.emit('resize', w, h, r);
  });

  // Première implémentation d'une promesse !
  // `header.anime()` retourne une promesse…
  const status = header
    .anime()
    // lorsque cette promesse est résolue (statut passant de "pending" à "fulfilled")
    // on peut faire autre chose
    .then(() => {
      // On anime les gangsta de façon "séquentielle"
      // en passant un délai basé sur l'index de chaque gangsta
      gangsters.forEach((g, i) => {
        g.anime(i);
      });
    });

  // Ici on peut voir le statut de la promesse changer…
  console.info(status);
});
