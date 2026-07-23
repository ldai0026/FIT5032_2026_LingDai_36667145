<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="form-panel">
            <p class="section-eyebrow">Private account</p>
            <h1>Register placeholder</h1>
            <p class="text-secondary">
              Stage 2 will add validated registration, local account storage, and role selection.
            </p>

            <div class="row g-3 mt-3">
              <div class="col-12 col-md-6">
                <label for="register-name" class="form-label">Full name</label>
                <input id="register-name" type="text" class="form-control" placeholder="Ling Dai" />
              </div>
              <div class="col-12 col-md-6">
                <label for="register-role" class="form-label">Role</label>
                <select id="register-role" class="form-select">
                  <option>Member</option>
                  <option>Staff</option>
                </select>
              </div>
              <div class="col-12">
                <button type="button" class="btn btn-primary" disabled>
                  Registration coming in Stage 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
