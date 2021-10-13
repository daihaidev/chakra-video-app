import { gsap, TimelineMax } from "../../../../gsap"
import { isBrowser } from "../../../../util/browser"

import { SVGHeart } from "./heart"

const emojiReactionAnimation = (color: string) => {

  const emojiArray = []

  const { random } = gsap.utils

  if (isBrowser) {
    const emojiElement: HTMLParagraphElement = document.createElement('p')
    const id = `#emoji-${parseInt(random(0, 10))}`
    emojiElement.innerHTML = SVGHeart(color)
    emojiElement.id = id

    emojiArray.push(emojiElement)

    const currentDiv = document
      .getElementById('video')

    document
      .getElementById('video-wrapper')
      ?.insertBefore(emojiElement, currentDiv)

    gsap.set(emojiElement, {
      position: 'absolute'
    })

    const tl = new (TimelineMax as any)()

    const heartRotation = random(270, 359)

    tl.fromTo(
      emojiElement,
      {
        bottom: 25,
        opacity: 1,
        right: random(0, 100),
        zIndex: 10,
        height: `${random(12, 24)}px`,
        width: `${random(12, 24)}px`,
        rotation: random(180, 360)
      },
      {
        top: 0,
        opacity: 0.4,
        duration: 1.8,
        rotation: heartRotation,
        x: random(80, 100),
        height: `${random(12, 96)}px`,
        width: `${random(12, 96)}px`,
        ease: 'rough'
      }
    )
      .fromTo(
        emojiElement,
        {
          rotation: heartRotation,
          opacity: 0.4
        },
        {
          rotation: heartRotation + 20,
          opacity: 0,
          duration: 0.4,
          ease: 'out'
        }
      )
      .call(() => emojiElement.parentNode.removeChild(emojiElement))
  }
}

export default emojiReactionAnimation
