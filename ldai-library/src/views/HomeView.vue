<template>
  <section class="page-section hero-section">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-12 col-lg-7">
          <p class="section-eyebrow">Mental health charity web application</p>
          <h1>MindBridge helps people start support sooner.</h1>
          <p class="hero-copy">
            A calm, mobile-friendly entry point for young adults, carers, and support staff to
            understand mental health options, save trusted resources, and prepare for the right
            next step.
          </p>
          <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
            <router-link to="/resources" class="btn btn-primary btn-lg">Explore resources</router-link>
            <router-link to="/register" class="btn btn-outline-primary btn-lg">
              Create private account
            </router-link>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="support-panel">
            <p class="support-label">Need help now?</p>
            <h2>Crisis support stays visible.</h2>
            <p>
              MindBridge separates urgent help from general guidance so users can find immediate
              options without searching through long pages.
            </p>
            <div class="support-actions">
              <span>Emergency: 000</span>
              <span>Lifeline: 13 11 14</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="container">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <p class="feature-number">01</p>
            <h2>Guided support pathways</h2>
            <p>
              Plain-language actions help users choose between self-help, carer guidance, service
              discovery, and staff-supported follow-up.
            </p>
          </article>
        </div>
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <p class="feature-number">02</p>
            <h2>Private accounts</h2>
            <p>
              Account pages will let members save resources and return to their support plan
              without exposing staff-only tools.
            </p>
          </article>
        </div>
        <div class="col-12 col-md-4">
          <article class="feature-card h-100">
            <p class="feature-number">03</p>
            <h2>Staff-ready structure</h2>
            <p>
              The A2 foundation includes a separate staff area for later role-based access and
              operational support workflows.
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
