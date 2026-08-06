<script setup>
import { computed, ref } from 'vue'
import { serviceLocations } from '../data/mindbridgeData'

const token = import.meta.env.VITE_MAPBOX_TOKEN
const query = ref('')
const searchResults = ref(serviceLocations)
const selectedOrigin = ref(null)
const selectedDestination = ref(serviceLocations[0])
const trip = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const userLocation = ref(null)

const hasToken = computed(() => Boolean(token))
const mapImage = computed(() => {
  if (!hasToken.value || !selectedDestination.value?.coordinates) return ''
  const [longitude, latitude] = selectedDestination.value.coordinates
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+167a62(${longitude},${latitude})/${longitude},${latitude},11,0/900x420?access_token=${token}`
})

const searchServices = async () => {
  errorMessage.value = ''
  const searchText = query.value.trim()
  if (!searchText) {
    searchResults.value = serviceLocations
    return
  }
  if (!hasToken.value) {
    searchResults.value = serviceLocations.filter((service) => `${service.name} ${service.address} ${service.type}`.toLowerCase().includes(searchText.toLowerCase()))
    return
  }
  loading.value = true
  try {
    const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(searchText)}&limit=5&language=en&access_token=${token}`)
    const payload = await response.json()
    const features = payload.features ?? []
    searchResults.value = features.map((feature, index) => ({
      id: feature.properties?.mapbox_id ?? `mapbox-${index}`,
      name: feature.properties?.name ?? feature.text ?? 'Service location',
      address: feature.properties?.full_address ?? feature.properties?.place_formatted ?? 'Mapbox result',
      type: feature.properties?.feature_type ?? 'Search result',
      coordinates: feature.geometry?.coordinates,
    })).filter((service) => Array.isArray(service.coordinates))
  } catch (error) {
    errorMessage.value = `Mapbox search failed: ${error.message}`
  } finally {
    loading.value = false
  }
}

const useMyLocation = () => {
  errorMessage.value = ''
  if (!navigator.geolocation) {
    errorMessage.value = 'This browser does not provide geolocation.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      userLocation.value = [coords.longitude, coords.latitude]
      selectedOrigin.value = { name: 'My current location', coordinates: userLocation.value }
    },
    (error) => { errorMessage.value = `Location permission was not available: ${error.message}` },
    { enableHighAccuracy: false, timeout: 8000 },
  )
}

const calculateDirections = async () => {
  errorMessage.value = ''
  trip.value = null
  if (!selectedOrigin.value?.coordinates) {
    errorMessage.value = 'Choose a starting point or use your current location first.'
    return
  }
  if (!selectedDestination.value?.coordinates) {
    errorMessage.value = 'Choose a destination from the service results.'
    return
  }
  if (!hasToken.value) {
    trip.value = { distance: 'Configure VITE_MAPBOX_TOKEN for live directions', duration: 'Demo route ready', steps: ['Origin and destination selected', 'Mapbox Directions API will provide turn-by-turn guidance after deployment configuration.'] }
    return
  }
  loading.value = true
  try {
    const start = selectedOrigin.value.coordinates.join(',')
    const end = selectedDestination.value.coordinates.join(',')
    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&access_token=${token}`)
    const payload = await response.json()
    const route = payload.routes?.[0]
    if (!route) throw new Error('No route was returned.')
    trip.value = { distance: `${(route.distance / 1000).toFixed(1)} km`, duration: `${Math.round(route.duration / 60)} min`, steps: route.legs?.[0]?.steps?.slice(0, 5).map((step) => step.maneuver?.instruction) ?? [] }
  } catch (error) {
    errorMessage.value = `Directions failed: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div><p class="section-eyebrow">E.2 service map</p><h1>Find local support services</h1></div>
        <p class="section-intro">Search points of interest with Mapbox, use browser geolocation, and calculate a route with distance, travel time, and step instructions.</p>
      </div>

      <div class="form-panel mb-4">
        <form class="row g-3" @submit.prevent="searchServices">
          <div class="col-12 col-lg-8"><label for="service-search" class="form-label">Search for a service or suburb</label><input id="service-search" v-model="query" type="search" class="form-control" placeholder="Try counselling, Preston, carer support" /></div>
          <div class="col-12 col-lg-4 d-flex align-items-end gap-2"><button type="submit" class="btn btn-primary">{{ loading ? 'Searching…' : 'Search Mapbox' }}</button><button type="button" class="btn btn-outline-primary" @click="useMyLocation">Use my location</button></div>
        </form>
        <div v-if="!hasToken" class="alert alert-warning mt-3 mb-0" role="status">Demo locations remain available. Add a Mapbox public token as <code>VITE_MAPBOX_TOKEN</code> for live POI search, static map tiles, and directions.</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0" role="alert">{{ errorMessage }}</div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-7">
          <div class="map-panel" role="img" aria-label="Map preview showing the selected service location">
            <img v-if="mapImage" :src="mapImage" alt="Mapbox map showing the selected MindBridge service" class="map-image" />
            <div v-else class="map-fallback"><span class="map-pin">+</span><strong>MindBridge service map</strong><span>POI search and directions are ready for the configured Mapbox token.</span></div>
          </div>
          <div class="service-results mt-3" aria-live="polite">
            <article v-for="service in searchResults" :key="service.id" class="service-result" :class="{ selected: selectedDestination?.id === service.id }">
              <div><span class="resource-type">{{ service.type }}</span><h2>{{ service.name }}</h2><p>{{ service.address }}</p></div>
              <button type="button" class="btn btn-outline-primary btn-sm" @click="selectedDestination = service">Choose destination</button>
            </article>
            <p v-if="!searchResults.length" class="empty-state">No matching services found. Try a broader search.</p>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="form-panel h-100">
            <p class="section-eyebrow">Trip information</p><h2>Plan your route</h2>
            <p class="text-secondary">Destination: <strong>{{ selectedDestination?.name ?? 'Not selected' }}</strong></p>
            <div class="mb-3"><label for="origin-select" class="form-label">Starting point</label><select id="origin-select" class="form-select" :value="selectedOrigin?.id ?? ''" @change="selectedOrigin = serviceLocations.find((service) => service.id === $event.target.value) ?? selectedOrigin"><option value="">Select a service or use location</option><option v-for="service in serviceLocations" :key="service.id" :value="service.id">{{ service.name }}</option></select></div>
            <button type="button" class="btn btn-primary w-100" @click="calculateDirections">{{ loading ? 'Calculating…' : 'Get directions' }}</button>
            <div v-if="trip" class="trip-card mt-4" aria-live="polite"><div class="trip-summary"><div><span>Distance</span><strong>{{ trip.distance }}</strong></div><div><span>Travel time</span><strong>{{ trip.duration }}</strong></div></div><h3>Route steps</h3><ol><li v-for="step in trip.steps" :key="step">{{ step }}</li></ol></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
