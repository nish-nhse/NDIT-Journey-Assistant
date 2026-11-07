let rules = [];

// Load rules from JSON
fetch("data/retrieval_rules.json")
  .then(response => response.json())
  .then(data => {
    rules = data;
    console.log("Rules loaded:", rules);
  })
  .catch(error => {
    console.error("Failed to load rules:", error);
  });

function generateGuidance() {

  console.log("Button clicked");

  const intent = document.getElementById("intent").value;
  const role = document.getElementById("role").value;
  const collection = document.getElementById("collection").value;
  const service = document.getElementById("service").value;

  console.log("Selected intent:", intent);

  const rule = rules.find(r => r.intent === intent);

  console.log("Matched rule:", rule);

  const resultsDiv = document.getElementById("results");

  if (!rule) {
    resultsDiv.innerHTML = `
      <div class="result">
        <h3>No matching guidance found</h3>
        <p><strong>Intent selected:</strong> ${intent}</p>
      </div>
    `;
    return;
  }

  resultsDiv.innerHTML = `
    <div class="result">

      <h3>NDIT Guidance</h3>

      <p><strong>Role:</strong> ${role}</p>

      <p><strong>Collection:</strong> ${collection}</p>

      <p><strong>Service:</strong> ${service}</p>

      <p><strong>Capability:</strong> ${rule.capability}</p>

      <div class="governance">
        <strong>Governance</strong><br>
        ${rule.governance.join(", ")}
      </div>

      <br>

      <div class="next-action">
        <strong>Next Action</strong><br>
        ${rule.action}
      </div>

      <br>

      <div class="articles">
        <strong>Recommended Articles</strong>
        <ul>
          <li>CRDL Onboarding Guide</li>
          <li>MESH Integration Guide</li>
          <li>DSA Process</li>
        </ul>
      </div>

    </div>
  `;
}
