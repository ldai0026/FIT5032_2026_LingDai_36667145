<script setup>
import { computed, ref } from 'vue'
import { authHelpers, currentUser, isAuthenticated } from '../auth'

const RATINGS_KEY = 'mindbridge_resource_ratings'

const resources = [
  {
    id: 'anxiety-toolkit',
    type: 'Self-help',
    topic: 'Anxiety',
    audience: 'Young adults',
    title: 'Anxiety grounding toolkit',
    description: 'Short exercises for moments when anxiety feels difficult to manage.',
    seedRatings: [5, 4, 5, 4],
  },
  {
    id: 'safe-conversation',
    type: 'Carer guide',
    topic: 'Family support',
    audience: 'Carers',
    title: 'Starting a safe conversation',
    description: 'Guidance for family members who want to support someone respectfully.',
    seedRatings: [5, 5, 4],
  },
  {
    id: 'counselling-pathway',
    type: 'Service',
    topic: 'Counselling',
    audience: 'Members',
    title: 'Low-cost counselling pathway',
    description: 'A plain-English description of intake, eligibility, and referral options.',
    seedRatings: [4, 4, 3, 5],
  },
  {
    id: 'peer-checklist',
    type: 'Peer support',
    topic: 'Community',
    audience: 'Members',
    title: 'Online group readiness checklist',
    description: 'Questions to consider before joining a moderated peer support space.',
    seedRatings: [4, 5, 4],
  },
  {
    id: 'urgent-help-plan',
    type: 'Safety plan',
    topic: 'Crisis preparation',
    audience: 'All users',
    title: 'Urgent help preparation plan',
    description: 'A private checklist for warning signs, trusted contacts, and immediate options.',
    seedRatings: [5, 5, 5, 4],
  },
  {
    id: 'staff-referral-map',
    type: 'Staff resource',
    topic: 'Referral',
    audience: 'Staff',
    title: 'Referral readiness map',
    description: 'A staff-facing overview for matching support needs with suitable referral paths.',
    seedRatings: [4, 4, 5],
  },
]

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback
  } catch {
    return fallback
  }
}

const loadRatings = () => {
  const storedRatings = safeJsonParse(localStorage.getItem(RATINGS_KEY), {})
  return storedRatings && typeof storedRatings === 'object' ? storedRatings : {}
}

const searchQuery = ref('')
const selectedType = ref('All')
const selectedScores = ref({})
const ratingMessages = ref({})
const storedRatings = ref(loadRatings())

const resourceTypes = computed(() => ['All', ...new Set(resources.map((resource) => resource.type))])

const safeSearchQuery = computed(() =>
  authHelpers.sanitizeText(searchQuery.value).toLowerCase(),
)

const filteredResources = computed(() => {
  return resources.filter((resource) => {
    const matchesType = selectedType.value === 'All' || resource.type === selectedType.value
    const searchableText = [
      resource.type,
      resource.topic,
      resource.audience,
      resource.title,
      resource.description,
    ]
      .join(' ')
      .toLowerCase()

    return matchesType && searchableText.includes(safeSearchQuery.value)
  })
})

const allRatingsFor = (resource) => {
  const savedRatings = storedRatings.value[resource.id] ?? []
  return [...resource.seedRatings, ...savedRatings.map((rating) => Number(rating.score))]
}

const averageRatingFor = (resource) => {
  const ratings = allRatingsFor(resource)
  const total = ratings.reduce((sum, rating) => sum + rating, 0)
  return (total / ratings.length).toFixed(1)
}

const ratingCountFor = (resource) => allRatingsFor(resource).length

const submitRating = (resource) => {
  const score = Number(selectedScores.value[resource.id])

  if (!isAuthenticated.value) {
    ratingMessages.value = {
      ...ratingMessages.value,
      [resource.id]: 'Please log in before rating a resource.',
    }
    return
  }

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    ratingMessages.value = {
      ...ratingMessages.value,
      [resource.id]: 'Choose a rating from 1 to 5.',
    }
    return
  }

  const existingRatings = storedRatings.value[resource.id] ?? []
  const withoutCurrentUser = existingRatings.filter((rating) => rating.userId !== currentUser.value.id)
  const nextRatings = {
    ...storedRatings.value,
    [resource.id]: [...withoutCurrentUser, { userId: currentUser.value.id, score }],
  }

  storedRatings.value = nextRatings
  localStorage.setItem(RATINGS_KEY, JSON.stringify(nextRatings))
  ratingMessages.value = {
    ...ratingMessages.value,
    [resource.id]: 'Your rating has been saved.',
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <p class="section-eyebrow">Resource library</p>
          <h1>Support resources for different needs</h1>
        </div>
        <p class="section-intro">
          Resources are rendered from JavaScript data, filtered with Vue computed properties, and
          rated with persisted localStorage data.
        </p>
      </div>

      <div class="filter-panel mb-4">
        <div>
          <label for="resource-search" class="form-label">Search resources</label>
          <input
            id="resource-search"
            v-model="searchQuery"
            type="search"
            class="form-control"
            placeholder="Try anxiety, carer, referral..."
          />
        </div>
        <div>
          <label for="resource-type" class="form-label">Resource type</label>
          <select id="resource-type" v-model="selectedType" class="form-select">
            <option v-for="type in resourceTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <div class="security-note mb-4">
        Client-side safety: search text is trimmed and stripped of angle brackets, ratings are
        validated as numbers from 1 to 5, and the page renders text with Vue interpolation only.
      </div>

      <div class="row g-3">
        <div v-for="resource in filteredResources" :key="resource.id" class="col-12 col-md-6 col-xl-4">
          <article class="resource-card h-100">
            <span class="resource-type">{{ resource.type }}</span>
            <h2>{{ resource.title }}</h2>
            <p>{{ resource.description }}</p>

            <dl class="resource-meta">
              <div>
                <dt>Topic</dt>
                <dd>{{ resource.topic }}</dd>
              </div>
              <div>
                <dt>Audience</dt>
                <dd>{{ resource.audience }}</dd>
              </div>
            </dl>

            <div class="rating-summary">
              <strong>{{ averageRatingFor(resource) }}</strong>
              <span>/ 5 average from {{ ratingCountFor(resource) }} ratings</span>
            </div>

            <div class="rating-form">
              <label :for="`rating-${resource.id}`" class="form-label">Rate this resource</label>
              <div class="d-flex gap-2">
                <select
                  :id="`rating-${resource.id}`"
                  v-model="selectedScores[resource.id]"
                  class="form-select"
                >
                  <option disabled value="">Select</option>
                  <option v-for="score in [1, 2, 3, 4, 5]" :key="score" :value="score">
                    {{ score }}
                  </option>
                </select>
                <button type="button" class="btn btn-outline-primary" @click="submitRating(resource)">
                  Save
                </button>
              </div>
              <p
                v-if="ratingMessages[resource.id]"
                class="small mt-2 mb-0"
                :class="isAuthenticated ? 'text-success' : 'text-danger'"
              >
                {{ ratingMessages[resource.id] }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <p v-if="filteredResources.length === 0" class="empty-state">
        No resources match the current filters.
      </p>
    </div>
  </section>
</template>
