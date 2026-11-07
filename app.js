let rules = [];

// Load rules
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

  const intent = document.getElementById("intent").value;
  const role = document.getElementById("role").value;
  const collection = document.getElementById("collection").value;
  const service = document.getElementById("service").value;

  console.log("Selected Intent:", intent);
  console.log("Selected Role:", role);
  console.log("Selected Collection:", collection);
  console.log("Selected Service:", service);

  const rule = rules.find(r =>
      r.intent === intent &&
      r.role === role &&
      r.collection === collection &&
      r.service === service
  );

  const resultsDiv = document.getElementById("results");

  if (!rule) {

    resultsDiv.innerHTML = `
      <div class="result">

        <h3>No Matching Guidance Found</h3>

        <p>
          We do not yet have guidance for:
        </p>

        <ul>
          <li><strong>Intent:</strong> ${intent}</li>
          <li><strong>Role:</strong> ${role}</li>
          <li><strong>Collection:</strong> ${collection}</li>
          <li><strong>Service:</strong> ${service}</li>
        </ul>

        <p>
          Add a matching rule to retrieval_rules.json.
        </p>

      </div>
    `;

    return;
  }

  resultsDiv.innerHTML = `

    <div class="result">

      <h2>NDIT Guidance</h2>

      <p>
        <strong>Role:</strong> ${role}
      </p>

      <p>
        <strong>Collection:</strong> ${collection}
      </p>

      <p>
        <strong>Service:</strong> ${service}
      </p>

      <p>
        <strong>Capability:</strong> ${rule.capability}
      </p>

      <p>
        <strong>Description:</strong><br>
        ${rule.description}
      </p>

      <p>
        <strong>Owner:</strong><br>
        ${rule.owner}
      </p>

      <p>
        <strong>Timescale:</strong><br>
        ${rule.timescale}
      </p>

      <h3>Governance Requirements</h3>

      <ul>
        ${rule.governance.map(item =>
          `<li>${item}</li>`
        ).join("")}
      </ul>

      <h3>Required Steps</h3>

      <ol>
        ${rule.steps.map(step =>
          `<li>${step}</li>`
        ).join("")}
      </ol>

      <h3>Knowledge Articles</h3>

      <ul>
        ${rule.articles.map(article =>
          `<li>${article}</li>`
        ).join("")}
      </ul>

    </div>

  `;
}
