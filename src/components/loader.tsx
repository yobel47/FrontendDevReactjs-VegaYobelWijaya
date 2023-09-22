function imageLoader({ src }: { src: number }) {
    return `https://restaurant-api.dicoding.dev/images/large/${src}`
}

module.exports = imageLoader