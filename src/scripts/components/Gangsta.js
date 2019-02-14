import { TweenMax, TimelineMax, Power4 } from 'gsap/TweenMax';
import ee from '../utils/events';

// L'utilisation d'une classe, va nous permettre de générer plusieurs instances (objets créés à partir de la classe)
// Toutes les instances bénificieront des mêmes propriétés et méthodes
export class Gangsta {
  // Méthode spéciales qui est invoquée à chaque `new Gangsta`
  constructor (el) {
    // On récupère les éléments du DOM dont on aura besoin
    this.$el = el;
    this.$picture = el.querySelector('[data-ref="gangsta.picture"]');
    this.$name = el.querySelector('[data-ref="gangsta.name"]');
    this.$bio = el.querySelector('[data-ref="gangsta.bio"]');
    this.$action = el.querySelector('[data-ref="gangsta.action"]');
    console.info(`Gangsta: ${this.$name.textContent.trim()}`);

    // On gère tout ce qui est écouteurs d'événements
    this.bind();
    // On prépare l'état initial de l'animation
    this.prepareAnim();
  }

  /**
   * Events binding
   *
   * @memberof Gangsta
   */
  bind () {
    // À chaque resize de la fenêtre…
    ee.on('resize', (w, h, r) => {
      // Mettre ici votre stratégie…
      // Exemple: `this.update()` qui exécuterait les 2 premières lignes de `prepareAnim`
      // histoire que la hauteur du clipping soit toujours à jour…
      console.info('do something');
    });
  }

  /**
   * Animation, initial status
   *
   * @memberof Gangsta
   */
  prepareAnim () {
    // Hauteur de l'image pour le clipping
    this.height = this.$picture.offsetHeight;
    // Clipping total, image non visible
    this.$picture.style.clip = `rect(0, 0, ${this.height}px , 0 )`;

    // Pour manipuler ces 3 éléments ensembles, on les range dans un tableau
    this.details = [this.$name, this.$bio, this.$action];

    // On définit une opacité de zéro pour tous les éléments du tableau "details"
    TweenMax.set(this.details, {
      opacity: 0
    });
  }

  /**
   * Animation timeline
   *
   * @param {number} [delay=0] timeline delay
   * @memberof Gangsta
   */
  anime (delay = 0) {
    // On récupère de façon "déstructurée" la propriété "offsetWidth" et on l'assign à une variable "offsetWidth"
    // ce qui est moins verbeux que ceci :
    // const offsetWidth = this.$picture.offsetWidth;
    const { offsetWidth } = this.$picture;
    // Création d'un objet dont on va pouvoir "tweener" la propriété `w` de 0 à "largeur de l'image" (offsetWidth)
    const clipProgress = { w: 0 };
    // Création d'une timeline
    const tl = new TimelineMax({
      delay,
      onComplete () {
        // Animation terminée
        // On devrait "cleaner" les restes des transitions
        // notament le style "clip" inline…
        console.info('done', clipProgress);
      }
    });

    tl
      // Ajout d'un label qui pourra servier de point de repère pour ajuster les timing (via offsets)
      .add('start')
      // Transition de la propriété `w` de 0 à `offsetWidth`
      .to(clipProgress, 1, {
        w: offsetWidth,
        ease: Power4.easeInOut,
        // À chaque "update" (fps), on met à jour la propriété CSS "clip"
        onUpdate: () => {
          this.$picture.style.clip = `rect(0, ${clipProgress.w}px, ${this.height}px , 0 )`;
        }
        // Offset indiquant de placer ce tween à l'étiquette "start"
      }, 'start')
      // Petit effet de "dézoom"
      .from(this.$picture, 0.65, {
        scale: 1.2,
        ease: Power4.easeOut,
        // On supprime tous les styles inline liés au `transform: scale()`
        clearProps: 'scale'
        // Offset indiquant de placer ce tween une demi-seconde après "start"
      }, 'start+=0.5')
      // Animation des contenus "textuels"
      // le "stagger" permet de gérer facilement un petit délai entre chaque tween
      .staggerFromTo(
        // Mon tableau de 3 éléments
        this.details,
        // Durée d'un transition
        0.5,
        // Valeurs de départ
        {
          opacity: 0,
          y: 20,
          ease: Power4.easeOut
        },
        // Valeurs d'arrivée
        {
          opacity: 1,
          y: 0
        },
        // Décalage du "stagger"
        0.15,
        // Offset indiquant de placer ce tween une demi-seconde plus tôt (par rapport à sa position de départ dans la TL)
        '-=0.5'
      );
  }
}
