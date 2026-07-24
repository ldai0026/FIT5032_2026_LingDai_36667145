<template>
  <section class="page-section">
    <div class="container">
      <div class="access-panel">
        <p class="section-eyebrow">Access control</p>
        <h1>Staff access required</h1>
        <p>
          This page is only available to MindBridge staff accounts. Please log in with a staff role
          or return to your member dashboard.
        </p>
        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <router-link to="/login" class="btn btn-primary">Login as staff</router-link>
          <router-link to="/dashboard" class="btn btn-outline-primary">Back to dashboard</router-link>
        </div>
      </div>
    </div>
  </section>
</template>
