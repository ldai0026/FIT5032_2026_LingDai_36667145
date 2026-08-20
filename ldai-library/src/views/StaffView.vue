<script setup>
import { computed, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { currentUser } from '../auth'
import { outreachRows, resourceRows } from '../data/mindbridgeData'

const resourceSearch = ref('')
const contactSearch = ref('')
const selectedRecipients = ref([])
const subject = ref('MindBridge follow-up and support resources')
const message = ref('Hello,\n\nHere is a helpful MindBridge update for your support journey.\n\nKind regards,\nThe MindBridge team')
const emailStatus = ref('')
const emailError = ref('')
const sending = ref(false)

const resources = ref(resourceRows)
const contacts = ref(outreachRows)

const filteredResources = computed(() => {
  const query = resourceSearch.value.trim().toLowerCase()
  return resources.value.filter((row) => !query || Object.values(row).join(' ').toLowerCase().includes(query))
})

const filteredContacts = computed(() => {
  const query = contactSearch.value.trim().toLowerCase()
  return contacts.value.filter((row) => !query || Object.values(row).join(' ').toLowerCase().includes(query))
})

const dueCount = computed(() => contacts.value.filter((row) => row.status === 'Follow-up due').length)
const publishedCount = computed(() => resources.value.filter((row) => row.status === 'Published').length)

const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
const downloadCsv = (rows, filename) => {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const exportPdf = (title) => {
  document.title = title
  window.print()
}

const sendBulkEmail = async () => {
  emailStatus.value = ''
  emailError.value = ''
  if (!selectedRecipients.value.length) {
    emailError.value = 'Select at least one outreach contact.'
    return
  }
  if (!subject.value.trim() || !message.value.trim()) {
    emailError.value = 'Subject and message are required.'
    return
  }

  sending.value = true
  try {
    const payload = {
      recipients: selectedRecipients.value.map((row) => row.email),
      subject: subject.value.trim(),
      text: message.value.trim(),
    }
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Staff-Email': currentUser.value?.email ?? '' },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || 'The email service could not send this message.')
    emailStatus.value = `Message queued for ${selectedRecipients.value.length} recipient(s).`
    selectedRecipients.value = []
  } catch (error) {
    emailError.value = error.message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="staff-shell">
        <p class="section-eyebrow">F.1 management dashboard</p>
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <h1>Staff operations dashboard</h1>
            <p class="section-intro">Welcome, {{ currentUser.name }}. Review resources, monitor outreach, and send a documented follow-up from one workspace.</p>
          </div>
          <span class="role-badge align-self-start">{{ currentUser.role }}</span>
        </div>

        <div class="row g-3 my-4" role="region" aria-labelledby="dashboard-summary-title">
          <h2 id="dashboard-summary-title" class="visually-hidden">Dashboard summary</h2>
          <div class="col-12 col-md-4"><article class="metric-card"><span>Published resources</span><strong>{{ publishedCount }}</strong></article></div>
          <div class="col-12 col-md-4"><article class="metric-card"><span>Contacts needing follow-up</span><strong>{{ dueCount }}</strong></article></div>
          <div class="col-12 col-md-4"><article class="metric-card"><span>Selected recipients</span><strong>{{ selectedRecipients.length }}</strong></article></div>
        </div>

        <div class="table-toolbar">
          <div>
            <label for="resource-table-search" class="form-label">Search resources</label>
            <input id="resource-table-search" v-model="resourceSearch" type="search" class="form-control" placeholder="Title, topic or status" />
          </div>
          <div class="d-flex align-items-end gap-2">
            <button type="button" class="btn btn-outline-primary" @click="downloadCsv(filteredResources, 'mindbridge-resources.csv')">Export CSV</button>
            <button type="button" class="btn btn-outline-primary" @click="exportPdf('MindBridge resources')">Export PDF</button>
          </div>
        </div>
        <p class="small text-secondary mb-2" role="status">{{ filteredResources.length }} resources shown; the table displays 10 rows per page.</p>
        <div role="region" aria-labelledby="resource-table-title">
          <h2 id="resource-table-title" class="visually-hidden">Resource management table</h2>
          <DataTable :value="filteredResources" paginator :rows="10" sortMode="multiple" responsiveLayout="scroll" class="mb-5">
          <Column field="title" header="Resource" sortable />
          <Column field="type" header="Type" sortable />
          <Column field="topic" header="Topic" sortable />
          <Column field="audience" header="Audience" sortable />
          <Column field="status" header="Status" sortable />
          </DataTable>
        </div>

        <div class="table-toolbar">
          <div>
            <label for="contact-table-search" class="form-label">Search outreach contacts</label>
            <input id="contact-table-search" v-model="contactSearch" type="search" class="form-control" placeholder="Name, pathway or status" />
          </div>
          <div class="d-flex align-items-end gap-2">
            <button type="button" class="btn btn-outline-primary" @click="downloadCsv(filteredContacts, 'mindbridge-outreach-contacts.csv')">Export CSV</button>
            <button type="button" class="btn btn-outline-primary" @click="exportPdf('MindBridge outreach contacts')">Export PDF</button>
          </div>
        </div>
        <p class="small text-secondary mb-2" role="status">{{ filteredContacts.length }} outreach contacts shown; the table displays 10 rows per page.</p>
        <div role="region" aria-labelledby="contact-table-title">
          <h2 id="contact-table-title" class="visually-hidden">Outreach contact table</h2>
          <DataTable v-model:selection="selectedRecipients" :value="filteredContacts" dataKey="id" paginator :rows="10" sortMode="multiple" responsiveLayout="scroll" class="mb-5">
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="name" header="Contact" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="pathway" header="Pathway" sortable />
          <Column field="status" header="Status" sortable />
          <Column field="lastContact" header="Last contact" sortable />
          </DataTable>
        </div>

        <div class="bulk-email-panel" role="region" aria-labelledby="bulk-email-title">
          <p class="section-eyebrow mb-1">F.1 bulk email</p>
          <h2 id="bulk-email-title">Send selected contacts an update</h2>
          <p class="text-secondary">The browser sends a validated request to a protected EmailJS serverless function. The provider credentials remain in the deployment secret store.</p>
          <form class="row g-3" @submit.prevent="sendBulkEmail">
            <div class="col-12"><label for="bulk-subject" class="form-label">Subject</label><input id="bulk-subject" v-model="subject" class="form-control" required maxlength="160" /></div>
            <div class="col-12"><label for="bulk-message" class="form-label">Message</label><textarea id="bulk-message" v-model="message" class="form-control" rows="5" required maxlength="5000" /></div>
            <div v-if="emailError" class="col-12"><div class="alert alert-danger" role="alert">{{ emailError }}</div></div>
            <div v-if="emailStatus" class="col-12"><div class="alert alert-success" role="status">{{ emailStatus }}</div></div>
            <div class="col-12 d-flex align-items-center gap-3"><button type="submit" class="btn btn-primary" :disabled="sending">{{ sending ? 'Sending…' : `Send to ${selectedRecipients.length} contact(s)` }}</button><span class="small text-secondary">Maximum 10 recipients per request.</span></div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
