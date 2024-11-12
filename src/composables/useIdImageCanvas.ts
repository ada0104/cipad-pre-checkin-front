import { ref, watch, nextTick } from 'vue'

export function useIdImageCanvas() {
  type CanvasRefs = {
    [key: string]: HTMLCanvasElement | null
  }

  const canvasRefs = ref<CanvasRefs>({})

  const addWatermark = (canvas: HTMLCanvasElement, imageUrl: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const watermarkText = '僅供平臺使用'
      const fontSize = 12
      const fontFamily = '"Noto Sans"'
      const fontWeight = '500'
      const fillStyle = 'rgba(0, 0, 0, 0.5)'

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.fillStyle = fillStyle
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const angle = 20.951 * (Math.PI / 180)
      ctx.save()

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(angle)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      const textWidth = ctx.measureText(watermarkText).width
      const textHeight = 0.3
      const xOffset = 15
      const yOffset = 25

      for (let y = -canvas.height; y < canvas.height * 2; y += textHeight + yOffset) {
        for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + xOffset) {
          const offsetX = (y / (textHeight + yOffset)) % 2 === 0 ? 0 : xOffset / 2
          ctx.fillText(watermarkText, x + offsetX, y)
        }
      }
      ctx.restore()
    }

    img.src = imageUrl
  }

  const applyWatermarks = (idImageArray: any) => {
    nextTick(() => {
      Object.keys(canvasRefs.value).forEach((side) => {
        const canvas = canvasRefs.value[side]
        if (canvas && idImageArray[side]) {
          addWatermark(canvas, idImageArray[side])
        }
      })
    })
  }

  return {
    canvasRefs,
    applyWatermarks
  }
}