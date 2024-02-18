export const convertToDateTime = () => {
  const now = new Date()
  const durationInSeconds = 60 * 60 * 24 * 30
  const futureDate = new Date(now.getTime() + durationInSeconds * 1000)

  return futureDate
}