<script>
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

export default {
  name: 'WeatherView',
  data() {
    return {
      city: '',
      weatherData: null,
      loading: false,
      error: '',
    }
  },
  computed: {
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null
    },
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
        : null
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather()
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (!apiKey) {
        this.error = 'OpenWeather API key is not configured.'
        return
      }

      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by this browser.'
        return
      }

      this.loading = true
      this.error = ''

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          await this.fetchWeatherData({
            lat: coords.latitude,
            lon: coords.longitude,
          })
        },
        () => {
          this.loading = false
          this.error = 'Location access was unavailable. Search for a city instead.'
        },
      )
    },
    async searchByCity() {
      const query = this.city.trim()

      if (!query) {
        this.error = 'Enter a city name.'
        return
      }

      await this.fetchWeatherData({ q: query })
    },
    async fetchWeatherData(parameters) {
      if (!apiKey) {
        this.error = 'OpenWeather API key is not configured.'
        return
      }

      this.loading = true
      this.error = ''

      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            ...parameters,
            appid: apiKey,
            units: 'metric',
          },
        })
        this.weatherData = response.data
      } catch (error) {
        console.error('Error fetching weather data:', error)
        this.error =
          error.response?.status === 404
            ? 'City not found. Try a city and country code, such as Clayton, AU.'
            : 'Unable to retrieve weather data. Check the API key and try again.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="weather-shell">
        <header class="mb-4">
          <p class="section-eyebrow">OpenWeather API</p>
          <h1 class="weather-title">WEATHER APP</h1>
          <p class="section-intro mb-0">View current weather or search by city.</p>
        </header>

        <div class="input-group search-bar">
          <input
            v-model="city"
            type="text"
            class="form-control search-input"
            placeholder="Enter city name"
            aria-label="City name"
            @keyup.enter="searchByCity"
          />
          <button type="button" class="btn btn-primary search-button" @click="searchByCity">
            Search
          </button>
        </div>

        <p v-if="loading" class="status-message" role="status">Loading weather...</p>
        <p v-if="error" class="error-message mt-3" role="alert">{{ error }}</p>

        <main v-if="weatherData && !loading" class="weather-result">
          <div>
            <p class="result-label">Current weather</p>
            <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
            <span class="text-capitalize">{{ weatherData.weather[0].description }}</span>
          </div>
          <div class="temperature-block">
            <img :src="iconUrl" :alt="`${weatherData.weather[0].description} weather icon`" />
            <p>{{ temperature }} °C</p>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-shell {
  max-width: 760px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid var(--mindbridge-line);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(23, 32, 51, 0.07);
}

.weather-title {
  font-size: 2.4rem;
}

.search-bar {
  max-width: 620px;
}

.status-message {
  margin-top: 18px;
  color: var(--mindbridge-muted);
}

.weather-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--mindbridge-line);
}

.result-label {
  margin-bottom: 6px;
  color: var(--mindbridge-green);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.temperature-block {
  display: flex;
  align-items: center;
}

.temperature-block img {
  width: 90px;
  height: 90px;
}

.temperature-block p {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

@media (max-width: 575.98px) {
  .weather-shell {
    padding: 20px;
  }

  .weather-result {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
