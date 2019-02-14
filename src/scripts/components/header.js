import { TweenMax, Power4 } from 'gsap';

export default {
  // On récupère, une seule fois, les éléments du DOM dont on aura besoin
  init () {
    const $el = document.querySelector('[data-component="header"]');

    this.$title = $el.querySelector('[data-ref="header.title"]');
    this.$strong = this.$title.querySelector('strong');
  },

  anime () {
    // Première implémentation d'une promesse
    // la méthode retourne une promesse
    // qui est résolue dans le callback "onComplete"
    // à noter qu'en cas de souci, on utilise "reject"
    return new Promise((resolve, reject) => {
      // Tween "à partie de…"
      TweenMax.from([this.$title, this.$strong], 5, {
        delay: 0.5,
        opacity: 0,
        y: 50,
        ease: Power4.easeOut,
        // C'est ici, à la fin de la transition qu'on résout la promesse
        // ce qui aura pour effet de passer à `then` dans la chaîne de promesse (`app.js`)
        onComplete () {
          resolve();
        }
      });
    });
  }
};
