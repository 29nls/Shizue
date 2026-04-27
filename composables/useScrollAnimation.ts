export const useScrollAnimation = () => {
  const initializeAOS = () => {
    if (process.client) {
      // Dynamically import AOS only on client side
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 600,
          easing: 'ease-in-out',
          offset: 100,
          once: false,
          mirror: true
        })
      })
    }
  }

  const refreshAOS = () => {
    if (process.client) {
      import('aos').then((AOS) => {
        AOS.default.refresh()
      })
    }
  }

  return { initializeAOS, refreshAOS }
}
