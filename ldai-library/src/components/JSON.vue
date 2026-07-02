<script setup>
import { computed, ref } from 'vue'
import authors from '../assets/json/authors.json'
import bookstores from '../assets/json/bookstores.json'

const showClassicAuthors = ref(true)
const showBookstores = ref(true)
const selectedNationality = ref('British')

const modernAuthors = computed(() =>
  authors.filter((author) => author.birthYear > 1850),
)

const classicAuthors = computed(() =>
  authors.filter((author) => author.birthYear <= 1850),
)

const britishAuthors = computed(() =>
  authors.filter((author) => author.nationality === selectedNationality.value),
)

const livingAuthors = computed(() =>
  authors.filter((author) => author.alive),
)

const totalFamousWorks = computed(() =>
  authors.reduce((total, author) => total + author.famousWorks.length, 0),
)

const georgeOrwellStyle = {
  borderColor: '#f59e0b',
  backgroundColor: '#fff7ed',
  boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.18)',
}

const isGeorgeOrwell = (author) => author.name === 'George Orwell'
</script>

<template>
  <main class="lab-shell">
    <section class="hero">
      <p class="eyebrow">FIT5032 Week 2</p>
      <h1>Vue 3 One-Way Data Binding Lab</h1>
      <p>
        JSON data, computed properties, built-in directives, attribute binding,
        class binding, and style binding.
      </p>
    </section>

    <section class="activity-grid">
      <article class="activity-card">
        <span class="activity-number">Activity 1</span>
        <h2>Import JSON Files</h2>
        <p>
          Imported <code>authors.json</code> and <code>bookstores.json</code>
          from <code>src/assets/json</code>.
        </p>
        <div class="metric-row">
          <strong>{{ authors.length }}</strong>
          <span>authors loaded</span>
        </div>
        <div class="metric-row">
          <strong>{{ bookstores.length }}</strong>
          <span>bookstores loaded</span>
        </div>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 2</span>
        <h2>Computed Authors After 1850</h2>
        <p>
          <code>modernAuthors</code> uses <code>computed</code> and
          <code>filter</code> to keep authors born after 1850.
        </p>
        <ul class="compact-list">
          <li v-for="author in modernAuthors" :key="`modern-${author.id}`">
            {{ author.name }} ({{ author.birthYear }})
          </li>
        </ul>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 3</span>
        <h2>Computed Classic Authors</h2>
        <p>Computed list of authors born in or before 1850.</p>
        <ul class="compact-list">
          <li v-for="author in classicAuthors" :key="`classic-${author.id}`">
            {{ author.name }} ({{ author.birthYear }})
          </li>
        </ul>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 4</span>
        <h2>Computed Nationality Filter</h2>
        <p>Filter authors by selected nationality.</p>
        <label class="control-label">
          Nationality
          <select v-model="selectedNationality">
            <option>British</option>
            <option>American</option>
          </select>
        </label>
        <p class="result-text">{{ britishAuthors.length }} matching authors</p>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 5</span>
        <h2>Computed Summary</h2>
        <p>Calculated totals from JSON data using computed properties.</p>
        <div class="summary-pills">
          <span>{{ totalFamousWorks }} famous works</span>
          <span>{{ livingAuthors.length }} living author</span>
          <span>{{ modernAuthors.length }} modern authors</span>
        </div>
      </article>

      <article class="activity-card wide">
        <span class="activity-number">Activity 6</span>
        <h2>v-for Author Names and Birth Years</h2>
        <ul class="author-list">
          <li v-for="author in authors" :key="author.id">
            {{ author.name }} ({{ author.birthYear }})
          </li>
        </ul>
      </article>

      <article class="activity-card wide">
        <span class="activity-number">Activity 7</span>
        <h2>v-for Filtered Modern Authors</h2>
        <ul class="author-list">
          <li v-for="author in modernAuthors" :key="`filtered-${author.id}`">
            {{ author.name }} ({{ author.birthYear }})
          </li>
        </ul>
      </article>

      <article class="activity-card wide">
        <span class="activity-number">Activity 8</span>
        <h2>Nested v-for Famous Works</h2>
        <div class="work-list">
          <section v-for="author in authors" :key="`works-${author.id}`">
            <h3>{{ author.name }}</h3>
            <ul>
              <li v-for="work in author.famousWorks" :key="`${author.id}-${work}`">
                {{ work }}
              </li>
            </ul>
          </section>
        </div>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 9</span>
        <h2>v-if Living Authors</h2>
        <p v-if="livingAuthors.length > 0">
          Living author found: {{ livingAuthors[0].name }}.
        </p>
        <p v-else>No living authors in the data.</p>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 10</span>
        <h2>v-show Classic Author Section</h2>
        <label class="checkbox-label">
          <input v-model="showClassicAuthors" type="checkbox" />
          Show classic authors
        </label>
        <ul v-show="showClassicAuthors" class="compact-list">
          <li v-for="author in classicAuthors" :key="`shown-${author.id}`">
            {{ author.name }}
          </li>
        </ul>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 11</span>
        <h2>v-if Bookstore Status</h2>
        <label class="checkbox-label">
          <input v-model="showBookstores" type="checkbox" />
          Show bookstore list
        </label>
        <div v-if="showBookstores">
          <p v-for="store in bookstores" :key="store.id" class="store-line">
            {{ store.name }} -
            <strong>{{ store.open ? 'Open' : 'Closed' }}</strong>
          </p>
        </div>
      </article>

      <article class="activity-card">
        <span class="activity-number">Activity 12</span>
        <h2>Attribute Binding</h2>
        <p>
          Author links use <code>:href</code> and <code>:title</code> bindings.
        </p>
        <a
          v-for="author in modernAuthors"
          :key="`link-${author.id}`"
          class="author-link"
          :href="`https://www.google.com/search?q=${encodeURIComponent(author.name)}`"
          :title="`Search for ${author.name}`"
          target="_blank"
          rel="noopener"
        >
          {{ author.name }}
        </a>
      </article>

      <article class="activity-card wide highlight-demo">
        <span class="activity-number">Activity 13</span>
        <h2>Class and Style Binding: Highlight George Orwell</h2>
        <p>
          George Orwell is highlighted using <code>:class</code> and
          <code>:style</code> bindings.
        </p>
        <div class="highlight-list">
          <section
            v-for="author in authors"
            :key="`highlight-${author.id}`"
            class="author-card"
            :class="{ 'orwell-highlight': isGeorgeOrwell(author) }"
            :style="isGeorgeOrwell(author) ? georgeOrwellStyle : undefined"
          >
            <h3>{{ author.name }}</h3>
            <p>{{ author.genre }} - {{ author.birthYear }}</p>
            <p v-if="isGeorgeOrwell(author)" class="highlight-note">
              Highlighted author for EFOLIO Task 2.2
            </p>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>
