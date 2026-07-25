<script setup>
import { currentUser } from '../auth'
</script>

<template>
  <section class="page-section">
    <div class="container">
      <p class="section-eyebrow">Member area</p>
      <h1>Private support dashboard</h1>
      <div class="account-summary mt-3">
        <span class="role-badge">{{ currentUser.role }}</span>
        <p class="mb-0">
          Signed in as <strong>{{ currentUser.name }}</strong> using {{ currentUser.email }}.
        </p>
      </div>
      <div class="row g-3 mt-2">
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <h2>Saved resources</h2>
            <p>Members can browse dynamic resources and rate the content they find useful.</p>
          </article>
        </div>
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <h2>Aggregated feedback</h2>
            <p>Ratings are persisted locally and update the average score across all users.</p>
          </article>
        </div>
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <h2>Account privacy</h2>
            <p>This route is protected by the Vue Router authentication guard.</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
